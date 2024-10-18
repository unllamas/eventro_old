'use client';

import React, { useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { QrReader } from 'react-qr-reader';

import { Button } from '@/components/ui/button';

export function QrScannerModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleScan = useCallback((result: any) => {
    if (result?.text) {
      setScannedResult(result?.text);
      setIsModalOpen(false);
    }
  }, []);

  const handleError = (error: Error) => {
    console.error(error);
    // You might want to show an error message to the user here
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Close modal when clicking outside of the QR reader
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    <div>
      <Button onClick={openModal}>Scan QR Code</Button>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-background' onClick={handleModalClick}>
          <div ref={modalRef} className='p-4 rounded-lg w-full max-w-lg'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Scan QR Code</h2>
              <Button variant='ghost' size='icon' onClick={closeModal}>
                <X className='h-6 w-6' />
              </Button>
            </div>
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              containerStyle={{ width: '100%' }}
              videoStyle={{ width: '100%' }}
            />
          </div>
        </div>
      )}

      {/* {scannedResult && (
        <div className='mt-4 p-4 bg-green-100 rounded-lg'>
          <h3 className='font-bold text-green-800'>Scanned Result:</h3>
          <p className='text-green-700'>{scannedResult}</p>
        </div>
      )} */}
    </div>
  );
}
