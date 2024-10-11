export interface EventDetails {
  title: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  location: {
    description: string;
    lat: number;
    lon: number;
  };
  description: string;
  tickets: Ticket[];
  relays: string[];
  tags: string[];
  organizers: Organizer[];
}

export interface Organizer {
  pubkey: string;
  name: string;
}

export interface Ticket {
  title: string;
  description: string;
  amount: number;
  token: string;
  quantity: number;
}

export interface FileNostr {
  blurhash: string;
  dimensions: { width: number; height: number };
  fileName: string;
  metadata: { m: string; x: number; dim: string };
  mime: string;
  responsive: {
    '240p': string;
    '360p': string;
    '480p': string;
    '720p': string;
    '1080p': string;
  };
  sha256: string;
  size: number;
  thumbnail: string;
  type: string;
  url: string;
}
