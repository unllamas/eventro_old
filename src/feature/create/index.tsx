'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import Geohash from 'latlon-geohash';
import { nip19 } from 'nostr-tools';
import { useNewEvent, useActiveUser } from 'nostr-hooks';

import { RELAYS } from '@/lib/nostr';
import { uploadFile } from '@/lib/file-upload';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ImageUploader } from './components/image-uploader';
import { EventDateTimePicker } from './components/event-date-time-picker';
import { EventDescription } from './components/event-description';
import { LocationInput } from './components/location-input';
import { OrganizersList } from './components/organizers-list';
import { TagsInput } from './components/tags-input';
import { TicketManager } from './components/ticket-manager';

import { EventDetails, Organizer, Ticket, FileNostr } from '@/types/event';

export function CreateFeature() {
  const [imageUrl, setImageUrl] = useState<FileNostr | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
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
    tickets: [],
    relays: RELAYS,
    tags: [],
    organizers: [{ pubkey: '', name: 'Owner' }],
  });

  const [newOrganizer, setNewOrganizer] = useState('');
  const router = useRouter();
  const { createNewEvent } = useNewEvent();
  const { activeUser } = useActiveUser();

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, type: 'start' | 'end') => {
    if (date) {
      setEventDetails((prev) => ({ ...prev, [`${type}Date`]: date }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await uploadFile(file);
      if (res.status === 'success') {
        setImageUrl(res.data);
      } else {
        console.error('Image upload failed:', res.message);
      }
    }
  };

  const handleTicketChange = (index: number, field: keyof Ticket, value: string | number) => {
    setEventDetails((prev) => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => (i === index ? { ...ticket, [field]: value } : ticket)),
    }));
  };

  const addTicket = () => {
    setEventDetails((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { title: '', description: '', amount: 0, token: 'SAT', quantity: 0 }],
    }));
  };

  const moveTicket = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < eventDetails.tickets.length) {
      setEventDetails((prev) => {
        const updatedTickets = [...prev.tickets];
        [updatedTickets[index], updatedTickets[newIndex]] = [updatedTickets[newIndex], updatedTickets[index]];
        return { ...prev, tickets: updatedTickets };
      });
    }
  };

  const deleteTicket = (index: number) => {
    setEventDetails((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));
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
        // TODO: Implement NIP-05 resolution
        pubkey = 'resolved_pubkey_from_nip05';
      }
      setEventDetails((prev) => ({
        ...prev,
        organizers: [...prev.organizers, { pubkey, name: `Organizer ${prev.organizers.length + 1}` }],
      }));
      setNewOrganizer('');
    } catch (error) {
      console.error('Invalid pubkey format', error);
    }
  };

  const removeOrganizer = (index: number) => {
    setEventDetails((prev) => ({
      ...prev,
      organizers: prev.organizers.filter((_, i) => i !== index),
    }));
  };

  const createUnixTimestamp = (date: Date, timeString: string): number => {
    if (!timeString) return Math.floor(date.getTime() / 1000);
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return Math.floor(newDate.getTime() / 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // TO-DO
    return null;

    e.preventDefault();
    const event = createNewEvent();
    const startTimestamp = createUnixTimestamp(eventDetails.startDate, eventDetails.startTime);
    const endTimestamp = createUnixTimestamp(eventDetails.endDate, eventDetails.endTime);
    const UUID = uuidv4();

    event.content = eventDetails.description;
    event.kind = 30023;
    event.tags = [
      ['d', UUID],
      ['title', eventDetails.title],
      ['image', imageUrl?.responsive['240p'] as string, '428x426'],
      ['start', startTimestamp.toString()],
      ['end', endTimestamp.toString()],
      ['location', eventDetails.location.description],
      ['g', Geohash.encode(eventDetails.location.lat, eventDetails.location.lon)],
      ...eventDetails.tickets.map((ticket) => [
        'ticket',
        ticket.title,
        ticket.description,
        ticket.token,
        ticket.amount.toString(),
        ticket.quantity.toString(),
      ]),
      ...eventDetails.tags.map((tag) => ['t', tag]),
      ...eventDetails.organizers.map((organizer) => organizer && ['p', activeUser?.pubkey as string]),
      ['relays', ...eventDetails.relays],
    ];

    try {
      await event.publish();
      router.push(`/event/${UUID}`);
    } catch (err) {
      console.error('Failed to publish event:', err);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <main className='flex flex-col md:flex-row gap-8 w-full max-w-[960px] mx-auto px-4 py-8'>
        <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-8 w-full'>
          <div className='flex flex-col w-full md:max-w-[320px] h-full gap-8'>
            <ImageUploader imageUrl={imageUrl} onImageUpload={handleImageUpload} />
            <OrganizersList
              newOrganizer={newOrganizer}
              onNewOrganizerChange={setNewOrganizer}
              onAddOrganizer={addOrganizer}
              onRemoveOrganizer={removeOrganizer}
            />
          </div>

          <div className='flex-1'>
            <div className='flex flex-col gap-8'>
              <Input name='title' value={eventDetails.title} onChange={handleEventChange} placeholder='Event Title' />
              <EventDateTimePicker
                startDate={eventDetails.startDate}
                startTime={eventDetails.startTime}
                endDate={eventDetails.endDate}
                endTime={eventDetails.endTime}
                onDateChange={handleDateChange}
                onTimeChange={handleEventChange}
              />
              <LocationInput
                location={eventDetails.location.description}
                onLocationChange={(value) =>
                  setEventDetails((prev) => ({
                    ...prev,
                    location: { ...prev.location, description: value },
                  }))
                }
              />
              <TicketManager
                tickets={eventDetails.tickets}
                onAddTicket={addTicket}
                onTicketChange={handleTicketChange}
                onMoveTicket={moveTicket}
                onDeleteTicket={deleteTicket}
              />
              <EventDescription description={eventDetails.description} onChange={handleEventChange} />
              <TagsInput tags={eventDetails.tags.join(', ')} onChange={handleTagsChange} />
              <Button type='submit' className='w-full' size='lg' disabled>
                Create Event
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
