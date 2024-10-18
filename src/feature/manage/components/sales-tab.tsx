import { Card, CardContent } from '@/components/ui/card';
import AttendeeCard from '@/components/attendee-details';

import { db } from '@/config/db';

export function SalesTab(props: { id: string }) {
  const { data } = db.useQuery({
    tickets: {
      $: {
        where: {
          event_id: decodeURIComponent(props.id),
        },
      },
    },
    orders: {
      $: {
        where: {
          event_id: decodeURIComponent(props.id),
        },
      },
    },
  });

  if (!data) return null;

  const { orders, tickets } = data;

  return (
    <div className='flex flex-col gap-8 w-full'>
      <div className='flex justify-between items-end w-full'>
        <div className='flex flex-col'>
          <h3 className='text-xl font-bold'>Sales</h3>
          <p>
            <span className='font-bold text-lg'>{orders.length}</span> <span className='text-md'>tickets sold</span>
          </p>
        </div>
      </div>
      {/* <Progress value={orders.length} max={100} /> */}
      <hr />
      <div className='flex justify-between gap-4'>
        <h3 className='text-xl font-bold'>Lista de invitados</h3>
      </div>
      <div className='overflow-hidden flex flex-col rounded-md border'>
        {!orders || orders.length === 0 ? (
          <Card className='border-dashed'>
            <CardContent className='py-12 text-center'>
              <p>
                <strong>Aún no hay invitados</strong>
              </p>
              <p className='text-white/70'>¡Comparte el evento o invita a personas para comenzar!</p>
            </CardContent>
          </Card>
        ) : (
          orders?.map((order) => {
            const ticket = tickets?.filter((ticket) => ticket?.id === order?.ticket_id)[0];
            const parse = JSON.parse(order?.content);

            return (
              <>
                <AttendeeCard
                  name={parse?.name}
                  email={parse?.email}
                  ticketTitle={ticket?.title}
                  quantity={order?.quantity}
                  registrationTime='16 oct, 18:21'
                  inscriptionTime='16 oct, 12:23'
                  chronology={{
                    registered: { time: '16 oct, 18:21', by: 'Check-in' },
                    sent: { time: '16 oct, 12:23', status: 'Pagado' },
                    enrolled: { time: '16 oct, 12:23' },
                  }}
                />
              </>
            );
          })
        )}
      </div>
    </div>
  );
}
