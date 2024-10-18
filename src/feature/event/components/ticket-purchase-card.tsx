import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Tickets } from '@/types/db';

interface TicketPurchaseCardProps {
  tickets: Tickets[];
  orders: any[];
  selectedTickets: Record<string, number>;
  handleTicketChange: (ticket: Tickets, change: number) => void;
  handleRegister: () => void;
}

export function TicketPurchaseCard({
  tickets,
  orders,
  selectedTickets,
  handleTicketChange,
  handleRegister,
}: TicketPurchaseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {tickets?.map((ticket: Tickets) => {
            const id = ticket.id;
            let amount = 0;

            orders.filter((order) => order.ticket_id === ticket.id).map((order) => (amount += order.quantity));

            return (
              <div key={id} className='flex flex-col justify-between gap-2'>
                <div className='flex gap-4 justify-between'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-semibold'>{ticket.title}</h3>
                      {ticket?.quantity - amount === 0 && <Badge variant='outline'>Sold out</Badge>}
                      {ticket?.quantity - amount !== 0 && ticket?.quantity - amount < 3 && (
                        <Badge variant='destructive'>{ticket?.quantity - amount} left</Badge>
                      )}
                    </div>
                    <p className='text-muted-foreground'>
                      {ticket.amount} {ticket.currency}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    {selectedTickets[ticket.id] > 0 && (
                      <>
                        <Button variant='secondary' size='icon' onClick={() => handleTicketChange(ticket, -1)}>
                          <Minus className='h-4 w-4' />
                        </Button>
                        <span className='w-8 text-center'>{selectedTickets[ticket.id] || 0}</span>
                      </>
                    )}
                    {ticket?.quantity && ticket?.quantity - amount !== 0 && (
                      <Button
                        variant='secondary'
                        size='icon'
                        onClick={() => handleTicketChange(ticket, 1)}
                        disabled={
                          selectedTickets[ticket.id] + amount === ticket?.quantity || ticket?.quantity - amount === 0
                        }
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>{ticket.description}</p>
              </div>
            );
          })}
        </div>
        <div className='mt-4'>
          <Button
            className='w-full'
            size='lg'
            onClick={handleRegister}
            disabled={Object.values(selectedTickets).every((count) => count === 0)}
          >
            Get entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
