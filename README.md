# Automation Flow Builder

A web app for visually creating email automations using a flow editor (React Flow). Users can add Action (send message) and Delay (wait) steps between Start and End, then save, edit, delete, and test-run automations.

## Repository structure

- **`front-end/`** — Next.js 16 + React Flow + Tailwind + shadcn (separate app, own `package.json`)
- **`back-end/`** — Express + MongoDB + Resend (separate app, own `package.json`)

No shared dependencies; front-end and back-end are fully decoupled.

## How to run

1. **Backend**

   ```bash
   cd back-end && npm install && npm run dev
   ```

   Uses port **4000** by default. Set env vars (see `back-end/.env.example`).

2. **Frontend**
   ```bash
   cd front-end && npm install && npm run dev
   ```
   Uses port **3000** by default. Set `NEXT_PUBLIC_API_URL` (see `front-end/.env.local.example`).

Run both for full functionality.
