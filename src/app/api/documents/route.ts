import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const favorite = searchParams.get('favorite');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      studentProfile: { userId: session.user.id },
      deletedAt: null,
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (favorite === 'true') {
      where.isFavorite = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { fileName: { contains: search } },
        { scanData: { contains: search } },
      ];
    }

    if (tags) {
      const tagIds = tags.split(',');
      where.tags = {
        some: {
          id: { in: tagIds },
        },
      };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          tags: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
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
    const { title, category, subCategory, description, fileUrl, fileName, fileSize, fileType, mimeType, tags } = body;

    // Check storage limit
    if (profile.storageUsed + fileSize > profile.storageLimit) {
      return NextResponse.json({ error: 'Storage limit exceeded' }, { status: 400 });
    }

    // Generate QR code for sharing
    const shareToken = uuidv4();

    const document = await prisma.document.create({
      data: {
        title,
        category,
        subCategory,
        description,
        fileUrl,
        fileName,
        fileSize,
        fileType,
        mimeType,
        studentProfileId: profile.id,
        tags: tags?.length ? {
          connect: tags.map((id: string) => ({ id })),
        } : undefined,
        qrCode: shareToken,
      },
      include: {
        tags: true,
      },
    });

    // Update storage used
    await prisma.studentProfile.update({
      where: { id: profile.id },
      data: { storageUsed: profile.storageUsed + fileSize },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'create',
        entityType: 'document',
        entityId: document.id,
      },
    });

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids')?.split(',');

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No document IDs provided' }, { status: 400 });
    }

    // Soft delete documents
    await prisma.document.updateMany({
      where: {
        id: { in: ids },
        studentProfile: { userId: session.user.id },
      },
      data: { deletedAt: new Date() },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'delete',
        entityType: 'document',
        entityId: ids.join(','),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting documents:', error);
    return NextResponse.json({ error: 'Failed to delete documents' }, { status: 500 });
  }
}
