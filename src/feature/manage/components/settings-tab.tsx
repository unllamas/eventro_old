import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SettingsTab() {
  return (
    <div className='flex flex-col gap-8 w-full'>
      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col'>
          <h3 className='text-xl font-bold'>Organizers</h3>
          <p className='text-md'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, sed.</p>
        </div>
        <Button size='sm' variant='secondary'>
          <PlusIcon className='w-4 h-4 mr-1' /> Add
        </Button>
      </div>
      <div className='overflow-hidden flex flex-col rounded-md border'>
        <Card className='rounded-none border-none py-4'>
          <CardContent className='flex items-center justify-between gap-8'>
            <div className='flex items-center gap-4'>
              <p>
                <strong>Jona</strong>
              </p>
              <p>npub123123....</p>
              <div>
                <Badge variant='outline'>Owner</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
