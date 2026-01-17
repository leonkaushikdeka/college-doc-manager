import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const completed = searchParams.get('completed');
    const upcoming = searchParams.get('upcoming');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      studentProfile: { userId: session.user.id },
    };

    if (type) {
      where.type = type;
    }

    if (completed !== null && completed !== undefined) {
      where.isCompleted = completed === 'true';
    }

    if (upcoming === 'true') {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      where.dueDate = {
        gte: today,
        lte: nextWeek,
      };
      where.isCompleted = false;
    }

    const [reminders, total] = await Promise.all([
      prisma.reminder.findMany({
        where,
        orderBy: [
          { isCompleted: 'asc' },
          { dueDate: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.reminder.count({ where }),
    ]);

    return NextResponse.json({
      reminders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

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
    const { title, description, type, dueDate, reminderDays, isRecurring, recurringType, recurringEnd, priority, color } = body;

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        type,
        dueDate: new Date(dueDate),
        reminderDays: reminderDays || 3,
        isRecurring: isRecurring || false,
        recurringType,
        recurringEnd: recurringEnd ? new Date(recurringEnd) : null,
        priority: priority || 'medium',
        color: color || '#3B82F6',
        studentProfileId: profile.id,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'create',
        entityType: 'reminder',
        entityId: reminder.id,
      },
    });

    return NextResponse.json({ reminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 });
    }

    // Handle date conversion
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }
    if (updates.recurringEnd) {
      updates.recurringEnd = new Date(updates.recurringEnd);
    }

    const reminder = await prisma.reminder.update({
      where: {
        id,
        studentProfile: { userId: session.user.id },
      },
      data: {
        ...updates,
        ...(updates.isCompleted ? { completedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ reminder });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
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
      return NextResponse.json({ error: 'Reminder ID required' }, { status: 400 });
    }

    await prisma.reminder.delete({
      where: {
        id,
        studentProfile: { userId: session.user.id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}
