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

const MAX_BODY_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

function validateFileUpload(fileUrl: string): { valid: boolean; error?: string; decodedSize?: number } {
  const match = fileUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return { valid: false, error: 'File URL must be a valid base64 data URL' };
  }

  const actualMimeType = match[1].toLowerCase();
  const base64Data = match[2];

  if (!ALLOWED_MIME_TYPES.includes(actualMimeType)) {
    return { valid: false, error: `File type "${actualMimeType}" is not allowed. Allowed types: PDF, images, Word, Excel` };
  }

  const decodedSize = Math.ceil(base64Data.length * 0.75);
  if (decodedSize > MAX_BODY_SIZE) {
    return { valid: false, error: `File size (${(decodedSize / 1024 / 1024).toFixed(2)}MB) exceeds the 10MB limit` };
  }

  return { valid: true, decodedSize };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: 'Request body too large. Maximum size is 10MB' }, { status: 413 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, category, subCategory, description, fileUrl, fileName, fileType, mimeType, tags } = body;

    const validation = validateFileUpload(fileUrl);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const actualFileSize = validation.decodedSize!;

    // Check storage limit using actual decoded file size
    if (profile.storageUsed + actualFileSize > profile.storageLimit) {
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
        fileSize: actualFileSize,
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
      data: { storageUsed: profile.storageUsed + actualFileSize },
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
