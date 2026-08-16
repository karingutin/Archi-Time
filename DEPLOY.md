# Deploy — KAIRO / Architecture of Time

Host: **GitHub Pages**, served from `main` at the repository root.
URL: **https://karingutin.github.io/Archi-Time/**

The site is a plain static site: one HTML shell, four CSS files, thirty-two JS
files, nine SVGs. No build step, no bundler, no server. Pages copies the branch
and serves it, which is exactly what this project needs — the `<script src>`
order in the shell IS the execution order, and nothing must be allowed to
reorder or concatenate it.

Data collection stays **off**: `CONFIG.DATA_ENDPOINT` is empty, so a visitor's
answers live only in their own browser's `localStorage`. Nothing leaves the
machine, so the site needs no privacy notice and no backend.

---

## Decisions taken

| Question | Answer |
| --- | --- |
| Host | GitHub Pages, branch `main`, folder `/` |
| Repo visibility | **Public** (Pages from a private repo needs a paid plan) |
| Address | Default `karingutin.github.io/Archi-Time` — a custom domain can be added later without breaking anything |
| Answer collection | None. `localStorage` only |

---

## Step 1 — Clean the repo before it goes public

The repo is private today, so it carries things that were never written to be
read by strangers. Making it public publishes **the whole history**, not just
the current tree — so untracking a file now does not remove it from the past
commits. Decide per item whether "visible in history" is acceptable.

Tracked today, and worth a decision:

- **`handoff/`** (22 files) — includes `handoff/memory/*.md`: notes on how Karin
  works, feedback style, the question-bank method. Personal working notes, not
  product. **Recommend: `git rm -r handoff` before going public.** Still in
  history; acceptable, since nothing there is a secret.
- **`פוסטרדמה.psd`** and **`ניסיון עם אלמנטים שלי`** — working art files. They
  are why `.git` is 27 MB. **Recommend: untrack, keep locally.**
- **`lattice/week.html`, `lattice/weekend.html`** (and the two `… new.html`) —
  Brik exports that still contain `base44.app` asset URLs, a `frog.wix.com`
  analytics beacon and a PostHog endpoint. They are reference material, not part
  of the site. **Recommend: untrack, or keep and accept that internal Wix tool
  URLs become public.** This one is a judgement call about Wix material, not a
  technical one.
- **`PRODUCT.md`, `SPLIT_PLAN.md`, `CLAUDE.md`, `docs/`, the four prototype
  HTMLs** — design and process documents. Nothing sensitive; they read as the
  making-of. **Recommend: keep.** They are the honest record of the build.

Then add a `.gitignore` the repo has never had:

```
.DS_Store
*.psd
.claude/settings.local.json
```

(`.claude/settings.local.json` is already untracked but has no guard, and it
contains local absolute paths under `/Users/karingu/`.)

Also: there are two stray `.DS_Store` files untracked right now, and twenty
modified files not yet committed. Commit or stash those before touching Pages
— whatever is on `main` is what the world sees within a minute of the push.

## Step 2 — Give the site a root entry point

Pages serves `index.html` at `/`. The app is `architecture-of-time.html`.

**Recommended: `git mv architecture-of-time.html index.html`.** Clean URL, no
redirect flash, and `?skip` / `?endpoint` query params keep working. The cost is
updating the references in `CLAUDE.md`, `SPLIT_PLAN.md`, `.claude/launch.json`
and the header comment in `js/app/72-boot.js` — a find-and-replace across about
six files, no code change.

Alternative, if the filename is load-bearing elsewhere: add a two-line
`index.html` that meta-refreshes to `architecture-of-time.html`. Works, but the
public URL then shows the long filename and a visitor sees one blank frame.

Also add an empty **`.nojekyll`** at the root. Nothing here starts with an
underscore so Jekyll would not currently eat anything, but it removes a whole
class of future surprise and makes the build faster.

## Step 3 — Turn Pages on

Repo → Settings → Pages:

- Source: **Deploy from a branch**
- Branch: **`main`**, folder: **`/ (root)`**
- Enforce HTTPS: **on**

No GitHub Actions workflow is needed. The branch source is a plain file copy,
which is the right choice for a project whose load order is hand-authored.

First build takes a minute or two. Every later push to `main` redeploys
automatically.

## Step 4 — Verify on the live URL, not locally

macOS is case-insensitive and Pages is not, so a path that works locally can
404 in production. All 36 `src`/`href` paths in the shell were checked against
the tracked filenames and match exactly today — but re-verify after the rename,
because that is precisely the kind of change that breaks it.

On https://karingutin.github.io/Archi-Time/ :

1. DevTools → Console: zero errors.
2. DevTools → Network: no 404s; all four CSS and all thirty-two JS files load;
   the Google Fonts stylesheet resolves.
3. Walk the flow end to end — landing → five linear questions → fork → Create.
4. Confirm the poster renders and the three Save-as buttons produce files.
5. Reload. `no-store` is set in the shell, so nothing should be stale.
6. Check one non-Chrome browser (Safari) and one phone.

## Step 5 — Rollback

Pages always serves the last pushed commit. To roll back:

```bash
git revert HEAD && git push
```

Live again in about a minute. There is no build cache to clear.

---

## Open items, worth handling before sharing the link widely

**The `?endpoint=` parameter.** `js/app/70-collect.js:20` lets any visitor
append `?endpoint=https://…` to the URL and the page will POST their answers
there. It was a testing convenience on a private file. On a public URL it is a
loaded gun pointed at nobody in particular — a visitor can only leak their own
answers, and only by pasting a crafted link. Low harm, zero benefit in
production. **Recommend: gate it behind `localhost`, or delete the block.**

**Small screens.** The whole interface is snapped to the `--cell` grid and was
built at desktop sizes. A public link will be opened on phones. Either verify
the grid holds at 375px, or add an honest small-screen notice. Not a blocker
for a first deploy, but it is what most visitors will hit first.

**Sharing metadata.** No `<meta name="description">`, no Open Graph tags, no
favicon. A link pasted into Slack or WhatsApp will show a bare URL. One block
in the shell's `<head>` plus one preview image fixes it. Cosmetic, but this is
a poster tool — the preview is part of the invitation.

**Fonts.** `Wix Madefor Display` comes from Google Fonts over the network. If
Google Fonts is blocked or slow the interface falls back. Acceptable; note it
as the one external dependency the site has.

**Discoverability.** A public repo and a public Pages site are indexable. If
this should be shareable-by-link but not searchable, add a `robots.txt`
disallow — it is a request, not a wall, but it handles the honest crawlers.

---

## The whole thing, in commands

Run after Step 1's deletions are decided:

```bash
git rm -r --cached "פוסטרדמה.psd" "ניסיון עם אלמנטים שלי" && printf '.DS_Store\n*.psd\n.claude/settings.local.json\n' > .gitignore && git mv architecture-of-time.html index.html && touch .nojekyll && git add -A && git commit -m "Prepare for public hosting on GitHub Pages" && git push
```

Then flip the repo to public and switch Pages on in Settings.
