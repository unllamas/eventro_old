'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useActiveUser } from 'nostr-hooks';

import { db } from '@/config/db';
import fetcher from '@/lib/fetcher';
import { Tickets } from '@/types/db';

import { EventHeader } from './components/event-header';
import { EventSidebar } from './components/event-sidebar';
import { TicketPurchaseCard } from './components/ticket-purchase-card';
import { EventDescription } from './components/event-description';
import { PurchaseModal } from './components/purchase-modal';

export function EventFeature({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [total, setTotal] = useState<number>(0);
  const [screen, setScreen] = useState<'info' | 'payment' | 'summary'>('info');

  const { activeUser } = useActiveUser();
  const { data: event } = useSWR(`/api/event?id=${id}`, fetcher);

  const { data } = db.useQuery({
    tickets: {
      $: {
        where: {
          event_id: event?.a,
        },
      },
    },
    orders: {
      $: {
        where: {
          event_id: event?.a,
        },
      },
    },
  });

  if (!event || !data) return null;

  const { tickets, orders } = data;

  const handleTicketChange = (ticket: Tickets, change: number) => {
    const updatedTickets = { ...selectedTickets };
    const currentCount = updatedTickets[ticket?.id] || 0;
    const newCount = Math.max(0, currentCount + change);

    if (newCount === 0) {
      delete updatedTickets[ticket?.id];
    } else {
      updatedTickets[ticket?.id] = newCount;
    }

    setSelectedTickets(updatedTickets);
    calculateTotal(updatedTickets);
  };

  const calculateTotal = (selectedTickets: Record<string, number>) => {
    let newTotal = 0;
    tickets?.forEach((ticket: Tickets) => {
      const count = selectedTickets[ticket.id] || 0;
      newTotal += count * ticket.amount;
    });
    setTotal(newTotal);
  };

  const handleRegister = () => setIsModalOpen(true);

  const handleResetModal = () => {
    setScreen('info');
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-background'>
      <main className='flex flex-col md:flex-row gap-8 w-full max-w-[960px] mx-auto px-4 py-8'>
        <EventSidebar event={event} id={id} />
        <div className='w-full'>
          <div className='flex flex-col gap-8'>
            <EventHeader event={event} />
            <TicketPurchaseCard
              tickets={tickets}
              orders={orders}
              selectedTickets={selectedTickets}
              handleTicketChange={handleTicketChange}
              handleRegister={handleRegister}
            />
            <EventDescription description={event.description} />
          </div>
        </div>
      </main>
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleResetModal}
        event={event}
        tickets={tickets}
        selectedTickets={selectedTickets}
        total={total}
        screen={screen}
        setScreen={setScreen}
        activeUser={activeUser}
      />
    </div>
  );
}
