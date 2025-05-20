// app/my-route/seedcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cards = body;

    if (!Array.isArray(cards)) {
      return NextResponse.json({ error: 'Input must be a valid JSON array' }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const creationResults = [];

    for (const card of cards) {
      try {
        const created = await payload.create({
          collection: 'credit-cards',
          data: card,
        });
        creationResults.push({ success: true, data: created });
      } catch (err) {
        creationResults.push({
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          card,
        });
      }
    }

    return NextResponse.json({ results: creationResults });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
