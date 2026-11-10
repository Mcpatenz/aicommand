# Custom AI

Custom AI is a local-first personal assistant prototype with a responsive PWA interface, chat, saved conversation history, and browser speech features. The planned wake phrase is **“Hey Mak Patens”**; always-on wake-word detection is not implemented.

## Requirements and local setup

- Node.js 20+, npm, PostgreSQL 16, and an OpenAI API key with access to the configured Responses API model.
- Install packages with `npm install`.
- Start PostgreSQL if needed: `docker run --name custom-ai-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=custom_ai -p 5432:5432 -d postgres:16`
- Copy `.env.example` to `.env`. Set `DATABASE_URL`, `OPENAI_API_KEY`, a unique `APP_PASSWORD`, and a random `AUTH_SECRET` (at least 32 characters). Never commit `.env` or expose secrets via `NEXT_PUBLIC_` variables.
- Run `npx prisma generate` and `npx prisma migrate dev --name init`.
- Run `npm run dev`, then open `http://localhost:3000`.

## Deploy a private preview to Vercel

This version adds a **single shared app-password gate** so you can test the deployed app privately. In Vercel Project → Settings → Environment Variables, set these for **Production** (and Preview if desired):

- `DATABASE_URL` — a hosted PostgreSQL connection string reachable from Vercel.
- `OPENAI_API_KEY` — a valid OpenAI API key. Keep it server-side only; rotate any key that has been pasted into chat or committed.
- `APP_PASSWORD` — a long, unique private access password. Share it only with people allowed to use the preview.
- `AUTH_SECRET` — generate a new random value of at least 32 characters, e.g. `openssl rand -base64 48`.
- Optional: `OPENAI_MODEL` (defaults to `gpt-4o-mini`) and `ASSISTANT_NAME`.

After setting variables, redeploy so they take effect. On the first deployment, apply the Prisma schema to the hosted database from a trusted local environment using the production database URL: `npx prisma migrate deploy`. Do not run `migrate dev` against production.

The app redirects signed-out visitors to `/login`; successful sign-in creates a seven-day, HTTP-only, signed session cookie. Chat and conversation APIs require that session. The app password is shared by this private preview; it is **not** per-person accounts, OAuth, or a full multi-user authentication system. Do not publish the password or treat this as suitable for sensitive or public use. Add rate limiting and a proper identity provider before broader deployment.

## Use on Android and iPhone

Open the deployed HTTPS URL on Android Chrome or iPhone Safari. Android users can choose **Install app** / **Add to Home screen** from Chrome. iPhone users can use Safari **Share → Add to Home Screen**. Text chat is the most compatible input. Browser mic recognition varies by platform and browser and requires microphone permission; AI requests and history require an internet connection. No always-on listening or “Hey Mak Patens” detection is included.

## Features and commands

- OpenAI Responses API chat (default model: `gpt-4o-mini`).
- PostgreSQL persistence and conversation history.
- Browser speech input/output where supported.
- Responsive PWA metadata, offline navigation fallback, dashboard and settings.
- `npm run dev` — local server; `npm run build` — production build; `npm run db:generate` — Prisma client; `npm run db:migrate` — local dev migration; `npm run db:studio` — Prisma Studio.
