'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format, parse, isValid } from 'date-fns';
import { Calendar, MapPin, Minus, Plus } from 'lucide-react';
import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export function EventFeature(props: { id: string }) {
  const { id } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [selectedTickets, setSelectedTickets] = useState<
    Array<{ id: string; title: string; count: number; price: number; token: string }>
  >([]);

  const { data: event, isLoading } = useSWR(`/api/event?id=${id}`, fetcher);

  if (!event) return null;

  const handleTicketChange = (ticketId: string, change: number) => {
    const updatedCounts = { ...ticketCounts };
    updatedCounts[ticketId] = (updatedCounts[ticketId] || 0) + change;
    if (updatedCounts[ticketId] < 0) updatedCounts[ticketId] = 0;
    setTicketCounts(updatedCounts);

    const ticket = event.tickets.find((t: any) => t.id === ticketId);
    if (ticket) {
      const updatedSelectedTickets = selectedTickets.filter((t) => t.id !== ticketId);
      if (updatedCounts[ticketId] > 0) {
        updatedSelectedTickets.push({
          id: ticketId,
          title: ticket.title,
          count: updatedCounts[ticketId],
          price: ticket.price,
          token: ticket.token,
        });
      }
      setSelectedTickets(updatedSelectedTickets);
    }
  };

  const totalPrice = selectedTickets.reduce((sum, ticket) => sum + ticket.count * ticket.price, 0);

  const handleRegister = () => {
    setIsModalOpen(true);
  };

  const formatEventDate = (dateString: string): any => {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    if (!isValid(date)) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }

    return format(date, "EEEE, d 'de' MMMM");
  };

  const formatEventTime = (value: string) => {
    const data = new Date(Number(value) * 1000).toLocaleDateString();
    const date = parse(data, 'yyyy-MM-dd', new Date());
    if (!isValid(date)) {
      console.error('Invalid date:', data);
      return 'Invalid time';
    }
    return format(date, 'HH:mm');
  };

  return (
    <div className='min-h-screen bg-background'>
      <main className='flex flex-col md:flex-row gap-8 w-full max-w-[960px] mx-auto px-4 py-8'>
        <div className='flex flex-col w-full md:max-w-[320px] gap-8'>
          <div className='relative overflow-hidden w-full max-h-[320px] aspect-square rounded-xl bg-background border'>
            <Image className='object-cover' src={event?.image as string} alt={event?.title as string} fill />
          </div>

          {/* <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Users className='w-5 h-5 mr-2 text-muted-foreground' />
                    <span>{event.attendees} attendees</span>
                  </div>
                  <Button variant='outline' size='icon'>
                    <Share2 className='w-4 h-4' />
                  </Button>
                </div>
                <div className='flex items-center'>
                  <Zap className='w-5 h-5 mr-2 text-muted-foreground' />
                  <span>Nostr Event ID: {nostrEvent.id.slice(0, 8)}...</span>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className='w-full'>
          <div className='flex flex-col gap-8'>
            <div className='flex items-end'>
              <div className='flex flex-col gap-4'>
                <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>{event.title}</h1>
                <div className='flex flex-col gap-2 text-white'>
                  <div className='flex items-center gap-2'>
                    <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
                      <Calendar className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm'>
                        {new Date(Number(event?.start) * 1000).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -
                        {new Date(Number(event?.end) * 1000).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        hs.
                      </span>
                      <span className='font-bold'>{new Date(Number(event?.start) * 1000).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
                      <MapPin className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start'>
                      <span className='font-bold'>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className=''>
              <CardHeader>
                <CardTitle>Buy tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {event?.tickets?.map((ticket: any, index: number) => {
                    const id = ticket.id;

                    return (
                      <div key={index} className='flex flex-col justify-between gap-2'>
                        <div className='flex gap-4 justify-between'>
                          <div>
                            <h3 className='font-semibold'>{ticket.title}</h3>
                            <p className='text-muted-foreground'>
                              {ticket.price} {ticket.token}
                            </p>
                          </div>
                          <div className='flex items-center space-x-2'>
                            {ticketCounts[id] > 0 && (
                              <>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  onClick={() => handleTicketChange(id, -1)}
                                  disabled={ticketCounts[id] === 0}
                                >
                                  <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-8 text-center'>{ticketCounts[id] || 0}</span>
                              </>
                            )}
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => handleTicketChange(id, 1)}
                              disabled={(ticketCounts[id] || 0) >= ticket.available}
                            >
                              <Plus className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                        <p className='text-sm text-muted-foreground'>{ticket.description}</p>
                      </div>
                    );
                  })}
                </div>
                <div className='mt-4'>
                  <Button className='w-full' size='lg' onClick={handleRegister} disabled={totalPrice === 0}>
                    Get entry
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className='flex flex-col gap-2'>
              <h2 className='text-white/70 text-sm font-bold'>About this event</h2>
              <p className='text-lg'>{event?.description}</p>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='flex flex-col items-center gap-8'>
          <div className='w-full flex flex-col gap-8'>
            <div className='flex gap-4 items-center'>
              <div className='relative overflow-hidden w-full max-w-[80px] max-h-[80px] aspect-square rounded-xl bg-red-500'>
                <Image src={event?.image as string} alt={event?.title as string} layout='fill' objectFit='cover' />
              </div>
              <div>
                <h3 className='text-white/70 text-sm font-bold'>Your Registration</h3>
                <p className='text-lg'>
                  <strong>{event?.title}</strong>
                </p>
              </div>
            </div>
            <div className='space-y-4'>
              {selectedTickets.map((ticket) => (
                <div key={ticket.id} className='flex justify-between'>
                  <span>
                    {ticket.count} x {ticket.title}
                  </span>
                  <span>
                    {ticket.count * ticket.price} {ticket.token}
                  </span>
                </div>
              ))}
              <div className='flex justify-between font-semibold'>
                <span>Total:</span>
                <span>{totalPrice} SAT</span>
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='email'>Email (optional)</Label>
                <Input id='email' type='email' placeholder='Your email' disabled />
              </div>
            </div>

            <div className='flex gap-4 py-4'>
              <Checkbox id='terms' />
              <div className='grid leading-none'>
                <label htmlFor='terms' className='text-sm font-medium text-white/70'>
                  Politicas de privacidad
                </label>
                <p className='mt-1 text-md'>Quiero que me avisen de nuevos eventos.</p>
              </div>
            </div>

            <Button className='w-full mt-4' size='lg' disabled>
              Confirm Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
