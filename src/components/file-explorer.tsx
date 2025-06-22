
'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useToast } from "@/hooks/use-toast";
import { FileSystemNode } from '@/types';
import * as actions from '@/app/actions';
import { Toolbar } from '@/components/toolbar';
import { FileTree } from '@/components/file-tree';
import { EditorPanel } from '@/components/editor-panel';
import { UploadDropzone } from '@/components/upload-dropzone';
import { NewFileDialog } from '@/components/modals/new-file-dialog';
import { DeleteConfirmDialog } from '@/components/modals/delete-confirm-dialog';
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Folder, Code } from 'lucide-react';

export function FileExplorer() {
  const [nodes, setNodes] = useState<FileSystemNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<FileSystemNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<FileSystemNode | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const fileNodes = await actions.listFiles();
      setNodes(fileNodes);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load files.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleSelectNode = useCallback(async (node: FileSystemNode) => {
    if (node.type === 'directory') {
      setSelectedNode(node);
      setFileContent(null);
      return;
    }

    if (selectedNode?.path === node.path) return;

    setSelectedNode(node);
    setFileContent(null); // Show loading state for content
    try {
      const content = await actions.readFile(node.path);
      setFileContent(content);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: `Could not read file: ${node.name}` });
      setFileContent('Error loading file content.');
    }
  }, [selectedNode, toast]);

  const refreshAndSelect = async (path: string | null) => {
    await loadFiles();
    if (path) {
        // This is complex to implement correctly without full tree traversal on client
        // For now, we just refresh the tree. A better implementation would re-select the new file.
        setSelectedNode(null);
        setFileContent(null);
    }
  };

  const handleCreateFile = (path: string, content: string) => {
    startTransition(async () => {
      try {
        await actions.createFile(path, content);
        toast({ title: 'Success', description: 'File created successfully.' });
        await refreshAndSelect(path);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create file.' });
      }
    });
  };

  const handleDeleteNode = (node: FileSystemNode) => {
    setNodeToDelete(node);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!nodeToDelete) return;
    startTransition(async () => {
        try {
            await actions.deleteFile(nodeToDelete.path);
            toast({ title: 'Success', description: `"${nodeToDelete.name}" deleted.` });
            if (selectedNode?.path === nodeToDelete.path) {
                setSelectedNode(null);
                setFileContent(null);
            }
            await loadFiles();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete.' });
        } finally {
            setDeleteDialogOpen(false);
            setNodeToDelete(null);
        }
    });
  };

  const handleUpload = async (formData: FormData) => {
    startTransition(async () => {
        try {
            await actions.uploadFile(formData);
            toast({ title: 'Success', description: 'File uploaded.' });
            await loadFiles();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Upload failed.' });
        }
    });
  };

  return (
    <div className="flex flex-col h-full font-sans">
        <h1 className="text-2xl font-semibold p-4 border-b bg-card text-card-foreground font-headline flex items-center gap-2">
            <Code className="text-primary"/> File Commander
        </h1>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-full max-w-xs border-r flex flex-col">
            <Toolbar onNewFile={() => setNewFileDialogOpen(true)} />
            <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-5/6" />
                </div>
            ) : (
                <FileTree nodes={nodes} selectedNode={selectedNode} onSelectNode={handleSelectNode} onDeleteNode={handleDeleteNode} />
            )}
            </div>
            <div className="p-2 border-t">
                 <UploadDropzone onUpload={handleUpload} isPending={isPending} />
            </div>
        </aside>
        <main className="flex-1 flex flex-col overflow-y-auto">
          {selectedNode ? (
            <EditorPanel 
              key={selectedNode.path} 
              node={selectedNode} 
              initialContent={fileContent} 
              onDelete={handleDeleteNode}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                  <FileText size={48} className="mx-auto mb-2" />
                  <p>Select a file to view or edit</p>
                  <p className="text-sm">or create a new file to get started.</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <NewFileDialog
        isOpen={isNewFileDialogOpen}
        onOpenChange={setNewFileDialogOpen}
        onCreate={handleCreateFile}
        isPending={isPending}
      />
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        nodeName={nodeToDelete?.name || ''}
        isPending={isPending}
      />
    </div>
  );
}
