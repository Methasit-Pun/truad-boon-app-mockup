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

<img width="640" height="480" alt="4" src="https://github.com/user-attachments/assets/dd2dbf09-edb2-4795-ae86-1d200cc76942" />

<img width="640" height="480" alt="5" src="https://github.com/user-attachments/assets/c21ae78c-c2ff-4ebb-a971-29ece7462105" />

<img width="640" height="480" alt="6" src="https://github.com/user-attachments/assets/9c1e6df7-2b74-441f-b445-d5645f0476fa" />

<img width="640" height="480" alt="7" src="https://github.com/user-attachments/assets/015ae58c-3c7f-460b-aa3e-36e9e43d2eee" />

<img width="640" height="480" alt="8" src="https://github.com/user-attachments/assets/c4a06fbe-7923-4af7-b1df-e98f6d23632d" />

<img width="640" height="480" alt="9" src="https://github.com/user-attachments/assets/b634a9c1-0405-48ff-b22e-ad56d10b64a2" />

<img width="640" height="480" alt="10" src="https://github.com/user-attachments/assets/eb8ad76a-fe4c-4edd-95ff-d5cc8561e591" />

<img width="640" height="480" alt="11" src="https://github.com/user-attachments/assets/ac6b459b-9437-4a52-921f-79b813940d21" />

<img width="640" height="480" alt="12" src="https://github.com/user-attachments/assets/7ccff202-60ca-4994-8761-527c4d427033" />

<img width="640" height="480" alt="13" src="https://github.com/user-attachments/assets/7f29787e-6f33-46d9-a719-f3e283bb28c3" />

<img width="640" height="480" alt="14" src="https://github.com/user-attachments/assets/7f507dc1-5581-4b2a-ac2d-655de1556c50" />


<img width="640" height="480" alt="16" src="https://github.com/user-attachments/assets/04893f79-cd13-45f3-b472-40274851fd41" />

<img width="640" height="480" alt="17" src="https://github.com/user-attachments/assets/345c4b79-e60e-4dbf-8d7f-8d00d2d89d21" />

</p>





## 📋 Overview

Traudboon is a web application designed to verify donation accounts before you transfer money, helping protect users from scam operations disguised as legitimate charitable organizations. Simply enter account details or upload a QR code to check against our verified foundation database.

## ✨ Features

-  **Real-time Verification** — Instant account validation against verified foundations
-  **Scam Detection** — Pattern matching to identify suspicious accounts
-  **QR Code Support** — Upload and verify payment QR codes
-  **Dark Mode** — Seamless light/dark theme switching
- **Mobile Responsive** — Optimized for all screen sizes
-  **Fast & Lightweight** — Built with modern web technologies

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
