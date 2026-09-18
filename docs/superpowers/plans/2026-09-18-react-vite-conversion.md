# React + Vite Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static `index.html` digital business card (Gül Yeşil) into a React + Vite (JavaScript) app, split into `ProfileCard`, `AboutSection`, `ContactLinks` components, with the visual design and content staying pixel-identical.

**Architecture:** Vite scaffolds the build (root `index.html` mounts `src/main.jsx` → `App.jsx`). `App.jsx` holds the static profile data and composes the three presentational components inside the original `.card` wrapper. The entire existing `<style>` block moves verbatim into `src/index.css`, so all class names and CSS behavior (responsive breakpoint, dark mode) are reused unchanged — this is what guarantees pixel parity. There is no application logic (no state, no data fetching), so verification is build success (`npm run build`) plus visual comparison in the browser rather than unit tests — this matches the spec's own verification section, and no testing framework is in scope.

**Tech Stack:** React 18, Vite 6, `@vitejs/plugin-react`, npm.

**Spec:** `docs/superpowers/specs/2026-09-18-react-vite-conversion-design.md`

## Global Constraints

- Visual design and content must stay pixel-identical to the current `index.html` — same text, same CSS values, same class names.
- Components: `ProfileCard`, `AboutSection`, `ContactLinks` (exact names from the spec).
- Language: JavaScript, not TypeScript.
- CSS: one global stylesheet (`src/index.css`), ported verbatim — no CSS Modules, no CSS-in-JS.
- Preserve accessibility attributes exactly: `aria-hidden="true"` on the avatar, `aria-label="İletişim linkleri"` on the contact nav, `target="_blank" rel="noopener noreferrer"` on both links, `lang="en"` on the title paragraph.
- Preserve responsive (`@media (max-width: 400px)`) and dark-mode (`@media (prefers-color-scheme: dark)`) CSS unchanged.
- Package manager: npm.

---

## File Structure

```
package.json            # created (Task 1)
vite.config.js           # created (Task 1)
index.html               # overwritten — Vite entry point (Task 1)
src/
  main.jsx               # created (Task 1)
  App.jsx                # created (Task 1), extended (Tasks 3-5)
  index.css               # created empty stub (Task 1), filled (Task 2)
  components/
    icons.jsx             # created (Task 3) — LinkedinIcon, GithubIcon
    ProfileCard.jsx        # created (Task 3)
    AboutSection.jsx       # created (Task 4)
    ContactLinks.jsx       # created (Task 5)
```

---

### Task 1: Scaffold the Vite + React project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Modify (overwrite): `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css` (empty stub, filled in Task 2)

**Interfaces:**
- Produces: `App` default export (React component, no props) — consumed by `src/main.jsx`.

- [ ] **Step 1: Initialize git and commit the pre-existing static site**

The project has no git repo yet, and the current `index.html` is about to be overwritten by the Vite entry point. Commit the current state first so the static version stays recoverable in history.

```bash
git init
git add index.html CLAUDE.md docs
git commit -m "chore: snapshot static digital business card before React conversion"
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "dijitalkart",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.5"
  }
}
```

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 4: Overwrite `index.html` with the Vite entry point**

Keep the original `<head>` metadata (title, description, `lang="tr"`), replace the body with the React mount point.

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gül Yeşil | Dijital Kartvizit</title>
  <meta name="description" content="Gül Yeşil - Operation Specialist. Dijital kartvizit." />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 5: Create `src/index.css` as an empty stub**

```css
/* filled in Task 2 with the ported stylesheet */
```

- [ ] **Step 6: Create a placeholder `src/App.jsx`**

```jsx
export default function App() {
  return <div>DijitalKart</div>;
}
```

- [ ] **Step 7: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 8: Install dependencies**

Run: `npm install`
Expected: completes without errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 9: Verify the build**

Run: `npm run build`
Expected: exits 0, prints a `dist/` output summary with no errors.

- [ ] **Step 10: Commit**

```bash
printf "node_modules\ndist\n" > .gitignore
git add package.json package-lock.json vite.config.js index.html src .gitignore
git commit -m "chore: scaffold Vite + React project skeleton"
```

---

### Task 2: Port the CSS verbatim

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS classes `.card`, `.avatar`, `.title`, `.tagline`, `.divider`, `.about h2`, `.about p`, `.contact`, `.btn`, `.btn-linkedin`, `.btn-github` and CSS custom properties on `:root` — consumed by components in Tasks 3-5.

- [ ] **Step 1: Replace `src/index.css` with the full ported stylesheet**

