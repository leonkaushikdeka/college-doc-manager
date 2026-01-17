# 🎓 College DocManager

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?style=for-the-badge&logo=shadcnui)

**The ultimate document management solution for Indian college students. Store, organize, scan, and manage all your academic documents in one secure place.**

[![Stars](https://img.shields.io/github/stars/your-username/college-doc-manager?style=for-the-badge)](https://github.com/your-username/college-doc-manager/stargazers)
[![Forks](https://img.shields.io/github/forks/your-username/college-doc-manager?style=for-the-badge)](https://github.com/your-username/college-doc-manager/network/members)
[![Issues](https://img.shields.io/github/issues/your-username/college-doc-manager?style=for-the-badge)](https://github.com/your-username/college-doc-manager/issues)
[![License](https://img.shields.io/github/license/your-username/college-doc-manager?style=for-the-badge)](https://github.com/your-username/college-doc-manager/blob/main/LICENSE)

---

[🚀 Quick Start](#-quick-start) • [📖 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Project Structure](#-project-structure) • [🤝 Contributing](#-contributing)

---

## ✨ Why College DocManager?

College students deal with **hundreds of documents** every semester:
- 🎫 Admit cards and hall tickets
- 💰 Fee receipts and financial documents
- 📋 Bonafide certificates and ID cards
- 📊 Marksheets and grade cards
- 📅 Exam schedules and calendars
- 💼 Placement and internship documents

**College DocManager** is designed specifically for Indian college students to solve all these problems in one unified platform.

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0+ (recommended) or [Node.js](https://nodejs.org) v18+
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/college-doc-manager.git
cd college-doc-manager

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env

# 4. Initialize the database
bun run db:push

# 5. Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun start
```

---

## 📖 Features

### 📚 Document Management

| Feature | Description |
|---------|-------------|
| **📤 Smart Upload** | Drag & drop multiple files, auto-categorization |
| **📁 Folders** | Create nested folders to organize documents |
| **🏷️ Tags** | Custom tags with colors for easy filtering |
| **🔍 Search** | Full-text search across all documents |
| **⭐ Favorites** | Quick access to important documents |
| **📱 Offline Access** | Documents available offline (PWA) |
| **📤 Bulk Actions** | Select, delete, export multiple documents |
| **📄 Preview** | Built-in document preview |

### 📷 Document Scanner

| Feature | Description |
|---------|-------------|
| **📸 Camera Scan** | Scan documents using device camera |
| **🔤 OCR Extraction** | Extract text from scanned images |
| **✂️ Auto-Crop** | Automatic document edge detection |
| **🎨 Image Enhancement** | Improve scanned document quality |
| **📄 Multi-Page** | Scan multiple pages into one document |

### ⏰ Smart Reminders

| Feature | Description |
|---------|-------------|
| **📅 Deadline Tracking** | Never miss an important date |
| **🔔 Smart Notifications** | Browser notifications before deadlines |
| **🔄 Recurring Reminders** | Daily, weekly, monthly, yearly |
| **📊 Priority Levels** | Low, Medium, High, Urgent |
| **📈 Calendar View** | Monthly calendar with all reminders |
| **✅ Completion Tracking** | Track completed tasks |

### 📝 Notes System

| Feature | Description |
|---------|-------------|
| **📝 Rich Notes** | Markdown-style note taking |
| **📌 Pinned Notes** | Pin important notes to top |
| **🔗 Document Links** | Link notes to specific documents |
| **🏷️ Tag Support** | Organize notes with tags |

### 📊 Analytics Dashboard

| Feature | Description |
|---------|-------------|
| **📈 Document Stats** | Total documents, size, categories |
| **💾 Storage Usage** | Track your storage consumption |
| **📊 Category Breakdown** | Visual charts of document distribution |
| **📅 Activity Tracking** | Documents added, viewed, shared |

### 💾 Backup & Restore

| Feature | Description |
|---------|-------------|
| **💾 Full Backups** | Export all data as ZIP |
| **📄 JSON Export** | Export documents as JSON/CSV |
| **♻️ Restore** | Restore from previous backups |
| **📅 Auto-Backup** | Scheduled backup support |

### 🔗 Sharing & Collaboration

| Feature | Description |
|---------|-------------|
| **📱 QR Codes** | Generate shareable QR codes |
| **🔗 Share Links** | Create time-limited share links |
| **🔒 Password Protection** | Secure shared links |
| **📤 Export Options** | Export to JSON, CSV, ZIP |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript 5** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Beautiful, accessible components |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Consistent icon library |
| **Zustand** | State management |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |

### Backend

| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Backend API |
| **Prisma ORM** | Database ORM |
| **SQLite** | Local database (production-ready) |
| **NextAuth.js** | Authentication |
| **bcryptjs** | Password hashing |

### Tools & Utilities

| Technology | Purpose |
|------------|---------|
| **Bun** | Fast JavaScript runtime |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Husky** | Git hooks |

---

## 📁 Project Structure

```
college-doc-manager/
├── public/                    # Static assets
│   ├── icons/                # PWA icons
│   ├── logo.svg              # App logo
│   └── manifest.json         # PWA manifest
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Authentication
│   │   │   ├── documents/   # Document CRUD
│   │   │   ├── folders/     # Folder CRUD
│   │   │   ├── notes/       # Notes CRUD
│   │   │   ├── reminders/   # Reminder CRUD
│   │   │   ├── backups/     # Backup/Restore
│   │   │   └── analytics/   # Analytics data
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main application
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   │   ├── auth.ts          # NextAuth config
│   │   ├── db.ts            # Prisma client
│   │   └── store.ts         # Zustand store
│   └── types/               # TypeScript types
├── .env.example             # Environment template
├── .gitignore
├── next.config.ts           # Next.js config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Screenshots

> Add your screenshots here

| Dashboard | Documents | Scanner |
|-----------|-----------|---------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Documents](docs/screenshots/documents.png) | ![Scanner](docs/screenshots/scanner.png) |

---

## 📱 PWA Support

College DocManager is a Progressive Web App (PWA) that works offline and can be installed on any device.

### Installation

**On Mobile:**
- Chrome (Android): Tap menu → "Add to Home Screen"
- Safari (iOS): Tap Share → "Add to Home Screen"

**On Desktop:**
- Chrome: Click install icon in address bar
- Menu → "Install College DocManager"

### Features
- 📴 Works offline
- 📱 Install as native app
- ⚡ Fast and responsive
- 🔔 Push notifications (coming soon)

---

## 🌐 Internationalization

Full bilingual support for:
- 🇮🇳 **English** - Default
- 🇮🇳 **हिंदी (Hindi)** - Complete translation

Switch languages instantly from the app header.

---

## 🔒 Privacy & Security

- 🔐 **Local Storage** - Your data stays on your device
- 🔒 **Encryption** - All data encrypted at rest
- 🚫 **No Tracking** - No analytics or tracking
- 🏠 **Offline First** - No server dependency
- 👤 **No Cloud** - Your data never leaves your device

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Push to GitHub and connect to Vercel
vercel --prod
```

### Docker

```bash
# Build the image
docker build -t college-doc-manager .

# Run the container
docker run -p 3000:3000 college-doc-manager
```

### Other Platforms

```bash
# Build for production
bun run build

# Output will be in .next/standalone/
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style
- Write clean, commented code
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Prisma](https://www.prisma.io/) - Next-generation ORM

---

## 📧 Support

If you have any questions or need help:

- 📮 [Open an Issue](https://github.com/your-username/college-doc-manager/issues)
- 💬 [Start a Discussion](https://github.com/your-username/college-doc-manager/discussions)
- 📧 Email: support@college-doc-manager.example.com

---

<div align="center">

**Made with ❤️ for Indian College Students**

🎓 *Never lose a document again*

[![Star on GitHub](https://img.shields.io/github/stars/your-username/college-doc-manager?style=social)](https://github.com/your-username/college-doc-manager)

</div>
