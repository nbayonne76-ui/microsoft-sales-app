import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'templates', 'knowledge-base', file);

    // Security check: ensure file is within knowledge-base directory
    const normalizedPath = path.normalize(filePath);
    const baseDir = path.join(process.cwd(), 'templates', 'knowledge-base');

    if (!normalizedPath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    return NextResponse.json({ content, file });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'File not found or could not be read' },
      { status: 404 }
    );
  }
}
