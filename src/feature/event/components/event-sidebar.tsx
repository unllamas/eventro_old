import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { ExpandableImage } from './expandable-image';
import { OwnerList } from './owner-list';

export function EventSidebar({ event, id }: { event: any; id: string }) {
  return (
    <div className='flex flex-col w-full md:max-w-[320px] gap-8'>
      <ExpandableImage src={event?.image as string} alt={event?.title as string} title={event?.title as string} />

      <Card>
        <CardContent>
          <p className='text-center'>You have administrator access for this event.</p>
        </CardContent>
        <CardFooter>
          <Button className='w-full' asChild>
            <Link href={`/event/manage/${decodeURIComponent(id)}`}>Manage</Link>
          </Button>
        </CardFooter>
      </Card>

      <OwnerList pubkey={event.pubkey} />
    </div>
  );
}
