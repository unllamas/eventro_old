import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket } from '@/types/event';

interface TicketManagerProps {
  tickets: Ticket[];
  onAddTicket: () => void;
  onTicketChange: (index: number, field: keyof Ticket, value: string | number) => void;
  onMoveTicket: (index: number, direction: 'up' | 'down') => void;
  onDeleteTicket: (index: number) => void;
}

export function TicketManager({
  tickets,
  onAddTicket,
  onTicketChange,
  onMoveTicket,
  onDeleteTicket,
}: TicketManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className='text-center'>
            <p>No tickets added yet</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {tickets.map((ticket, index) => (
              <div key={index} className='flex flex-col justify-between gap-2 p-4 border rounded-xl bg-white/5'>
                <Input
                  value={ticket.title}
                  onChange={(e) => onTicketChange(index, 'title', e.target.value)}
                  placeholder='Ticket Title'
                />
                <Input
                  value={ticket.description}
                  onChange={(e) => onTicketChange(index, 'description', e.target.value)}
                  placeholder='Ticket Description'
                />
                <div className='flex gap-4 items-center'>
                  <div className='flex flex-col w-full'>
                    <p className='text-md'>Price</p>
                  </div>
                  <div className='flex gap-2'>
                    <Input
                      type='number'
                      value={ticket.amount}
                      onChange={(e) => onTicketChange(index, 'amount', parseFloat(e.target.value))}
                      placeholder='Price'
                    />
                    <Select value={ticket.token} onValueChange={(value) => onTicketChange(index, 'token', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Token' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='SAT'>SAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='flex gap-4 items-center'>
                  <div className='flex flex-col w-full'>
                    <p className='text-md'>Quantity</p>
                    <p className='text-sm text-white/70 whitespace-nowrap'>0 for unlimited.</p>
                  </div>
                  <div className='flex gap-2'>
                    <Input
                      type='number'
                      value={ticket.quantity}
                      onChange={(e) => onTicketChange(index, 'quantity', parseInt(e.target.value))}
                      placeholder={ticket.quantity === 0 ? 'Unlimited' : `${ticket.quantity}`}
                    />
                  </div>
                </div>
                <div className='flex justify-between gap-4 mt-4'>
                  <div className='flex gap-2'>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() => onMoveTicket(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={() => onMoveTicket(index, 'down')}
                      disabled={index === tickets.length - 1}
                    >
                      <ArrowDown className='h-4 w-4' />
                    </Button>
                  </div>
                  <Button size='icon' variant='destructive' onClick={() => onDeleteTicket(index)}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button type='button' variant='secondary' onClick={onAddTicket} className='w-full mt-4'>
          Add Ticket
        </Button>
      </CardContent>
    </Card>
  );
}
