# 🎓 Graduation Secret Messages — Setup Guide

A tiny static site where graduates write a secret message, and their families
scan a QR code at the ceremony, search the graduate's name, and enter a secret
code to unlock the message.

- **Frontend:** React + Vite (static, hosted free on GitHub Pages)
- **Backend:** Supabase (Postgres). No server of your own needed.
- **Security:** message content and edit/delete are gated by a per-message
  secret code, verified server-side. See [How the security works](#how-the-security-works).

---

## 1. Set up the database (Supabase)

You already created the project. Now load the schema:

1. Open your project → **SQL Editor** → **New query**.
2. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and paste it in.
3. Click **Run**. You should see "Success".
4. (Optional) Verify RLS is on — run this and confirm it returns `true`:
   ```sql
   select relrowsecurity from pg_class where relname = 'messages';
   ```

That's the whole backend. It creates the table, the public names view, the
code-checking functions, and locks down direct access.

---

## 2. Run it locally

Your `.env` should already contain (values from Supabase → Settings → API):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

Then:

```bash
npm install
npm run dev
```

Open the printed URL, submit a test message, and try unlocking it. 🎉

---

## 3. Deploy to GitHub Pages

The repo includes a GitHub Actions workflow that builds and deploys on every
push to `main`.

1. **Push this repo to GitHub** (if you haven't):
   ```bash
   git add .
   git commit -m "Graduation secret messages app"
   git push
   ```

2. **Add the Supabase values as Actions Variables** so the build can read them:
   - Repo → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` with your values.
   - (These are public keys, so repo *Variables* are fine — no need for Secrets.)

3. **Turn on Pages:** Repo → **Settings** → **Pages** → under "Build and deployment",
   set **Source** to **GitHub Actions**.

4. Push to `main` (or re-run the workflow from the **Actions** tab). When it
   finishes, your site is live at:
   ```
   https://<your-username>.github.io/graduation-ceremony-message/
   ```

> **Note on the URL / base path:** the site is configured for a repo named
> `graduation-ceremony-message`. If your repo has a different name, update
> `REPO_BASE` in [`vite.config.ts`](vite.config.ts) to match `/your-repo-name/`.

---

## 4. Make the QR code

Once you know your live URL, generate a big print-friendly QR code:

```bash
npm run qr -- https://<your-username>.github.io/graduation-ceremony-message/
```

This writes `qr/qr.png` and `qr/qr.svg`. Drop the PNG into your ceremony slide.
(Test it with your phone before the big day!)

---

## How the security works

- The browser only ever holds the **public** anon/publishable key. That's by
  design — it's safe to expose (like Firebase's client config).
- **Names are public** (the browsable list) via a view that exposes *only*
  `id`, `name`, `created_at` — never the message or the code.
- **Message content** is returned *only* by the `reveal_message(id, code)`
  database function, which checks the code server-side. There is no way for the
  browser to read message text without the correct code.
- **Editing/deleting** likewise only happens through functions that verify the
  code first. `anon` has **no** direct insert/update/delete rights on the table.
- Secret codes are **never stored in plaintext** — only a bcrypt hash.

**The one real limitation:** since there's no login, anyone can *submit* a
message, and a weak/guessable code could be brute-forced. For a one-day event
that's an acceptable trade-off. Encourage graduates to pick non-obvious codes.

---

## Project structure

```
supabase/schema.sql        The entire backend (run once in Supabase)
scripts/generate-qr.mjs    QR code generator
src/lib/supabase.ts        Supabase client + all data calls
src/pages/Home.tsx         Search / browse names
src/pages/Reveal.tsx       Enter code → reveal message
src/pages/Submit.tsx       Graduate writes a message
src/pages/Manage.tsx       Enter code → edit / delete
.github/workflows/deploy.yml   Auto-deploy to GitHub Pages
```
