
'use client';

import { FileSystemNode } from '@/types';
import { Folder, File, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import React from 'react';

interface FileTreeProps {
  nodes: FileSystemNode[];
  selectedNode: FileSystemNode | null;
  onSelectNode: (node: FileSystemNode) => void;
  onDeleteNode: (node: FileSystemNode) => void;
}

interface NodeProps {
  node: FileSystemNode;
  selectedNode: FileSystemNode | null;
  onSelectNode: (node: FileSystemNode) => void;
  onDeleteNode: (node: FileSystemNode) => void;
  level: number;
}

const NodeComponent = React.memo(({ node, selectedNode, onSelectNode, onDeleteNode, level }: NodeProps) => {
  const isSelected = selectedNode?.path === node.path;

  const NodeIcon = node.type === 'directory' ? Folder : File;

  const commonClasses = "flex items-center justify-between w-full text-left pr-1 group rounded-md";
  const selectedClasses = "bg-accent text-accent-foreground";

  if (node.type === 'directory') {
    return (
      <Accordion type="single" collapsible className="w-full" defaultValue={level === 0 ? node.path : undefined}>
        <AccordionItem value={node.path} className="border-b-0">
          <AccordionTrigger 
            onClick={() => onSelectNode(node)}
            className={cn(commonClasses, isSelected && selectedClasses, "py-1.5 hover:no-underline hover:bg-muted/50")}
            style={{ paddingLeft: `${level * 1}rem` }}
          >
            <div className="flex items-center gap-2">
              <NodeIcon className={cn("h-4 w-4 shrink-0", isSelected ? "text-accent-foreground" : "text-primary")} />
              <span className="truncate">{node.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-4 pt-0 pb-0">
            {node.children && node.children.length > 0 ? (
              node.children.map(child => (
                <NodeComponent key={child.path} node={child} selectedNode={selectedNode} onSelectNode={onSelectNode} onDeleteNode={onDeleteNode} level={level + 1} />
              ))
            ) : (
               <p className="text-xs text-muted-foreground p-2" style={{ paddingLeft: `${(level + 1) * 1}rem` }}>Empty directory</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div
      onClick={() => onSelectNode(node)}
      className={cn(commonClasses, "cursor-pointer hover:bg-muted/50", isSelected && selectedClasses)}
      style={{ paddingLeft: `${level * 1}rem` }}
    >
      <div className="flex items-center gap-2 py-1.5">
        <NodeIcon className={cn("h-4 w-4 shrink-0", isSelected ? "text-accent-foreground" : "text-primary")} />
        <span className="truncate">{node.name}</span>
      </div>
       <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteNode(node);
          }}
        >
          <Trash2 className="h-3.5 w-3.5"/>
       </Button>
    </div>
  );
});

NodeComponent.displayName = 'NodeComponent';

export function FileTree({ nodes, selectedNode, onSelectNode, onDeleteNode }: FileTreeProps) {
  return (
    <div className="space-y-1">
      {nodes.map(node => (
        <NodeComponent key={node.path} node={node} selectedNode={selectedNode} onSelectNode={onSelectNode} onDeleteNode={onDeleteNode} level={0} />
      ))}
    </div>
  );
}
