import { tx, id } from '@instantdb/react';
import { db } from '@/config/db';

/**
 * Adds a new event to the database.
 * @param event The event details to be added.
 */
export function addEvent(event: any): void {
  const now = Date.now();
  const newId = id();

  db.transact(
    tx.event[event.id].update({
      ...event,
      created_at: now,
      updated_at: now,
    }),
  );
}

/**
 * Adds a new ticket type to an event.
 * @param data The ticket type details to be added.
 * @returns A promise that resolves when the ticket type is added.
 */
export function addTicket(data: any): void {
  const newId = id();

  db.transact(
    tx.tickets[newId].update({
      ...data,
    }),
  );
}

export function addOrders(data: any): void {
  const newId = id();
  const now = Date.now();

  db.transact(
    tx.orders[newId].update({
      ...data,
      status: 'purchased',
      created_at: now,
      updated_at: now,
    }),
  );
}
