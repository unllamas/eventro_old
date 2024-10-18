import { useState } from 'react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { addTicket } from '@/lib/db';

export function NewTicketDialog(props: { id: string }) {
  const { id } = props;

  // Data
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('sat');
  const [quantity, setQuantity] = useState<number | null>(null);

  const handleSubmit = () => {
    const data = {
      event_id: decodeURIComponent(id),
      title,
      description,
      amount,
      currency,
      quantity,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    addTicket(data);

    // Reset functions
    setTitle(null);
    setDescription(null);
    setAmount(null);
    setCurrency('sat');
    setQuantity(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary'>
          <PlusIcon className='w-4 h-4 mr-1' /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva entrada</DialogTitle>
          <DialogDescription>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</DialogDescription>
        </DialogHeader>

        <div className='grid flex-1 gap-2'>
          <Label htmlFor='title'>Ticket title</Label>
          <Input
            id='title'
            placeholder='Ej. Early Birds'
            defaultValue={title as string}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* <div>
        <Button size='sm' variant='link'>
          Add description
        </Button>
      </div> */}
        <div className='grid flex-1 gap-2'>
          <Label htmlFor='description'>Ticket description</Label>
          <Textarea
            id='description'
            defaultValue={description as string}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* <div>
        <Button size='sm' variant='link'>
          Add limit
        </Button>
      </div> */}
        <div className='flex gap-4 items-center'>
          <div className='flex flex-col w-full'>
            <p className='text-sm'>Price</p>
          </div>
          <div className='flex gap-2'>
            <Input
              className='w-28 max-w-28 text-right'
              type='number'
              defaultValue={amount as number}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={'Free'}
            />
            <Select value={currency as string} onValueChange={(value) => setCurrency(value)} disabled>
              <SelectTrigger>
                <SelectValue placeholder='Token' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='sat'>SAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='flex gap-4 items-center'>
          <div className='flex flex-col w-full'>
            <p className='text-sm'>Quantity</p>
          </div>
          <div className='flex gap-2'>
            <Input
              className='max-w-40 text-right'
              type='number'
              defaultValue={quantity as number}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder={'∞'}
            />
          </div>
        </div>
        <DialogFooter className='flex flex-col'>
          <div className='flex flex-col w-full gap-2'>
            <Button size='lg' onClick={handleSubmit}>
              Create ticket
            </Button>
            <DialogClose asChild>
              <Button type='button' size='lg' variant='ghost'>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