```css
:root {
  --bg-start: #eef2f7;
  --bg-end: #dfe7f0;
  --card-bg: #ffffff;
  --text-primary: #1b2430;
  --text-secondary: #4a5568;
  --accent: #2f6f5e;
  --accent-dark: #24564a;
  --border: #e6eaef;
  --shadow: rgba(27, 36, 48, 0.12);
}

* {
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: linear-gradient(160deg, var(--bg-start), var(--bg-end));
  color: var(--text-primary);
}

.card {
  width: 100%;
  max-width: 420px;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 20px 45px var(--shadow);
  padding: 40px 32px;
  text-align: center;
}

.avatar {
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
}

h1 {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}

.title {
  margin: 0 0 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.tagline {
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-secondary);
  font-style: italic;
}

.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 24px 0;
}

.about h2 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text-primary);
}

.about p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--text-secondary);
  text-align: left;
}

.contact {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 18px;
  border-radius: 12px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn:hover,
.btn:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px var(--shadow);
}

.btn-linkedin {
  background: #0a66c2;
  color: #fff;
}

.btn-github {
  background: #1b1f23;
  color: #fff;
}

@media (max-width: 400px) {
  .card {
    padding: 32px 22px;
    border-radius: 16px;
  }

  h1 {
    font-size: 21px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-start: #12161c;
    --bg-end: #1a2029;
    --card-bg: #1e242d;
    --text-primary: #f1f4f8;
    --text-secondary: #b9c2cf;
    --accent: #4fb59b;
    --accent-dark: #3a8f7a;
    --border: #2c3440;
    --shadow: rgba(0, 0, 0, 0.45);
  }
}
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `npm run build`
Expected: exits 0, no CSS syntax errors.

- [ ] **Step 3: Visually verify the background applies**

Run: `npm run dev`, open the printed local URL in a browser.
Expected: page shows the light gradient background (or dark variant if the OS is in dark mode) behind the placeholder "DijitalKart" text — confirms `index.css` is loading. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: port stylesheet verbatim to src/index.css"
```

---

### Task 3: Build `ProfileCard` and wire it into `App`

**Files:**
- Create: `src/components/icons.jsx`
- Create: `src/components/ProfileCard.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: CSS classes from Task 2 (`.avatar`, `h1`, `.title`, `.tagline`).
- Produces: `LinkedinIcon()`, `GithubIcon()` (no props, named exports from `icons.jsx`) — consumed by `ContactLinks` in Task 5. `ProfileCard({ initials, name, title, tagline })` (default export) — consumed by `App.jsx`.

- [ ] **Step 1: Create `src/components/icons.jsx`**

```jsx
export function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `src/components/ProfileCard.jsx`**

```jsx
export default function ProfileCard({ initials, name, title, tagline }) {
  return (
    <>
      <div className="avatar" aria-hidden="true">{initials}</div>
      <h1>{name}</h1>
      <p className="title" lang="en">{title}</p>
      <p className="tagline">{tagline}</p>
    </>
  );
}
```

- [ ] **Step 3: Wire `ProfileCard` into `App.jsx`**

```jsx
import ProfileCard from './components/ProfileCard.jsx';

const profile = {
  initials: 'GY',
  name: 'Gül Yeşil',
  title: 'Operation Specialist',
  tagline: 'Şirketlerdeki data lojistik alanında operasyon süreçlerini yönetiyor.',
};

export default function App() {
  return (
    <main className="card">
      <ProfileCard {...profile} />
    </main>
  );
}
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 5: Visually verify against the original**

Run: `npm run dev`, open the local URL.
Expected: teal circular "GY" avatar, "Gül Yeşil" heading, uppercase "OPERATION SPECIALIST" title in accent color, italic tagline — matching the card header in the original `index.html` (compare side-by-side, or check against the earlier-approved screenshot). Stop the dev server once confirmed.

- [ ] **Step 6: Commit**

```bash
git add src/components/icons.jsx src/components/ProfileCard.jsx src/App.jsx
git commit -m "feat: add ProfileCard component"
```

---

### Task 4: Build `AboutSection` and wire it into `App`

**Files:**
- Create: `src/components/AboutSection.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: CSS classes from Task 2 (`.about h2`, `.about p`), `.divider`.
- Produces: `AboutSection({ heading, text })` (default export) — consumed by `App.jsx`.

- [ ] **Step 1: Create `src/components/AboutSection.jsx`**

```jsx
export default function AboutSection({ heading, text }) {
  return (
    <section className="about">
      <h2>{heading}</h2>
      <p>{text}</p>
    </section>
  );
}
```

- [ ] **Step 2: Wire `AboutSection` into `App.jsx`**

```jsx
import ProfileCard from './components/ProfileCard.jsx';
import AboutSection from './components/AboutSection.jsx';

const profile = {
  initials: 'GY',
  name: 'Gül Yeşil',
  title: 'Operation Specialist',
  tagline: 'Şirketlerdeki data lojistik alanında operasyon süreçlerini yönetiyor.',
};

const about = {
  heading: 'Hakkımda',
  text: 'Gül Yeşil, şirketlerin data lojistik alanındaki operasyon süreçlerini uçtan uca yönetiyor. Veri akışının doğru ve zamanında ilerlemesini sağlamak, operasyonel süreçleri sistemli bir şekilde yürütmek işinin merkezinde yer alıyor. Detaylara verdiği önem ve sistematik yaklaşımıyla, karmaşık süreçleri sadeleştirip sürdürülebilir hale getirmeyi hedefliyor.',
};

export default function App() {
  return (
    <main className="card">
      <ProfileCard {...profile} />
      <hr className="divider" />
      <AboutSection {...about} />
    </main>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 4: Visually verify against the original**

Run: `npm run dev`, open the local URL.
Expected: horizontal divider line below the tagline, "HAKKIMDA" heading, left-aligned paragraph text — matching the original's about section.

- [ ] **Step 5: Commit**

```bash
git add src/components/AboutSection.jsx src/App.jsx
git commit -m "feat: add AboutSection component"
```

---

### Task 5: Build `ContactLinks` and wire it into `App`

**Files:**
- Create: `src/components/ContactLinks.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `LinkedinIcon`, `GithubIcon` from `src/components/icons.jsx` (Task 3); CSS classes from Task 2 (`.contact`, `.btn`, `.btn-linkedin`, `.btn-github`).
- Produces: `ContactLinks({ links })` (default export, `links: Array<{ label: string, href: string, variant: string, Icon: () => JSX.Element }>`) — consumed by `App.jsx`.

