
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface SmartEditDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (prompt: string) => void;
  isPending: boolean;
}

const formSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters long.'),
});

export function SmartEditDialog({ isOpen, onOpenChange, onConfirm, isPending }: SmartEditDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: '',
        },
      });
    
      useEffect(() => {
        if (isOpen) {
          form.reset();
        }
      }, [isOpen, form]);
    
      const onSubmit = (values: z.infer<typeof formSchema>) => {
        onConfirm(values.prompt);
        onOpenChange(false);
      };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-accent"/> Smart Edit
          </DialogTitle>
          <DialogDescription>
            Describe the changes you want to make to the file. The AI will apply them.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Instructions</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="e.g., 'Refactor this function to be async/await' or 'Fix any typos in this text'"
                            className="resize-none"
                            rows={5}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Thinking...' : 'Apply Changes'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
