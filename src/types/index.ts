export type FileSystemNode = {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileSystemNode[];
};
