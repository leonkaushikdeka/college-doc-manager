import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Document {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  tags: string[];
  isFavorite: boolean;
  isOffline: boolean;
  isPublic: boolean;
  shareExpiry?: string;
  scanData?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: string;
  dueDate: string;
  reminderDays: number;
  isCompleted: boolean;
  isRecurring: boolean;
  recurringType?: string;
  recurringEnd?: string;
  priority: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  data?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  university?: string;
  department?: string;
  semester?: number;
  rollNumber?: string;
  language: string;
  isOnboarded: boolean;
  storageUsed: number;
  storageLimit: number;
  avatar?: string;
  theme: string;
}

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Documents
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Selected documents for bulk operations
  selectedDocuments: string[];
  setSelectedDocuments: (ids: string[]) => void;
  toggleDocumentSelection: (id: string) => void;
  clearSelection: () => void;

  // Reminders
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;

  // Tags
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;

  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;

  // Modal states
  isUploadDialogOpen: boolean;
  setUploadDialogOpen: (open: boolean) => void;
  isReminderDialogOpen: boolean;
  setReminderDialogOpen: (open: boolean) => void;
  isDocumentPreviewOpen: boolean;
  setDocumentPreviewOpen: (open: boolean) => void;
  previewDocument: Document | null;
  setPreviewDocument: (doc: Document | null) => void;
  isShareDialogOpen: boolean;
  setShareDialogOpen: (open: boolean) => void;
  shareDocument: Document | null;
  setShareDocument: (doc: Document | null) => void;
  isTagDialogOpen: boolean;
  setTagDialogOpen: (open: boolean) => void;
  isSettingsDialogOpen: boolean;
  setSettingsDialogOpen: (open: boolean) => void;

  // Calendar
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  user: null,
  documents: [],
  selectedDocuments: [],
  reminders: [],
  tags: [],
  notifications: [],
  unreadCount: 0,
  activeTab: 'dashboard',
  searchQuery: '',
  selectedCategory: 'all',
  viewMode: 'grid' as 'grid' | 'list',
  isUploadDialogOpen: false,
  isReminderDialogOpen: false,
  isDocumentPreviewOpen: false,
  previewDocument: null,
  isShareDialogOpen: false,
  shareDocument: null,
  isTagDialogOpen: false,
  isSettingsDialogOpen: false,
  selectedDate: undefined,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User
      setUser: (user) => set({ user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Documents
      setDocuments: (documents) => set({ documents }),
      addDocument: (document) =>
        set((state) => ({
          documents: [document, ...state.documents],
        })),
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        })),
      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
          selectedDocuments: state.selectedDocuments.filter((docId) => docId !== id),
        })),
      toggleFavorite: (id) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
          ),
        })),

      // Selected documents
      setSelectedDocuments: (selectedDocuments) => set({ selectedDocuments }),
      toggleDocumentSelection: (id) =>
        set((state) => ({
          selectedDocuments: state.selectedDocuments.includes(id)
            ? state.selectedDocuments.filter((docId) => docId !== id)
            : [...state.selectedDocuments, id],
        })),
      clearSelection: () => set({ selectedDocuments: [] }),

      // Reminders
      setReminders: (reminders) => set({ reminders }),
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [reminder, ...state.reminders],
        })),
      updateReminder: (id, updates) =>
        set((state) => ({
          reminders: state.reminders.map((rem) =>
            rem.id === id ? { ...rem, ...updates } : rem
          ),
        })),
      deleteReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((rem) => rem.id !== id),
        })),
      completeReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((rem) =>
            rem.id === id
              ? { ...rem, isCompleted: true, completedAt: new Date().toISOString() }
              : rem
          ),
        })),

      // Tags
      setTags: (tags) => set({ tags }),
      addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
        })),

      // Notifications
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      clearNotifications: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),

      // UI State
      setActiveTab: (activeTab) => set({ activeTab }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setViewMode: (viewMode) => set({ viewMode }),

      // Modal states
      setUploadDialogOpen: (isUploadDialogOpen) => set({ isUploadDialogOpen }),
      setReminderDialogOpen: (isReminderDialogOpen) => set({ isReminderDialogOpen }),
      setDocumentPreviewOpen: (isDocumentPreviewOpen) => set({ isDocumentPreviewOpen }),
      setPreviewDocument: (previewDocument) => set({ previewDocument }),
      setShareDialogOpen: (isShareDialogOpen) => set({ isShareDialogOpen }),
      setShareDocument: (shareDocument) => set({ shareDocument }),
      setTagDialogOpen: (isTagDialogOpen) => set({ isTagDialogOpen }),
      setSettingsDialogOpen: (isSettingsDialogOpen) => set({ isSettingsDialogOpen }),

      // Calendar
      setSelectedDate: (selectedDate) => set({ selectedDate }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'college-doc-manager-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        documents: state.documents,
        reminders: state.reminders,
        tags: state.tags,
        notifications: state.notifications,
      }),
    }
  )
);
