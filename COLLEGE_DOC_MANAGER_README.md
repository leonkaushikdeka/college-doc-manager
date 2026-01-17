# College Document Manager 🎓

A digital vault for Indian college students to store, organize, and manage all college documents - from admit cards and hall tickets to exam schedules and fee receipts. Never miss a deadline again!

## 🌟 Features

### 📚 Document Management
- **Digital Vault**: Store all your college documents securely
- **Smart Categories**: Organize by Academic, Financial, Administrative, and Personal documents
- **Offline Access**: All documents available offline once downloaded
- **Quick Search**: Find documents instantly with search and filters
- **Favorite Documents**: Mark important docs for quick access

### ⏰ Smart Reminders
- **Deadline Tracking**: Set reminders for exams, fees, assignments, and more
- **Custom Notifications**: Get reminded 1, 3, 7, or 14 days before deadlines
- **Multiple Types**: Exams, fee payments, assignments, registrations, and custom reminders
- **Complete History**: Track completed and upcoming deadlines

### 📱 Mobile-First Design
- **Responsive Interface**: Works perfectly on any device
- **Indian Aesthetics**: Clean design with saffron, white, and green accents
- **Touch-Friendly**: Optimized for mobile interactions
- **PWA Ready**: Install on your phone like a native app

### 🌐 Bilingual Support
- **Hindi & English**: Switch languages instantly
- **Complete Translations**: All UI elements in both languages
- **Student-Friendly**: Language that Indian students understand

### 🔧 Quick Actions
- **Share Documents**: Share via WhatsApp, email, or any app
- **Download Anytime**: Download documents with one tap
- **Storage Tracking**: Monitor your storage usage in real-time
- **Delete & Manage**: Full control over your documents

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-project
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up the database**
   ```bash
   bun run db:push
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### PWA Installation

On your phone:
1. Open the app in Chrome/Safari
2. Tap "Add to Home Screen" (iOS) or "Install App" (Android)
3. Use it like a native app!

## 📖 User Guide

### First Time Setup

1. **Welcome Screen**: Create your student profile
   - Enter your name, email, phone
   - Select your college/university
   - Choose your department and semester
   - Set your preferred language (Hindi/English)

2. **Dashboard Overview**: See everything at a glance
   - Storage usage indicator
   - Upcoming deadlines (next 7 days highlighted)
   - Quick access to favorite documents
   - One-tap upload button

### Uploading Documents

1. Tap the **Upload** button or go to Documents tab
2. Fill in document details:
   - **Title**: Give your document a clear name
   - **Category**: Academic, Financial, Administrative, or Personal
   - **Subcategory**: e.g., Admit Card, Fee Receipt
   - **Description**: Add optional notes
   - **File**: Select PDF, JPG, PNG, DOC, or DOCX
3. Tap save - document is stored and available offline!

### Setting Reminders

1. Go to the **Reminders** tab
2. Tap **Add Reminder**
3. Fill in details:
   - **Title**: What's the deadline for?
   - **Type**: Exam, Fee, Assignment, Registration, or Custom
   - **Description**: Add details (optional)
   - **Due Date**: When is it due?
   - **Remind me**: 1, 3, 7, or 14 days before
4. Save and get notified automatically!

### Managing Documents

**View Documents**:
- Tap any document card to see details
- Download with one tap
- Share via WhatsApp or email
- Mark as favorite for quick access

**Search & Filter**:
- Use search bar to find specific documents
- Filter by category using category buttons
- View favorites in Quick Access section

**Delete Documents**:
- Tap the trash icon on any document
- Confirm deletion
- Storage space is freed up automatically

### Categories Explained

**Academic** 📚
- Marksheets and grade cards
- Admit cards and hall tickets
- Exam schedules
- Certificates and diplomas

**Financial** 💰
- Fee receipts
- Scholarship documents
- Payment confirmations
- Financial aid forms

**Administrative** 📋
- ID cards
- Bonafide certificates
- NOC (No Objection Certificate)
- Transfer certificates

**Personal** 👤
- Aadhaar card
- PAN card
- Passport size photos
- Other personal documents

## 🎯 Common Use Cases

### Before Exams
1. Upload your admit card
2. Mark as favorite for quick access
3. Set reminder 3 days before exam
4. Access offline during exams!

### Fee Payments
1. Pay fees
2. Upload fee receipt
3. Set reminder for next payment
4. Share receipt with parents via WhatsApp

### Placements & Internships
1. Gather all required documents
2. Upload to organized categories
3. Download ZIP when needed
4. Have everything ready in minutes!

### Lost Documents
1. Search for document by name or category
2. Download instantly
3. Print if needed
4. No more last-minute panic!

## 🔧 Technical Details

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Database**: Prisma ORM with SQLite
- **State Management**: Zustand + localStorage
- **PWA**: Service Worker with offline caching
- **Icons**: Lucide React
- **Date Handling**: date-fns

### PWA Features
- Offline support with service worker
- Installable on mobile devices
- App shortcuts for quick actions
- Custom icons and splash screens
- Optimized for mobile performance

### Storage
- Documents stored as Base64 in localStorage
- 100MB storage limit per user
- Real-time storage tracking
- Automatic cleanup on deletion

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ Edge
- ✅ Samsung Internet

## 🎨 Design Philosophy

**Indian College Student-Centric**:
- Saffron, white, green color palette (Indian flag colors)
- Clean, minimalist interface
- Fast loading even on 3G connections
- Mobile-first design
- Hindi + English support

**Inspiration**: Google Keep meets file manager - simple, powerful, fast.

## 🔒 Privacy & Security

- All data stored locally on your device
- No cloud storage by default
- Offline-first architecture
- No tracking or analytics
- Your documents stay with you

## 🐛 Troubleshooting

**Documents not showing?**
- Check browser console for errors
- Clear localStorage and try again
- Ensure file size is under limit

**Reminders not working?**
- Check browser notifications are enabled
- Verify device time is correct
- Allow notifications for the app

**PWA not installing?**
- Use Chrome or Safari browser
- Ensure you're on HTTPS (production)
- Check browser compatibility

**Storage full?**
- Delete old documents you don't need
- Download important ones first
- Clear browser cache

## 🚀 Future Enhancements

- [ ] Camera integration for document scanning
- [ ] OCR text extraction for searchability
- [ ] Cloud backup and sync
- [ ] QR code generation for documents
- [ ] Batch download as ZIP
- [ ] Print-ready formatting
- [ ] Dark mode support
- [ ] Export/import data
- [ ] Share between devices
- [ ] More Indian colleges in dropdown

## 📄 License

This project is built for Indian college students to make their academic life easier and more organized.

## 👨‍💻 Development

Built with ❤️ for Indian students

**Version**: 1.0.0

---

**Need help?** Check the FAQ section in the app or contact support.

**Lost your data?** All data is stored locally. If you clear browser storage, documents will be deleted. Export functionality coming soon!

---

*यह ऐप भारतीय कॉलेज छात्रों के लिए बनाया गया है*
*Made in India 🇮🇳*
