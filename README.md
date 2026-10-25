# EnjeraGo

EnjeraGo is a Next.js food-ordering app with a MySQL backend. The pages and demo catalog work locally; accounts, checkout, and order history use MySQL through server-side Next.js API routes.

## Run locally with MAMP

1. Start MAMP's MySQL server. Check its MySQL port in MAMP Preferences; on Windows it is often `3306`.
2. Open phpMyAdmin from the MAMP start page. Select the database you already use for the project. The migration only creates tables named `enjerago_*` and leaves other tables alone.
3. Open `database/mysql-schema.sql` in VS Code and copy all of it. In phpMyAdmin, select your database, open the **SQL** tab, paste the script, and click **Go**. It creates the EnjeraGo account, restaurant, menu, order, and order-item tables and seeds the current demo menu.
4. Copy `.env.example` to `.env.local`. Set `DB_NAME`, `DB_USER`, and `DB_PASSWORD` to the values for your MAMP database. Set `DB_PORT` to the MySQL port shown in MAMP. Leave `DB_SSL=false` for local MAMP.
5. Generate a unique auth secret in the frontend terminal:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```

   Put the generated value in `.env.local` as `AUTH_SECRET`. Do not commit `.env.local` or share the secret.
6. Install packages if needed, then run:

   ```powershell
   npm install
   npm run dev
   ```

7. Open `http://localhost:3000/api/health` and confirm it reports `"schemaReady": true`. Then open `http://localhost:3000`, register an account, sign in, add menu items from one restaurant, place a cash-on-delivery order, then check **My Orders**.

If your MAMP database password is blank, leave `DB_PASSWORD=` blank. Restart Next.js after changing `.env.local`. Never put MySQL credentials in a `NEXT_PUBLIC_` variable; browser code must not connect directly to MySQL.

## Database and API

- `database/mysql-schema.sql` contains the idempotent EnjeraGo-only MySQL schema and demo catalog seed.
- `app/api/auth/*` implements registration, sign-in, sign-out, and current-session routes. Passwords use bcrypt hashes; the app session is a signed, HTTP-only, same-site cookie.
- `app/api/orders/*` creates orders transactionally, calculates prices from the database catalog, and only returns orders owned by the signed-in customer.
- `app/api/catalog` serves the restaurant and menu pages from MySQL. The order API rechecks item availability and prices in the database when placing an order.

This is a customer ordering MVP: it supports accounts, browsing demo foods, cash-on-delivery orders, and order history. It does not yet include restaurant/rider dashboards, online card payments, email verification/reset, or live delivery tracking.

## Deploy

Vercel cannot connect to a MySQL database running only on your computer (`localhost`). To deploy the whole app, you need a hosted MySQL database with secure network access from Vercel.

1. Provision a managed MySQL database from a provider that permits Vercel connections. Restrict database access to the provider's recommended network controls; set `DB_SSL=true` when the provider supports standard TLS, and use a dedicated least-privilege database user, a strong password, backups, and the provider's connection limits.
2. Run `database/mysql-schema.sql` against that hosted database as well. Do not expose database credentials in browser-visible variables.
3. Push the `feat/frontend` branch to GitHub. `.env` and `.env.local` are ignored by Git; do not commit them.
4. Import `mekuanntmunye50-cmd/ENJRAGO-DELIVERY` in Vercel and select `feat/frontend`. `package.json` is at the branch root.
5. Add these server-side environment variables in Vercel for Production:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_SSL=true` if required by the provider
   - `AUTH_SECRET` (generate a separate random secret for production; do not reuse a development secret)
6. Deploy and test register/login, ordering, order history, and customer-only order access on the deployed site.

If the database provider cannot accept Vercel's serverless connections, use its supported connection pool/proxy or choose another managed MySQL provider. A successful local MAMP test does not mean the deployed site can reach your local computer.

## Validation

```powershell
npm run lint
npm run build
```
