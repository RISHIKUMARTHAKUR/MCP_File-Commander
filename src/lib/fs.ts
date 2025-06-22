
'use server';

import fs from 'fs/promises';
import path from 'path';
import { FileSystemNode } from '@/types';

const BASE_DIR = path.resolve(process.cwd(), 'project-files');

const getValidatedFilePath = (relativePath: string): string => {
  const absolutePath = path.resolve(BASE_DIR, relativePath);
  if (!absolutePath.startsWith(BASE_DIR + path.sep) && absolutePath !== BASE_DIR) {
    throw new Error('Access denied: Path is outside the allowed directory.');
  }
  return absolutePath;
};

export const ensureBaseDir = async (): Promise<void> => {
  try {
    await fs.access(BASE_DIR);
  } catch {
    await fs.mkdir(BASE_DIR, { recursive: true });
    await fs.writeFile(
      path.join(BASE_DIR, 'welcome.txt'),
      'Welcome to File Commander! You can create, edit, and delete files here.'
    );
  }
};

export const listTree = async (dirPath: string = ''): Promise<FileSystemNode[]> => {
  await ensureBaseDir();
  const absolutePath = getValidatedFilePath(dirPath);
  const entries = await fs.readdir(absolutePath, { withFileTypes: true });
  const nodes: FileSystemNode[] = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name);
      const node: FileSystemNode = {
        name: entry.name,
        path: entryPath,
        type: entry.isDirectory() ? 'directory' : 'file',
      };
      if (entry.isDirectory()) {
        node.children = await listTree(entryPath);
      }
      return node;
    })
  );
  return nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });
};

export const readFileContent = async (relativePath: string): Promise<string> => {
  const absolutePath = getValidatedFilePath(relativePath);
  const stat = await fs.stat(absolutePath);
  if (stat.isDirectory()) {
    throw new Error('Cannot read content of a directory.');
  }
  return fs.readFile(absolutePath, 'utf-8');
};

export const createFile = async (relativePath: string, content: string | Buffer): Promise<void> => {
  const absolutePath = getValidatedFilePath(relativePath);
  const dir = path.dirname(absolutePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(absolutePath, content);
};

export const deleteNode = async (relativePath: string): Promise<void> => {
  const absolutePath = getValidatedFilePath(relativePath);
  const stat = await fs.stat(absolutePath);
  if (stat.isDirectory()) {
    await fs.rm(absolutePath, { recursive: true, force: true });
  } else {
    await fs.unlink(absolutePath);
  }
};
