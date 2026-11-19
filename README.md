# VIBE SWIFT ⚡

> **AI-Driven Reverse-Engineering and Cloning Engine integrating [morluto/rea](https://github.com/morluto/rea)**  
> **Styled with The Swifters Studio Black & Grey Aesthetic**

Vibe Swift ingests target websites, applications, and bundles via `morluto/rea`, extracts their structural blueprints, and rebuilds them as customized, production-ready **Next.js & Tailwind CSS** applications.

---

## 🏛️ Monorepo Architecture

```
vibe-swift/
├── packages/
│   └── core/                 # @vibe-swift/core: REA parser wrapper & backend engine logic
│       ├── src/
│       │   ├── engine/       # VibeEngine facade, BlueprintSynthesizer, CodeGenerator, AIEnhancer
│       │   ├── rea/          # REARunner (morluto/rea CLI & passive session collector), EvidenceParser
│       │   ├── types/        # Schemas for Evidence, Blueprint, Synthesis, and Project
│       │   └── utils/        # HTML/DOM scanner, HTML entity decoder, CSS-to-Tailwind mapper, Logger
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   └── web/                  # @vibe-swift/web: Next.js (App Router) & Tailwind frontend
│       ├── public/           # The Swifters brand mark assets (swifters-logo-mark.png)
│       ├── src/
│       │   ├── app/          # Next.js App Router (Dashboard, Layout, API routes)
│       │   │   └── api/      # /api/clone, /api/analyze, /api/blueprint, /api/health
│       │   ├── components/   # Dashboard, Header, LiveReconstructedPreview, CodeViewer, EvidenceViewer
│       │   └── lib/          # HTML entity decoding & Tailwind utility helpers
│       ├── package.json
│       ├── tailwind.config.ts
│       └── next.config.mjs
│
├── package.json              # Monorepo workspace configuration (npm workspaces)
├── tsconfig.base.json        # Shared TypeScript base configuration
└── README.md
```

---

## 🖤 The Swifters Studio Aesthetic

* **Obsidian & Charcoal Palette**: Deep black background (`#09090b`), dark charcoal panels (`#111113`, `#18181b`), subtle 1px hairline neutral grey borders (`#27272a`), and crisp off-white/silver typography (`#fafafa`, `#e4e4e7`).
* **Utilitarian Engineering Tooling**: No glowing purple/cyan gradients, no neon blobs, no floating glassmorphism, and no cheesy magic sparkles. Built like a serious developer and studio workstation.
* **The Swifters Brand Mark**: Integrated metallic anchor emblem paired with the `VIBE SWIFT` wordmark.
* **Studio Customizer**: On-the-fly customization panel allowing overrides for Brand Name, Primary Headline, Value Proposition, Description, and CTA text with instant live preview and code re-synthesis.
* **Entity Decoding**: Automated HTML entity decoding (`&amp;` -> `&`, `&#x27;` -> `'`, etc.) across all extracted titles, metadata, and components.

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Web Studio
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the Vibe Swift Studio interface.

### 3. Build & Verify All Packages
```bash
npm run build
npm run test
npm run typecheck
```

---

## 📜 License
MIT &copy; Vibe Swift Team. Integrates [morluto/rea](https://github.com/morluto/rea) with The Swifters studio aesthetic.
