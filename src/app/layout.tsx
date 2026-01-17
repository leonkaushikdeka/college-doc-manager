import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "College Document Manager - Never Miss a Deadline",
  description: "A digital vault for Indian college students to store, organize, and manage all college documents. Store admit cards, hall tickets, exam schedules, and fee receipts in one place.",
  keywords: ["College Documents", "Student Document Manager", "Indian Students", "Admit Card", "Hall Ticket", "Fee Receipts", "Exam Schedule", "Document Scanner", "PWA", "Next.js"],
  authors: [{ name: "College DocManager", url: "https://github.com/your-username/college-doc-manager" }],
  creator: "College DocManager",
  openGraph: {
    title: "College Document Manager - Never Miss a Deadline",
    description: "Digital vault for Indian college students - Store, organize, and manage all your college documents",
    type: "website",
    siteName: "College DocManager",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Document Manager",
    description: "A digital vault for Indian college students",
    creator: "@yourtwitter",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-152x152.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DocManager",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF9933",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
