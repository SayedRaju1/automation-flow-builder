# Automation Flow Builder

A web app for visually creating email automations using a flow editor (React Flow). Users can add **Action** (send message) and **Delay** (wait) steps between Start and End, then save, edit, delete, and test-run automations.

## Repository structure

- **`front-end/`** — Next.js 16 + React Flow + Tailwind + shadcn (separate app, own `package.json`)
- **`back-end/`** — Express + MongoDB + Resend (separate app, own `package.json`)

No shared dependencies; front-end and back-end are fully decoupled.

## How to run

1. **Backend**

   ```bash
   cd back-end && npm install && npm run dev
   ```

   Uses port **4000** by default. Requires env vars (see below).

2. **Frontend**
   ```bash
   cd front-end && npm install && npm run dev
   ```
   Uses port **3000** by default. Set `NEXT_PUBLIC_API_URL` (see below).

Run both for full functionality.

## Environment variables

### Backend (`back-end/.env`)

| Variable         | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `PORT`           | Server port (default: 4000)                               |
| `CORS_ORIGIN`    | Allowed frontend origin (e.g. http://localhost:3000)      |
| `MONGODB_URI`    | MongoDB Atlas connection string                           |
| `RESEND_API_KEY` | Resend API key for sending email                          |
| `FROM_EMAIL`     | Optional; sender address (default: onboarding@resend.dev) |

Copy `back-end/.env.example` to `back-end/.env` and fill in values.

### Frontend (`front-end/.env.local`)

| Variable              | Description                                   |
| --------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. http://localhost:4000) |

Copy `front-end/.env.local.example` to `front-end/.env.local` and set the URL.

## API (Backend)

Base URL: `http://localhost:4000` (or your `PORT` / host).

| Method | Path                        | Description                                              |
| ------ | --------------------------- | -------------------------------------------------------- |
| GET    | `/health`                   | Health check                                             |
| GET    | `/api/automations`          | List all automations                                     |
| POST   | `/api/automations`          | Create automation (body: `name`, `flowData`)             |
| GET    | `/api/automations/:id`      | Get one automation                                       |
| PUT    | `/api/automations/:id`      | Update automation                                        |
| DELETE | `/api/automations/:id`      | Delete automation                                        |
| POST   | `/api/automations/:id/test` | Start test run (body: `{ "email": "user@example.com" }`) |

`flowData` shape: `{ nodes: Array<{ id, type, data, position }>, edges: Array<{ id, source, target }> }`.

## Features

- **Flow editor:** Start → End by default; add **Action** (email message) and **Delay** (specific date/time or relative duration) steps.
- **Automation list:** View, create, edit, delete, and test automations from the home page.
- **Test run:** Enter an email; automation runs in the background (delays and email sending handled server-side).
