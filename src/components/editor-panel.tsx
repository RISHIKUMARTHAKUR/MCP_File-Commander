
'use client';

import { useState, useTransition, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FileSystemNode } from '@/types';
import * as actions from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Sparkles, Trash2, Folder, File } from 'lucide-react';

interface EditorPanelProps {
  node: FileSystemNode;
  initialContent: string | null;
  onDelete: (node: FileSystemNode) => void;
}

export function EditorPanel({ node, initialContent, onDelete }: EditorPanelProps) {
  const [content, setContent] = useState(initialContent);
  const [prompt, setPrompt] = useState('');
  const [isSaving, startSaveTransition] = useTransition();
  const [isSmartEditing, startSmartEditTransition] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, node.path]);

  const hasChanges = content !== initialContent;

  const handleSave = () => {
    if (!hasChanges || content === null) return;
    startSaveTransition(async () => {
      try {
        await actions.updateFile(node.path, content);
        toast({ title: 'Success', description: `"${node.name}" saved.` });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save file.' });
      }
    });
  };

  const handleSmartEdit = () => {
    if (content === null || !prompt.trim()) return;
    startSmartEditTransition(async () => {
      try {
        const result = await actions.smartEdit(node.name, content, prompt);
        setContent(result.suggestedContent);
        setPrompt('');
        toast({ title: 'AI Edit Applied', description: 'Review the changes and save.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Smart Edit Failed', description: (error as Error).message });
      }
    });
  };
  
  const NodeIcon = node.type === 'directory' ? Folder : File;

  if (node.type === 'directory') {
    return (
      <div className="p-6 flex flex-col h-full">
         <header className="flex items-center justify-between pb-4 border-b mb-4">
             <div className="flex items-center gap-2 truncate">
                 <NodeIcon className="h-5 w-5 text-primary" />
                 <span className="text-lg font-medium truncate">{node.name}</span>
             </div>
             <Button variant="outline" size="sm" onClick={() => onDelete(node)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete Folder
             </Button>
         </header>
         <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                  <Folder size={48} className="mx-auto mb-2" />
                  <p>This is a directory.</p>
                  <p className="text-sm">Select a file to view its content.</p>
              </div>
            </div>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="flex items-center justify-between pb-4 border-b mb-4">
        <div className="flex items-center gap-2 truncate">
          <NodeIcon className="h-5 w-5 text-primary" />
          <span className="text-lg font-medium truncate" title={node.path}>{node.path}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={!hasChanges || isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex-1 overflow-auto">
          {content === null ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full resize-none text-base font-mono"
              placeholder="File is empty."
            />
          )}
        </div>

        <div className="shrink-0 flex flex-col gap-2 pt-4 border-t">
          <label htmlFor="smart-edit-prompt" className="flex items-center gap-2 font-medium text-md">
            <Sparkles className="h-5 w-5 text-accent" />
            Smart Edit
          </label>
          <Textarea
            id="smart-edit-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Refactor this function to be async/await' or 'Fix any typos in this text'"
            className="w-full resize-none font-mono"
            rows={3}
            disabled={isSmartEditing || content === null}
          />
          <Button
            onClick={handleSmartEdit}
            disabled={!prompt.trim() || isSmartEditing || content === null}
            className="self-end"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isSmartEditing ? 'Applying AI Changes...' : 'Apply AI Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
