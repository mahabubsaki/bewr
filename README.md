# Bewerbung Manager

A browser-based German job application builder. Create, edit, and export a polished **Lebenslauf** (CV), **Anschreiben** (cover letter), and **Deckblatt** (cover page) — all in one place. Everything runs client-side; no server or account required.

---

## Features

- **Three document editors** — Lebenslauf, Anschreiben, and Deckblatt, each with a live side-by-side PDF preview
- **PDF export** — generate pixel-perfect PDFs using `@react-pdf/renderer` with embedded Roboto fonts and a cursive signature font
- **Combined download** — merge all documents (including uploaded certificates) into a single PDF with a custom filename
- **Certificate / attachment upload** — drag-and-drop or click to attach additional PDF files (e.g. diplomas)
- **Adjustable page margins** — set top / bottom / left / right margins per document in millimetres
- **Drag-and-drop section reordering** — reorder CV sections (experience, projects, education, etc.) via `@dnd-kit`
- **Undo / Redo** — up to 50 history steps on the Lebenslauf editor
- **Persistent state** — all data is auto-saved to `localStorage`; nothing is lost on page refresh
- **Photo upload** — embed a profile picture in the Lebenslauf and Deckblatt
- **Responsive UI** — mobile-friendly navigation with a hamburger menu on small screens
- **shadcn/ui components** — accessible, composable UI built on Radix UI primitives + Tailwind CSS v4

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
| Drag-and-drop | `@dnd-kit/core` / `sortable` |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |
| Deployment | Vercel (SPA rewrite config included) |

---

## Project Structure

```
src/
├── App.tsx                  # Router setup & layout shell
├── index.css                # Global styles
├── assets/font/roboto/      # Local Roboto TTF files (embedded in PDF)
├── components/
│   ├── Navbar.tsx           # Sticky top navigation (desktop + mobile)
│   ├── LebenslaufPreview.tsx # Live browser preview of the CV
│   ├── AnschreibenPreview.tsx
│   ├── DeckblattPreview.tsx
│   ├── EditableList.tsx     # Reusable bullet-point list editor
│   ├── EditableText.tsx     # Inline text editor
│   ├── MarginControls.tsx   # Popover to adjust page margins (mm)
│   ├── PdfUploader.tsx      # Drag-and-drop PDF attachment uploader
│   ├── PhotoUpload.tsx      # Profile photo picker
│   └── ui/                  # shadcn/ui primitives (button, card, dialog, …)
├── data/
│   └── defaultData.ts       # TypeScript interfaces + default placeholder data
├── hooks/
│   ├── useLocalStorage.ts   # Typed localStorage hook with reset support
│   └── useUndoRedo.ts       # History stack (max 50 steps) backed by localStorage
├── lib/
│   └── utils.ts             # `cn()` helper (clsx + tailwind-merge)
├── pages/
│   ├── Dashboard.tsx        # Overview: download buttons, certificate manager, data reset
│   ├── LebenslaufPage.tsx   # Full CV editor
│   ├── AnschreibenPage.tsx  # Cover letter editor
│   └── DeckblattPage.tsx    # Cover page editor
├── pdf/
│   ├── LebenslaufPDF.tsx    # React-PDF document template for the CV
│   ├── AnschreibenPDF.tsx
│   └── DeckblattPDF.tsx
└── utils/
    ├── generatePdf.ts       # Renders a React-PDF element → Blob → file download
    ├── mergePdfs.ts         # Merges multiple PDF Blobs into one via pdf-lib
    └── dateUtils.ts         # German date formatter + filename sanitiser
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Download individual or combined PDFs, manage certificate attachments, reset data |
| `/lebenslauf` | LebenslaufPage | Edit personal info, skills, projects, experience, education, languages, hobbies |
| `/anschreiben` | AnschreibenPage | Edit sender/recipient details and the letter body (multi-paragraph) |
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

The app is available at `http://localhost:5173` (or the next free port). The `--host` flag is set, so it is also reachable on your local network.

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Serve the folder with any static host.

### Lint

```bash
npm run lint
```

---

## Deployment

A `vercel.json` is included that rewrites all routes to `index.html`, enabling client-side routing on Vercel. Import the repository in the [Vercel dashboard](https://vercel.com) — no additional configuration is needed.

---

## Data & Privacy

All data (CV content, images, certificates) is stored exclusively in the **browser's `localStorage`**. Nothing is sent to any server. Clearing browser data or using the "Daten zurücksetzen" (reset) button on the Dashboard will permanently erase everything.

---

## License

Private project — all rights reserved.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
