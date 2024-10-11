'use client';

import { Plus } from 'lucide-react';
import { FileNostr } from '@/types/event';

interface ImageUploaderProps {
  imageUrl: FileNostr | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploader({ imageUrl, onImageUpload }: ImageUploaderProps) {
  return (
    <div className='relative overflow-hidden w-full h-full max-h-[320px] aspect-square rounded-xl bg-muted flex items-center justify-center cursor-pointer'>
      {imageUrl && <img src={imageUrl.url} alt={imageUrl.fileName} className='w-full h-full object-cover' />}
      <div className='absolute text-center'>
        <Plus className='h-12 w-12 mx-auto mb-2' />
        <p>Click to upload event image</p>
      </div>
      <input
        type='file'
        accept='image/*'
        onChange={onImageUpload}
        className='absolute inset-0 opacity-0 cursor-pointer'
      />
    </div>
  );
}
