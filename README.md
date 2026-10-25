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

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Get both values from **Supabase Dashboard → Project Settings → API**. The URL should look like `https://<your-project-ref>.supabase.co`; do not leave the example values.
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

Before deploying, make sure the Supabase project is active, `supabase/schema.sql` has run successfully, and local `npm run lint` and `npm run build` both pass.

1. Push this repository to GitHub. Do not commit `.env` or `.env.local`; they are ignored by Git.
2. Commit and push the frontend changes to the GitHub repository. The checked-out `feat/frontend` branch contains the Next.js app at its repository root.
3. In [Vercel](https://vercel.com/), choose **Add New → Project** and import `mekuanntmunye50-cmd/ENJRAGO-DELIVERY`. Select the `feat/frontend` branch (or `main` after the changes are merged). Use the repository root as the project root; `package.json` is at that branch’s root.
4. In the Vercel project settings, open **Environment Variables** and add these for Production (and Preview if needed):
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase publishable/anon key. Never use the service-role key in a `NEXT_PUBLIC_` variable.
5. Deploy. Once Vercel provides the production domain, open Supabase **Authentication → URL Configuration**:
   - Set **Site URL** to the production domain, e.g. `https://your-app.vercel.app`.
   - Add `https://your-app.vercel.app/auth/callback` to the redirect URL allow list. Also add `http://localhost:3000/auth/callback` for local OAuth testing.
   - If using Google or Apple sign-in, configure that provider in Supabase and its provider console using the Supabase callback URL shown in the provider settings.
6. Redeploy from Vercel after changing environment variables. Test registration/email confirmation, sign-in, checkout, order history, and opening an order detail page on the deployed URL.

For a local run, use `npm run dev` from the `frontend` directory. A change to `.env.local` requires restarting that process.
