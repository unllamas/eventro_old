import { Textarea } from '@/components/ui/textarea';

interface EventDescriptionProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function EventDescription({ description, onChange }: EventDescriptionProps) {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-white/70 text-sm font-bold'>About this event</h2>
      <Textarea name='description' value={description} onChange={onChange} placeholder='Event Description' rows={6} />
    </div>
  );
}
