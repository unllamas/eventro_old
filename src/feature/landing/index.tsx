'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';
import Link from 'next/link';

export function LandingFeature() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  return (
    <div className='flex justify-center items-center h-full min-h-screen'>
      <main className='flex flex-col gap-8 w-full max-w-[960px] h-full mx-auto px-4 py-8'>
        <div className='flex flex-col items-center gap-4 text-center max-w-2xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4'>
            Connect, Create, and Celebrate with Eventro
          </h1>
          <p className='text-xl md:text-2xl text-white/70'>
            Discover and organize decentralized events powered by Nostr. Your gateway to a world of exciting meetups,
            workshops, and gatherings.
          </p>
        </div>
      </main>
    </div>
  );
}
