# Step-by-Step Guide: Deploy Your LMS AI Chatbot Backend to Render

This guide walks you through deploying the **LMS AI Chatbot backend** (the `server` folder) to [Render](https://render.com), with Render handling TypeScript compilation.

We’ll track progress with a running completion percentage. You can check off each step as you go.

---

## 1. Pre‑deployment checks (10%)

1. **Confirm backend is in `server/` folder** ✅ (Done)
   - Path: `LMS-Ai-Chatbot/server`.
   - Contains at least: `index.ts`, `package.json`, `tsconfig.json`, `.env`.

2. **Check `package.json` scripts** (Render will use these) ✅ (Done):
   - Ensure `"start"` runs your server with TypeScript support (via `tsx` or `ts-node`).
   - Example (recommended):
     ```json
     "scripts": {
       "dev": "tsx watch index.ts",
       "start": "node --experimental-strip-types index.ts"
     }
     ```
   - Or, if using `tsx` directly in production:
     ```json
     "scripts": {
       "dev": "tsx watch index.ts",
       "start": "tsx index.ts"
     }
     ```

3. **Check environment variables needed by the backend** ✅ (Done)
   - At minimum, you’ll need your Gemini API key in production, e.g. `GOOGLE_GEMINI_API_KEY`.
   - Keep your local `.env` file handy so you can copy values into Render later.

> ✅ When you’ve verified the folder and scripts and know which env vars you need, mark **10% complete**. (Completed)

---

## 2. Prepare the project for Render (25%)

Render can:
- Run TypeScript directly with a runtime like `tsx`, **or**
- Run compiled JavaScript (if you build first).

In this project we’ll **let Render compile/execute TypeScript** using `tsx`.

1. **Ensure `tsx` is in `devDependencies`** in `server/package.json` ✅ (Done):
   ```json
   "devDependencies": {
     "tsx": "^4.21.0",
     "typescript": "^5.9.3"
   }
   ```
   (Your repo already has these; just confirm.)

2. **Set the `main` entry and module type** ✅ (Done)
    - `"main": "index.js"` is still present, but we’re running TS directly with `tsx`, so the critical part is that the **start script now points to `index.ts`** instead of a compiled file.

3. **Decide on the production command** ✅ (Done)
    - `server/package.json` now has:
       ```json
       "scripts": {
          "dev": "tsx watch index.ts",
          "start": "tsx index.ts"
       }
       ```
    - This lets Render run TypeScript directly without a separate build step.

> ✅ When your `server/package.json` has a correct `start` script and `tsx` dependency, mark **25% complete**.

---

## 3. Push latest backend code to GitHub (35%) ✅ (Done)

Render pulls code from a Git repository (GitHub is most common).

1. **Commit all recent backend changes** ✅ (Done)
   - From the project root (`LMS-Ai-Chatbot`):
     - Stage changes (especially inside `server/`).
     - Commit with a clear message (e.g. `chore: prepare backend for render`).

2. **Push to your main/default branch** ✅ (Done)
   - Make sure the branch you’ll connect on Render (e.g. `main`) is up to date.

3. **Verify on GitHub** ✅ (Done)
   - Open your repo in GitHub and confirm:
     - `server/` folder is present.
     - `server/index.ts` and `server/package.json` are visible with your latest changes.

> ✅ Once changes are pushed and visible on GitHub, mark **35% complete**. (Completed)

---

## 4. Create a Render account and connect GitHub (45%) ✅ (Done)

1. Go to **https://render.com** and **sign up / log in**. ✅ (Done)
2. In the Render dashboard, click **"New" → "Web Service"**. ✅ (Done)
3. If prompted, **connect your GitHub account** and **authorize Render**. ✅ (Done)
4. Select your **LMS-Ai-Chatbot** repository from the list. ✅ (Done)

> ✅ After Render is connected to your GitHub and you’ve selected the repo, mark **45% complete**. (Completed)

---

## 5. Configure the Render Web Service (65%) ✅ (Done)

Now you’ll tell Render how to run your backend.

1. **Pick a name** ✅ (Done)
   - Example: `lms-ai-chatbot-backend`.

2. **Choose region** ✅ (Done)
   - Select a region close to your users (e.g. `Frankfurt` or `Oregon`).

3. **Select branch** ✅ (Done)
   - Usually `main`.

4. **Set the Root Directory** (IMPORTANT) ✅ (Done)
   - Since your backend lives in the `server` folder, set:
     - **Root Directory**: `server`
   - This makes Render treat `server/` as the working directory, so it uses `server/package.json` and `server/index.ts`.

5. **Set Build Command** ✅ (Done)
   - Because you want Render to handle TypeScript and you’re running with `tsx`, you can:
     - **Option A (no build step)**: leave Build Command empty or use `npm install` only.
       - Example: `npm install`
     - **Option B (explicit build step)**: keep it simple, still no compile, just dependencies:
       - `npm install`

   - In both options, TypeScript compilation is handled at **runtime** by `tsx`.

6. **Set Start Command** ✅ (Done)
   - Use your `start` script so Render runs TS via `tsx`:
   - Example:
     - Start Command: `npm start`
   - Under the hood, this will run the `"start": "tsx index.ts"` script in `server/package.json`.

> ✅ Once the Web Service is configured with root directory `server`, build command `npm install`, and start command `npm start`, mark **65% complete**. (Completed)

---

## 6. Configure environment variables on Render (80%) ✅ (Done)

You must add any secrets and config values your backend needs.

1. In the Render Web Service settings, go to **"Environment" → "Environment Variables"**. ✅ (Done)

2. Based on your current `server/.env`, you should configure the following variables on Render (use these **exact names**):
   - `GOOGLE_GEMINI_API_KEY` – your Google Gemini API key (used by `GeminiService`).
   - `GEMINI_MODEL` – the Gemini model name to use (e.g. `gemini-3-flash-preview`).
   - `PORT` – the port your Express server listens on (Render will set its own port, but keeping this is fine; Render overrides it internally).
   - `NODE_ENV` – runtime environment (e.g. `development` or `production`).
   - `SMTP_HOST` – SMTP server host for escalation emails.
   - `SMTP_PORT` – SMTP server port.
   - `SMTP_USER` – SMTP username.
   - `SMTP_PASS` – SMTP password or app-specific password.
   - `EMAIL_FROM` – the "from" email address used when sending escalation emails.

   You **do not** need to set `VITE_API_URL` on Render for the backend; that one belongs on the frontend (Vercel) environment.

3. For each variable: ✅ (Done)
   - **Key**: the exact variable name (e.g. `GOOGLE_GEMINI_API_KEY`).
   - **Value**: copy from your local `.env` (but **never commit secrets** to Git).

4. Click **Save Changes**. ✅ (Done)

> ✅ After all required environment variables are added and saved, mark **80% complete**. (Completed)

---

## 7. Trigger first deploy and verify health (90%) ✅ (Done)

Render will usually start the first deploy automatically after you create the service. If not, you can trigger it manually.

1. **Trigger a manual deploy (if needed)** ✅ (Done)
    - In your Render Web Service page, go to the **top-right corner** and click:
       - **"Manual Deploy" → "Deploy latest commit"**.
    - Render will:
       - Pull the latest commit from your configured GitHub branch (e.g. `main`).
       - Run the **Build Command** (e.g. `npm install`).
       - Then run the **Start Command** (`npm start`, which runs `tsx index.ts` in `server/`).

2. **Monitor the build & startup logs carefully** ✅ (Done)
    - Switch to the **"Logs"** tab while the deploy is running.
    - During the build phase you should see:
       - `npm install` downloading and installing dependencies.
       - No red `ERR!` messages related to missing scripts or missing packages.
    - During the start phase you should see something like:
       - `> npm start`
       - `> tsx index.ts`
    - After that, you should see your own application logs from `server/index.ts`, for example:
       - `CodeTribe LMS — AI Service Ready`
       - `Server listening on port ...` or similar.
    - If you see errors here instead (e.g. missing env vars, port in use, etc.), fix them, push a new commit, and trigger another **Manual Deploy**.

3. **Confirm the service status is Live** ✅ (Done)
    - At the top of the Render service page, check the **Status** badge:
       - It should change from **"Building"** → **"Deploying"** → **"Live"**.
    - If it shows **"Crashed"** or **"Failed"**, scroll through the logs to see why, fix the issue locally, push a new commit, and redeploy.

4. **Test the backend health endpoint from your browser** ✅ (Done)
    - When the service is **Live**, copy the **public service URL** from the top of the Render service page, e.g.:
       - `https://lms-ai-chatbot-backend.onrender.com`
    - In your browser, open:
       - `https://lms-ai-chatbot-backend.onrender.com/api/health`
    - You should see a JSON response similar to:
       ```json
       {
          "ok": true,
          "service": "chat-api",
          "status": "healthy",
          "model": "gemini-pro"
       }
       ```
    - If you get a **timeout**, **5xx error**, or **HTML error page** instead of JSON, re-check:
       - That the service is **Live** (not rebuilding or crashed).
       - That your Express app actually defines the `/api/health` route.
       - That CORS or middleware isn’t blocking the request (a simple GET from the browser should work).

> ✅ Once the first deploy is live and `/api/health` responds correctly, mark **90% complete**. (Completed)

---

## 8. Connect your frontend to Render backend (100%)

Your frontend (already hosted on Vercel) needs to call the new Render backend URL.

1. Get your Render service URL
    - Example: `https://lms-ai-chatbot-backend.onrender.com`.

2. In your frontend `.env` (e.g. root `.env` in `LMS-Ai-Chatbot`), update:
    - `VITE_API_URL=https://lms-ai-chatbot-backend.onrender.com`

3. Rebuild/redeploy the frontend on Vercel so it picks up the new `VITE_API_URL`.

4. Test the full flow:
    - Open your Vercel frontend URL.
    - Use the chatbot as usual.
    - Confirm chat requests succeed and you see valid responses (or correct error messages when quota is exceeded).

> ✅ Once the frontend successfully communicates with the backend hosted on Render, mark **100% complete – deployment finished.**

---

## Troubleshooting tips

- **Build fails or `tsx` not found**
  - Ensure `tsx` is installed in `devDependencies` in `server/package.json`.
  - Confirm Render is using the **server** directory as root, not the project root.

- **Service crashes on startup**
  - Check logs for missing environment variables (e.g. missing Gemini key).
  - Verify your `start` script matches your code entrypoint (`index.ts`).

- **CORS issues between Vercel and Render**
  - Ensure `cors()` is enabled in your Express app (it is in `index.ts`).
  - If needed, restrict allowed origins by passing options to `cors()`.

- **API URL mismatch**
  - Confirm `VITE_API_URL` in the frontend `.env` exactly matches your Render backend URL, including `https`.

---

## Progress summary

Here’s a quick summary of steps and their contribution to overall completion:

1. Pre‑deployment checks – **10%** ✅
2. Prepare project for Render – **25%** ✅
3. Push latest code to GitHub – **35%** ✅
4. Create Render service & connect GitHub – **45%** ✅
5. Configure Render Web Service – **65%** ✅
6. Configure environment variables – **80%** ✅
7. First deploy & health check – **90%** ✅
8. Connect frontend & final test – **100%**

You can use this markdown file as a live checklist while you deploy your backend to Render.