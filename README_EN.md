# EditMD

> A lightweight online Markdown editor with live preview, PDF/Word export, one-click copy, and a REST API for external integrations.

[中文](./README.md)

---

## Preview

<!-- Replace with actual screenshot -->
<!-- ![EditMD Preview](./screenshot.png) -->

```
+----------------------------------------------------------+
|  EditMD  [H1][H2][H3][H4] | [B][I][~][🔗]...  [Copy][Word][PDF] |
+-----------------------------+----------------------------+
|  Markdown Editor            |  Live Preview              |
|  # Title                    |  Title                     |
|  **Bold**                   |  Bold                      |
|  ```js                      |  ┌─────────────┐           |
|  console.log('hello');      |  │ console.log │           |
|  ```                        |  └─────────────┘           |
+-----------------------------+----------------------------+
|  120 chars | 15 lines | Auto-save enabled               |
+----------------------------------------------------------+
```

---

## Features

### Editor
- Split-pane layout: Markdown source on the left, live preview on the right
- Toolbar shortcuts: Headings (H1-H4), Bold, Italic, Strikethrough, Link, Image, Code, Code Block, Quote, List, Task List, Table, Horizontal Rule
- Emoji picker (6 categories, 100+ emojis) with `:emoji_name:` syntax support
- Tab indentation
- Drag-and-drop `.md` file import, or click the import button

### Export
- **Export PDF** — Generated in-browser with preserved code highlighting, tables, blockquotes, and other formatting
- **Export Word** — Generates `.docx` in-browser with support for headings, bold, lists, tables, quotes, code blocks, and more
- **One-click Copy** — Copies Markdown source to clipboard

### REST API
- `POST /api/export/pdf` — Accepts Markdown, returns PDF file stream
- `POST /api/export/word` — Accepts Markdown, returns Word file stream
- `GET /api/health` — Health check

### Enhancements
- **Code Highlighting** — highlight.js with syntax highlighting for many programming languages
- **Full-width Character Auto-conversion** — When pasting from WeChat, Word, etc., full-width punctuation (`＊＃＿～（）【】：｜`) is automatically converted to half-width, ensuring Markdown syntax parses correctly
- **Local Auto-save** — Content is automatically saved to browser localStorage, persists across refreshes
- **Status Bar** — Real-time character count, line count, and auto-save status
- **Responsive Layout** — Side-by-side on wide screens, stacked on narrow screens

---

## Quick Start

### Prerequisites

- Node.js >= 18

### Install & Run

```bash
# Clone the repository
git clone https://github.com/errorpower/editmd.git
cd editmd

# Install dependencies
npm install

# Start both frontend + backend API
npm run dev:all
```

Frontend at http://localhost:7812, Backend API at http://localhost:7813.

### Frontend Only

```bash
npm run dev
```

### Backend API Only

```bash
npm run dev:server
```

---

## Usage

### Editor

1. Open http://localhost:7812
2. Type Markdown in the left editor pane
3. See live preview on the right
4. Use toolbar buttons to insert Markdown syntax
5. Click the top buttons to export PDF / Word / Copy

### Emoji

**Method 1: Emoji Picker**

Click the 😊 button on the right side of the toolbar to open the emoji picker panel.

**Method 2: Markdown Syntax**

Type `:emoji_name:` in the editor, and it will be rendered as the corresponding emoji in the preview:

```
:fire: → 🔥
:star: → ⭐
:warning: → ⚠️
:thumbsup: → 👍
:heart: → ❤️
```

Supports 100+ emoji names. See the full list at the bottom of the emoji picker panel.

### Full-width Character Auto-conversion

When copying Markdown content from WeChat, Word, WPS, etc., punctuation marks are often auto-converted to full-width characters (e.g., `＊` instead of `*`), causing Markdown syntax to break.

EditMD automatically converts the following full-width characters to half-width:

| Full-width | Half-width | Markdown Usage |
| --- | --- | --- |
| ＊ | * | Bold, Italic, Lists |
| ＃ | # | Headings |
| ＿ | _ | Bold, Italic |
| ～ | ~ | Strikethrough |
| （） | () | Links, Images |
| 【】 | [] | Links, Images |
| ： | : | Links, Emoji |
| ｜ | \| | Tables |

---

## API Documentation

### POST /api/export/pdf

Convert Markdown content to a PDF file.

**Request:**

