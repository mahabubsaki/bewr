# Bewerbung Manager

A client-side German job application builder. Create, edit, and export a **Lebenslauf** (CV), **Anschreiben** (cover letter), and **Deckblatt** (cover page) — entirely in the browser. No account, no server, no data leaving your device.

---

## Features

- **Three document editors** — Lebenslauf, Anschreiben, and Deckblatt with live side-by-side preview
- **PDF export** — pixel-perfect output via `@react-pdf/renderer` with embedded Roboto and cursive signature fonts
- **Combined download** — merge all documents and uploaded certificates into a single PDF
- **Certificate upload** — drag-and-drop or click to attach additional PDF files (e.g. diplomas, references)
- **Adjustable page margins** — per-document top / bottom / left / right controls in millimetres
- **Drag-and-drop section reordering** — reorder CV sections via `@dnd-kit`
- **Undo / Redo** — 50-step history on the Lebenslauf editor
- **Persistent state** — auto-saved to `localStorage`; survives page refresh
- **Photo upload** — embed a profile picture in the Lebenslauf and Deckblatt
- **Responsive UI** — mobile-friendly layout with a hamburger menu on small screens
- **shadcn/ui** — accessible component library built on Radix UI + Tailwind CSS v4

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 · shadcn/ui · `tw-animate-css` |
| Routing | React Router DOM v7 |
| PDF rendering | `@react-pdf/renderer` v4 |
| PDF merging | `pdf-lib` |
| Drag-and-drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |
| Deployment | Vercel (SPA rewrite config included) |

---

## Project Structure

```
src/
├── App.tsx                   # Router setup & layout shell
├── index.css                 # Global styles
├── assets/font/roboto/       # Local Roboto TTF files (embedded in PDF)
├── components/
│   ├── Navbar.tsx            # Sticky navigation (desktop + mobile)
│   ├── LebenslaufPreview.tsx # Live browser preview of the CV
│   ├── AnschreibenPreview.tsx
│   ├── DeckblattPreview.tsx
│   ├── EditableList.tsx      # Bullet-point list editor
│   ├── EditableText.tsx      # Inline text editor
│   ├── MarginControls.tsx    # Popover margin controls (mm)
│   ├── PdfUploader.tsx       # Drag-and-drop PDF attachment uploader
│   ├── PhotoUpload.tsx       # Profile photo picker
│   └── ui/                   # shadcn/ui primitives (button, card, dialog …)
├── data/
│   └── defaultData.ts        # TypeScript interfaces + default placeholder data
├── hooks/
│   ├── useLocalStorage.ts    # Typed localStorage hook with reset support
│   └── useUndoRedo.ts        # History stack (max 50 steps) backed by localStorage
├── lib/
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
├── pages/
│   ├── Dashboard.tsx         # Overview: download all, certificate manager, data reset
│   ├── LebenslaufPage.tsx    # CV editor
│   ├── AnschreibenPage.tsx   # Cover letter editor
│   └── DeckblattPage.tsx     # Cover page editor
├── pdf/
│   ├── LebenslaufPDF.tsx     # React-PDF template for the CV
│   ├── AnschreibenPDF.tsx
│   └── DeckblattPDF.tsx
└── utils/
    ├── generatePdf.ts        # Renders a React-PDF element → Blob → download
    ├── mergePdfs.ts          # Merges multiple PDF Blobs via pdf-lib
    └── dateUtils.ts          # German date formatter + filename sanitiser
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Download individual or combined PDFs, manage certificates, reset data |
| `/lebenslauf` | LebenslaufPage | Edit personal info, skills, projects (live & GitHub URLs), experience, education, languages, hobbies |
| `/anschreiben` | AnschreibenPage | Edit sender/recipient details and letter body |
| `/deckblatt` | DeckblattPage | Edit cover page with photo, position title, and list of enclosures |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm (or pnpm / yarn)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Available at `http://localhost:5173` (or the next free port). The `--host` flag is set, so it is reachable on your local network as well.

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Serve with any static host.

### Lint

```bash
npm run lint
```

---

## Deployment

A `vercel.json` is included that rewrites all routes to `index.html` for client-side routing. Import the repository in the Vercel dashboard — no additional configuration required.

---

## Data & Privacy

All data (CV content, images, certificates) is stored exclusively in the **browser's `localStorage`**. Nothing is transmitted to any server. Use the "Daten zurücksetzen" button on the Dashboard or clear browser storage to permanently erase everything.

---

## License

This project is proprietary software — all rights reserved. See [LICENSE.md](LICENSE.md) for full terms.

