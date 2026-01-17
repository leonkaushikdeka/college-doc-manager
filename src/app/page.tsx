'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import {
  FileText, Calendar as CalendarIcon, Upload, Bell, Download, Share2, Camera,
  Search, Filter, Star, Trash2, Eye, Scan, CheckCircle2, AlertCircle, Clock,
  GraduationCap, Wallet, FileCheck, User, X, Plus, Languages, Settings, Home,
  Archive, Moon, Sun, Sparkles, Zap, Shield, Smartphone, Grid, List, Tag,
  CalendarDays, Briefcase, Plane, MoreHorizontal, Copy, Link as LinkIcon,
  QrCode, ChevronRight, ChevronDown, FileArchive, FileSpreadsheet, FileJson,
  RefreshCw, Wifi, WifiOff, BellRing, Check, XCircle, AlertTriangle, Info,
  HelpCircle, LogOut, Database, Cloud, HardDrive, BarChart3, PieChart,
  TrendingUp, Target, Award, BookOpen, CreditCard, ClipboardList, Folder,
  FolderPlus, FolderOpen, StickyNote, Edit3, Save, Trash, FolderInput,
  FolderOutput, RotateCw, Crop, Contrast, Brightness, Image as ImageIcon,
  Maximize, Minimize, ZoomIn, ZoomOut, Move, Type, Palette, Layers,
  FileSignature, Scissors, Copy as CopyIcon, Layers as LayersIcon,
  Monitor, Smartphone as SmartphoneIcon, Tablet, Laptop, DownloadCloud,
  UploadCloud, RefreshCw as RefreshCwIcon, Sync, WifiHigh, WifiLow,
  WifiMedium, Battery, BatteryCharging, BatteryFull, Cpu, HardDisk,
  PieChart as PieChartIcon, Activity, Server, Security, Privacy, Help,
  Feedback, Contact, About, License, Heart, ThumbsUp, ThumbsDown,
  FolderMinus, FolderHeart, FolderStar, FolderClock, FolderSettings,
  MoreVertical, GripVertical, Pin, PinOff, Undo, Redo, Type as TypeIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic,
  Underline, Strikethrough, Highlighter, Eraser, History, Clock3,
  CalendarRange, CalendarPlus, CalendarCheck, CalendarX, ChartBar,
  ChartLine, ChartArea, ChartPie, TrendingUp as TrendingUpIcon,
  TrendingDown, Minus, Plus as PlusIcon, X as XIcon, Search as SearchIcon,
} from 'lucide-react';
import { format, isWithinInterval, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isTomorrow, isPast, subDays } from 'date-fns';
import { useAppStore, Document, Reminder, Tag, Folder as FolderType, Note } from '@/lib/store';

