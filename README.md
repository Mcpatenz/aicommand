# Custom AI

A local-first personal AI assistant prototype for Windows and Android browsers. The current milestone includes responsive chat, PostgreSQL conversation persistence, a history viewer, button-activated browser speech recognition, and spoken responses. The planned wake phrase is **“Hey Mak Patens”**; always-on wake-word detection is not implemented.

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

5. Run the app with `npm run dev`, then open [http://localhost:3000](http://localhost:3000).
6. Check [http://localhost:3000/api/health](http://localhost:3000/api/health) for database connectivity.

## Included features

- AI chat through the OpenAI Responses API (`OPENAI_MODEL` defaults to `gpt-4o-mini`).
- PostgreSQL persistence for users, conversations, and messages via Prisma 6.
- Conversation history page at `/history`.
- Browser mic input where supported (typically Chrome/Edge); browser speech synthesis for assistant responses.
- Responsive installable-web-app manifest foundation.
- Dashboard, settings, and responsive navigation.

Speech support varies by browser/device. Microphone access requires localhost or HTTPS. The app does not continuously listen and does not detect “Hey Mak Patens.”

## Security and deployment status

This is a **single-user local development prototype**, not a production-ready public service. Chat and conversation APIs intentionally refuse production use because real authentication, per-user authorization, rate limiting, and deployment hardening are not yet implemented. Do not expose the development server or API to the public internet. The local demo uses a fixed local user record; it is not a real account system. The API key must remain server-side.

The earlier UI login/session concept is not included as a security boundary: accepting a user-supplied email or an unsigned cookie is not authentication. Add a proven authentication provider and enforce user ownership on every endpoint before enabling cross-device accounts or production hosting.

## Useful commands

- `npm run dev` — local development server
- `npm run build` — generate Prisma client and build Next.js
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate` — run Prisma development migrations
- `npm run db:studio` — open Prisma Studio

## Next milestones

1. Run and validate this local milestone.
2. Implement real authentication and account-specific ownership.
3. Add OpenAI Realtime voice and evaluate a native wake-word engine for “Hey Mak Patens.”
4. Add explicit permissions, confirmations, and audit logs before any device automation.
