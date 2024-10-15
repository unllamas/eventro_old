import { useProfile } from 'nostr-hooks';
import { Avatar } from '@/components/ui/avatar';

interface ComponentProps {
  pubkey: string;
}

export function OwnerList({ pubkey }: ComponentProps) {
  if (!pubkey) return null;

  const { profile } = useProfile({ pubkey });

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-white/70 text-sm font-bold'>Organizers</h2>
      <div className='flex items-center space-x-4'>
        <Avatar src={profile?.image} />
        <div className='flex-1'>
          <p className='font-bold'>{profile?.name || profile?.displayName}</p>
          <p className='text-white/70'>{pubkey?.slice(0, 8)}...</p>
        </div>
      </div>
    </div>
  );
}
