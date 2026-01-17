import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { backupData, options } = body;

    if (!backupData) {
      return NextResponse.json({ error: 'No backup data provided' }, { status: 400 });
    }

    const results = {
      folders: 0,
      tags: 0,
      reminders: 0,
      notes: 0,
      errors: [] as string[],
    };

    // Restore folders
    if (options?.folders && backupData.folders) {
      for (const folder of backupData.folders) {
        try {
          await prisma.folder.create({
            data: {
              name: folder.name,
              description: folder.description,
              color: folder.color,
              icon: folder.icon,
              parentId: folder.parentId,
              isRoot: folder.parentId === null,
              studentProfileId: profile.id,
            },
          });
          results.folders++;
        } catch (e) {
          results.errors.push(`Failed to restore folder: ${folder.name}`);
        }
      }
    }

    // Restore tags
    if (options?.tags && backupData.tags) {
      for (const tag of backupData.tags) {
        try {
          await prisma.tag.create({
            data: {
              name: tag.name,
              color: tag.color,
              studentProfileId: profile.id,
            },
          });
          results.tags++;
        } catch (e) {
          results.errors.push(`Failed to restore tag: ${tag.name}`);
        }
      }
    }

    // Restore reminders
    if (options?.reminders && backupData.reminders) {
      for (const reminder of backupData.reminders) {
        try {
          await prisma.reminder.create({
            data: {
              title: reminder.title,
              description: reminder.description,
              type: reminder.type,
              dueDate: new Date(reminder.dueDate),
              reminderDays: reminder.reminderDays,
              isCompleted: reminder.isCompleted,
              isRecurring: reminder.isRecurring,
              recurringType: reminder.recurringType,
              priority: reminder.priority || 'medium',
              color: reminder.color || '#3B82F6',
              studentProfileId: profile.id,
            },
          });
          results.reminders++;
        } catch (e) {
          results.errors.push(`Failed to restore reminder: ${reminder.title}`);
        }
      }
    }

    // Restore notes
    if (options?.notes && backupData.notes) {
      for (const note of backupData.notes) {
        try {
          await prisma.note.create({
            data: {
              title: note.title,
              content: note.content,
              isPinned: note.isPinned,
              documentId: note.documentId,
              studentProfileId: profile.id,
            },
          });
          results.notes++;
        } catch (e) {
          results.errors.push(`Failed to restore note: ${note.title}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}
