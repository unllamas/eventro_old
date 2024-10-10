'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';
import Link from 'next/link';

// Mock data for Nostr events
const mockEvents = [
  {
    id: 'event1',
    pubkey: 'npub1abc...',
    created_at: 1696868800,
    kind: 30023,
    tags: [
      ['d', 'Bitcoin Meetup Buenos Aires'],
      ['start', '2023-10-15T18:00:00Z'],
      ['end', '2023-10-15T21:00:00Z'],
      ['location', 'Buenos Aires, Argentina'],
      ['l', 'in-person'],
      ['t', 'event'],
      ['ticket', 'free'],
      ['capacity', 'unlimited'],
    ],
    content: 'Join us for an exciting Bitcoin meetup in Buenos Aires!',
  },
  {
    id: 'event2',
    pubkey: 'npub2xyz...',
    created_at: 1696955200,
    kind: 30023,
    tags: [
      ['d', 'Online Nostr Workshop'],
      ['start', '2023-10-20T15:00:00Z'],
      ['end', '2023-10-20T17:00:00Z'],
      ['location', 'https://zoom.us/j/123456789'],
      ['l', 'online'],
      ['t', 'event'],
      ['ticket', 'free'],
      ['capacity', '100'],
    ],
    content: 'Learn about Nostr in this interactive online workshop!',
  },
  // Add more mock events as needed
];

export function HomePageComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.tags
        .find((tag) => tag[0] === 'd')?.[1]
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || event.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.tags.find((tag) => tag[0] === 'l')?.[1] === filterType;
    return matchesSearch && matchesFilter;
  });

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

      <main className='flex flex-col gap-8 w-full max-w-[960px] mx-auto px-4 py-8'>
        <div className='mb-8 flex flex-col md:flex-row gap-4'>
          <div className='flex-grow'>
            <div className='relative object-contain'>
              <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search events...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Events</SelectItem>
              <SelectItem value='in-person'>In-person</SelectItem>
              <SelectItem value='online'>Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredEvents.map((event) => {
            const title = event.tags.find((tag) => tag[0] === 'd')?.[1] || 'Untitled Event';
            const startDate = new Date(event.tags.find((tag) => tag[0] === 'start')?.[1] || '');
            const location = event.tags.find((tag) => tag[0] === 'location')?.[1] || 'TBA';
            const locationType = event.tags.find((tag) => tag[0] === 'l')?.[1] || 'in-person';
            const capacity = event.tags.find((tag) => tag[0] === 'capacity')?.[1] || 'unlimited';

            return (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{event.content}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center'>
                      <Calendar className='mr-2 h-4 w-4' />
                      <span>{startDate.toLocaleDateString()}</span>
                    </div>
                    <div className='flex items-center'>
                      <Clock className='mr-2 h-4 w-4' />
                      <span>{startDate.toLocaleTimeString()}</span>
                    </div>
                    <div className='flex items-center'>
                      <MapPin className='mr-2 h-4 w-4' />
                      <span>{locationType === 'online' ? 'Online Event' : location}</span>
                    </div>
                    <div className='flex items-center'>
                      <Users className='mr-2 h-4 w-4' />
                      <span>{capacity === 'unlimited' ? 'Unlimited capacity' : `${capacity} spots`}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className='w-full'>
                    <Link href={`/event`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
