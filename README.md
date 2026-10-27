# 🧠 CodeIntel — AI-Powered Codebase Intelligence Platform

> Connect any GitHub repository for instant AI-powered security audits, architecture visualization, dependency analysis, and codebase intelligence.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **🔗 Live GitHub Integration** — Analyze any public or private GitHub repository (with PAT)
- **📊 Health Score Dashboard** — Composite health scoring across 7 dimensions
- **🗺️ Architecture Visualization** — Interactive React Flow graph of inferred system topology
- **🛡️ Security & Secrets Audit** — Detect committed secrets, vulnerable dependencies, and CVEs
- **📦 Dependency Intelligence** — Real dependency scanning from `package.json` with vulnerability cross-referencing
- **🏗️ Technical Debt Analysis** — Identify monolithic modules, complexity hotspots, and missing tests
- **🤖 AI Repository Copilot** — Context-aware RAG-style assistant with source citations
- **📝 PR Risk Review** — AI-generated pull request risk assessment with file-level scoring
- **📖 Auto Documentation** — Generated README, API specs, architecture docs, and setup guides
- **🔍 Symbol Search** — AST-indexed function and class search across the codebase

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/your-username/codeintel.git
cd codeintel
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the dashboard.

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Private Repository Support

CodeIntel supports private repositories via GitHub Personal Access Tokens:

1. Generate a token at [github.com/settings/tokens](https://github.com/settings/tokens/new?scopes=repo&description=CodeIntel)
2. Grant the `repo` scope
3. Paste the token in the "Add Repository" modal

> **Note:** Tokens are stored locally in your browser's `localStorage` and are never sent to any external server.

---

## 📁 Project Structure

```
codeintel/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main dashboard (client component)
│   ├── globals.css         # Design tokens & scrollbar styles
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # Custom 404 page
│   └── loading.tsx         # App loading state
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Header.tsx          # Top bar with repo selector
│   ├── AddRepoModal.tsx    # Repository connection modal
│   ├── OverviewView.tsx    # Health score dashboard
│   ├── ArchitectureView.tsx # React Flow topology graph
│   ├── SecurityView.tsx    # Security findings explorer
│   ├── QualityView.tsx     # Technical debt cards
│   ├── DependenciesView.tsx # Dependency table
│   ├── AiAssistantView.tsx # AI chat assistant
│   ├── PullRequestsView.tsx # PR risk analysis
│   └── DocsAndSearchView.tsx # Docs generator & symbol search
├── lib/
│   ├── githubAnalyzer.ts   # GitHub API integration & analysis engine
│   └── utils.ts            # Shared utilities (cn, formatNumber, etc.)
├── types/
│   └── codeintel.ts        # TypeScript interfaces & schemas
├── next.config.ts          # Production config with security headers
├── .env.example            # Environment variable template
└── package.json
```

---

## 🛡️ Security

- **Security headers** configured: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **No server-side token storage** — GitHub PATs are stored client-side only
- **`poweredByHeader: false`** — Server technology fingerprint removed
- **Standalone output** — Optimized for containerized deployments

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npx vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📄 License

MIT © CodeIntel
