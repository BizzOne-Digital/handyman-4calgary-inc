# Handyman 4 Calgary: Website & Admin Panel

Next.js (App Router) + TypeScript + Tailwind CSS + MongoDB (Mongoose).
10 public pages, an authenticated admin panel, enquiry forms saved to MongoDB, and serverless-safe image uploads stored in MongoDB.

## Site structure (10 pages)

Everything is organized around two divisions. Services are admin-managed records; each belongs to a **group**, and each group is either its own page (residential) or a section of the Commercial & Industrial page.

| Route | Page | Services shown |
|---|---|---|
| `/` | Home | Both divisions side by side, every group and service linked |
| `/residential` | Residential overview | All residential groups |
| `/residential/renovations` | Kitchen, Bathroom & Basement Renovations | Kitchen, Basement & General Renovations · Bathroom & Washroom Renovations · Demolition & General Construction |
| `/residential/flooring-painting-carpentry` | Flooring, Painting, Doors & Carpentry | Flooring · Painting & Drywall · Door & Window Services · Carpentry & General Repairs |
| `/residential/plumbing-electrical-maintenance` | Plumbing, Electrical & Property Maintenance | Plumbing · Electrical · Property Maintenance |
| `/commercial-industrial` | Commercial & Industrial | `#renovations-construction` · `#trade-services` · `#maintenance` |
| `/about` · `/projects` · `/request-a-quote` · `/contact` | | |

- Every service has its own anchor (e.g. `/residential/renovations#bathroom-washroom-renovations`, `/commercial-industrial#commercial-electrical`) and a quote link with the service preselected (`/request-a-quote?division=commercial&service=commercial-electrical`).
- Groups are defined in `lib/constants.ts` → `SERVICE_GROUPS`. Adding a **service** needs no code: create it in Admin → Services and choose its group. Adding a new **page** means adding a group and a route; discuss this first, as the plan is limited to 10 pages.
- Old URLs (`/residential/basement-development`, `/kitchen-bathroom-renovations`, `/home-improvements-maintenance`) permanently redirect to the new pages.

Admin: `/admin/login`, `/admin`, `/admin/pages`, `/admin/services`, `/admin/projects`, `/admin/media`, `/admin/enquiries`, `/admin/settings`.

## Environment variables

Copy `.env.example` to `.env.local` (local) or add these in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string including the database name. |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://handyman4calgary.com`. Used for canonical URLs, sitemap and Open Graph. **Inlined at build time**: redeploy after changing it. |
| `APP_SECRET` | Yes | Long random string used to hash IPs for rate limiting. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `RESEND_API_KEY` | No | Enables enquiry email notifications through Resend. |
| `NOTIFY_EMAIL_TO` | No | Comma-separated recipients for notifications. |
| `NOTIFY_EMAIL_FROM` | No | Verified sender, e.g. `Handyman 4 Calgary Website <website@handyman4calgary.com>`. |

Enquiries are always saved to MongoDB first. Email is an optional extra and never blocks a submission.

## Local development

```bash
npm install
cp .env.example .env.local      # then fill in MONGODB_URI and APP_SECRET
npm run seed                    # initial content (safe to re-run; never overwrites edits)
ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSWORD='choose-a-long-password-1' npm run admin:create
npm run dev                     # http://localhost:3000, admin at /admin
```

Other commands:

```bash
npm run typecheck
npm run build && npm start
npm run admin:create -- --reset          # with ADMIN_EMAIL/ADMIN_PASSWORD set: reset a password and sign out its sessions
npm run cleanup:uploads                  # delete unreferenced uploads older than 24h (also a button in Admin → Media)
npm run migrate:structure                # one-time move to the 10-page service structure (already run on Atlas; safe to re-run)
npm run migrate:images                   # one-time switch from seeded stock URLs to /images/*.webp (already run)
```

Admin passwords must be at least 12 characters with letters and numbers. No credentials are stored in the code.

