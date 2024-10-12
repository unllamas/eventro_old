import { NextRequest, NextResponse } from 'next/server';
import { NDKFilter } from '@nostr-dev-kit/ndk';
import { fetchNostrEvent, fetchNostrEvents } from '@/lib/nostr';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const filter: NDKFilter = {
    ids: [id],
    kinds: [31923 as number],
    limit: 1,
  };

  try {
    const nostrEvents = await fetchNostrEvent(filter);
    const raw = nostrEvents?.rawEvent();

    const event = {
      id: raw?.tags.find((tag: any) => tag[0] === 'd')?.[1],
      title: raw?.tags.find((tag: any) => tag[0] === 'title')?.[1] || 'Untitled Event',
      date: new Date(raw?.created_at! * 1000).toLocaleDateString(),
      time: new Date(raw?.created_at! * 1000).toLocaleTimeString(),
      start: raw?.tags.find((tag: any) => tag[0] === 'start')?.[1],
      end: raw?.tags.find((tag: any) => tag[0] === 'end')?.[1],
      location: raw?.tags.find((tag: any) => tag[0] === 'location')?.[1],
      description: raw?.content,
      image: raw?.tags.find((tag: any) => tag[0] === 'image')?.[1],
      organizers: [],
      tickets:
        raw?.tags
          .filter((tag: any) => tag[0] === 'ticket')!
          .map((ticket: any) => ({
            id: ticket[0] + '_' + ticket[1].toLowerCase(),
            title: ticket[1],
            description: ticket[2],
            token: ticket[3],
            price: parseInt(ticket[4]),
            available: parseInt(ticket[5]),
          })) || [],
    };

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching user posts:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
