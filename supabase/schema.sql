create table if not exists public.customer_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'customer'
    check (role in ('customer', 'restaurant', 'rider', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;

drop policy if exists "Customers can read their own profile"
  on public.customer_profiles;
create policy "Customers can read their own profile"
  on public.customer_profiles
  for select
  to authenticated
  using (auth.uid() = id);

create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.customer_profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_customer_profile();

create table if not exists public.menu_catalog (
  id text primary key,
  restaurant_id text not null,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null default '',
  is_available boolean not null default true
);

insert into public.menu_catalog (id, restaurant_id, name, price, image_url)
values
  ('food-1', 'addis-kitchen', 'Special Beyaynetu', 220, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800'),
  ('food-2', 'addis-kitchen', 'Doro Wot', 380, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800'),
  ('food-3', 'addis-kitchen', 'Shiro Wot', 180, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800'),
  ('food-4', 'green-platter', 'Fresh Garden Bowl', 250, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'),
  ('food-5', 'green-platter', 'Avocado Salad', 200, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'),
  ('food-6', 'coffee-house', 'Ethiopian Coffee', 80, 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800'),
  ('food-7', 'coffee-house', 'Coffee and Snack Combo', 150, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800')
on conflict (id) do update
set restaurant_id = excluded.restaurant_id,
    name = excluded.name,
    price = excluded.price,
    image_url = excluded.image_url;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users (id) on delete cascade,
  restaurant_id text not null,
  full_name text not null,
  phone text not null,
  city text not null,
  area text not null,
  street_address text not null,
  instructions text not null default '',
  payment_method text not null default 'cod' check (payment_method = 'cod'),
  status text not null default 'placed'
    check (status in ('placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled')),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 80 check (delivery_fee >= 0),
  total numeric(10, 2) not null check (total = subtotal + delivery_fee),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  food_id text not null,
  restaurant_id text not null,
  food_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  image_url text not null default ''
);

create index if not exists orders_customer_created_at_idx
  on public.orders (customer_id, created_at desc);
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

alter table public.menu_catalog enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Anyone can read available menu items" on public.menu_catalog;
create policy "Anyone can read available menu items"
  on public.menu_catalog
  for select
  to anon, authenticated
  using (is_available);

drop policy if exists "Customers can read their own orders" on public.orders;
create policy "Customers can read their own orders"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = customer_id);

drop policy if exists "Customers can read items in their own orders" on public.order_items;
create policy "Customers can read items in their own orders"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.customer_id = auth.uid()
    )
  );

grant select on public.menu_catalog to anon, authenticated;
grant select on public.orders, public.order_items to authenticated;
revoke insert, update, delete on public.orders, public.order_items from anon, authenticated;

create or replace function public.create_customer_order(
  p_full_name text,
  p_phone text,
  p_city text,
  p_area text,
  p_street_address text,
  p_instructions text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer_id uuid := auth.uid();
  v_order_id uuid;
  v_subtotal numeric(10, 2);
  v_delivery_fee constant numeric(10, 2) := 80;
  v_restaurant_id text;
  v_item_count integer;
  v_matched_count integer;
  v_restaurant_count integer;
begin
  if v_customer_id is null then
    raise exception 'You must be signed in to place an order.';
  end if;

  if coalesce(length(trim(p_full_name)), 0) < 2
    or coalesce(length(trim(p_phone)), 0) = 0
    or coalesce(length(trim(p_city)), 0) = 0
    or coalesce(length(trim(p_area)), 0) = 0
    or coalesce(length(trim(p_street_address)), 0) < 5 then
    raise exception 'Complete all required delivery details before placing your order.';
  end if;

  if jsonb_typeof(p_items) is distinct from 'array' then
    raise exception 'Order items must be provided as a list.';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'An order must contain at least one menu item.';
  end if;

  select count(*), count(distinct item.food_id)
  into v_item_count, v_matched_count
  from jsonb_to_recordset(p_items) as item(food_id text, quantity integer);

  if v_item_count = 0 or v_item_count <> v_matched_count then
    raise exception 'Order items must have unique food IDs.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_items) as item(food_id text, quantity integer)
    where item.food_id is null or item.quantity is null or item.quantity < 1
  ) then
    raise exception 'Each order item must have a valid food ID and quantity.';
  end if;

  select
    count(*),
    count(distinct catalog.restaurant_id),
    sum(catalog.price * item.quantity),
    min(catalog.restaurant_id)
  into v_matched_count, v_restaurant_count, v_subtotal, v_restaurant_id
  from jsonb_to_recordset(p_items) as item(food_id text, quantity integer)
  join public.menu_catalog as catalog
    on catalog.id = item.food_id
   and catalog.is_available;

  if v_matched_count <> v_item_count then
    raise exception 'One or more menu items are unavailable.';
  end if;

  if v_restaurant_count <> 1 then
    raise exception 'All items in an order must come from the same restaurant.';
  end if;

  insert into public.orders (
    customer_id, restaurant_id, full_name, phone, city, area,
    street_address, instructions, subtotal, delivery_fee, total
  )
  values (
    v_customer_id, v_restaurant_id, trim(p_full_name), trim(p_phone),
    trim(p_city), trim(p_area), trim(p_street_address),
    coalesce(trim(p_instructions), ''), v_subtotal,
    v_delivery_fee, v_subtotal + v_delivery_fee
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, food_id, restaurant_id, food_name, unit_price, quantity, image_url
  )
  select
    v_order_id, catalog.id, catalog.restaurant_id, catalog.name,
    catalog.price, item.quantity, catalog.image_url
  from jsonb_to_recordset(p_items) as item(food_id text, quantity integer)
  join public.menu_catalog as catalog
    on catalog.id = item.food_id
   and catalog.is_available;

  return v_order_id;
end;
$$;

revoke all on function public.create_customer_order(text, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.create_customer_order(text, text, text, text, text, text, jsonb) to authenticated;
