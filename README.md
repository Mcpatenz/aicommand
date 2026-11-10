# Custom AI

A local-first personal AI assistant prototype designed to work as a responsive web app on desktop, Android, and iPhone. The current milestone includes responsive chat, PostgreSQL conversation persistence, a history viewer, button-activated browser speech, and an installable PWA shell. The planned wake phrase is **“Hey Mak Patens”**; always-on wake-word detection is not implemented.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 16 (local install or Docker)
- An OpenAI API key with access to the configured Responses API model

## Setup

1. Install dependencies: `npm install`
2. Start PostgreSQL if needed:

   ```bash
   docker run --name custom-ai-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=custom_ai -p 5432:5432 -d postgres:16
   ```

3. Copy `.env.example` to `.env` and set your database URL and OpenAI API key. Keep `.env` private; never commit your API key or expose it through a `NEXT_PUBLIC_` variable.
4. Generate the Prisma client and create the local tables:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Run `npm run dev`, then open [http://localhost:3000](http://localhost:3000).
6. Check [http://localhost:3000/api/health](http://localhost:3000/api/health) for database connectivity.

## Use on Android and iPhone

Deploy the app to a publicly reachable **HTTPS** host before opening it on a phone. Keep `DATABASE_URL` and `OPENAI_API_KEY` in the server's environment, never in the browser. The current API is intentionally disabled when `NODE_ENV=production` because real authentication and account-specific authorization are not implemented yet; do not make a public deployment available to other people or treat it as a secure private service.

- **Android:** open the HTTPS app in Chrome and use the browser menu’s **Install app** or **Add to Home screen** action.
- **iPhone/iPad:** open the HTTPS app in Safari, tap **Share**, then **Add to Home Screen**. iOS controls PWA install and microphone behavior; browser speech recognition is not consistently available, so text chat is the reliable fallback.

The PWA shell provides a simple offline page for navigation failures only. Chat, AI requests, and database history require internet access and are not cached offline. Mic access requires permission and HTTPS. The app does not continuously listen and does not detect “Hey Mak Patens.”

## Included features

- AI chat through the OpenAI Responses API (`OPENAI_MODEL` defaults to `gpt-4o-mini`).
- PostgreSQL persistence for users, conversations, and messages via Prisma 6.
- Conversation history page at `/history`.
- Browser mic input where supported; browser speech synthesis for assistant responses.
- Responsive dashboard, settings, and mobile navigation.
- PWA manifest, app-shell metadata, service worker, and offline navigation fallback.

## Security and deployment status

This is a **single-user local development prototype**, not a production-ready public service. Chat and conversation APIs intentionally refuse production use because real authentication, per-user authorization, rate limiting, and deployment hardening are not yet implemented. Do not expose the development server or API to the public internet. The local demo uses a fixed local user record; it is not a real account system. The API key must remain server-side.

## Useful commands

- `npm run dev` — local development server
- `npm run build` — generate Prisma client and build Next.js
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate` — run Prisma development migrations
- `npm run db:studio` — open Prisma Studio

## Next milestones

1. Run and validate this local milestone.
2. Implement real authentication and account-specific ownership before public deployment.
3. Add OpenAI Realtime voice and evaluate native wake-word options for “Hey Mak Patens.”
4. Add explicit permissions, confirmations, and audit logs before any device automation.
