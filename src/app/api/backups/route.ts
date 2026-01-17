import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const backups = await prisma.backup.findMany({
      where: { studentProfileId: profile.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Error fetching backups:', error);
    return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type = 'full', name } = body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        documents: {
          where: { deletedAt: null },
          include: { tags: true },
        },
        reminders: true,
        notes: true,
        folders: true,
        tags: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Create backup record
    const backup = await prisma.backup.create({
      data: {
        name: name || `Backup ${new Date().toISOString()}`,
        type,
        status: 'in_progress',
        studentProfileId: profile.id,
      },
    });

    // Prepare backup data
    const backupData: any = {
      profile: {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        college: profile.college,
        university: profile.university,
        department: profile.department,
        semester: profile.semester,
        rollNumber: profile.rollNumber,
        language: profile.language,
        theme: profile.theme,
      },
      folders: profile.folders.map(f => ({
        id: f.id,
        name: f.name,
        description: f.description,
        color: f.color,
        icon: f.icon,
        parentId: f.parentId,
      })),
      tags: profile.tags.map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
      })),
      reminders: profile.reminders.map(r => ({
        title: r.title,
        description: r.description,
        type: r.type,
        dueDate: r.dueDate.toISOString(),
        reminderDays: r.reminderDays,
        isCompleted: r.isCompleted,
        isRecurring: r.isRecurring,
        recurringType: r.recurringType,
        priority: r.priority,
        color: r.color,
      })),
      notes: profile.notes.map(n => ({
        title: n.title,
        content: n.content,
        isPinned: n.isPinned,
        documentId: n.documentId,
      })),
    };

    // For full backup, include documents metadata (not the actual files due to size)
    if (type === 'full') {
      backupData.documents = profile.documents.map(d => ({
        id: d.id,
        title: d.title,
        category: d.category,
        subCategory: d.subCategory,
        description: d.description,
        fileName: d.fileName,
        fileSize: d.fileSize,
        fileType: d.fileType,
        mimeType: d.mimeType,
        folderId: d.folderId,
        tags: d.tags.map(t => t.id),
        isFavorite: d.isFavorite,
        extractedText: d.extractedText,
        metadata: d.metadata,
        createdAt: d.createdAt.toISOString(),
      }));
    }

    // Create zip file
    const zip = new JSZip();
    zip.file('backup.json', JSON.stringify(backupData, null, 2));
    zip.file('README.txt', `College DocManager Backup\nDate: ${new Date().toISOString()}\nType: ${type}\n\nTo restore:\n1. Go to Settings > Restore\n2. Upload this backup file\n3. Select items to restore`);

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

    // In a real app, you would upload this to cloud storage
    // For now, we'll just create a data URL (for demo purposes)
    const dataUrl = `data:application/zip;base64,${zipContent.toString('base64')}`;

    // Update backup record
    await prisma.backup.update({
      where: { id: backup.id },
      data: {
        status: 'completed',
        progress: 100,
        fileUrl: dataUrl,
        fileSize: zipContent.length,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      backup,
      downloadUrl: dataUrl,
      fileSize: zipContent.length,
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await prisma.backup.delete({
      where: {
        id,
        studentProfileId: profile.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
  }
}
