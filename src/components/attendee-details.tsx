'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CheckCircle, MoreVertical, AlertTriangle } from 'lucide-react';

interface AttendeeCardProps {
  name: string;
  email: string;
  ticketTitle: string;
  quantity: number;
  registrationTime: string;
  inscriptionTime: string;
  chronology: {
    registered: { time: string; by: string };
    sent: { time: string; status: string };
    enrolled: { time: string };
  };
}

export default function AttendeeCard({
  name,
  email,
  ticketTitle,
  quantity,
  registrationTime,
  inscriptionTime,
  chronology,
}: AttendeeCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Card className='rounded-none border-none hover:bg-border cursor-pointer'>
          <CardContent className='flex items-center justify-between gap-8'>
            <div className='flex items-center gap-2'>
              <p>
                <strong>{name}</strong>
              </p>
              <p className='text-white/70'>{email}</p>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline'>{ticketTitle}</Badge>
              <span className='text-sm'>x{quantity}</span>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className=''>
        <SheetHeader>
          <SheetTitle className='text-white'>Attendee Details</SheetTitle>
        </SheetHeader>
        <div className='mt-6'>
          <div className='flex justify-between items-start mb-4'>
            <div className='flex items-center'>
              {/* <Avatar className='h-12 w-12 mr-3'>
                <AvatarImage src='/placeholder-avatar.png' alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar> */}
              <div>
                <h2 className='text-lg font-semibold'>{name}</h2>
                <p className='text-md text-white/70'>{email}</p>
              </div>
            </div>
            {/* <Button variant='outline' className='bg-green-700 hover:bg-green-600 text-white border-none'>
              Asistiré
            </Button> */}
          </div>

          <hr className='my-4' />

          <div className='flex justify-between'>
            <div>
              <p className='text-sm text-white/70'>Hora de registro</p>
              <p className='text-md'>{registrationTime}</p>
            </div>
            <div className='text-end'>
              <p className='text-sm text-white/70'>Hora de inscripción</p>
              <p className='text-md'>{inscriptionTime}</p>
            </div>
          </div>

          <hr className='my-4' />

          <div className='flex flex-col gap-4'>
            <h3 className='text-lg font-semibold mb-2'>Cronología</h3>
            <ul className='flex flex-col gap-2'>
              <li className='flex items-start'>
                <CheckCircle className='text-green-500 mr-2 mt-1' size={16} />
                <div>
                  <p className='font-medium'>Check-in</p>
                  <p className='text-sm text-gray-400'>
                    {chronology.registered.time} · {chronology.registered.by}
                  </p>
                </div>
              </li>
              <li className='flex items-start'>
                <CheckCircle className='text-green-500 mr-2 mt-1' size={16} />
                <div className='flex gap-2 justify-between w-full'>
                  <div className='flex flex-col'>
                    <p className='font-medium'>Ticket General x2</p>
                    <p className='text-sm text-gray-400'>
                      {chronology.sent.time} · {chronology.sent.status}
                    </p>
                  </div>
                  <Button variant='outline' size='icon'>
                    <MoreVertical size={16} className='text-gray-400' />
                  </Button>
                </div>
              </li>
              {/* <li className='flex items-start'>
                <CheckCircle className='text-green-500 mr-2 mt-1' size={16} />
                <div>
                  <p className='font-medium'>Inscrito</p>
                  <p className='text-sm text-gray-400'>{chronology.enrolled.time}</p>
                </div>
              </li> */}
            </ul>
          </div>

          <hr className='my-4' />

          <div className='flex justify-between text-sm'>
            <button className='text-red-500 flex items-center'>
              <AlertTriangle size={16} className='mr-1' />
              Denunciar invitado
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
