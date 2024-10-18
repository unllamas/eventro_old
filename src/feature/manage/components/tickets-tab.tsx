import { PencilIcon } from 'lucide-react';

import { NewTicketDialog } from '@/components/new-ticket-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { db } from '@/config/db';

export function TicketsTab(props: { id: string }) {
  const { data } = db.useQuery({
    tickets: {
      $: {
        where: {
          event_id: decodeURIComponent(props.id),
        },
      },
    },
    orders: {
      $: {
        where: {
          event_id: decodeURIComponent(props.id),
        },
      },
    },
  });

  if (!data) return null;

  const { tickets, orders } = data;

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-8 w-full'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex flex-col'>
            <h3 className='text-xl font-bold'>Tickets</h3>
            <p className='text-md'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, sed.</p>
          </div>
          <NewTicketDialog id={props.id} />
        </div>
        <div className='overflow-hidden flex flex-col rounded-md border'>
          {!data || data?.tickets?.length === 0 ? (
            <Card className='border-dashed'>
              <CardContent className='py-12 text-center'>
                <p>
                  <strong>Aún no hay invitados</strong>
                </p>
                <p className='text-white/70'>¡Comparte el evento o invita a personas para comenzar!</p>
              </CardContent>
            </Card>
          ) : (
            tickets?.map((ticket) => {
              let amount = 0;
              orders.filter((order) => order.ticket_id === ticket.id).map((order) => (amount += order.quantity));

              return (
                <Card className='rounded-none border-none'>
                  <CardContent className='flex gap-2 justify-between items-center'>
                    <div className='flex gap-2 items-end'>
                      <p className='text-lg'>
                        <strong>{ticket.title}</strong>
                      </p>
                      <p>
                        {ticket?.amount} {ticket.currency}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm'>
                        <span className='text-lg font-semibold'>{amount}</span>
                        {ticket?.quantity && ' / '}
                        <span className='font-semibold'>{ticket?.quantity}</span> totales
                      </p>
                      <Button variant='outline' size='icon' onClick={() => null}>
                        <PencilIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
