import { Input } from '@/components/ui/input';

interface TagsInputProps {
  tags: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TagsInput({ tags, onChange }: TagsInputProps) {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-white/70 text-sm font-bold'>Tags</h2>
      <Input name='tags' value={tags} onChange={onChange} placeholder='Enter tags separated by commas' />
    </div>
  );
}
