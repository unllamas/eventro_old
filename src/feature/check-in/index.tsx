'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QrCode, ChevronLeft, Minus, Plus, Search } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { db } from '@/config/db';
import { QrScannerModal } from '@/components/qr-scanner-modal';
import { Input } from '@/components/ui/input';

export function CheckIn(props: { id: string }) {
  const { id } = props;
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);

  const { data, isLoading, error } = db.useQuery({
    tickets: {
      $: {
        where: {
          event_id: decodeURIComponent(id),
        },
      },
    },
    orders: {
      $: {
        where: {
          event_id: decodeURIComponent(id),
        },
      },
    },
  });

  if (!id || !data) return null;

  const { tickets, orders } = data;

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedAmount(1);
    setSelectedOrder(null);
  };

  const handleRegister = () => {
    // Implement registration logic here
    console.log('Registering:', selectedOrder);
    handleCloseModal();
  };

  return (
    <>
      <div className='w-full min-h-screen'>
        <div className='flex flex-col gap-4 w-full max-w-[960px] mx-auto px-4 py-8'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Button variant='secondary' size='icon' asChild>
                <Link href={`/event/manage/${decodeURIComponent(id)}`}>
                  <ChevronLeft className='h-4 w-4' />
                </Link>
              </Button>
              <div className='flex flex-col'>
                <h1 className='text-xl font-bold'>Test</h1>
                {/* <p className='text-white/70 text-sm'>Comenzó hace hace 3 días</p> */}
              </div>
            </div>
            <QrScannerModal />
            {/* <Button>
              <QrCode className='mr-2 h-4 w-4' /> Escanear
            </Button> */}
          </div>

          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <Input type='text' placeholder='Search' className='pl-10' value={''} onChange={(e) => null} />
          </div>

          <Tabs defaultValue='all'>
            <TabsList>
              <TabsTrigger value='all'>All the guests</TabsTrigger>
            </TabsList>

            <TabsContent value='all'>
              <AttendeeList tickets={tickets} orders={orders} onOrderClick={handleOrderClick} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <div>
                <p className='font-semibold'>{JSON.parse(selectedOrder?.content).name}</p>
                <p className='text-sm text-gray-500'>{JSON.parse(selectedOrder?.content).email}</p>
              </div>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='flex items-center justify-between w-full py-4'>
                <div className='flex gap-1'>
                  <p className='font-semibold'>{tickets.find((t: any) => t.id === selectedOrder.ticket_id)?.title}</p>
                  <p>x{selectedOrder?.quantity}</p>
                </div>

                <div className='flex items-center gap-2'>
                  {selectedAmount > 0 && (
                    <>
                      <Button
                        variant='secondary'
                        size='icon'
                        onClick={() => setSelectedAmount(selectedAmount - 1)}
                        disabled={selectedAmount <= 1}
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='w-8 text-center'>{selectedAmount}</span>
                    </>
                  )}
                  <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => setSelectedAmount(selectedAmount + 1)}
                    disabled={selectedAmount === selectedOrder?.quantity}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className='flex flex-col md:flex-row'>
              <Button className='flex-1' size='lg' variant='secondary' onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button className='flex-1' size='lg' onClick={handleRegister} disabled={selectedAmount === 0}>
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function AttendeeList({
  tickets,
  orders,
  onOrderClick,
}: {
  tickets: any;
  orders: any;
  onOrderClick: (order: any) => void;
}) {
  return (
    <Card>
      <CardContent className='p-0'>
        {orders?.map((order: any) => {
          const parse = JSON.parse(order?.content);
          const ticket = tickets?.filter((ticket: any) => ticket?.id === order?.ticket_id)[0];
          return (
            <Card
              key={order.id}
              className='rounded-none border-none hover:bg-border cursor-pointer'
              onClick={() => onOrderClick(order)}
            >
              <CardContent className='flex items-center justify-between gap-8'>
                <div className='flex items-center gap-2'>
                  <p>
                    <strong>{parse?.name}</strong>
                  </p>
                  <p className='text-white/70'>{parse?.email}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>{ticket?.title}</Badge>
                  <span className='text-sm'>x{order?.quantity}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
