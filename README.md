# Custom AI

A local-first personal AI assistant prototype for Windows and Android browsers. Milestone 1 includes a responsive chat interface, persistent conversations in PostgreSQL, button-triggered browser speech recognition, and spoken responses. The future wake phrase is **“Hey Mak Patens”**; always-on wake-word listening is not implemented yet.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL 16 (local install or Docker)
- An OpenAI API key with access to the configured Responses API model

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start PostgreSQL if needed:

   ```bash
   docker run --name custom-ai-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=custom_ai -p 5432:5432 -d postgres:16
   ```

3. Copy `.env.example` to `.env` and set your database URL and OpenAI API key. Keep `.env` private; never commit your API key or expose it through a `NEXT_PUBLIC_` variable.

4. Generate the Prisma client and create the local database tables:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000). Check [http://localhost:3000/api/health](http://localhost:3000/api/health) to confirm the database connection.

## What works in this milestone

- Text chat using the OpenAI Responses API (`OPENAI_MODEL` defaults to `gpt-4o-mini`).
- PostgreSQL conversation and message persistence through Prisma 6.
- Microphone button using browser speech recognition where supported (typically Chrome or Edge, with microphone permission).
- Spoken assistant responses through the browser's SpeechSynthesis API.
- Responsive installable-web-app manifest foundation.

Browser speech recognition support and behavior vary by browser and device. Microphone access requires localhost or HTTPS. This project does not continuously listen and does not yet detect “Hey Mak Patens.”

## Important security limitation

This is a **single-user local development prototype**, not a production-ready public service. The chat API intentionally rejects requests when `NODE_ENV=production` because authentication, per-user authorization, rate limiting, and deployment hardening have not been implemented. Do not expose the development server or API to the public internet. Before adding Android/Windows remote access, implement authentication and enforce conversation ownership for authenticated users.

The local prototype stores its data under a fixed local user record. Conversations cannot be accessed through the API using another user's identifier, but that is not a substitute for real authentication.

## Useful commands

- `npm run dev` — local development server
- `npm run build` — generate Prisma client and build Next.js
- `npm run db:generate` — generate Prisma client
- `npm run db:migrate` — run Prisma development migrations
- `npm run db:studio` — open Prisma Studio

## Planned next steps

1. Run and validate Milestone 1 on your machine.
2. Add real authentication and secure cross-device accounts.
3. Add a dedicated Realtime voice experience.
4. Evaluate a supported “Hey Mak Patens” wake-word engine; browser web apps cannot reliably provide always-on background listening.
5. Add explicit permissions and confirmation before any device automation.
