# Custom AI

Custom AI is a local-first personal assistant prototype with a responsive PWA interface, chat, saved conversation history, and browser speech features. The planned wake phrase is **“Hey Mak Patens”**; always-on wake-word detection is not implemented.

## Requirements and local setup

- Node.js 20+, npm, PostgreSQL 16 (or Neon), and an OpenAI API key with access to the configured Responses API model.
- Install packages with `npm install`.
- For local PostgreSQL, start the database if needed: `docker run --name custom-ai-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=custom_ai -p 5432:5432 -d postgres:16`
- Copy `.env.example` to `.env`. Set `DATABASE_URL`, `DIRECT_URL`, `OPENAI_API_KEY`, a unique `APP_PASSWORD`, and a random `AUTH_SECRET` (at least 32 characters). Never commit `.env` or expose secrets via `NEXT_PUBLIC_` variables.
- For a local database, `DATABASE_URL` and `DIRECT_URL` can both use the same local PostgreSQL URL. For Neon, see the setup below.
- Run `npx prisma generate` and `npx prisma migrate dev --name init`.
- Run `npm run dev`, then open `http://localhost:3000`.

## Set up Neon PostgreSQL

1. Create a project and database in the Neon Console.
2. In the Neon connection details, select the **pooled** connection string (host includes `-pooler`) and set it as `DATABASE_URL`. This is the runtime connection used by the Vercel application. Keep the connection string private and retain its `sslmode=require` parameter.
3. Copy the **direct/unpooled** connection string and set it as `DIRECT_URL`. Prisma uses this direct connection for schema migrations. Keep `sslmode=require`.
4. Do not commit either URL. Set the same variable names in Vercel's project environment settings for the intended environment.
5. Before the first deployment, run Prisma migrations from a trusted local environment with `DIRECT_URL` set to the Neon unpooled connection:

   ```bash
   npx prisma migrate deploy
   ```

   For a new local development schema, use `npx prisma migrate dev --name init` instead.

The `DIRECT_URL` Prisma datasource setting keeps migration traffic on Neon’s direct endpoint while Vercel’s serverless runtime uses the pooled endpoint. Use Neon’s copied connection strings rather than manually constructing credentials or hostnames.

## Deploy a private preview to Vercel

In Vercel Project → Settings → Environment Variables, set these for **Production** (and Preview if desired):

- `DATABASE_URL` — Neon pooled connection string.
- `DIRECT_URL` — Neon direct/unpooled connection string.
- `OPENAI_API_KEY` — a valid OpenAI API key. Keep it server-side only; rotate any key that has been pasted into chat or committed.
- `APP_PASSWORD` — a long, unique private access password.
- `AUTH_SECRET` — generate a new random value of at least 32 characters, e.g. `openssl rand -base64 48`.
- Optional: `OPENAI_MODEL` (defaults to `gpt-4o-mini`) and `ASSISTANT_NAME`.

After setting variables, redeploy so they take effect. Apply the Prisma schema to Neon with `npx prisma migrate deploy` before using chat. Never run `migrate dev` against the production database.

This version uses a **single shared app-password gate** for a private personal preview. Successful sign-in creates a seven-day, HTTP-only, signed session cookie; chat and conversation APIs require that session. This is not per-person accounts, OAuth, or a full multi-user authentication system. Do not publish the password or treat this as suitable for sensitive or public use. Add rate limiting and a proper identity provider before broader deployment.

## Use on Android and iPhone

Open the deployed HTTPS URL on Android Chrome or iPhone Safari. Android users can choose **Install app** / **Add to Home screen** from Chrome. iPhone users can use Safari **Share → Add to Home Screen**. Text chat is the most compatible input. Browser mic recognition varies by platform and browser and requires microphone permission; AI requests and history require an internet connection. No always-on listening or “Hey Mak Patens” detection is included.

## Features and commands

- OpenAI Responses API chat (default model: `gpt-4o-mini`).
- PostgreSQL persistence and conversation history.
- Browser speech input/output where supported.
- Responsive PWA metadata, offline navigation fallback, dashboard and settings.
- `npm run dev` — local server; `npm run build` — production build; `npm run db:generate` — Prisma client; `npm run db:migrate` — local dev migration; `npm run db:studio` — Prisma Studio.
