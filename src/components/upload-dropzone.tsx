
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onUpload: (formData: FormData) => void;
  isPending: boolean;
}

export function UploadDropzone({ onUpload, isPending }: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      onUpload(formData);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    // accept: { 'application/zip': ['.zip'] } // Can be enabled to restrict to zips
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
        'border-muted-foreground/50 hover:border-accent hover:bg-accent/10',
        isDragActive && 'border-accent bg-accent/10'
      )}
    >
      <input {...getInputProps()} />
      {isPending ? (
        <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
          {isDragActive ? (
            <p className="font-semibold text-accent">Drop here to upload</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-accent">Click to upload</span> or drag and drop
            </p>
          )}
           <p className="text-xs text-muted-foreground mt-1">Upload a file or a .zip archive</p>
        </div>
      )}
    </div>
  );
}
