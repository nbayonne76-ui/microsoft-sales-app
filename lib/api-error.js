import { NextResponse } from 'next/server';

/**
 * Maps OpenAI / fetch errors to safe client responses.
 * Logs the full error server-side, returns only a generic message to the client.
 */
export function handleApiError(error, context = 'API') {
  console.error(`[${context}]`, error);

  const status = error?.status ?? error?.response?.status;

  if (status === 429) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable due to high demand. Please retry in a moment.' },
      { status: 429 }
    );
  }
  if (status === 401) {
    return NextResponse.json(
      { error: 'AI service configuration error. Please contact support.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred. Please try again.' },
    { status: 500 }
  );
}
