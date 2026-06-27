import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const BASE_DIR = path.join(process.cwd(), 'templates', 'knowledge-base');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
  }

  try {
    const filePath = path.normalize(path.join(BASE_DIR, file));

    // Prevent path traversal : require trailing sep so knowledge-base-evil/ is blocked
    if (!filePath.startsWith(BASE_DIR + path.sep) && filePath !== BASE_DIR) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ content, file });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
