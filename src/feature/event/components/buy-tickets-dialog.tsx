// @ts-nocheck

import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { db } from '@/config/db';
import { Tickets } from '@/types/db';

export function BuyTicketsDialog(props: {
  tickets: any;
  selectedTickets: any;
  open: boolean;
  onChange: any;
  event: any;
  total: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onChange}>
      <DialogContent className='flex flex-col items-center gap-8'>
        <div className='w-full flex flex-col gap-8'>
          {/* <div className='flex flex-col items-start gap-8'>
          <div className='inline w-auto p-4 rounded-full bg-border/70'>
            <TicketCheckIcon className='w-8 h-8' />
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-bold'>Tickets purchased</h3>
            <p className='text-md'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus quidem tempora voluptate animi quas
              quisquam reprehenderit magni. Unde praesentium porro, nobis quidem enim voluptatibus sunt iusto, quasi
              eos est excepturi?
            </p>
          </div>
        </div> */}
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
          <div className='flex flex-col gap-4'>
            <div className=''>
              {tickets?.tickets?.map((ticket: Tickets) => {
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

            <div className='mx-auto p-12 bg-white rounded-lg'>
              <QRCodeSVG
                value={'asd'}
                size={240}
                imageSettings={{
                  // Iso 24x24, image 42x42
                  src: '/iso.png',
                  x: undefined,
                  y: undefined,
                  height: 42,
                  width: 42,
                  excavate: true,
                }}
              />
            </div>

            <div className='flex justify-between font-semibold'>
              <span>Total:</span>
              <span>{total} SAT</span>
            </div>
          </div>
        </div>

        <div className='w-full'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='name'>Name</Label>
              <Input id='name' type='text' placeholder='Your name' />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='Your email' />
            </div>
          </div>

          {/* <div className='flex gap-4 py-4'>
          <Checkbox id='terms' />
          <div className='grid leading-none'>
            <label htmlFor='terms' className='text-sm font-medium text-white/70'>
              Politicas de privacidad
            </label>
            <p className='mt-1 text-md'>Quiero que me avisen de nuevos eventos.</p>
          </div>
        </div> */}

          <Button className='w-full mt-4' size='lg' disabled>
            Generate payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
