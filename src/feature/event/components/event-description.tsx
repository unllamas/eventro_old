export function EventDescription({ description }: { description: string }) {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-white/70 text-sm font-bold'>About this event</h2>
      <p className='text-lg'>{description}</p>
    </div>
  );
}
