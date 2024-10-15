import { useMemo } from 'react';
import { useActiveUser, useProfile } from 'nostr-hooks';
import { Search } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrganizersListProps {
  newOrganizer: string;
  onNewOrganizerChange: (value: string) => void;
  onAddOrganizer: () => void;
  onRemoveOrganizer: (index: number) => void;
}

export function OrganizersList({
  newOrganizer,
  onNewOrganizerChange,
  onAddOrganizer,
  onRemoveOrganizer,
}: OrganizersListProps) {
  const { activeUser } = useActiveUser();

  const pubkey = useMemo(() => activeUser?.pubkey, [activeUser]);
  const { profile } = useProfile({ pubkey: pubkey });

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-white/70 text-sm font-bold'>Organizers</h2>
      <div className='flex items-center space-x-4'>
        <Avatar src={profile?.image} />
        <div className='flex-1'>
          <p className='font-bold'>{profile?.name}</p>
          <p className='text-white/70'>{activeUser?.pubkey?.slice(0, 8)}...</p>
        </div>
        {/* {index !== 0 && (
            <Button size='icon' variant='ghost' onClick={() => onRemoveOrganizer(index)}>
              <X className='h-4 w-4' />
            </Button>
          )} */}
      </div>
      <div className='flex gap-2 mt-2'>
        <Input
          value={newOrganizer}
          onChange={(e) => onNewOrganizerChange(e.target.value)}
          placeholder='Enter pubkey, npub, or NIP-05'
          disabled
        />
        <Button size='lg' type='button' onClick={onAddOrganizer} disabled>
          <Search className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
