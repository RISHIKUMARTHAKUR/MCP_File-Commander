
'use server';

import * as fs from '@/lib/fs';
import { smartEdit as smartEditFlow } from '@/ai/flows/smart-edit';
import { revalidatePath } from 'next/cache';

export async function listFiles() {
  return fs.listTree();
}

export async function readFile(path: string) {
  return fs.readFileContent(path);
}

export async function createFile(path: string, content: string) {
  await fs.createFile(path, content);
  revalidatePath('/');
}

export async function updateFile(path: string, content: string) {
  await fs.createFile(path, content);
  revalidatePath('/');
}

export async function deleteFile(path: string) {
  await fs.deleteNode(path);
  revalidatePath('/');
}

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file) {
    throw new Error('No file provided.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.createFile(file.name, buffer);

  // Note: Unzipping functionality requires a library like 'unzipper' or 'adm-zip'.
  // This feature is not implemented due to package installation constraints.
  // To enable unzipping, install a library and add the extraction logic here.

  revalidatePath('/');
}

export async function smartEdit(filename: string, content: string, prompt: string) {
  try {
    const result = await smartEditFlow({ filename, content, prompt });
    return result;
  } catch (error) {
    console.error('Smart Edit failed:', error);
    throw new Error('Failed to get AI suggestions. Please try again.');
  }
}
