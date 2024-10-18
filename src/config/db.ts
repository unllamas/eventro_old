import { init } from '@instantdb/react';

import { Events, Tickets, Orders, Check } from '@/types/db';

const APP_ID = process.env.INSTANT_DB;

type AppSchema = {
  events: Events;
  tickets: Tickets;
  orders: Orders;
  checks: Check;
  // moderators: Moderator;
};

export const db = init<AppSchema>({ appId: APP_ID as string });