```bash
curl -X POST http://localhost:7812/api/export/pdf \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nThis is **bold** text."}' \
  -o output.pdf
```

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| markdown | string | Yes | Markdown text content |
| filename | string | No | Output filename, defaults to `document.pdf` |

**Response:**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="document.pdf"`
- Body: PDF binary stream

---

### POST /api/export/word

Convert Markdown content to a Word document.

**Request:**

```bash
curl -X POST http://localhost:7812/api/export/word \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nThis is **bold** text.", "filename": "report.docx"}' \
  -o output.docx
```

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| markdown | string | Yes | Markdown text content |
| filename | string | No | Output filename, defaults to `document.docx` |

**Response:**

- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="report.docx"`
- Body: DOCX binary stream

---

### GET /api/health

Health check endpoint.

```bash
curl http://localhost:7812/api/health
# {"status":"ok","service":"EditMD API"}
```

---

## Markdown Syntax Support

| Syntax | Supported | Notes |
| --- | --- | --- |
| Headings `# ~ ######` | ✅ | H1-H6 |
| Bold `**text**` | ✅ | |
| Italic `*text*` | ✅ | |
| Strikethrough `~~text~~` | ✅ | |
| Inline code `` `code` `` | ✅ | |
| Code blocks ` ``` ` | ✅ | Syntax highlighting |
| Links `[text](url)` | ✅ | |
| Images `![alt](url)` | ✅ | |
| Unordered lists `- item` | ✅ | |
| Ordered lists `1. item` | ✅ | |
| Task lists `- [ ] item` | ✅ | |
| Blockquotes `> text` | ✅ | |
| Tables | ✅ | GFM tables |
| Horizontal rules `---` | ✅ | |
| Emoji `:name:` | ✅ | 100+ emojis |
| Full-width char conversion | ✅ | WeChat/Word compatible |

---

## Tech Stack

| Layer | Technology | Description |
| --- | --- | --- |
| Frontend | React 18 + TypeScript | Vite build |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Markdown | marked | GFM support |
| Highlighting | highlight.js | Multi-language syntax highlighting |
| Emoji | marked-emoji | `:name:` syntax support |
| PDF (frontend) | html2pdf.js | Browser-side generation |
| PDF (backend) | pdfkit | Server-side generation |
| Word export | docx | Shared frontend/backend |
| Backend | Express.js | REST API |
| Dev tools | tsx, concurrently | Hot reload + concurrent startup |

---

## Project Structure

```
editmd/
├── index.html                    # Entry HTML
├── package.json
├── vite.config.ts                # Vite config (port 7812, API proxy)
├── tsconfig.json
├── server/                       # Backend API
│   ├── index.ts                  # Express server entry (port 7813)
│   ├── routes/
│   │   └── export.ts             # /api/export/pdf & /api/export/word
│   └── utils/
│       ├── generatePdf.ts        # PDF generation logic
│       └── generateWord.ts       # Word generation logic
├── src/                          # Frontend source
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Main layout
│   ├── components/
│   │   ├── Editor.tsx            # Markdown editor
│   │   ├── Preview.tsx           # Live preview
│   │   ├── Toolbar.tsx           # Toolbar + Emoji picker
│   │   ├── ActionBar.tsx         # Export buttons
│   │   ├── StatusBar.tsx         # Status bar
│   │   └── Toast.tsx             # Toast notifications
│   ├── hooks/
│   │   ├── useLocalStorage.ts    # Auto-save
│   │   └── useMarkdown.ts        # Markdown parsing + Emoji + char conversion
│   ├── utils/
│   │   ├── exportPdf.ts          # Frontend PDF export
│   │   ├── exportWord.ts         # Frontend Word export
│   │   └── copyToClipboard.ts    # Copy to clipboard
│   └── styles/
│       ├── index.css             # Tailwind entry
│       └── preview.css           # Preview area styles
```

---

## Development

### Commands

```bash
npm run dev          # Start frontend dev server (port 7812)
npm run dev:server   # Start backend API server (port 7813)
npm run dev:all      # Start both frontend + backend
npm run build        # Build for production
npm run lint         # Lint code
```

### Frontend

The frontend uses Vite dev server with Hot Module Replacement (HMR). Changes are reflected in the browser instantly.

`/api/*` requests are automatically proxied to the backend (port 7813) via Vite's proxy config — no extra setup needed in development.

### Backend API

The backend runs with `tsx watch` and auto-restarts on code changes.

---

## License

[MIT](./LICENSE)
