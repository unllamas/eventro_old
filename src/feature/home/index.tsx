'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActiveUser, useSubscribe } from 'nostr-hooks';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import useSWR from 'swr';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import fetcher from '@/lib/fetcher';

export function HomeFeature() {
  // const { activeUser } = useActiveUser();

  const { data: events, isLoading } = useSWR(`/api/events`, fetcher);

  return (
    <div className='min-h-screen bg-background'>
      <main className='flex flex-col gap-8 w-full max-w-[520px] mx-auto px-4 py-8'>
        {/* <div className='mb-8 flex flex-col md:flex-row gap-4'>
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
        </div> */}

        <div className='flex flex-col gap-8'>
          {events?.length > 0 &&
            events?.map((event: any) => {
              if (!event) return null;

              const id = event?.tags.find((tag: any) => tag[0] === 'd')?.[1];
              const title = event?.tags.find((tag: any) => tag[0] === 'title')?.[1] || 'Untitled Event';
              const start = event?.tags.find((tag: any) => tag[0] === 'start')?.[1];
              const location = event?.tags.find((tag: any) => tag[0] === 'location')?.[1] || 'TBA';
              const image = event?.tags.find((tag: any) => tag[0] === 'image')?.[1];

              return (
                <Link key={id} href={`/event/${event?.id}`}>
                  <Card>
                    <CardContent>
                      <div className='flex gap-4 items-center'>
                        <div className='relative overflow-hidden w-full max-w-[80px] max-h-[80px] aspect-square rounded-xl bg-[#333]'>
                          <Image src={image as string} alt={title} layout='fill' objectFit='cover' />
                        </div>
                        <div>
                          <h3 className='text-xl font-bold'>{title}</h3>
                          <div className='flex gap-2 text-white/70 text-sm'>
                            <p className=''>
                              <span className='mr-2'>{new Date(Number(start) * 1000).toLocaleDateString()}</span>
                              <span>
                                {new Date(Number(start) * 1000).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                hs.
                              </span>
                            </p>
                            <p>·</p>
                            <p className='overflow-hidden whitespace-nowrap w-full max-w-[160px] truncate'>
                              {location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}
