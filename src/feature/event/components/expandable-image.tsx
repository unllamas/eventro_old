'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableImageProps {
  src: string;
  alt: string;
  title: string;
}

export function ExpandableImage({ src, alt, title }: ExpandableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      <div
        className='relative overflow-hidden w-full max-h-[320px] aspect-square rounded-xl bg-background border cursor-pointer'
        onClick={toggleExpand}
        role='button'
        aria-expanded={isExpanded}
        aria-label={`Expand ${title} image`}
      >
        <Image className='object-cover' src={src} alt={alt} fill />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='z-50 fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-90'
            onClick={toggleExpand}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className='relative w-full h-full max-w-screen max-h-screen flex items-center justify-center'
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={src} alt={alt} className='object-contain max-w-full max-h-full' width={1280} height={720} />
              <button
                className='absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2'
                onClick={toggleExpand}
                aria-label='Close fullscreen image'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
