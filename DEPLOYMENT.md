# Deployment Guide: Vercel (Frontend) + Render (Backend)

Deploy the **backend** first so you have its URL for the frontend env.

---

## 1. Backend on Render

### Option A: Using the Blueprint (recommended)

1. Push your repo to GitHub (if not already).
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
3. Connect the repo that contains this project.
4. Render will detect `render.yaml`. Click **Apply**.
5. When prompted, set these **environment variables** (secrets are not in the repo):
   - **MONGODB_URI** – Your MongoDB Atlas connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/automation-flow?retryWrites=true&w=majority`).
   - **RESEND_API_KEY** – Your Resend API key (e.g. `re_xxxxxxxx`).
   - **CORS_ORIGIN** – Leave empty for now; set after the frontend is deployed (see step 2 below).
6. After the first deploy, open your backend service. The URL will be like `https://automation-flow-builder-api.onrender.com`.
7. In Render → your service → **Environment**, set **CORS_ORIGIN** to your Vercel frontend URL (e.g. `https://your-app.vercel.app`). No trailing slash. Save; Render will redeploy if needed.

### Option B: Manual Web Service

1. **New** → **Web Service**.
2. Connect your GitHub repo.
3. **Root Directory:** `back-end`.
4. **Runtime:** Node.
5. **Build Command:** `npm install && npm run build`
6. **Start Command:** `npm start`
7. **Instance type:** Free (or Starter).
8. Add environment variables as in Option A (MONGODB_URI, RESEND_API_KEY, CORS_ORIGIN). Render sets **PORT** automatically.
9. Deploy. Note the service URL (e.g. `https://your-service-name.onrender.com`).

### Backend env summary

| Variable       | Required   | Notes                                               |
| -------------- | ---------- | --------------------------------------------------- |
| MONGODB_URI    | Yes        | MongoDB Atlas connection string                     |
| RESEND_API_KEY | Yes        | Resend API key for sending email                    |
| CORS_ORIGIN    | Yes (prod) | Frontend origin, e.g. `https://your-app.vercel.app` |
| FROM_EMAIL     | No         | Default: `Automation Flow <onboarding@resend.dev>`  |
| PORT           | No         | Set by Render                                       |

**Health check:** `GET https://your-backend.onrender.com/health` should return `{"status":"ok"}`.

---

## 2. Frontend on Vercel

1. Go to [Vercel](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project** → Import the same GitHub repo.
3. **Root Directory:** Click **Edit**, set to `front-end`, then **Continue**.
4. **Environment Variables:**
   - **NEXT_PUBLIC_API_URL** = your Render backend URL, e.g. `https://automation-flow-builder-api.onrender.com`
   - No trailing slash.
5. **Deploy.** Wait for the build to finish.
6. Open the Vercel URL (e.g. `https://your-project.vercel.app`).
7. In Render, set **CORS_ORIGIN** to this Vercel URL (see Backend step 7 in Option A).

---

## 3. Quick checklist

- [ ] Backend deployed on Render; `/health` returns OK.
- [ ] Frontend deployed on Vercel; root directory = `front-end`.
- [ ] `NEXT_PUBLIC_API_URL` = Render backend URL (no trailing slash).
- [ ] `CORS_ORIGIN` on Render = Vercel frontend URL (no trailing slash).
- [ ] MongoDB Atlas: if you use IP allowlist, allow `0.0.0.0/0` for Render (or add Render’s outbound IPs if you restrict them).
- [ ] Resend: “From” domain is verified, or you use the default onboarding domain for testing.

---

## 4. Troubleshooting

- **CORS errors in browser:** Ensure `CORS_ORIGIN` on Render exactly matches the frontend origin (scheme + host, no trailing slash).
- **API 404 / wrong base URL:** Ensure `NEXT_PUBLIC_API_URL` has no trailing slash and uses `https://`.
- **Backend “Application failed to respond”:** Check Render logs (Logs tab). Typical causes: missing `MONGODB_URI` or `RESEND_API_KEY`, or build/start command running from wrong directory (Root Directory must be `back-end`).
- **Render free tier spin-down:** First request after idle can take 30–60 seconds; subsequent requests are fast. Consider a paid instance if you need no cold starts.