## Deploying to Vercel

1. Create a MongoDB Atlas cluster and a database user. In Atlas → Network Access, allow Vercel (for example `0.0.0.0/0` with a strong password, or Vercel's static IP options).
2. Import the project in Vercel (framework: Next.js). Add the environment variables above.
3. From your machine, with `.env.local` pointing at the production `MONGODB_URI`, run `npm run seed` and `npm run admin:create` once.
4. Deploy. Then connect the `handyman4calgary.com` domain in Vercel.

## How content works

- Public pages read **published** content from MongoDB (cached, refreshed automatically after each admin save). If the database is unreachable, pages fall back to built-in default content, so the site never goes blank.
- **Pages**: edit hero, introduction, section images, FAQs and SEO. *Save draft* keeps changes private; *Save & publish* updates the live page. *Unpublish* reverts the live page to the defaults.
- **Services**: 20 services (10 residential, 10 commercial), each with title, description, highlights, image and alt text, division, group, order and draft/published status. They drive the homepage overview, the service pages, the navigation-ready links and the quote form dropdown, so a new published service appears everywhere automatically.
- **Projects**: gallery photos. Use **Add project photos in bulk** to upload up to 50 photos at once. Link a project to a **related service** and its photo also appears in that service's section on the website. Stock/example images are labelled *Illustrative example*; real client photos are not.
- **Settings**: phone, email, service area, logo, footer text, social links (shown only when filled in), default SEO.
- **Enquiries**: every quote/contact submission with a reference (`H4C-YYMMDD-XXXXXX`), status (New / Contacted / In Progress / Closed) and internal notes.

## Image uploads (MongoDB storage)

- Images are stored as binary in the `storeduploads` collection, never on disk, so they survive redeploys on Vercel.
- `POST /api/upload` (FormData `file`, `folder` = `products|gallery|pages|misc`) → `{ success, url, filename, size, folder }`.
- Vercel limits request bodies to about **4.5 MB**. The admin uploader sends files up to 3.5 MB directly and larger files (up to the **8 MB** limit) in 3 MB chunks via `/api/upload/chunked`. The server reassembles, validates and stores them in the same format. Abandoned chunks expire automatically after 1 hour.
- Files are validated by their real file signature (PNG, JPEG, WebP, GIF only). Filenames are generated server-side.
- `GET /api/uploads/{folder}/{filename}` serves images with immutable caching. Replacements always get a new filename.
- Old images are deleted only **after** the content is saved, and only when no page, service, project or setting still uses them. Unsplash URLs are never deleted.

## Before launch: client to confirm

- **Logo**: `public/brand/logo.png` was extracted from the design mockup (250×66 px). Upload the original high-resolution logo in Admin → Settings for a sharper result on high-density screens.
- **Plumbing and electrical**: published as client services, worded to say permit and licensing requirements are confirmed during planning. Confirm who performs regulated work (licensed staff or licensed subcontractors) before adding any licence claims.
- **Licences, insurance, certifications, warranties, pricing, hours**: none are published. Add only verified information.
- **Photography**: all 21 initial photographs are AI-generated illustrative images in public/images. They are not completed client projects. Replace with real project photos when available. Original seeded Unsplash image URLs are resolved to the matching local assets without changing custom admin images.
- **Social links and Google Business Profile**: add in Admin → Settings.

## Replacing images with real project photos

| Where it shows | Where to change it |
|---|---|
| Service sections, service cards, group thumbnails | Admin → Services → *service* → Service image (the first service in a group is its thumbnail) |
| Page heroes (Residential pages, Commercial, About) | Admin → Pages → *page* → Hero image |
| Home division panels, About preview | Admin → Pages → Home → Section images |
| Gallery, homepage project preview, photos under each service | Admin → Projects (bulk upload, link to a service) |
| Logo, social sharing image | Admin → Settings |

Always update the alt text so it describes what the photo actually shows.
