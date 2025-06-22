
'use client';

import { Button } from '@/components/ui/button';
import { FilePlus2 } from 'lucide-react';

interface ToolbarProps {
  onNewFile: () => void;
}

export function Toolbar({ onNewFile }: ToolbarProps) {
  return (
    <div className="p-2 border-b">
      <Button onClick={onNewFile} className="w-full" variant="outline">
        <FilePlus2 className="mr-2 h-4 w-4" />
        New File
      </Button>
    </div>
  );
}
