import { X, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Organizer } from '@/types/event';

interface OrganizersListProps {
  organizers: Organizer[];
  newOrganizer: string;
  onNewOrganizerChange: (value: string) => void;
  onAddOrganizer: () => void;
  onRemoveOrganizer: (index: number) => void;
}

export function OrganizersList({
  organizers,
  newOrganizer,
  onNewOrganizerChange,
  onAddOrganizer,
  onRemoveOrganizer,
}: OrganizersListProps) {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-white/70 text-sm font-bold'>Organizers</h2>
      {organizers.map((organizer, index) => (
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
            <Button size='icon' variant='ghost' onClick={() => onRemoveOrganizer(index)}>
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
      ))}
      <div className='flex gap-2 mt-2'>
        <Input
          value={newOrganizer}
          onChange={(e) => onNewOrganizerChange(e.target.value)}
          placeholder='Enter pubkey, npub, or NIP-05'
        />
        <Button size='lg' type='button' onClick={onAddOrganizer}>
          <Search className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