- [ ] **Step 1: Create `src/components/ContactLinks.jsx`**

```jsx
export default function ContactLinks({ links }) {
  return (
    <nav className="contact" aria-label="İletişim linkleri">
      {links.map(({ label, href, variant, Icon }) => (
        <a
          key={variant}
          className={`btn btn-${variant}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon />
          {label}
        </a>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Wire `ContactLinks` into `App.jsx`**

```jsx
import ProfileCard from './components/ProfileCard.jsx';
import AboutSection from './components/AboutSection.jsx';
import ContactLinks from './components/ContactLinks.jsx';
import { LinkedinIcon, GithubIcon } from './components/icons.jsx';

const profile = {
  initials: 'GY',
  name: 'Gül Yeşil',
  title: 'Operation Specialist',
  tagline: 'Şirketlerdeki data lojistik alanında operasyon süreçlerini yönetiyor.',
};

const about = {
  heading: 'Hakkımda',
  text: 'Gül Yeşil, şirketlerin data lojistik alanındaki operasyon süreçlerini uçtan uca yönetiyor. Veri akışının doğru ve zamanında ilerlemesini sağlamak, operasyonel süreçleri sistemli bir şekilde yürütmek işinin merkezinde yer alıyor. Detaylara verdiği önem ve sistematik yaklaşımıyla, karmaşık süreçleri sadeleştirip sürdürülebilir hale getirmeyi hedefliyor.',
};

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/g%C3%BCl-ye%C5%9Fil/', variant: 'linkedin', Icon: LinkedinIcon },
  { label: 'GitHub', href: 'https://github.com/gulyesil', variant: 'github', Icon: GithubIcon },
];

export default function App() {
  return (
    <main className="card">
      <ProfileCard {...profile} />
      <hr className="divider" />
      <AboutSection {...about} />
      <ContactLinks links={links} />
    </main>
  );
}
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: exits 0, no errors.

- [ ] **Step 4: Visually verify against the original**

Run: `npm run dev`, open the local URL.
Expected: blue "LinkedIn" button and dark "GitHub" button with icons, both open their target URL in a new tab when clicked (`view-source` or hover to confirm `href`/`target`/`rel`).

- [ ] **Step 5: Commit**

```bash
git add src/components/ContactLinks.jsx src/App.jsx
git commit -m "feat: add ContactLinks component"
```

---

### Task 6: Final visual regression, cleanup, and verification

**Files:**
- Modify: none expected (cleanup only if the scaffold left unused boilerplate)
- Verify: `index.html`, `src/App.jsx`, `src/index.css`, `src/components/*`

- [ ] **Step 1: Remove unused Vite template boilerplate, if present**

Run: `ls public/ src/assets 2>/dev/null`
If `public/vite.svg` or `src/assets/react.svg` exist and are not referenced anywhere (`grep -r "vite.svg\|react.svg" src index.html`), delete them:

```bash
rm -f public/vite.svg src/assets/react.svg
rmdir src/assets public 2>/dev/null || true
```

- [ ] **Step 2: Full build check**

Run: `npm run build`
Expected: exits 0, no errors or warnings about unused files.

- [ ] **Step 3: Desktop visual comparison**

Run: `npm run dev`, open the local URL in a browser window sized ≥1280px wide.
Expected: layout matches the original static `index.html` (recoverable via `git show HEAD~5:index.html` if a side-by-side is needed) — card centered, spacing, colors, fonts identical.

- [ ] **Step 4: Mobile visual comparison**

Using browser DevTools responsive mode at 390px width (or narrower, ≤400px to trigger the breakpoint).
Expected: card padding/border-radius shrink and `h1` font-size drops to 21px, per the `@media (max-width: 400px)` rule — matching the original's mobile behavior.

- [ ] **Step 5: Dark mode check**

Toggle the OS/browser to dark color scheme (or DevTools "Emulate CSS prefers-color-scheme: dark").
Expected: background, card, text, and accent colors switch to the dark palette values from `:root` inside the `@media (prefers-color-scheme: dark)` block — matching the original.

- [ ] **Step 6: Stop the dev server and commit any cleanup**

```bash
git add -A
git commit -m "chore: clean up unused Vite template assets" --allow-empty
```
