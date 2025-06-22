// src/ai/flows/smart-edit.ts
'use server';

/**
 * @fileOverview AI-powered smart editing tool for files.
 *
 * - smartEdit - A function that accepts a filename, content, and a prompt, and returns suggested changes to the content.
 * - SmartEditInput - The input type for the smartEdit function.
 * - SmartEditOutput - The return type for the smartEdit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartEditInputSchema = z.object({
  filename: z.string().describe('The name of the file to edit.'),
  content: z.string().describe('The current content of the file.'),
  prompt: z.string().describe('A prompt describing the desired changes to the file content.'),
});
export type SmartEditInput = z.infer<typeof SmartEditInputSchema>;

const SmartEditOutputSchema = z.object({
  suggestedContent: z.string().describe('The AI-suggested content for the file, based on the prompt.'),
});
export type SmartEditOutput = z.infer<typeof SmartEditOutputSchema>;

export async function smartEdit(input: SmartEditInput): Promise<SmartEditOutput> {
  return smartEditFlow(input);
}

const smartEditPrompt = ai.definePrompt({
  name: 'smartEditPrompt',
  input: {schema: SmartEditInputSchema},
  output: {schema: SmartEditOutputSchema},
  prompt: `You are an AI-powered code editor. The user has provided the content of a file, along with a prompt describing the desired changes.

  Based on the prompt, suggest changes to the file content.
  Return ONLY the modified content.

  Filename: {{{filename}}}
  Current Content:
  {{content}}

  Prompt: {{{prompt}}}`,  
});

const smartEditFlow = ai.defineFlow(
  {
    name: 'smartEditFlow',
    inputSchema: SmartEditInputSchema,
    outputSchema: SmartEditOutputSchema,
  },
  async input => {
    const {output} = await smartEditPrompt(input);
    return output!;
  }
);
