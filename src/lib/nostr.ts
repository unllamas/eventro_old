import NDK, { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';

// Nostr
export const RELAYS = ['wss://relay.primal.net/'];

export const ndk = new NDK({ explicitRelayUrls: RELAYS });

export async function connectToNDK(): Promise<NDK> {
  await ndk.connect();

  return ndk;
}

export async function fetchNostrEvent(filter: NDKFilter): Promise<NDKEvent | null> {
  const ndk = await connectToNDK();
  const event = await ndk.fetchEvent(filter);

  return event || null;
}

export async function fetchNostrEvents(filter: NDKFilter): Promise<NDKEvent[]> {
  const ndk = await connectToNDK();
  const events = await ndk.fetchEvents(filter);

  return Array.from(events);
}
