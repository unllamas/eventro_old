// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import axios from 'axios';
import FormData from 'form-data';

// NIP-94: File Metadata
function generateFileMetadata(file: any) {
  return {
    m: file.mime,
    x: file.size,
    dim: file.dimensions ? `${file.dimensions.width}x${file.dimensions.height}` : undefined,
  };
}

// NIP-96: File Storage
async function uploadToNostrBuild(file: Buffer, fileName: string) {
  const form = new FormData();
  form.append('file', file, fileName);

  try {
    const response = await axios.post('https://nostr.build/api/v2/upload/files', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading to nostr.build:', error);
    throw new Error('Failed to upload file to nostr.build');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ status: 'error', message: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file temporarily
    const tempPath = join('/tmp', file.name);
    await writeFile(tempPath, buffer);

    const uploadResult = await uploadToNostrBuild(buffer, file.name);

    if (uploadResult.status !== 'success') {
      throw new Error('Upload to nostr.build failed');
    }

    const fileData = uploadResult.data[0];

    // Generate SHA-256 hash of the file
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

    // Prepare the response
    const response = {
      status: 'success',
      message: 'File uploaded successfully',
      data: {
        fileName: fileData.name,
        url: fileData.url,
        thumbnail: fileData.thumbnail,
        blurhash: fileData.blurhash,
        sha256: sha256,
        type: fileData.type,
        mime: fileData.mime,
        size: fileData.size,
        metadata: generateFileMetadata(fileData),
        dimensions: fileData.dimensions,
        responsive: fileData.responsive,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to process upload' }, { status: 500 });
  }
}
