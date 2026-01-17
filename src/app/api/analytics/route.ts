import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7'; // days
    const days = parseInt(range);

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        documents: {
          where: { deletedAt: null },
        },
        reminders: true,
        folders: true,
        tags: true,
        notes: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const today = new Date();
    const startDate = subDays(today, days);

    // Calculate statistics
    const totalDocuments = profile.documents.length;
    const totalSize = profile.documents.reduce((sum, d) => sum + d.fileSize, 0);
    const documentsByCategory = profile.documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalReminders = profile.reminders.length;
    const completedReminders = profile.reminders.filter(r => r.isCompleted).length;
    const pendingReminders = totalReminders - completedReminders;
    const overdueReminders = profile.reminders.filter(
      r => !r.isCompleted && new Date(r.dueDate) < today
    ).length;

    // Documents added per day (last N days)
    const documentsByDay = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const count = profile.documents.filter(
        d => new Date(d.createdAt) >= dayStart && new Date(d.createdAt) <= dayEnd
      ).length;
      documentsByDay.push({
        date: format(date, 'yyyy-MM-dd'),
        count,
      });
    }

    // File type distribution
    const fileTypes = profile.documents.reduce((acc, doc) => {
      const type = doc.mimeType.split('/')[1] || doc.fileType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top folders by document count
    const foldersWithCount = profile.folders.map(f => ({
      id: f.id,
      name: f.name,
      color: f.color,
      documentCount: profile.documents.filter(d => d.folderId === f.id).length,
    })).sort((a, b) => b.documentCount - a.documentCount);

    // Storage breakdown by category
    const storageByCategory = {};
    categories.forEach(cat => {
      const catDocs = profile.documents.filter(d => d.category === cat.id);
      storageByCategory[cat.id] = {
        label: cat.label,
        count: catDocs.length,
        size: catDocs.reduce((sum, d) => sum + d.fileSize, 0),
      };
    });

    const analytics = {
      overview: {
        totalDocuments,
        totalSize,
        totalReminders,
        completedReminders,
        pendingReminders,
        overdueReminders,
        completionRate: totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0,
        averageDocumentSize: totalDocuments > 0 ? Math.round(totalSize / totalDocuments) : 0,
        totalFolders: profile.folders.length,
        totalTags: profile.tags.length,
        totalNotes: profile.notes.length,
      },
      documentsByCategory,
      documentsByDay,
      fileTypes,
      topFolders: foldersWithCount.slice(0, 5),
      storageByCategory,
      recentActivity: {
        documentsAddedToday: profile.documents.filter(
          d => new Date(d.createdAt) >= startOfDay(today)
        ).length,
        remindersDueToday: profile.reminders.filter(
          r => !r.isCompleted && format(new Date(r.dueDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        ).length,
        completedToday: profile.reminders.filter(
          r => r.isCompleted && r.completedAt && format(new Date(r.completedAt), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        ).length,
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

const categories = [
  { id: 'academic', label: 'Academic' },
  { id: 'financial', label: 'Financial' },
  { id: 'administrative', label: 'Administrative' },
  { id: 'personal', label: 'Personal' },
  { id: 'placement', label: 'Placements' },
  { id: 'internship', label: 'Internships' },
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Record analytics event
    const body = await request.json();
    const { event, entityType, entityId } = body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update today's analytics record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await prisma.analytics.findFirst({
      where: {
        studentProfileId: profile.id,
        date: today,
      },
    });

    if (!analytics) {
      analytics = await prisma.analytics.create({
        data: {
          studentProfileId: profile.id,
          date: today,
        },
      });
    }

    const updateData: any = {};
    switch (event) {
      case 'document_viewed':
        updateData.documentsViewed = { increment: 1 };
        break;
      case 'document_shared':
        updateData.documentsShared = { increment: 1 };
        break;
      case 'reminder_set':
        updateData.remindersSet = { increment: 1 };
        break;
      case 'reminder_completed':
        updateData.remindersCompleted = { increment: 1 };
        break;
    }

    await prisma.analytics.update({
      where: { id: analytics.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording analytics:', error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
}
