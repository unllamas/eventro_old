import { NextRequest, NextResponse } from 'next/server';
import { NDKFilter } from '@nostr-dev-kit/ndk';
import { fetchNostrEvents } from '@/lib/nostr';

export async function GET(request: NextRequest) {
  const pubkey = request.nextUrl.searchParams.get('pubkey');

  const filter: NDKFilter = {
    kinds: [31923 as number],
    limit: 200,
  };

  if (pubkey) {
    filter.authors = [pubkey];
  }

  try {
    const events = await fetchNostrEvents(filter);
    const currentTime = Math.floor(Date.now() / 1000);

    const eventMap = new Map();

    events.forEach((event) => {
      const id = event?.tags.find((tag: string[]) => tag[0] === 'd')?.[1];
      const start = event?.tags.find((tag: string[]) => tag[0] === 'start')?.[1];
      const end = event?.tags.find((tag: string[]) => tag[0] === 'end')?.[1];

      if (id && start && end && parseInt(end) >= currentTime) {
        const existingEvent = eventMap.get(id);
        if (!existingEvent || existingEvent.created_at < event?.created_at!) {
          eventMap.set(id, {
            id,
            pubkey: event.pubkey,
            content: event.content,
            created_at: event.created_at,
            tags: event.tags,
            start: parseInt(start),
            end: parseInt(end),
          });
        }
      }
    });

    const filteredAndSortedEvents = Array.from(eventMap.values()).sort((a, b) => a.start - b.start);

    return NextResponse.json(filteredAndSortedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
