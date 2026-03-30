# Wilson Gaming 🎮

A kids AI game creation platform where children (ages 6–14) use simple prompts and AI to **create, play, and tweak games**. Monetized by ads.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │          Next.js 14 (App Router / React)          │    │
│   │   src/app/          src/components/               │    │
│   │   src/lib/          src/types/                    │    │
│   └───────────────────────┬───────────────────────────┘    │
└───────────────────────────┼─────────────────────────────────┘
                            │ API Routes (src/app/api/)
                ┌───────────┴──────────┐
                │    Node.js Backend   │
                │  (Next.js API routes)│
                └───────────┬──────────┘
               ┌────────────┼────────────┐
               ▼            ▼            ▼
          Claude API     Database     Ad Network
        (game gen + AI)  (future)      (future)
```

---

## Project Overview

Wilson Gaming lets kids describe a game in plain language and watch it come to life. The AI generates playable browser games, and kids can keep tweaking them with new prompts.

**Key principles:**

- **Simple**: No complex interfaces — just type and play
- **Safe**: Age-appropriate content only
- **Fast**: Games render in the browser immediately
- **Fun**: Colorful, accessible UI built for kids

---

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | Next.js 14, React, TypeScript |
| Styling  | Tailwind CSS                  |
| AI       | Claude API (Anthropic)        |
| Linting  | ESLint + Prettier             |
| CI       | GitHub Actions                |

---

## Folder Structure

```
wilson-gaming/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   │   ├── api/          # Backend API endpoints
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities, AI client, helpers
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── .github/workflows/    # CI/CD
└── ...config files
```

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm 9+

### Getting Started

```bash
# Clone the repo
git clone https://github.com/camjaywilson/wilson-gaming.git
cd wilson-gaming

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command          | Description               |
| ---------------- | ------------------------- |
| `npm run dev`    | Start development server  |
| `npm run build`  | Build for production      |
| `npm run start`  | Start production server   |
| `npm run lint`   | Run ESLint                |
| `npm run format` | Format code with Prettier |

---

## Environment Variables

Create a `.env.local` file with the following:

```env
# Anthropic Claude API
ANTHROPIC_API_KEY=your_api_key_here
```

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure lint and type checks pass: `npm run lint && npx tsc --noEmit`
4. Open a pull request

CI runs automatically on every push and PR.

---

## License

MIT
