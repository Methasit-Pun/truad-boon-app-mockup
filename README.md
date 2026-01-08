<div align="center">

# ตรวจบุญ (Traudboon)

### Donation Verification System

*Protect yourself from donation scams — verify before you transfer*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

</div>

---

## Overview

Traudboon is a web application designed to verify donation accounts before you transfer money, helping protect users from scam operations disguised as legitimate charitable organizations. Simply enter account details or upload a QR code to check against our verified foundation database.

## Features

-  **Real-time Verification** — Instant account validation against verified foundations
-  **Scam Detection** — Pattern matching to identify suspicious accounts
-  **QR Code Support** — Upload and verify payment QR codes
-  **Dark Mode** — Seamless light/dark theme switching
-  **Mobile Responsive** — Optimized for all screen sizes
-  **Fast & Lightweight** — Built with modern web technologies

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd truad-boon-app-mockup

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
# Create optimized build
pnpm build

# Start production server
pnpm start
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) |

## 📂 Project Structure

```
truad-boon-app-mockup/
├── app/
│   ├── globals.css         # Global styles & theme variables
│   ├── layout.tsx          # Root layout & metadata
│   ├── loading.tsx         # Loading UI
│   └── page.tsx            # Main application page
├── components/
│   ├── theme-provider.tsx  # Theme context provider
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/
│   └── utils.ts            # Utility functions
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 🎨 Customization

### Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). Add new components:

```bash
npx shadcn@latest add [component-name]
```

### Theme Customization

Modify color tokens in `app/globals.css`:

```css
:root {
  --kbank-green: oklch(0.62 0.18 155);
  --navy-blue: oklch(0.25 0.08 250);
  /* ... customize other colors */
}
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

<div align="center">

**[Report Bug](../../issues)** • **[Request Feature](../../issues)**

Made with ❤️ for safer donations

</div>
