import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LocationInputProps {
  location: string;
  onLocationChange: (value: string) => void;
}

export function LocationInput({ location, onLocationChange }: LocationInputProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
        <MapPin className='w-4 h-4' />
      </div>
      <Input
        name='location'
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder='Event Location'
      />
    </div>
  );
}
