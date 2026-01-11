<div align="center">

# ตรวจบุญ (Traudboon)

### Donation Verification System

*Protect yourself from donation scams — verify before you transfer*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-red.svg)](https://www.gnu.org/licenses/agpl-3.0)

</div>

---

<p align="center">
  <img width="640" height="480" src="https://github.com/user-attachments/assets/e3329e3d-5ee3-40fb-ae67-7c05ac930559" />

<img width="640" height="480" alt="3" src="https://github.com/user-attachments/assets/bad8c194-8431-4abc-814e-2d27057bfd6b" />


<img width="640" height="480" alt="4" src="https://github.com/user-attachments/assets/83a26d01-6548-4538-a841-6b3603c4fd15" />

<img width="640" height="480" alt="5" src="https://github.com/user-attachments/assets/aabe4acc-929c-48f9-b45f-8d74514de95f" />

<img width="640" height="480" alt="6" src="https://github.com/user-attachments/assets/c96486e0-e842-4fe8-8d64-6384c54a84fd" />

<img width="640" height="480" alt="7" src="https://github.com/user-attachments/assets/876ad22b-1201-45eb-8a1a-2d47e7209ca5" />

<img width="640" height="480" alt="8" src="https://github.com/user-attachments/assets/8fdbb15d-4328-4c5f-84ff-b1bfd1c4d8f1" />

<img width="640" height="480" alt="9" src="https://github.com/user-attachments/assets/c4c07ad2-8482-4406-8b31-5d3cedd6937b" />

<img width="640" height="480" alt="10" src="https://github.com/user-attachments/assets/1b18ac5e-cedc-4752-b413-4ca42147adfe" />

<img width="640" height="480" alt="11" src="https://github.com/user-attachments/assets/b2d9f859-df96-4472-b75d-6d7be4ed61ef" />

<img width="640" height="480" alt="12" src="https://github.com/user-attachments/assets/6f18a5d2-3ea8-42f6-a17d-33be37b02ce6" />

<img width="640" height="480" alt="13" src="https://github.com/user-attachments/assets/8d218947-29ae-443e-870c-7e8a8be94d98" />

<img width="640" height="480" alt="14" src="https://github.com/user-attachments/assets/7cb7354b-a439-4c04-a3ac-068f41cf4b95" />

<img width="640" height="480" alt="15" src="https://github.com/user-attachments/assets/d905db1e-74f9-445c-b493-9dabd169d11d" />

<img width="640" height="480" alt="16" src="https://github.com/user-attachments/assets/06b591e5-9b7b-4fd0-9633-334f96fe3f78" />

<img width="640" height="480" alt="17" src="https://github.com/user-attachments/assets/6ffcac10-2341-458c-95c8-fc0baa069d58" />

</p>



## 📋 Overview

Traudboon is a LineOA web application designed to verify donation accounts before you transfer money, helping protect users from scam operations disguised as legitimate charitable organizations. Simply enter account details or upload a QR code to check against our verified foundation database.

## ✨ Features

-  **Real-time Verification** — Instant account validation against verified foundations
-  **Scam Detection** — Pattern matching to identify suspicious accounts
-  **QR Code Support** — Upload and verify payment QR codes
- **Mobile Responsive** — Optimized for all screen sizes
-  **Fast & Lightweight** — Built with modern web technologies

## 💻 System Architecture
### MVP 
<p align="center">
<img width="542" height="527" alt="image" src="https://github.com/user-attachments/assets/28d5e6b0-8269-4054-badb-f3fe5be62bda" />
</p>

### Scalable Production

<p align="center">
<img width="720" height="720" alt="KBTG and sumsung meeting #1 (2)33" src="https://github.com/user-attachments/assets/57adc788-1b34-4e99-8f18-e39dd8984473" />
</p>


## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Methasit-Pun/truad-boon-app-mockup.git
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

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

<div align="center">

**[Report Bug](../../issues)** • **[Request Feature](../../issues)**

Made with ❤️ for safer donations

</div>
