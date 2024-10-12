import { NextRequest, NextResponse } from 'next/server';
import { NDKFilter } from '@nostr-dev-kit/ndk';
import { fetchNostrEvents } from '@/lib/nostr';

export async function GET(request: NextRequest) {
  const pubkey = request.nextUrl.searchParams.get('pubkey');

  // if (!pubkey) {
  //   return NextResponse.json({ error: 'Missing pubkey parameter' }, { status: 400 });
  // }

  const filter: NDKFilter = {
    kinds: [31923 as number],
    limit: 50,
  };

  try {
    const events = await fetchNostrEvents(filter);
    const currentTime = Math.floor(Date.now() / 1000);

    const filteredAndSortedEvents = events
      .map((event) => {
        const start = event?.tags.find((tag: string[]) => tag[0] === 'start')?.[1];
        const end = event?.tags.find((tag: string[]) => tag[0] === 'end')?.[1];

        if (!start || !end || parseInt(end) < currentTime) {
          return null;
        }

        return {
          id: event?.id,
          pubkey: event?.pubkey,
          content: event?.content,
          created_at: event?.created_at,
          tags: event?.tags,
          start: parseInt(start),
          end: parseInt(end),
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null)
      .sort((a, b) => a.start - b.start);

    return NextResponse.json(filteredAndSortedEvents);
  } catch (error) {
    console.error('Error fetching user posts:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
