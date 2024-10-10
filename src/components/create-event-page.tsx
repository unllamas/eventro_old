'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import Geohash from 'latlon-geohash';
import { MapPin, Plus, ArrowUp, ArrowDown, Trash2, Search, X } from 'lucide-react';
import { nip19 } from 'nostr-tools';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Organizer = {
  pubkey: string;
  name: string;
};

export function CreateEventPageComponent() {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    startDate: new Date(),
    startTime: '',
    endDate: new Date(),
    endTime: '',
    location: {
      description: '',
      lat: 0,
      lon: 0,
    },
    description: '',
    image: null as File | null,
    tickets: [] as { title: string; description: string; amount: number; token: string; quantity: number }[],
    relays: ['wss://relay1.example.com', 'wss://relay2.example.com'],
    tags: [] as string[],
    organizers: [{ pubkey: 'default_pubkey_hex', name: 'Default Organizer' }] as Organizer[],
  });

  const [newOrganizer, setNewOrganizer] = useState('');

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, type: 'start' | 'end') => {
    if (date) {
      setEventDetails((prev) => ({ ...prev, [`${type}Date`]: date }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventDetails((prev) => ({ ...prev, image: file }));
    }
  };

  const addTicket = () => {
    setEventDetails((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { title: '', description: '', amount: 0, token: 'SAT', quantity: 0 }],
    }));
  };

  const handleTicketChange = (index: number, field: string, value: string | number) => {
    const updatedTickets = [...eventDetails.tickets];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setEventDetails((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const moveTicket = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < eventDetails.tickets.length) {
      const updatedTickets = [...eventDetails.tickets];
      [updatedTickets[index], updatedTickets[newIndex]] = [updatedTickets[newIndex], updatedTickets[index]];
      setEventDetails((prev) => ({ ...prev, tickets: updatedTickets }));
    }
  };

  const deleteTicket = (index: number) => {
    const updatedTickets = eventDetails.tickets.filter((_, i) => i !== index);
    setEventDetails((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setEventDetails((prev) => ({ ...prev, tags }));
  };

  const addOrganizer = () => {
    let pubkey = newOrganizer;
    try {
      if (newOrganizer.startsWith('npub')) {
        pubkey = nip19.decode(newOrganizer).data as string;
      } else if (newOrganizer.includes('@')) {
        // This is a placeholder for NIP-05 resolution
        // In a real app, you would need to implement NIP-05 resolution here
        pubkey = 'resolved_pubkey_from_nip05';
      }
      // If it's not npub or NIP-05, assume it's already a hex pubkey
      const updatedOrganizers = [
        ...eventDetails.organizers,
        { pubkey, name: `Organizer ${eventDetails.organizers.length + 1}` },
      ];
      setEventDetails((prev) => ({ ...prev, organizers: updatedOrganizers }));
      setNewOrganizer('');
    } catch (error) {
      console.error('Invalid pubkey format', error);
      // Here you might want to show an error message to the user
    }
  };

  const removeOrganizer = (index: number) => {
    const updatedOrganizers = eventDetails.organizers.filter((_, i) => i !== index);
    setEventDetails((prev) => ({ ...prev, organizers: updatedOrganizers }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const createUnixTimestamp = (date: Date, timeString: string): number => {
      if (!timeString) return Math.floor(date.getTime() / 1000);
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      return Math.floor(newDate.getTime() / 1000);
    };

    const startTimestamp = createUnixTimestamp(eventDetails.startDate, eventDetails.startTime);
    const endTimestamp = createUnixTimestamp(eventDetails.endDate, eventDetails.endTime);

    const nostrEvent = {
      kind: 30023,
      pubkey: eventDetails.organizers[0].pubkey, // Use the first organizer as the main pubkey
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['d', uuidv4()],
        ['title', eventDetails.title],
        ['image', eventDetails.image ? URL.createObjectURL(eventDetails.image) : '', '256x256'],
        ['start', startTimestamp.toString()],
        ['end', endTimestamp.toString()],
        ['location', eventDetails.location.description],
        ['g', Geohash.encode(eventDetails.location.lat, eventDetails.location.lon)],
        ...eventDetails.tickets.map((ticket) => [
          'ticket',
          ticket.title,
          ticket.description,
          ticket.amount.toString(),
          ticket.token,
          ticket.quantity.toString(),
        ]),
        ...eventDetails.tags.map((tag) => ['t', tag]),
        ...eventDetails.organizers.map((organizer) => ['p', organizer.pubkey]),
        ['relays', ...eventDetails.relays],
      ],
      content: eventDetails.description,
    };

    console.log('Nostr Event to be published:', nostrEvent);
    // In a real application, you would sign and publish the event here
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
        <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-8 w-full'>
          <div className='flex flex-col w-full md:max-w-[320px] h-full gap-8'>
            <div className='relative overflow-hidden w-full h-full max-h-[320px] aspect-square rounded-xl bg-muted flex items-center justify-center cursor-pointer'>
              {eventDetails.image ? (
                <img
                  src={URL.createObjectURL(eventDetails.image)}
                  alt='Event Cover'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='text-center'>
                  <Plus className='h-12 w-12 mx-auto mb-2' />
                  <p>Click to upload event image</p>
                </div>
              )}
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='absolute inset-0 opacity-0 cursor-pointer'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <h2 className='text-white/70 text-sm font-bold'>Organizers</h2>
              {eventDetails.organizers.map((organizer, index) => (
                <div key={index} className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage src='/placeholder.svg?height=100&width=100' alt={organizer.name} />
                    <AvatarFallback>{organizer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <p className='font-bold'>{organizer.name}</p>
                    <p className='text-white/70'>{organizer.pubkey.slice(0, 8)}...</p>
                  </div>
                  {index !== 0 && (
                    <Button size='icon' variant='ghost' onClick={() => removeOrganizer(index)}>
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
              <div className='flex gap-2 mt-2'>
                <Input
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  placeholder='Enter pubkey, npub, or NIP-05'
                />
                <Button size='lg' type='button' onClick={addOrganizer}>
                  <Search className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          <div className='flex-1'>
            <div className='flex flex-col gap-8'>
              <Input name='title' value={eventDetails.title} onChange={handleEventChange} placeholder='Event Title' />

              <div className='flex flex-col gap-2 w-full text-white'>
                <div className='flex flex-col md:flex-row items-center gap-4'>
                  <div className='flex flex-col gap-2 w-full'>
                    <Label>Start Date</Label>
                    <div className='flex gap-2'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className='h-12' variant='outline'>
                            {format(eventDetails.startDate, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={eventDetails.startDate}
                            onSelect={(date) => handleDateChange(date, 'start')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type='time'
                        name='startTime'
                        value={eventDetails.startTime}
                        onChange={handleEventChange}
                        placeholder='Start Time'
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 w-full'>
                    <Label>End Date</Label>
                    <div className='flex gap-2'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className='h-12' variant='outline'>
                            {format(eventDetails.endDate, 'PPP')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={eventDetails.endDate}
                            onSelect={(date) => handleDateChange(date, 'end')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type='time'
                        name='endTime'
                        value={eventDetails.endTime}
                        onChange={handleEventChange}
                        placeholder='End Time'
                      />
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
                    <MapPin className='w-4 h-4' />
                  </div>
                  <Input
                    name='location'
                    value={eventDetails.location.description}
                    onChange={(e) =>
                      setEventDetails((prev) => ({
                        ...prev,
                        location: { ...prev.location, description: e.target.value },
                      }))
                    }
                    placeholder='Event Location'
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventDetails.tickets.length === 0 ? (
                    <div className='text-center'>
                      <p>No tickets added yet</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {eventDetails.tickets.map((ticket, index) => (
                        <div
                          key={index}
                          className='flex flex-col justify-between gap-2 p-4 border rounded-xl bg-white/5'
                        >
                          <Input
                            value={ticket.title}
                            onChange={(e) => handleTicketChange(index, 'title', e.target.value)}
                            placeholder='Ticket Title'
                          />
                          <Input
                            value={ticket.description}
                            onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
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
                                onChange={(e) => handleTicketChange(index, 'amount', parseFloat(e.target.value))}
                                placeholder='Price'
                              />
                              <Select
                                value={ticket.token}
                                onValueChange={(value) => handleTicketChange(index, 'token', value)}
                              >
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
                                onChange={(e) => handleTicketChange(index, 'quantity', parseInt(e.target.value))}
                                placeholder={ticket.quantity === 0 ? 'Unlimited' : `${ticket.quantity}`}
                              />
                            </div>
                          </div>
                          <div className='flex justify-between gap-4 mt-4'>
                            <div className='flex gap-2'>
                              <Button
                                size='icon'
                                variant='outline'
                                onClick={() => moveTicket(index, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUp className='h-4 w-4' />
                              </Button>
                              <Button
                                size='icon'
                                variant='outline'
                                onClick={() => moveTicket(index, 'down')}
                                disabled={index === eventDetails.tickets.length - 1}
                              >
                                <ArrowDown className='h-4 w-4' />
                              </Button>
                            </div>
                            <Button size='icon' variant='destructive' onClick={() => deleteTicket(index)}>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant='secondary' onClick={addTicket} className='w-full mt-4'>
                    Add Ticket
                  </Button>
                </CardContent>
              </Card>

              <div className='flex flex-col gap-2'>
                <h2 className='text-white/70 text-sm font-bold'>About this event</h2>
                <Textarea
                  name='description'
                  value={eventDetails.description}
                  onChange={handleEventChange}
                  placeholder='Event Description'
                  rows={6}
                />
              </div>

              <div className='flex flex-col gap-2'>
                <h2 className='text-white/70 text-sm font-bold'>Tags</h2>
                <Input
                  name='tags'
                  value={eventDetails.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder='Enter tags separated by commas'
                />
              </div>

              <Button type='submit' className='w-full' size='lg'>
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </main>

      <footer className='bg-muted py-8 mt-16'>
        <div className='container mx-auto px-4 text-center'>
          <p className='text-muted-foreground'>&copy; 2023 NostrEvents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
