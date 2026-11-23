# Vivaan Infracon — portfolio & admin

Portfolio website for **Nileesh Baldha / Vivaan Infracon**, with a private admin dashboard for managing projects, enquiries and site content.

Next.js 15 (App Router) · React 19 · Tailwind CSS 3 · TypeScript.

## Run locally

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and AUTH_SECRET
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (sign in with `ADMIN_PASSWORD`)

## What's inside

**Public site**
- `/` — Full-screen hero, about and stats, featured projects, a past / present / future overview, approach, and contact options.
- `/projects` — All published projects, filterable by Completed / Under construction / Upcoming.
- `/projects/[slug]` — Cover photo, story, key facts, gallery, and WhatsApp / email / call buttons that pre-fill the project name.
- `/contact` — Direct contact buttons plus an enquiry form. Enquiries are saved in the admin, with optional email notification.

**Admin (`/admin`, password-protected)**
- **Projects:** add, edit, publish, hide (draft), archive and delete. Reorder with ↑/↓ and use ★ to feature a project on the home page. Uploads go to the cover photo and the gallery, and photos are resized in the browser before upload (max 2400px, WebP). Photos you remove are deleted from storage.
- **Enquiries:** form submissions, with one-tap reply by email, phone or WhatsApp. You can mark them read, archive or delete them.
- **Site settings:** email, phone, WhatsApp number, socials and address, plus the home page text and numbers, hero photo and your portrait.
  WhatsApp and Call buttons appear on the site only after you fill in the number.

## Storage

`src/lib/storage.ts` picks a storage driver automatically:

| Where | Driver | Data |
|---|---|---|
| Vercel (`BLOB_READ_WRITE_TOKEN` set) | Vercel Blob | JSON files + photos in your Blob store |
| Local / VPS / Docker | Disk | `./data/*.json` and `./data/uploads/` (back this folder up) |

Until you save your first project, the site shows 6 **sample projects** with Unsplash placeholder photos. Edit or delete them from the admin.

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Storage → create a **Blob** store and connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`.
3. Add the environment variables `ADMIN_PASSWORD`, `AUTH_SECRET` (`openssl rand -base64 32`) and `NEXT_PUBLIC_SITE_URL`.
4. Optional email alerts: `RESEND_API_KEY` and `RESEND_FROM` (sender on a domain verified at resend.com).

## Design system

- Tokens are CSS variables in `src/app/globals.css`: light values on `:root`, dark values under `prefers-color-scheme` and `[data-theme="dark"]`. `tailwind.config.ts` maps them into Tailwind (`bg-bg`, `text-fg`, `text-muted`, `border-line`, `bg-primary`, `bg-accent`, `rounded-btn`, `py-section`…).
- Fonts are Manrope (headings) and Inter (body), loaded with `next/font/google`.
- Style: thin 1px rules instead of boxes, outlined buttons, no shadows, a warm photo grade (`.photo-warm`), and 200ms motion with fade-up reveals that are disabled under `prefers-reduced-motion`.
- Accessibility: tap targets are at least 44px, there is a skip link and focus rings, and colours pass WCAG AA. To pass AA, two tokens differ from the quiz values: light `muted` is #5E6675 instead of #6A7281, and dark `primary` is #7393EC instead of #4B72E0, with dark text on filled buttons. The amber accent is used only for rules, never for text.
- Components: `src/components/ui` (Button, Card, Section, Field/Input/Select/Textarea, Photo, Reveal, ThemeToggle) and `src/components/site` (Navbar, Footer, ProjectCard, ContactForm).
