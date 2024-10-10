'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Minus, Plus, Share2, Users, Zap } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export function EventFeature() {
  const [ticketCounts, setTicketCounts] = useState({
    VIP: 0,
    General: 0,
    'Early Bird': 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Updated Nostr event structure
  const nostrEvent = {
    id: 'event-id-1234567890abcdef',
    pubkey: 'npub1organizerpubkeyexample',
    created_at: 1696868800,
    kind: 30023,
    tags: [
      ['d', 'Bitcoin Meetup Buenos Aires'],
      ['p', 'npub1organizerpubkeyexample'],
      [
        'tickets',
        ['VIP', 'Exclusive access', '50000', 'SAT', '50'],
        ['General', 'Standard access', '20000', 'SAT', '100'],
        ['Early Bird', 'Discounted access', '15000', 'SAT', '20'],
      ],
      ['location', '-34.564752321926456', '-58.44321327646751'],
    ],
    content: 'Bitcoin Meetup Buenos Aires: Join us for an exclusive meetup with talks and networking.',
    sig: 'signatureofthiseventbyorganizerprivkey',
  };

  const eventDetails = {
    title: nostrEvent.tags.find((tag) => tag[0] === 'd')?.[1] || 'Untitled Event',
    date: new Date(nostrEvent.created_at * 1000).toLocaleDateString(),
    time: new Date(nostrEvent.created_at * 1000).toLocaleTimeString(),
    location: 'Buenos Aires, Argentina', // Assuming location based on the title
    latitude: nostrEvent.tags.find((tag) => tag[0] === 'location')?.[1],
    longitude: nostrEvent.tags.find((tag) => tag[0] === 'location')?.[2],
    description: nostrEvent.content,
    attendees: 42, // Example number, as the event structure doesn't specify an attendee count
    coverImage: '/placeholder.svg?height=400&width=800', // Using a placeholder as the event doesn't include an image
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.74844797932818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1628614993851!5m2!1sen!2sus',
    organizers: [
      {
        name: 'Event Organizer',
        role: 'Bitcoin Enthusiast',
        avatar: '/placeholder.svg?height=100&width=100',
      },
    ],
    tickets:
      nostrEvent.tags
        .find((tag) => tag[0] === 'tickets')
        ?.slice(1)
        .map((ticket) => ({
          id: ticket[0],
          title: ticket[0],
          description: ticket[1],
          price: parseInt(ticket[2]),
          token: ticket[3],
          available: parseInt(ticket[4]),
        })) || [],
  };

  const handleTicketChange = (ticketId: string, change: number) => {
    setTicketCounts((prev) => ({
      ...prev,
      [ticketId]: Math.max(
        0,
        Math.min(
          (prev[ticketId as keyof typeof prev] || 0) + change,
          eventDetails.tickets.find((t) => t.id === ticketId)?.available || 0,
        ),
      ),
    }));
  };

  const totalPrice = eventDetails.tickets.reduce(
    (sum, ticket) => sum + (ticketCounts[ticket.id as keyof typeof ticketCounts] || 0) * ticket.price,
    0,
  );

  const handleRegister = () => {
    setIsModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-primary'>NostrEvents</h1>
          <nav className='hidden md:flex space-x-4'>
            <a href='/' className='text-muted-foreground hover:text-primary'>
              Home
            </a>
            <a href='/create' className='text-muted-foreground hover:text-primary'>
              Create
            </a>
          </nav>
        </div>
      </header>

      <main className='flex flex-col md:flex-row gap-8 w-full max-w-[960px] mx-auto px-4 py-8'>
        <div className='flex flex-col w-full md:max-w-[320px] gap-8'>
          <div className='relative overflow-hidden w-full max-h-[320px] aspect-square rounded-xl bg-red-500'>
            <Image src={eventDetails.coverImage} alt={eventDetails.title as string} fill />
          </div>

          <div className='flex flex-col gap-2'>
            <h2 className='text-white/70 text-sm font-bold'>Organizado por</h2>
            <div className=''>
              {eventDetails.organizers.map((organizer, index) => (
                <div key={index} className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage src={organizer.avatar} alt={organizer.name} />
                    <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-bold'>{organizer.name}</p>
                    <p className='text-white/70'>{organizer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Users className='w-5 h-5 mr-2 text-muted-foreground' />
                    <span>{eventDetails.attendees} attendees</span>
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
          </Card>
        </div>

        <div className=''>
          <div className='flex flex-col gap-8'>
            <div className='flex items-end'>
              <div className='flex flex-col gap-4'>
                <h1 className='text-5xl font-bold text-white mb-2'>{eventDetails.title}</h1>
                <div className='flex flex-col gap-2 text-white'>
                  <div className='flex items-center gap-2'>
                    <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
                      <Calendar className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold'>{'Sabado, 2 Noviembre'}</span>
                      <span className='text-sm'>{'21 - 23hs'}</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
                      <MapPin className='w-4 h-4' />
                    </div>
                    <div className='flex flex-col items-start'>
                      <span className='font-bold'>{eventDetails.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='flex items-start space-x-2 mb-6'>
              <MapPin className='w-5 h-5 text-muted-foreground shrink-0 mt-1' />
              <span>{eventDetails.location}</span>
            </div> */}

            <Card className=''>
              <CardHeader>
                <CardTitle>Buy tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {eventDetails.tickets.map((ticket) => (
                    <div key={ticket.id} className='flex flex-col justify-between gap-2'>
                      <div className='flex gap-4 justify-between'>
                        <div>
                          <h3 className='font-semibold'>{ticket.title}</h3>
                          <p className='text-muted-foreground'>
                            {ticket.price} {ticket.token}
                          </p>
                        </div>
                        <div className='flex items-center space-x-2'>
                          {ticketCounts[ticket.id as keyof typeof ticketCounts] !== 0 && (
                            <>
                              <Button
                                variant='outline'
                                size='icon'
                                onClick={() => handleTicketChange(ticket.id, -1)}
                                disabled={ticketCounts[ticket.id as keyof typeof ticketCounts] === 0}
                              >
                                <Minus className='h-4 w-4' />
                              </Button>
                              <span className='w-8 text-center'>
                                {ticketCounts[ticket.id as keyof typeof ticketCounts] || 0}
                              </span>
                            </>
                          )}
                          <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handleTicketChange(ticket.id, 1)}
                            disabled={(ticketCounts[ticket.id as keyof typeof ticketCounts] || 0) >= ticket.available}
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                      <p className='text-sm text-muted-foreground'>{ticket.description}</p>
                    </div>
                  ))}
                </div>
                <div className='mt-4'>
                  <Button className='w-full' size='lg' onClick={handleRegister} disabled={totalPrice === 0}>
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className='flex flex-col gap-2'>
              <h2 className='text-white/70 text-sm font-bold'>About this event</h2>
              <p className='text-lg'>{eventDetails.description}</p>
            </div>

            <div className='flex flex-col gap-2'>
              <h2 className='text-white/70 text-sm font-bold'>Location</h2>
              <div className=' overflow-hidden aspect-video rounded-xl'>
                <iframe
                  src={`https://maps.google.com/maps?q=${eventDetails.latitude},${eventDetails.longitude}&hl=es;z=14&amp;output=embed`}
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                ></iframe>
              </div>
              <a
                href={`https://maps.google.com/maps?q=${eventDetails.latitude},${eventDetails.longitude}&hl=es;z=14&amp;output=embed`}
                target='_blank'
              >
                See map bigger
              </a>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='flex flex-col items-center gap-8'>
          <div className='w-full flex flex-col gap-8'>
            <div className='flex gap-4 items-center'>
              <div className='relative overflow-hidden w-full max-w-[80px] max-h-[80px] aspect-square rounded-xl bg-red-500'>
                <Image
                  src={eventDetails.coverImage}
                  alt={eventDetails.title as string}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <div>
                <h3 className='text-white/70 text-sm font-bold'>Your Registration</h3>
                <p className='text-lg'>
                  <strong>{eventDetails.title}</strong>
                </p>
              </div>
            </div>
            <div className='space-y-4'>
              {eventDetails.tickets.map(
                (ticket) =>
                  (ticketCounts[ticket.id as keyof typeof ticketCounts] || 0) > 0 && (
                    <div key={ticket.id} className='flex justify-between'>
                      <span>
                        {ticketCounts[ticket.id as keyof typeof ticketCounts]} x {ticket.title}
                      </span>
                      <span>
                        {(ticketCounts[ticket.id as keyof typeof ticketCounts] || 0) * ticket.price} {ticket.token}
                      </span>
                    </div>
                  ),
              )}
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
                <Input id='email' type='email' placeholder='Your email' />
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

            <Button className='w-full mt-4' size='lg'>
              Confirm Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className='bg-muted py-8 mt-16'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-muted-foreground'>&copy; 2023 NostrEvents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
