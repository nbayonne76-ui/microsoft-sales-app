import { NextResponse } from 'next/server';

// Stub : sequences are managed client-side (localStorage)
export async function GET() {
  return NextResponse.json({ sequences: [] });
}
