This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase setup

1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `frontend/.env`. Get both values from **Supabase Dashboard → Project Settings → API**. The URL should look like `https://<your-project-ref>.supabase.co`; do not leave the example values from `.env.example`.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql). It creates customer profiles, the menu catalog, orders, order items, row-level security policies, and the atomic order-creation function.
3. Enable email/password authentication in Supabase. For OAuth, enable the provider and add your local and production callback URLs (`/auth/callback`) to the Supabase redirect URL allow list.
4. Start the app with `npm run dev`, create an account, and confirm the email if confirmation is enabled. Checkout requires a signed-in user.

Checkout calls the database function to verify available menu items and calculate prices in the database before saving the order. The menu catalog is seeded from the current demo menu; update the seed rows in `supabase/schema.sql` whenever demo menu IDs, restaurant IDs, names, or prices change. Orders and their line items are created together, and customers can only read their own orders.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
