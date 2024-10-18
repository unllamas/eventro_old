import Link from 'next/link';
import useSWR from 'swr';
import { ArrowUpRight, ScanLine } from 'lucide-react';

import fetcher from '@/lib/fetcher';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { TicketsTab } from './components/tickets-tab';
import { SettingsTab } from './components/settings-tab';
import { SalesTab } from './components/sales-tab';

export function ManageFeature(props: { id: string }) {
  const { id } = props;

  const { data: event, isLoading } = useSWR(`/api/event?id=${id}`, fetcher);

  return (
    <div className='min-h-screen bg-background'>
      <div className='flex flex-col items-start gap-8 w-full max-w-[960px] mx-auto px-4 py-8'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex flex-col items-start'>
            <h1 className='text-xl font-bold text-white'>{event?.title}</h1>
          </div>
          <div className='flex gap-2'>
            <Button asChild variant='outline'>
              <Link href={`/event/${decodeURIComponent(id)}`}>
                Event
                <ArrowUpRight className='w-5 h-w-5 ml-1' />
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/event/check-in/${decodeURIComponent(id)}`}>
                <ScanLine className='w-5 h-w-5 mr-1' />
                Register
              </Link>
            </Button>
          </div>
        </div>
        <Tabs defaultValue='tickets' className='w-full'>
          <TabsList className='mb-12'>
            <TabsTrigger value='tickets'>Tickets</TabsTrigger>
            <TabsTrigger value='sales'>Sales</TabsTrigger>
            <TabsTrigger value='settings'>Settings</TabsTrigger>
          </TabsList>
          <TabsContent value='tickets'>
            <TicketsTab id={id} />
          </TabsContent>
          <TabsContent value='sales'>
            <SalesTab id={id} />
          </TabsContent>
          <TabsContent value='settings'>
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
