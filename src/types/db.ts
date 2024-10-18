/**
 * Represents an event in the system.
 */
export interface Events {
  // Identifiers
  id: string;
  // Base data
  pubkey: string;
  // Dates
  created_at?: number;
  updated_at?: number;
}

/**
 * Represents a ticket type for an event.
 */
export interface Tickets {
  // Identifiers
  id: string;
  event_id: string;
  // Base data
  title: string;
  description: string;
  amount: number;
  currency: string;
  quantity: number;
  // Dates
  created_at: number;
  updated_at: number;
}

type OrderStatus = 'purchased' | 'transferred';

/**
 * Represents a ticket purchased for an event.
 */
export interface Orders {
  // Identifiers
  event_id: string;
  ticket_id: string;
  // Base data
  content: string;
  pubkey: string;
  quantity: number;
  bolt11: string;
  status: OrderStatus;
  // Dates
  created_at: number;
  updated_at: number;
}

export interface Check {
  // Identifiers
  event_id: string;
  ticket_id: string;
  order_id: string;
  // Base data
  quantity: number;
  // Dates
  created_at: number;
  updated_at: number;
}

type Role = 'owner' | 'admin' | 'moderator';

export interface Moderator {
  // Identifiers
  event_id: string;
  // Base data
  pubkey: string;
  role: Role;
  // Dates
  created_at: number;
  updated_at: number;
}
