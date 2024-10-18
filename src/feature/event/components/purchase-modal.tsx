import { useState } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { TicketCheckIcon } from 'lucide-react';

import { addOrders } from '@/lib/db';

import { Dialog, DialogClose, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Tickets } from '@/types/db';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  tickets: Tickets[];
  selectedTickets: Record<string, number>;
  total: number;
  screen: 'info' | 'payment' | 'summary';
  setScreen: (screen: 'info' | 'payment' | 'summary') => void;
  activeUser: any;
}

export function PurchaseModal({
  isOpen,
  onClose,
  event,
  tickets,
  selectedTickets,
  total,
  screen,
  setScreen,
  activeUser,
}: PurchaseModalProps) {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const handlePayment = () => {
    setScreen('summary');

    tickets?.forEach((ticket: Tickets) => {
      const pubkey = activeUser?.pubkey;
      const amount = selectedTickets[ticket?.id] || 0;
      if (amount === 0) return;

      const data = {
        event_id: ticket?.event_id,
        ticket_id: ticket?.id,
        content: pubkey ? null : JSON.stringify({ name, email }),
        pubkey: pubkey || null,
        quantity: amount,
        bolt11: '',
      };

      addOrders(data);
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex flex-col items-center'>
        <div className='w-full flex flex-col gap-8'>
          {screen !== 'summary' ? (
            <div className='flex gap-4 items-center'>
              <div className='relative overflow-hidden w-full max-w-[80px] max-h-[80px] aspect-square rounded-xl bg-border'>
                <Image src={event?.image as string} alt={event?.title as string} layout='fill' objectFit='cover' />
              </div>
              <div>
                <h3 className='text-white/70 text-sm font-bold'>Your Registration</h3>
                <p className='text-lg'>
                  <strong>{event?.title}</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-start gap-8'>
              <div className='inline w-auto p-4 rounded-full bg-border/70'>
                <TicketCheckIcon className='w-8 h-8' />
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-xl font-bold'>Tickets purchased</h3>
                <p className='text-md'>
                  Thank you for your purchase. Your tickets have been successfully processed and are now ready for use.
                </p>
              </div>
            </div>
          )}

          {screen !== 'summary' && (
            <div className='flex flex-col gap-4'>
              {screen === 'info' && (
                <>
                  <div className=''>
                    {tickets?.map((ticket: Tickets) => {
                      const amount = selectedTickets[ticket.id] || 0;
                      if (amount === 0) return null;

                      return (
                        <div key={ticket.id} className='flex justify-between'>
                          <span>
                            {amount} x {ticket.title}
                          </span>
                          <span>
                            {amount * ticket.amount} {ticket.currency}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className='flex justify-between gap-2 text-lg'>
                    <span className='text-white/70'>Total:</span>
                    <span className='font-semibold'>{total} SAT</span>
                  </div>

                  <hr />
                </>
              )}

              {screen === 'payment' && (
                <>
                  <div className='mx-auto p-12 bg-white rounded-lg'>
                    <QRCodeSVG
                      value={'asd'}
                      size={240}
                      imageSettings={{
                        src: '/iso.png',
                        x: undefined,
                        y: undefined,
                        height: 42,
                        width: 42,
                        excavate: true,
                      }}
                    />
                  </div>

                  <div className='flex justify-center gap-2 text-lg'>
                    <span className='text-white/70'>Total:</span>
                    <span className='font-semibold'>{total} SAT</span>
                  </div>

                  <Button className='w-full mt-4' size='lg' onClick={handlePayment}>
                    Pay
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {screen === 'info' && (
          <div className='w-full'>
            {!activeUser && (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Your name'
                    value={name as string}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Your email'
                    value={email as string}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button className='w-full mt-4' size='lg' onClick={() => setScreen('payment')}>
              Generate payment
            </Button>
          </div>
        )}

        <DialogFooter className='w-full'>
          <DialogClose asChild>
            <Button className='w-full' type='button' size='lg' variant='ghost'>
              {screen === 'summary' ? 'Close' : 'Cancel'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