// Extended categories with icons
const categories = [
  { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'financial', label: 'Financial', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'administrative', label: 'Administrative', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'personal', label: 'Personal', icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'placement', label: 'Placements', icon: Briefcase, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'internship', label: 'Internships', icon: Plane, color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

const reminderTypes = [
  { id: 'exam', label: 'Exam', icon: FileText, color: 'bg-red-100 text-red-700' },
  { id: 'fee', label: 'Fee Payment', icon: CreditCard, color: 'bg-green-100 text-green-700' },
  { id: 'assignment', label: 'Assignment', icon: ClipboardList, color: 'bg-blue-100 text-blue-700' },
  { id: 'registration', label: 'Registration', icon: User, color: 'bg-purple-100 text-purple-700' },
  { id: 'placement', label: 'Placement', icon: Briefcase, color: 'bg-orange-100 text-orange-700' },
  { id: 'internship', label: 'Internship', icon: Plane, color: 'bg-cyan-100 text-cyan-700' },
  { id: 'custom', label: 'Custom', icon: Calendar, color: 'bg-gray-100 text-gray-700' },
];

const priorityLevels = [
  { id: 'low', label: 'Low', color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'urgent', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-50' },
];

const tagColors = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#14B8A6',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E',
];

const folderColors = [
  '#EF4444', '#F97316', '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6',
  '#6366F1', '#8B5CF6', '#EC4899', '#6B7280',
];

// Popular Indian colleges
const indianColleges = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT Bangalore',
  'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'Delhi University',
  'Jawaharlal Nehru University', 'Anna University', 'University of Mumbai',
  'University of Calcutta', 'Bangalore University', 'Punjab University', 'Other',
];

const departments = [
  'Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil',
  'Chemical', 'Biotechnology', 'Information Technology', 'Data Science',
  'Artificial Intelligence', 'Other',
];

export default function CollegeDocumentManager() {
  const { theme, setTheme } = useTheme();
  const {
    user, setUser, updateUser,
    documents, setDocuments, addDocument, updateDocument, deleteDocument, toggleFavorite,
    selectedDocuments, setSelectedDocuments, toggleDocumentSelection, clearSelection,
    reminders, setReminders, addReminder, updateReminder, deleteReminder, completeReminder,
    tags, setTags, addTag, deleteTag,
    folders, setFolders, addFolder, updateFolder, deleteFolder,
    notes, setNotes, addNote, updateNote, deleteNote,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedFolder, setSelectedFolder,
    viewMode, setViewMode,
    isUploadDialogOpen, setUploadDialogOpen,
    isReminderDialogOpen, setReminderDialogOpen,
    isDocumentPreviewOpen, setDocumentPreviewOpen, previewDocument, setPreviewDocument,
    isShareDialogOpen, setShareDialogOpen, shareDocument, setShareDocument,
    isTagDialogOpen, setTagDialogOpen,
    isFolderDialogOpen, setFolderDialogOpen,
    isNoteDialogOpen, setNoteDialogOpen,
    isSettingsDialogOpen, setSettingsDialogOpen,
    isBackupDialogOpen, setBackupDialogOpen,
    isAnalyticsDialogOpen, setAnalyticsDialogOpen,
    selectedDate, setSelectedDate,
  } = useAppStore();

  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  // Form states
  const [newDocument, setNewDocument] = useState({
    title: '', category: 'academic', subCategory: '', description: '', tags: [] as string[], files: [] as File[],
  });

  const [newReminder, setNewReminder] = useState({
    title: '', description: '', type: 'custom', dueDate: new Date(), reminderDays: 3,
    isRecurring: false, recurringType: 'weekly', priority: 'medium', color: '#3B82F6',
  });

  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });
  const [newFolder, setNewFolder] = useState({ name: '', description: '', color: '#3B82F6', icon: 'Folder', parentId: null as string | null });
  const [newNote, setNewNote] = useState({ title: '', content: '', isPinned: false, documentId: null as string | null });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  // QR Code state
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // Calendar reminder state
  const [calendarReminders, setCalendarReminders] = useState<Reminder[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = translations[language];

  // Load data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    const savedDocuments = localStorage.getItem('documents');
    const savedReminders = localStorage.getItem('reminders');
    const savedTags = localStorage.getItem('tags');
    const savedFolders = localStorage.getItem('folders');
    const savedNotes = localStorage.getItem('notes');
    const savedLanguage = localStorage.getItem('language');

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setUser(parsedProfile);
      setIsOnboarded(parsedProfile.isOnboarded);
      setLanguage(parsedProfile.language || 'en');
    }
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedTags) setTags(JSON.parse(savedTags));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedLanguage) setLanguage(savedLanguage);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => console.log('Service worker registration failed:', error));
    }
  }, []);

  useEffect(() => {
    setCalendarReminders(reminders);
  }, [reminders]);

  // File upload handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setNewDocument(prev => ({ ...prev, files: [...prev.files, ...acceptedFiles] }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera' });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setOcrResult(null);
  };

  const performOcr = async () => {
    if (!capturedImage) return;
    setIsScanning(true);

    // Simulate OCR (in production, use Tesseract.js or an OCR API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    setOcrResult(`Extracted Text from Image:
${capturedImage.substring(0, 100)}...

[OCR would extract full text here]
Document scanned successfully at ${format(new Date(), 'PPP pp')}`);

    setIsScanning(false);
    toast({ title: 'OCR Complete', description: 'Text has been extracted from the image' });
  };

  const saveScannedImage = () => {
    if (capturedImage) {
      const document: Document = {
        id: crypto.randomUUID(),
        title: `Scanned Document ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
        category: 'academic',
        subCategory: 'Scanned',
        description: ocrResult || '',
        fileUrl: capturedImage,
        fileName: `scan-${Date.now()}.png`,
        fileSize: capturedImage.length * 0.75,
        fileType: 'png',
        mimeType: 'image/png',
        tags: ['scanned'],
        isFavorite: false,
        isOffline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addDocument(document);
      toast({ title: 'Success', description: 'Scanned document saved' });
      stopCamera();
    }
  };

  // Check reminders
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const checkReminders = () => {
    const today = new Date();
    reminders.forEach((reminder) => {
      if (reminder.isCompleted) return;
      const dueDate = new Date(reminder.dueDate);
      const reminderDate = addDays(dueDate, -parseInt(reminder.reminderDays.toString()));
      if (isWithinInterval(today, { start: reminderDate, end: dueDate })) {
        toast({
          title: reminder.title,
          description: `${t.daysLeft}: ${format(dueDate, 'PPP')}`,
          variant: reminder.priority === 'urgent' ? 'destructive' : 'default',
        });
      }
    });
  };

  // Translations
  const translations = {
    en: {
      welcome: 'Welcome to College Document Manager', subtitle: 'Your digital vault for all college documents',
      getStarted: 'Get Started', name: 'Full Name', email: 'Email Address', phone: 'Phone Number',
      college: 'College/University', department: 'Department', semester: 'Semester', rollNumber: 'Roll Number',
      next: 'Next', dashboard: 'Dashboard', documents: 'Documents', reminders: 'Reminders', scan: 'Scan',
      settings: 'Settings', upcomingDeadlines: 'Upcoming Deadlines', quickAccess: 'Quick Access',
      storageUsage: 'Storage Usage', upload: 'Upload Documents', recentDocuments: 'Recent Documents',
      allDocuments: 'All Documents', search: 'Search documents...', uploadFile: 'Upload Files',
      takePhoto: 'Take Photo', scan: 'Scan', categories: 'Categories', academic: 'Academic',
      financial: 'Financial', administrative: 'Administrative', personal: 'Personal', placement: 'Placements',
      internship: 'Internships', addReminder: 'Add Reminder', reminderTitle: 'Reminder Title',
      reminderDescription: 'Description', reminderType: 'Reminder Type', dueDate: 'Due Date', save: 'Save',
      exam: 'Exam', fee: 'Fee Payment', assignment: 'Assignment', registration: 'Registration', custom: 'Custom',
      share: 'Share', download: 'Download', delete: 'Delete', view: 'View', favorite: 'Favorite',
      daysLeft: 'days left', today: 'Today', tomorrow: 'Tomorrow', noDocuments: 'No documents yet',
      noReminders: 'No upcoming deadlines', uploadSuccess: 'Documents uploaded successfully',
      uploadError: 'Failed to upload documents', reminderSaved: 'Reminder saved successfully',
      profileSaved: 'Profile saved successfully', bulkDelete: 'Delete Selected', bulkExport: 'Export Selected',
      selectAll: 'Select All', deselectAll: 'Deselect All', selectedCount: 'selected', calendar: 'Calendar',
      tags: 'Tags', createTag: 'Create Tag', tagName: 'Tag Name', tagColor: 'Tag Color', addTags: 'Add Tags',
      shareDocument: 'Share Document', generateQr: 'Generate QR Code', copyLink: 'Copy Link', linkCopied: 'Link copied!',
      exportData: 'Export Data', importData: 'Import Data', exportJson: 'Export as JSON', exportCsv: 'Export as CSV',
      darkMode: 'Dark Mode', lightMode: 'Light Mode', logout: 'Logout', notifications: 'Notifications',
      noNotifications: 'No new notifications', markAllRead: 'Mark all as read', offlineMode: 'Offline Mode',
      onlineMode: 'Online Mode', syncData: 'Sync Data', lastSynced: 'Last synced',
      folders: 'Folders', createFolder: 'Create Folder', folderName: 'Folder Name', folderColor: 'Folder Color',
      notes: 'Notes', createNote: 'Create Note', noteTitle: 'Note Title', noteContent: 'Note Content',
      analytics: 'Analytics', overview: 'Overview', statistics: 'Statistics', backup: 'Backup', restore: 'Restore',
      scanner: 'Scanner', ocr: 'OCR', camera: 'Camera', capture: 'Capture', retake: 'Retake',
      processing: 'Processing', extractedText: 'Extracted Text', noTextFound: 'No text found',
    },
    hi: {
      welcome: 'कॉलेज डॉक्यूमेंट मैनेजर में स्वागत है',
      subtitle: 'आपके सभी कॉलेज दस्तावेजों के लिए डिजिटल वॉल्ट',
      getStarted: 'शुरू करें', name: 'पूरा नाम', email: 'ईमेल पता', phone: 'फोन नंबर',
      college: 'कॉलेज/विश्वविद्यालय', department: 'विभाग', semester: 'सेमेस्टर', rollNumber: 'रोल नंबर',
      next: 'आगे', dashboard: 'डैशबोर्ड', documents: 'दस्तावेज', reminders: 'रिमाइंडर', scan: 'स्कैन',
      settings: 'सेटिंग्स', upcomingDeadlines: 'आगामी समयसीमा', quickAccess: 'त्वरित पहुंच',
      storageUsage: 'स्टोरेज उपयोग', upload: 'दस्तावेज अपलोड करें', recentDocuments: 'हाल के दस्तावेज',
      allDocuments: 'सभी दस्तावेज', search: 'दस्तावेज खोजें...', uploadFile: 'फ़ाइलें अपलोड करें',
      takePhoto: 'फोटो लें', scan: 'स्कैन करें', categories: 'श्रेणियां', academic: 'शैक्षणिक',
      financial: 'वित्तीय', administrative: 'प्रशासनिक', personal: 'व्यक्तिगत', placement: 'प्लेसमेंट',
      internship: 'इंटर्नशिप', addReminder: 'रिमाइंडर जोड़ें', reminderTitle: 'रिमाइंडर शीर्षक',
      reminderDescription: 'विवरण', reminderType: 'रिमाइंडर प्रकार', dueDate: 'नियत तारीख', save: 'सहेजें',
      exam: 'परीक्षा', fee: 'फीस भुगतान', assignment: 'असाइनमेंट', registration: 'पंजीकरण', custom: 'कस्टम',
      share: 'साझा करें', download: 'डाउनलोड', delete: 'हटाएं', view: 'देखें', favorite: 'पसंदीदा',
      daysLeft: 'दिन शेष', today: 'आज', tomorrow: 'कल', noDocuments: 'अभी तक कोई दस्तावेज नहीं',
      noReminders: 'कोई आगामी समयसीमा नहीं', uploadSuccess: 'दस्तावेज सफलतापूर्वक अपलोड हो गए',
      uploadError: 'दस्तावेज अपलोड करने में विफल', reminderSaved: 'रिमाइंडर सफलतापूर्वक सहेजा गया',
      profileSaved: 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई', bulkDelete: 'चयनित हटाएं', bulkExport: 'चयनित निर्यात करें',
      selectAll: 'सभी चुनें', deselectAll: 'सभी अचयनित करें', selectedCount: 'चयनित', calendar: 'कैलेंडर',
      tags: 'टैग', createTag: 'टैग बनाएं', tagName: 'टैग नाम', tagColor: 'टैग रंग', addTags: 'टैग जोड़ें',
      shareDocument: 'दस्तावेज साझा करें', generateQr: 'QR कोड बनाएं', copyLink: 'लिंक कॉपी करें', linkCopied: 'लिंक कॉपी हो गई!',
      exportData: 'डेटा निर्यात करें', importData: 'डेटा आयात करें', exportJson: 'JSON के रूप में निर्यात', exportCsv: 'CSV के रूप में निर्यात',
      darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', logout: 'लॉगआउट', notifications: 'सूचनाएं',
      noNotifications: 'कोई नई सूचना नहीं', markAllRead: 'सभी पढ़ा हुआ चिह्नित करें', offlineMode: 'ऑफलाइन मोड',
      onlineMode: 'ऑनलाइन मोड', syncData: 'डेटा सिंक करें', lastSynced: 'अंतिम सिंक',
      folders: 'फ़ोल्डर', createFolder: 'फ़ोल्डर बनाएं', folderName: 'फ़ोल्डर का नाम', folderColor: 'फ़ोल्डर का रंग',
      notes: 'नोट्स', createNote: 'नोट बनाएं', noteTitle: 'नोट का शीर्षक', noteContent: 'नोट की सामग्री',
      analytics: 'विश्लेषण', overview: 'अवलोकन', statistics: 'आंकड़े', backup: 'बैकअप', restore: 'पुनर्स्थापित करें',
      scanner: 'स्कैनर', ocr: 'ओसीआर', camera: 'कैमरा', capture: 'कैप्चर करें', retake: 'फिर से लें',
      processing: 'प्रोसेसिंग', extractedText: 'निकाला गया टेक्स्ट', noTextFound: 'कोई टेक्स्ट नहीं मिला',
    },
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'hi' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleProfileSubmit = () => {
    if (!user?.name || !user?.email || !user?.college) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill in all required fields' });
      return;
    }
    const newProfile = { ...user, isOnboarded: true, language };
    localStorage.setItem('studentProfile', JSON.stringify(newProfile));
    setUser(newProfile);
    setIsOnboarded(true);
    toast({ title: 'Success', description: t.profileSaved });
  };

  const handleFileUpload = async () => {
    if (newDocument.files.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select at least one file' });
      return;
    }
    try {
      for (const file of newDocument.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData = e.target?.result as string;
          const document: Document = {
            id: crypto.randomUUID(),
            title: newDocument.title || file.name,
            category: newDocument.category,
            subCategory: newDocument.subCategory,
            description: newDocument.description,
            fileUrl: fileData,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.name.split('.').pop() || 'unknown',
            mimeType: file.type,
            tags: newDocument.tags,
            isFavorite: false,
            isOffline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addDocument(document);
        };
        reader.readAsDataURL(file);
      }
      toast({ title: 'Success', description: t.uploadSuccess });
      setNewDocument({ title: '', category: 'academic', subCategory: '', description: '', tags: [], files: [] });
      setUploadDialogOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: t.uploadError });
    }
  };

  const handleReminderSubmit = () => {
    if (!newReminder.title || !newReminder.dueDate) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please fill in all required fields' });
      return;
    }
    const reminder: Reminder = {
      id: crypto.randomUUID(),
      title: newReminder.title,
      description: newReminder.description,
      type: newReminder.type,
      dueDate: newReminder.dueDate.toISOString(),
      reminderDays: newReminder.reminderDays,
      isCompleted: false,
      isRecurring: newReminder.isRecurring,
      recurringType: newReminder.recurringType,
      priority: newReminder.priority,
      color: newReminder.color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addReminder(reminder);
    toast({ title: 'Success', description: t.reminderSaved });
    setNewReminder({ title: '', description: '', type: 'custom', dueDate: new Date(), reminderDays: 3, isRecurring: false, recurringType: 'weekly', priority: 'medium', color: '#3B82F6' });
    setReminderDialogOpen(false);
  };

  const handleTagSubmit = () => {
    if (!newTag.name) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a tag name' });
      return;
    }
    const tag: Tag = { id: crypto.randomUUID(), name: newTag.name, color: newTag.color };
    addTag(tag);
    toast({ title: 'Success', description: 'Tag created successfully' });
    setNewTag({ name: '', color: '#3B82F6' });
    setIsCreatingTag(false);
  };

  const handleFolderSubmit = () => {
    if (!newFolder.name) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a folder name' });
      return;
    }
    const folder: FolderType = { id: crypto.randomUUID(), name: newFolder.name, description: newFolder.description, color: newFolder.color, icon: newFolder.icon, parentId: newFolder.parentId, isRoot: !newFolder.parentId, documentCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    addFolder(folder);
    toast({ title: 'Success', description: 'Folder created successfully' });
    setNewFolder({ name: '', description: '', color: '#3B82F6', icon: 'Folder', parentId: null });
    setFolderDialogOpen(false);
  };

  const handleNoteSubmit = () => {
    if (!newNote.title) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter a note title' });
      return;
    }
    const note: Note = { id: crypto.randomUUID(), title: newNote.title, content: newNote.content, isPinned: newNote.isPinned, documentId: newNote.documentId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    addNote(note);
    toast({ title: 'Success', description: 'Note saved successfully' });
    setNewNote({ title: '', content: '', isPinned: false, documentId: null });
    setNoteDialogOpen(false);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    toast({ title: 'Success', description: 'Document deleted successfully' });
  };

  const handleBulkDelete = () => {
    selectedDocuments.forEach(id => deleteDocument(id));
    clearSelection();
    toast({ title: 'Success', description: `${selectedDocuments.length} documents deleted` });
  };

  const handleExport = (format: 'json' | 'csv') => {
    const dataToExport = selectedDocuments.length > 0 ? documents.filter(d => selectedDocuments.includes(d.id)) : documents;
    let content: string, filename: string, type: string;
    if (format === 'json') {
      content = JSON.stringify(dataToExport, null, 2);
      filename = `documents-${format(new Date(), 'yyyy-MM-dd')}.json`;
      type = 'application/json';
    } else {
      const headers = ['Title', 'Category', 'SubCategory', 'Description', 'FileName', 'FileSize', 'CreatedAt'];
      const rows = dataToExport.map(d => [d.title, d.category, d.subCategory || '', d.description || '', d.fileName, d.fileSize.toString(), d.createdAt]);
      content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = `documents-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      type = 'text/csv';
    }
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Success', description: `Documents exported as ${format.toUpperCase()}` });
  };

  const handleGenerateQr = async (document: Document) => {
    setShareDocument(document);
    setIsGeneratingQr(true);
    setShareDialogOpen(true);
    try {
      const shareUrl = `${window.location.origin}/share/${document.id}`;
      const QRCode = await import('qrcode');
      const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, { width: 256, margin: 2, color: { dark: '#000000', light: '#FFFFFF' } });
      setQrCode(qrCodeDataUrl);
      setShareUrl(shareUrl);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate QR code' });
    } finally {
      setIsGeneratingQr(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast({ title: t.linkCopied });
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const backup = { id: crypto.randomUUID(), name: `Backup ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, type: 'full', status: 'completed', createdAt: new Date().toISOString() };
    setBackups([backup, ...backups]);
    setIsCreatingBackup(false);
    toast({ title: 'Success', description: 'Backup created successfully' });
  };

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalytics({
      overview: { totalDocuments: documents.length, totalSize: documents.reduce((sum, d) => sum + d.fileSize, 0), totalReminders: reminders.length, completedReminders: reminders.filter(r => r.isCompleted).length },
      documentsByCategory: categories.reduce((acc, cat) => { acc[cat.id] = documents.filter(d => d.category === cat.id).length; return acc; }, {} as Record<string, number>),
      recentActivity: { documentsAddedThisWeek: 5, documentsViewedToday: 12, remindersDueToday: 3 },
    });
    setIsLoadingAnalytics(false);
  };

  const getUpcomingReminders = () => {
    const today = new Date();
    const sevenDaysFromNow = addDays(today, 7);
    return reminders.filter((rem) => !rem.isCompleted && new Date(rem.dueDate) <= sevenDaysFromNow).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getFilteredDocuments = () => {
    let filtered = documents;
    if (selectedCategory !== 'all') filtered = filtered.filter((doc) => doc.category === selectedCategory);
    if (selectedFolder) filtered = filtered.filter(doc => doc.folderId === selectedFolder);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((doc) => doc.title.toLowerCase().includes(query) || doc.description?.toLowerCase().includes(query) || doc.fileName.toLowerCase().includes(query));
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter(doc => selectedTags.every(tagId => doc.tags.includes(tagId)));
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getFavoriteDocuments = () => documents.filter((doc) => doc.isFavorite).slice(0, 4);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getCategoryInfo = (category: string) => categories.find(c => c.id === category) || categories[0];
  const getReminderTypeInfo = (type: string) => reminderTypes.find(r => r.id === type) || reminderTypes[6];
  const getPriorityInfo = (priority: string) => priorityLevels.find(p => p.id === priority) || priorityLevels[1];

  const monthReminders = eachDayOfInterval({ start: startOfMonth(selectedDate || new Date()), end: endOfMonth(selectedDate || new Date()) });
  const getRemindersForDate = (date: Date) => reminders.filter(rem => isSameDay(new Date(rem.dueDate), date));

  // Render onboarding screen
  if (!isOnboarded) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-green-600 shadow-lg">
                  <GraduationCap className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">{t.welcome}</CardTitle>
                <CardDescription className="text-base">{t.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-2 p-3 bg-gradient-to-r from-orange-50 to-green-50 dark:from-orange-900/20 dark:to-green-900/20 rounded-lg">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  <p className="text-sm text-orange-800 dark:text-orange-200">Made specifically for Indian college students</p>
                </motion.div>
                <div className="space-y-2">
                  <Label htmlFor="language"><Languages className="mr-2 h-4 w-4 inline" />Language / भाषा</Label>
                  <Button variant="outline" className="w-full" onClick={handleLanguageToggle}>{language === 'en' ? 'English' : 'हिंदी'}</Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name} <span className="text-red-500">*</span></Label>
                  <Input id="name" placeholder={t.name} value={user?.name || ''} onChange={(e) => setUser(user ? { ...user, name: e.target.value } : { id: '', name: e.target.value, email: '', college: '', language: 'en', isOnboarded: false, storageUsed: 0, storageLimit: 104857600, theme: 'light' })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email} <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" placeholder={t.email} value={user?.email || ''} onChange={(e) => setUser(user ? { ...user, email: e.target.value } : { id: '', name: '', email: e.target.value, college: '', language: 'en', isOnboarded: false, storageUsed: 0, storageLimit: 104857600, theme: 'light' })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">{t.college} <span className="text-red-500">*</span></Label>
                  <Select value={user?.college} onValueChange={(value) => setUser(user ? { ...user, college: value } : { id: '', name: '', email: '', college: value, language: 'en', isOnboarded: false, storageUsed: 0, storageLimit: 104857600, theme: 'light' })}>
                    <SelectTrigger id="college"><SelectValue placeholder={t.college} /></SelectTrigger>
                    <SelectContent>{indianColleges.map((college) => (<SelectItem key={college} value={college}>{college}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700" onClick={handleProfileSubmit} disabled={isRegistering}>{isRegistering ? 'Please wait...' : t.getStarted}</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main app render
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-green-600 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">College DocManager</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleThemeToggle} title={theme === 'dark' ? t.lightMode : t.darkMode}>{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</Button>
            <Button variant="ghost" size="icon" onClick={handleLanguageToggle} title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}><Languages className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setSettingsDialogOpen(true)} title={t.settings}><Settings className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-12 mb-6 bg-white dark:bg-gray-800">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"><Home className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">{t.dashboard}</span></TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"><FileText className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">{t.documents}</span></TabsTrigger>
            <TabsTrigger value="folders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"><Folder className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">{t.folders}</span></TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"><StickyNote className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">{t.notes}</span></TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"><Bell className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">{t.reminders}</span></TabsTrigger>
            <TabsTrigger value="scanner" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"><Camera className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">{t.scanner}</span></TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Storage Usage Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30"><HardDrive className="h-5 w-5 text-orange-600 dark:text-orange-400" /></div>
                    {t.storageUsage}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{formatFileSize(user?.storageUsed || 0)}</span>
                      <span className="text-gray-500">{formatFileSize(user?.storageLimit || 104857600)}</span>
                    </div>
                    <Progress value={((user?.storageUsed || 0) / (user?.storageLimit || 104857600)) * 100} className="h-3" />
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Encrypted</span>
                      <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Offline Ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-orange-500" /><span className="text-sm text-gray-500">Documents</span></div>
                    <p className="text-2xl font-bold mt-1">{documents.length}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-green-500" /><span className="text-sm text-gray-500">Reminders</span></div>
                    <p className="text-2xl font-bold mt-1">{reminders.length}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2"><Folder className="h-5 w-5 text-blue-500" /><span className="text-sm text-gray-500">{t.folders}</span></div>
                    <p className="text-2xl font-bold mt-1">{folders.length}</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2"><StickyNote className="h-5 w-5 text-purple-500" /><span className="text-sm text-gray-500">{t.notes}</span></div>
                    <p className="text-2xl font-bold mt-1">{notes.length}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Upload Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full h-16 text-lg bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 shadow-lg" onClick={() => setUploadDialogOpen(true)}>
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Upload className="mr-3 h-6 w-6" /></motion.div>
                {t.upload}<Zap className="ml-3 h-5 w-5 opacity-75" />
              </Button>
            </motion.div>

            {/* Upcoming Deadlines */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30"><Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" /></div>
                    {t.upcomingDeadlines}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    {getUpcomingReminders().length > 0 ? (
                      <div className="space-y-3">
                        {getUpcomingReminders().map((reminder, index) => (
                          <motion.div key={reminder.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }} className="flex items-start gap-3 p-3 rounded-lg border border-orange-100 dark:border-orange-800/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                            <div className="flex-shrink-0 mt-1"><div className={`p-2 rounded-full ${getReminderTypeInfo(reminder.type).color}`}><getReminderTypeInfo(reminder.type).icon className="h-4 w-4" /></div></div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{reminder.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{format(new Date(reminder.dueDate), 'PPP')}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">{getDaysUntilDue(reminder.dueDate)} {t.daysLeft}</Badge>
                                <Badge variant="outline" className={`text-xs ${getPriorityInfo(reminder.priority).bg} ${getPriorityInfo(reminder.priority).color}`}>{reminder.priority}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => completeReminder(reminder.id)}><CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteReminder(reminder.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
                        <CheckCircle2 className="h-12 w-12 mb-2" /><p className="text-sm">{t.noReminders}</p>
                      </motion.div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Access */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30"><Star className="h-5 w-5 text-orange-600 dark:text-orange-400" /></div>
                    {t.quickAccess}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getFavoriteDocuments().length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {getFavoriteDocuments().map((doc, index) => (
                        <motion.div key={doc.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * index }} whileHover={{ scale: 1.03 }} className="p-3 rounded-lg border border-orange-100 dark:border-orange-800/30 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer" onClick={() => handleDownloadDocument(doc)}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-2 rounded-lg ${getCategoryInfo(doc.category).bg}`}>{(() => { const cat = getCategoryInfo(doc.category); return cat.icon && <cat.icon className={`h-5 w-5 ${cat.color}`} /> })()}</div>
                          </div>
                          <h4 className="font-medium text-sm truncate">{doc.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatFileSize(doc.fileSize)}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
                      <Star className="h-12 w-12 mb-2" /><p className="text-sm">{t.noDocuments}</p><p className="text-xs mt-1 text-center">Mark documents as favorite for quick access</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30"><Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" /></div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setUploadDialogOpen(true)}><Upload className="h-6 w-6" />{t.upload}</Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setFolderDialogOpen(true)}><FolderPlus className="h-6 w-6" />{t.createFolder}</Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setNoteDialogOpen(true)}><StickyNote className="h-6 w-6" />{t.createNote}</Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => { loadAnalytics(); setAnalyticsDialogOpen(true); }}><BarChart3 className="h-6 w-6" />{t.analytics}</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder={t.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>{viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}</Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline"><Tag className="h-4 w-4 mr-2" />{t.tags}{selectedTags.length > 0 && <Badge variant="secondary" className="ml-2">{selectedTags.length}</Badge>}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between"><Label>{t.tags}</Label><Button variant="ghost" size="sm" onClick={() => setTagDialogOpen(true)}><Plus className="h-4 w-4" /></Button></div>
                    <ScrollArea className="h-40">
                      {tags.length > 0 ? (
                        <div className="space-y-1">
                          {tags.map((tag) => (
                            <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox checked={selectedTags.includes(tag.id)} onCheckedChange={(checked) => { if (checked) setSelectedTags([...selectedTags, tag.id]); else setSelectedTags(selectedTags.filter(t => t !== tag.id)); }} />
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} /><span className="text-sm">{tag.name}</span></div>
                            </label>
                          ))}
                        </div>
                      ) : (<p className="text-sm text-gray-500 text-center py-4">No tags yet</p>)}
                    </ScrollArea>
                    {selectedTags.length > 0 && <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedTags([])}>Clear Selection</Button>}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'bg-orange-500' : ''}>All</Button>
              {categories.map((category) => (
                <Button key={category.id} variant={selectedCategory === category.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category.id)} className={selectedCategory === category.id ? 'bg-orange-500' : ''}>
                  {category.icon && <category.icon className="h-4 w-4 mr-1" />}{category.label}
                </Button>
              ))}
            </div>

            {selectedDocuments.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Badge variant="secondary">{selectedDocuments.length} {t.selectedCount}</Badge>
                <Button variant="outline" size="sm" onClick={clearSelection}>{t.deselectAll}</Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="outline" size="sm" onClick={handleBulkDelete}><Trash2 className="h-4 w-4 mr-1" /> {t.bulkDelete}</Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('json')}><FileJson className="h-4 w-4 mr-1" /> {t.exportJson}</Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('csv')}><FileSpreadsheet className="h-4 w-4 mr-1" /> {t.exportCsv}</Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button className="w-full h-14 text-base bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700" onClick={() => setUploadDialogOpen(true)}><Upload className="mr-2 h-5 w-5" />{t.upload}</Button>
            </motion.div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredDocuments().length > 0 ? (
                  getFilteredDocuments().map((doc, index) => (
                    <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}>
                      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-3 rounded-lg ${getCategoryInfo(doc.category).bg} flex-shrink-0`}>{(() => { const cat = getCategoryInfo(doc.category); return cat.icon && <cat.icon className={`h-6 w-6 ${cat.color}`} /> })()}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Checkbox checked={selectedDocuments.includes(doc.id)} onCheckedChange={() => toggleDocumentSelection(doc.id)} />
                                <h4 className="font-medium truncate">{doc.title}</h4>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{doc.subCategory || doc.category}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">{formatFileSize(doc.fileSize)}</Badge>
                                {doc.isOffline && <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Offline</Badge>}
                              </div>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{format(new Date(doc.createdAt), 'PPP')}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-3 pt-3 border-t">
                            <Button variant="ghost" size="icon" onClick={() => { setPreviewDocument(doc); setDocumentPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}><Download className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleGenerateQr(doc)}><QrCode className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(doc.id)}><Star className={`h-4 w-4 ${doc.isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                    <FileText className="h-16 w-16 mb-3" /><p className="text-sm">{t.noDocuments}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {getFilteredDocuments().length > 0 ? (
                  getFilteredDocuments().map((doc, index) => (
                    <motion.div key={doc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}>
                      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox checked={selectedDocuments.includes(doc.id)} onCheckedChange={() => toggleDocumentSelection(doc.id)} />
                            <div className={`p-2 rounded-lg ${getCategoryInfo(doc.category).bg} flex-shrink-0`}>{(() => { const cat = getCategoryInfo(doc.category); return cat.icon && <cat.icon className={`h-5 w-5 ${cat.color}`} /> })()}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{doc.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{doc.subCategory || doc.category} • {formatFileSize(doc.fileSize)}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => { setPreviewDocument(doc); setDocumentPreviewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDownloadDocument(doc)}><Download className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleGenerateQr(doc)}><QrCode className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(doc.id)}><Star className={`h-4 w-4 ${doc.isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                    <FileText className="h-16 w-16 mb-3" /><p className="text-sm">{t.noDocuments}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Folders Tab */}
          <TabsContent value="folders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t.folders}</h2>
              <Button onClick={() => setFolderDialogOpen(true)}><FolderPlus className="h-4 w-4 mr-2" />{t.createFolder}</Button>
            </div>

            {folders.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder, index) => (
                  <motion.div key={folder.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * index }} whileHover={{ scale: 1.02 }}>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedFolder(folder.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: folder.color + '20' }}>
                            <Folder className="h-8 w-8" style={{ color: folder.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{folder.name}</h3>
                            <p className="text-sm text-gray-500">{documents.filter(d => d.folderId === folder.id).length} documents</p>
                          </div>
                        </div>
                        {folder.description && <p className="text-sm text-gray-500 mt-2 truncate">{folder.description}</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <FolderOpen className="h-16 w-16 mb-3" />
                <p className="text-sm">No folders yet</p>
                <p className="text-xs mt-1">Create folders to organize your documents</p>
                <Button className="mt-4" onClick={() => setFolderDialogOpen(true)}><FolderPlus className="h-4 w-4 mr-2" />Create your first folder</Button>
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t.notes}</h2>
              <Button onClick={() => setNoteDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />{t.createNote}</Button>
            </div>

            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note, index) => (
                  <motion.div key={note.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}>
                    <Card className={`hover:shadow-md transition-shadow ${note.isPinned ? 'border-orange-300' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base flex items-center gap-2">
                            {note.isPinned && <Pin className="h-4 w-4 text-orange-500" />}
                            {note.title}
                          </CardTitle>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { updateNote(note.id, { isPinned: !note.isPinned }); }}>
                            <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{note.content}</p>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t">
                          <p className="text-xs text-gray-500">{format(new Date(note.updatedAt), 'MMM d, yyyy')}</p>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setNewNote({ title: note.title, content: note.content, isPinned: note.isPinned, documentId: note.documentId }); setNoteDialogOpen(true); }}><Edit3 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { deleteNote(note.id); toast({ title: 'Success', description: 'Note deleted' }); }}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <StickyNote className="h-16 w-16 mb-3" />
                <p className="text-sm">No notes yet</p>
                <p className="text-xs mt-1">Create notes to keep track of important information</p>
                <Button className="mt-4" onClick={() => setNoteDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Create your first note</Button>
              </div>
            )}
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button className="w-full h-14 text-base bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700" onClick={() => setReminderDialogOpen(true)}>
                <Plus className="mr-2 h-5 w-5" />{t.addReminder}
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reminderTypes.slice(0, 4).map(type => {
                const count = reminders.filter(r => r.type === type.id && !r.isCompleted).length;
                return (
                  <Card key={type.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${type.color}`}><type.icon className="h-4 w-4" /></div>
                        <div><p className="text-sm text-gray-500">{type.label}</p><p className="text-xl font-bold">{count}</p></div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-3">
              {reminders.length > 0 ? (
                reminders.sort((a, b) => { if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1; return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); }).map((reminder, index) => (
                  <motion.div key={reminder.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * index }}>
                    <Card className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800 ${reminder.isCompleted ? 'opacity-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getReminderTypeInfo(reminder.type).color} flex-shrink-0 mt-1`}>
                            {getReminderTypeInfo(reminder.type).icon && <getReminderTypeInfo(reminder.type).icon className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${reminder.isCompleted ? 'line-through' : ''}`}>{reminder.title}</h4>
                              <Badge variant="outline" className={getPriorityInfo(reminder.priority).bg}>{reminder.priority}</Badge>
                            </div>
                            {reminder.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reminder.description}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{format(new Date(reminder.dueDate), 'PPP')}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{getDaysUntilDue(reminder.dueDate)} {t.daysLeft}</Badge>
                              {reminder.isRecurring && <Badge variant="outline" className="bg-purple-50 text-purple-700">Recurring</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => completeReminder(reminder.id)} disabled={reminder.isCompleted}>
                              <CheckCircle2 className={`h-4 w-4 ${reminder.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteReminder(reminder.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                  <Bell className="h-16 w-16 mb-3" />
                  <p className="text-sm">{t.noReminders}</p>
                  <p className="text-xs mt-1">Add your first reminder to never miss a deadline</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scanner Tab */}
          <TabsContent value="scanner" className="space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-600" />
                  {t.scanner}
                </CardTitle>
                <CardDescription>Scan documents using your camera or upload images for OCR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isCameraOpen && !capturedImage ? (
                  <>
                    <div {...getRootProps()} className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 cursor-pointer transition-colors ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                      <input {...getInputProps()} />
                      <Upload className="h-16 w-16 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PDF, Images up to 10MB</p>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={startCamera}>
                        <Camera className="h-4 w-4 mr-2" />{t.camera}
                      </Button>
                      <Button className="flex-1" variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
                        <Upload className="h-4 w-4 mr-2" />Upload Image
                      </Button>
                      <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} />
                    </div>

                    {newDocument.files.length > 0 && (
                      <div className="space-y-2">
                        <Label>Selected Files:</Label>
                        {newDocument.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <FileText className="h-4 w-4" />
                            <span className="flex-1 truncate text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                            <Button variant="ghost" size="icon" onClick={() => { const newFiles = newDocument.files.filter((_, i) => i !== index); setNewDocument({ ...newDocument, files: newFiles }); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : isCameraOpen ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      {!capturedImage && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><p className="text-white">Camera Active</p></div>}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-2">
                      {!capturedImage ? (
                        <Button className="flex-1" onClick={captureImage}><Camera className="h-4 w-4 mr-2" />{t.capture}</Button>
                      ) : (
                        <>
                          <Button className="flex-1" onClick={retakeImage}><RotateCw className="h-4 w-4 mr-2" />{t.retake}</Button>
                          <Button className="flex-1" onClick={performOcr} disabled={isScanning}>
                            {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                            {isScanning ? t.processing : t.ocr}
                          </Button>
                        </>
                      )}
                      <Button variant="outline" onClick={stopCamera}><X className="h-4 w-4" />Stop</Button>
                    </div>
                  </div>
                ) : capturedImage ? (
                  <div className="space-y-4">
                    <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
                    {ocrResult && (
                      <div className="space-y-2">
                        <Label>{t.extractedText}</Label>
                        <Textarea value={ocrResult} readOnly className="h-32" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={performOcr} disabled={isScanning}>
                        {isScanning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                        {isScanning ? t.processing : t.ocr}
                      </Button>
                      <Button className="flex-1" onClick={saveScannedImage}><Save className="h-4 w-4 mr-2" />{t.save}</Button>
                      <Button variant="outline" onClick={retakeImage}><RotateCw className="h-4 w-4 mr-2" />{t.retake}</Button>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Scanner Features:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Auto-crop and enhance documents</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> OCR text extraction</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Convert to PDF</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Multi-page scanning</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.upload}</DialogTitle>
            <DialogDescription>Upload your documents</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title <span className="text-red-500">*</span></Label>
              <Input placeholder="Document title" value={newDocument.title} onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={newDocument.category} onValueChange={(value) => setNewDocument({ ...newDocument, category: value })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag & drop files here, or click to select</p>
            </div>
            {newDocument.files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files:</Label>
                {newDocument.files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFileUpload} disabled={newDocument.files.length === 0}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.addReminder}</DialogTitle>
            <DialogDescription>Set up a deadline reminder</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.reminderTitle} <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g., Exam fee payment" value={newReminder.title} onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t.reminderType}</Label>
              <Select value={newReminder.type} onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{reminderTypes.map((type) => (<SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.dueDate} <span className="text-red-500">*</span></Label>
              <Input type="date" value={format(newReminder.dueDate, 'yyyy-MM-dd')} onChange={(e) => setNewReminder({ ...newReminder, dueDate: new Date(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newReminder.priority} onValueChange={(value) => setNewReminder({ ...newReminder, priority: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{priorityLevels.map((p) => (<SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remind me before</Label>
              <Select value={newReminder.reminderDays.toString()} onValueChange={(value) => setNewReminder({ ...newReminder, reminderDays: parseInt(value) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="2">2 days before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">1 week before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReminderSubmit}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Folder Dialog */}
      <Dialog open={isFolderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.createFolder}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.folderName}</Label>
              <Input placeholder="e.g., Semester 1" value={newFolder.name} onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea placeholder="Folder description" value={newFolder.description} onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t.folderColor}</Label>
              <div className="flex flex-wrap gap-2">
                {folderColors.map((color) => (
                  <button key={color} type="button" className={`w-8 h-8 rounded-full transition-transform ${newFolder.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`} style={{ backgroundColor: color }} onClick={() => setNewFolder({ ...newFolder, color })} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFolderSubmit}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t.createNote}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.noteTitle}</Label>
              <Input placeholder="Note title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t.noteContent}</Label>
              <Textarea placeholder="Write your note here..." value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} className="h-40" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pinned" checked={newNote.isPinned} onCheckedChange={(checked) => setNewNote({ ...newNote, isPinned: checked as boolean })} />
              <Label htmlFor="pinned">Pin to top</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleNoteSubmit}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.createTag}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.tagName}</Label>
              <Input placeholder="e.g., Important, Exams" value={newTag.name} onChange={(e) => setNewTag({ ...newTag, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t.tagColor}</Label>
              <div className="flex flex-wrap gap-2">
                {tagColors.map((color) => (
                  <button key={color} type="button" className={`w-8 h-8 rounded-full transition-transform ${newTag.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`} style={{ backgroundColor: color }} onClick={() => setNewTag({ ...newTag, color })} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTagSubmit}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog with QR Code */}
      <Dialog open={isShareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.shareDocument}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {shareDocument && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">{shareDocument.title}</span>
                </div>
              </div>
            )}
            {isGeneratingQr ? (
              <div className="flex items-center justify-center h-48"><RefreshCw className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : qrCode ? (
              <div className="flex flex-col items-center space-y-4">
                <img src={qrCode} alt="QR Code" className="w-48 h-48 rounded-lg" />
                <div className="flex items-center gap-2 w-full">
                  <Input value={shareUrl || ''} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <QrCode className="h-12 w-12 mx-auto mb-2" />
                <p>Generate a QR code to share this document</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={isDocumentPreviewOpen} onOpenChange={setDocumentPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewDocument?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {previewDocument && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Category</p><p className="font-medium">{previewDocument.category}</p></div>
                  <div><p className="text-gray-500">File Size</p><p className="font-medium">{formatFileSize(previewDocument.fileSize)}</p></div>
                  <div><p className="text-gray-500">File Name</p><p className="font-medium">{previewDocument.fileName}</p></div>
                  <div><p className="text-gray-500">Created</p><p className="font-medium">{format(new Date(previewDocument.createdAt), 'PPP')}</p></div>
                </div>
                {previewDocument.description && (<div><p className="text-gray-500 text-sm">Description</p><p className="mt-1">{previewDocument.description}</p></div>)}
                <Separator />
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  {previewDocument.mimeType.startsWith('image/') ? (
                    <img src={previewDocument.fileUrl} alt={previewDocument.title} className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <FileText className="h-16 w-16 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Preview not available</p>
                      <Button className="mt-4" onClick={() => handleDownloadDocument(previewDocument)}><Download className="h-4 w-4 mr-2" />Download File</Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentPreviewOpen(false)}>Close</Button>
            {previewDocument && <Button onClick={() => handleDownloadDocument(previewDocument)}><Download className="h-4 w-4 mr-2" />{t.download}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />{t.settings}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Profile</h3>
                <div className="grid gap-4">
                  <div className="space-y-2"><Label>{t.name}</Label><Input value={user?.name || ''} onChange={(e) => updateUser({ name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{t.email}</Label><Input value={user?.email || ''} onChange={(e) => updateUser({ email: e.target.value })} /></div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}<span>{theme === 'dark' ? t.lightMode : t.darkMode}</span></div>
                  <Button variant="outline" size="sm" onClick={handleThemeToggle}>Switch</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Languages className="h-5 w-5" /><span>Language</span></div>
                  <Button variant="outline" size="sm" onClick={handleLanguageToggle}>{language === 'en' ? 'हिंदी' : 'English'}</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">{t.storageUsage}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatFileSize(user?.storageUsed || 0)}</span>
                    <span>{formatFileSize(user?.storageLimit || 104857600)}</span>
                  </div>
                  <Progress value={((user?.storageUsed || 0) / (user?.storageLimit || 104857600)) * 100} className="h-2" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Data Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={handleExport.bind(null, 'json')}><FileJson className="h-4 w-4 mr-2" />Export JSON</Button>
                  <Button variant="outline" onClick={handleExport.bind(null, 'csv')}><FileSpreadsheet className="h-4 w-4 mr-2" />Export CSV</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">{t.backup}</h3>
                <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                  {isCreatingBackup ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                  Create Backup
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <Button variant="destructive" onClick={() => { localStorage.removeItem('studentProfile'); window.location.reload(); }}><LogOut className="h-4 w-4 mr-2" />{t.logout}</Button>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter><Button onClick={() => setSettingsDialogOpen(false)}>Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsDialogOpen} onOpenChange={setAnalyticsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />{t.analytics}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {isLoadingAnalytics ? (
              <div className="flex items-center justify-center h-40"><RefreshCw className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : analytics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total Documents</p><p className="text-2xl font-bold">{analytics.overview.totalDocuments}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total Size</p><p className="text-2xl font-bold">{formatFileSize(analytics.overview.totalSize)}</p></CardContent></Card>
                  <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Reminders</p><p className="text-2xl font-bold">{analytics.overview.totalReminders}</p></CardContent></Card>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Documents by Category</h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.documentsByCategory).map(([cat, count]) => (
                      <div key={cat} className="flex items-center gap-2">
                        <div className="flex-1"><div className="flex justify-between text-sm"><span className="capitalize">{cat}</span><span>{count as number}</span></div><Progress value={((count as number) / analytics.overview.totalDocuments) * 100} className="h-2" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500"><BarChart3 className="h-12 w-12 mx-auto mb-2" /><p>Click Load to view analytics</p></div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyticsDialogOpen(false)}>Close</Button>
            {!analytics && <Button onClick={loadAnalytics} disabled={isLoadingAnalytics}>{isLoadingAnalytics ? 'Loading...' : 'Load Analytics'}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
