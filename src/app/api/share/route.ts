import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        studentProfile: { userId: session.user.id },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Generate QR code
    const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/share/${document.qrCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shareUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Get existing shared links
    const sharedLinks = await prisma.sharedLink.findMany({
      where: { documentId: document.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      shareUrl,
      qrCode: qrCodeDataUrl,
      documentId: document.id,
      sharedLinks,
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json({ error: 'Failed to generate share link' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, email, password, maxDownloads, expiresAt, createNewLink } = body;

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        studentProfile: { userId: session.user.id },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    let token = document.qrCode;
    let sharedLink;

    if (createNewLink) {
      token = uuidv4();
      sharedLink = await prisma.sharedLink.create({
        data: {
          token,
          documentId,
          email,
          password: password ? await require('bcryptjs').hash(password, 10) : null,
          maxDownloads,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });
    }

    const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/share/${token}`;

    return NextResponse.json({
      shareUrl,
      token,
      sharedLink,
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
    }

    await prisma.sharedLink.delete({
      where: {
        id: linkId,
        document: {
          studentProfile: { userId: session.user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting share link:', error);
    return NextResponse.json({ error: 'Failed to delete share link' }, { status: 500 });
  }
}
