import { Calendar, MapPin } from 'lucide-react';

export function EventHeader({ event }: { event: any }) {
  return (
    <div className='flex items-end'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl md:text-5xl font-bold text-white mb-2'>{event.title}</h1>
        <div className='flex flex-col gap-2 text-white'>
          <div className='flex items-center gap-2'>
            <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
              <Calendar className='w-4 h-4' />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm'>
                {new Date(Number(event?.start) * 1000).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -
                {new Date(Number(event?.end) * 1000).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                hs.
              </span>
              <span className='font-bold'>{new Date(Number(event?.start) * 1000).toLocaleDateString()}</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex justify-center items-center w-12 h-12 border rounded-xl'>
              <MapPin className='w-4 h-4' />
            </div>
            <div className='flex flex-col items-start'>
              <span className='font-bold'>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
