# Faculty Performance Appraisal System (React + Vite)

This is a React (Vite) port of the original vanilla HTML/CSS/JS Faculty
Performance Appraisal System. It preserves 100% of the original
functionality, workflow, validations, UI, and business logic, while
reorganizing the code into a professional React project structure.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/       Reusable UI pieces (Sidebar, Notification, SubmissionCard,
                     admin/ and staff/ subfolders for tab-specific pieces)
  pages/             Route-level pages (LoginPage, AdminDashboard,
                     StaffDashboard, SettingsPage)
  context/           React Context providers (AuthContext, ThemeContext,
                     NotificationContext)
  utils/             Storage helpers & shared constants
  styles/            style.css (original stylesheet, untouched) plus
                     theme.css and settings.css (new, additive only)
```

## Login

- **Admin** — username: `admin`, password: `admin123`
- **Staff** — enter any name, pick a designation and department

## Settings (new page)

Reachable via the "Settings" link in the sidebar of either dashboard.

- **Theme** — toggle Light / Dark mode (persisted in `localStorage`)
- **Font Size** — Small / Medium / Large, scales the whole app
  (persisted in `localStorage`)

No other functionality was added. All original features — the Question
Builder, form validations, appraisal scoring, submission history, and
localStorage-backed persistence — work exactly as before.
