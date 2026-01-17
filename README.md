# College DocManager

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000?style=flat-square&logo=shadcnui)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Stars](https://img.shields.io/github/stars/leonkaushikdeka/college-doc-manager?style=flat-square)
![Forks](https://img.shields.io/github/forks/leonkaushikdeka/college-doc-manager?style=flat-square)

**The ultimate document management solution for Indian college students. Store, organize, scan, and manage all your academic documents in one secure place.**

---

## Quick Start

### Prerequisites
- Bun v1.0+ (recommended) or Node.js v18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/leonkaushikdeka/college-doc-manager.git
cd college-doc-manager

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Initialize the database
bun run db:push

# Start the development server
bun run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun start
```

---

## Features

### Document Management
- Smart Upload: Drag & drop multiple files, auto-categorization
- Folders: Create nested folders to organize documents
- Tags: Custom tags with colors for easy filtering
- Search: Full-text search across all documents
- Favorites: Quick access to important documents
- Offline Access: Documents available offline (PWA)
- Bulk Actions: Select, delete, export multiple documents
- Preview: Built-in document preview

### Document Scanner
- Camera Scan: Scan documents using device camera
- OCR Extraction: Extract text from scanned images
- Auto-Crop: Automatic document edge detection
- Image Enhancement: Improve scanned document quality
- Multi-Page: Scan multiple pages into one document

### Smart Reminders
- Deadline Tracking: Never miss an important date
- Smart Notifications: Browser notifications before deadlines
- Recurring Reminders: Daily, weekly, monthly, yearly
- Priority Levels: Low, Medium, High, Urgent
- Calendar View: Monthly calendar with all reminders
- Completion Tracking: Track completed tasks

### Notes System
- Rich Notes: Markdown-style note taking
- Pinned Notes: Pin important notes to top
- Document Links: Link notes to specific documents
- Tag Support: Organize notes with tags

### Analytics Dashboard
- Document Stats: Total documents, size, categories
- Storage Usage: Track your storage consumption
- Category Breakdown: Visual charts of document distribution
- Activity Tracking: Documents added, viewed, shared

### Backup & Restore
- Full Backups: Export all data as ZIP
- JSON Export: Export documents as JSON/CSV
- Restore: Restore from previous backups
- Auto-Backup: Scheduled backup support

### Sharing & Collaboration
- QR Codes: Generate shareable QR codes
- Share Links: Create time-limited share links
- Password Protection: Secure shared links
- Export Options: Export to JSON, CSV, ZIP

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript 5 | Type-safe JavaScript |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | Beautiful, accessible components |
| Framer Motion | Smooth animations |
| Lucide React | Consistent icon library |
| Zustand | State management |
| React Hook Form | Form handling |
| Zod | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Backend API |
| Prisma ORM | Database ORM |
| SQLite | Local database (production-ready) |
| NextAuth.js | Authentication |
| bcryptjs | Password hashing |

### Tools & Utilities
| Technology | Purpose |
|------------|---------|
| Bun | Fast JavaScript runtime |
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |

---

## Project Structure

```
college-doc-manager/
|
+-- public/                          # Static assets
|   +-- icons/                       # PWA icons
|   +-- logo.svg                     # App logo
|   +-- manifest.json                # PWA manifest
|   +-- robots.txt
|   +-- sw.js                        # Service worker
|
+-- prisma/                          # Database
|   +-- schema.prisma                # Database schema
|
+-- src/                             # Source code
|   +-- app/                         # Next.js App Router
|   |   +-- api/                     # API routes
|   |   |   +-- auth/[...nextauth]/ # Authentication
|   |   |   +-- documents/          # Document CRUD
|   |   |   +-- folders/            # Folder CRUD
|   |   |   +-- notes/              # Notes CRUD
|   |   |   +-- reminders/          # Reminder CRUD
|   |   |   +-- backups/            # Backup/Restore
|   |   |   +-- analytics/          # Analytics data
|   |   |   +-- share/              # Sharing & QR
|   |   +-- globals.css             # Global styles
|   |   +-- layout.tsx              # Root layout
|   |   +-- page.tsx                # Main application
|   |
|   +-- components/
|   |   +-- ui/                     # shadcn/ui components
|   |
|   +-- hooks/                       # Custom React hooks
|   |   +-- use-mobile.ts
|   |   +-- use-toast.ts
|   |
|   +-- lib/                         # Utilities
|   |   +-- auth.ts                 # NextAuth config
|   |   +-- db.ts                   # Prisma client
|   |   +-- store.ts                # Zustand store
|   |   +-- utils.ts
|   |
|   +-- types/                       # TypeScript types
|       +-- next-auth.d.ts
|
+-- .env.example                     # Environment template
+-- .gitignore
+-- next.config.ts                   # Next.js config
+-- package.json
+-- tailwind.config.ts
+-- tsconfig.json
+-- README.md
+-- LICENSE
+-- CONTRIBUTING.md
+-- CHANGELOG.md
+-- CODE_OF_CONDUCT.md
```

---

## PWA Support

College DocManager is a Progressive Web App (PWA) that works offline and can be installed on any device.

### Installation

**On Mobile:**
- Chrome (Android): Tap menu -> "Add to Home Screen"
- Safari (iOS): Tap Share -> "Add to Home Screen"

**On Desktop:**
- Chrome: Click install icon in address bar
- Menu -> "Install College DocManager"

### Features
- Works offline
- Install as native app
- Fast and responsive
- Push notifications (coming soon)

---

## Internationalization

Full bilingual support for:
- English - Default
- Hindi (हिंदी) - Complete translation

Switch languages instantly from the app header.

---

## Privacy & Security
- Local Storage - Your data stays on your device
- Encryption - All data encrypted at rest
- No Tracking - No analytics or tracking
- Offline First - No server dependency
- No Cloud - Your data never leaves your device

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Follow the existing code style
- Write clean, commented code
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments
- Next.js - The React Framework
- shadcn/ui - Beautiful component library
- Tailwind CSS - Utility-first CSS
- Lucide - Beautiful icons
- Prisma - Next-generation ORM

---

## Support

If you have any questions or need help:
- Open an Issue: https://github.com/leonkaushikdeka/college-doc-manager/issues
- Start a Discussion: https://github.com/leonkaushikdeka/college-doc-manager/discussions
- Email: support@college-doc-manager.example.com

---

**Made with love for Indian College Students**

*Never lose a document again*

[![Star on GitHub](https://img.shields.io/github/stars/leonkaushikdeka/college-doc-manager?style=social)](https://github.com/leonkaushikdeka/college-doc-manager)
