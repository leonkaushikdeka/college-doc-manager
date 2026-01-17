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
    const parentId = searchParams.get('parentId');
    const rootOnly = searchParams.get('rootOnly');

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const where: any = { studentProfileId: profile.id };

    if (rootOnly === 'true') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const folders = await prisma.folder.findMany({
      where,
      include: {
        children: true,
        _count: { select: { documents: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
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
    const { name, description, color, icon, parentId } = body;

    // If parentId is provided, verify it belongs to the user
    if (parentId) {
      const parentFolder = await prisma.folder.findFirst({
        where: { id: parentId, studentProfileId: profile.id },
      });

      if (!parentFolder) {
        return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
      }
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        description,
        color: color || '#3B82F6',
        icon,
        parentId: parentId || null,
        isRoot: !parentId,
        studentProfileId: profile.id,
      },
    });

    // If this is a subfolder, update the parent
    if (parentId) {
      await prisma.folder.update({
        where: { id: parentId },
        data: { isRoot: false },
      });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, description, color, icon, parentId } = body;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify folder belongs to user
    const existingFolder = await prisma.folder.findFirst({
      where: { id, studentProfileId: profile.id },
    });

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Prevent circular references
    if (parentId) {
      const parentFolder = await prisma.folder.findFirst({
        where: { id: parentId, studentProfileId: profile.id },
      });

      if (!parentFolder) {
        return NextResponse.json({ error: 'Parent folder not found' }, { status: 404 });
      }

      // Can't move folder into itself or its descendants
      if (parentId === id) {
        return NextResponse.json({ error: 'Cannot move folder into itself' }, { status: 400 });
      }
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        name,
        description,
        color,
        icon,
        parentId: parentId || null,
        isRoot: !parentId,
      },
    });

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
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
      return NextResponse.json({ error: 'Folder ID required' }, { status: 400 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify folder belongs to user
    const folder = await prisma.folder.findFirst({
      where: { id, studentProfileId: profile.id },
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Delete folder and all its contents
    await prisma.folder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
