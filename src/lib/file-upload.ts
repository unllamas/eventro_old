import { FileNostr } from '@/types/event';

export async function uploadFile(
  file: File,
): Promise<{ data: FileNostr; message: string; status: 'success' | 'error' }> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      data: {} as FileNostr,
      message: 'File upload failed',
      status: 'error',
    };
  }
}
