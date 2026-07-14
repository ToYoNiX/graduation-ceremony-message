# 🎓 Graduation Secret Messages

A little web app for a graduation ceremony. A QR code on the ceremony screen
sends families to this site, where they **search for their graduate's name** and
enter a **secret code** (given to them by the graduate) to unlock a personal
message. 💌

Each graduate writes their own message and picks their own code. Only someone
with the code can **read**, **edit**, or **delete** that message.

- 🧑‍🎓 **Graduates** write a message + choose a secret code
- 👨‍👩‍👧 **Families** search a name, enter the code, and unlock the message
- 🌐 **Arabic & English** supported (text direction is detected automatically)

---

## How it works

| Layer | Tech | Role |
| --- | --- | --- |
| Frontend | React + Vite + Tailwind | Static site (search, forms, reveal) |
| Hosting | GitHub Pages | Serves the static files, free |
| Backend | Supabase (Postgres) | Stores messages, enforces all security |

There is **no server of your own** to run. The browser talks directly to
Supabase using a **public** key, and all the security is enforced inside the
database. See [Security](#-security) below.

### User flows

```
Family:    Home → search name → 🔒 enter code → 💌 message revealed
Graduate:  Home → "Write your message" → ✍️ name + message + code → done
Edit:      Submit page → "Edit or delete" → search name → 🔒 code → ✏️ edit / 🗑️ delete
```

The edit/delete entry lives on the graduate **Submit** page (not the home page),
so families searching for a name aren't distracted by it.

---

## 🔐 Security

The whole point: it's safe to ship the Supabase **public** key in a static site,
because the browser can't do anything the database doesn't explicitly allow.

- **Names are public** (the browsable list) — exposed through a view that
  contains *only* `id`, `name`, `created_at`.
- **Message content is never directly readable.** It's returned *only* by the
  `reveal_message(id, code)` database function, which checks the code
  server-side. There is no query the browser can run to read message text
  without the correct code.
- **Editing/deleting** goes through functions that verify the code first. The
  browser has **no** direct insert/update/delete rights on the table.
- **Codes are never stored in plaintext** — only a bcrypt hash.
- Row Level Security is **on**, with no policies granting `anon` table access.

**Known trade-offs** (acceptable for a one-day event with no login):

- Anyone can *submit* a message (no accounts). 
- A weak/guessable code could be brute-forced. bcrypt makes each guess slow, but
  encourage graduates to pick non-obvious codes.

Full details and the exact SQL are in [`supabase/schema.sql`](supabase/schema.sql).

---

## 🚀 Getting started

Full step-by-step (Supabase + deploy + QR) is in **[SETUP.md](SETUP.md)**. Short version:

```bash
# 1. Install
npm install

# 2. Configure (copy the example, fill in your Supabase values)
cp .env.example .env

# 3. Load the database
#    Paste supabase/schema.sql into Supabase → SQL Editor → Run

# 4. Run locally
npm run dev

# 5. Generate the QR code for your live URL
npm run qr -- https://toyonix.github.io/graduation-ceremony-message/
```

### Environment variables

Both are **public** (safe in the browser). From Supabase → Project Settings → API:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

---

## 📦 Deployment (GitHub Pages)

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and deploys automatically. You need to:

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as repo
   **Actions → Variables**.
2. Set **Settings → Pages → Source** to **GitHub Actions**.

Live at: `https://toyonix.github.io/graduation-ceremony-message/`

> If you fork/rename the repo, update `REPO_BASE` in
> [`vite.config.ts`](vite.config.ts) to match `/<your-repo-name>/`.

---

## 🗂️ Project structure

```
supabase/schema.sql            The entire backend (run once in Supabase)
scripts/generate-qr.mjs        QR code generator (npm run qr)
src/lib/supabase.ts            Supabase client + all data calls
src/components/NameSearch.tsx  Shared searchable name list
src/components/ui.tsx          Buttons, inputs, cards
src/pages/Home.tsx             Family: search / browse names
src/pages/Reveal.tsx           Family: enter code → reveal message
src/pages/Submit.tsx           Graduate: write a message
src/pages/ManageSearch.tsx     Graduate: find your message to edit
src/pages/Manage.tsx           Graduate: enter code → edit / delete
.github/workflows/deploy.yml   Auto-deploy to GitHub Pages
```

---

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run qr -- <url>` | Generate `qr/qr.png` + `qr/qr.svg` for a URL |

---

Made with 💜 for our graduating class.
