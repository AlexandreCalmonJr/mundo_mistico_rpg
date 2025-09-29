'use server';
/**
 * @fileOverview An AI oracle that provides cryptic wisdom and lore.
 *
 * - oracleFlow - A function that generates a thematic message based on chat history.
 * - OracleFlowInput - The input type for the oracleFlow function.
 * - OracleFlowOutput - The return type for the oracleFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OracleFlowInputSchema = z.object({
  chatHistory: z.string().describe("The recent history of the chat conversation."),
});
export type OracleFlowInput = z.infer<typeof OracleFlowInputSchema>;

const OracleFlowOutputSchema = z.object({
  oracleResponse: z
    .string()
    .describe('A cryptic, thematic, or prophetic message from the world oracle, written in an epic and mysterious tone. It can be a piece of lore, a hook for an adventure, a comment on the players\' conversation, or a general atmospheric statement. The message should be 1-2 sentences long.'),
});
export type OracleFlowOutput = z.infer<typeof OracleFlowOutputSchema>;

export async function oracleFlow(
  input: OracleFlowInput
): Promise<OracleFlowOutput> {
  const prompt = ai.definePrompt({
    name: 'oraclePrompt',
    input: {schema: OracleFlowInputSchema},
    output: {schema: OracleFlowOutputSchema},
    prompt: `You are the Oracle of "Mundo Mítico", a mysterious, all-knowing entity that sometimes speaks to the heroes of the land.
Your voice is epic, cryptic, and ancient.
You observe the conversations of the heroes and, when the moment is right, you deliver a short, impactful message.

The heroes are currently discussing the following:
---
{{{chatHistory}}}
---

Based on their conversation, provide a piece of lore, a cryptic warning, a hint of a forgotten treasure, or a prophetic statement.
Your message should feel like it belongs to a world of dark fantasy and mythology. Keep it brief and powerful.
Do not directly address any player. Speak as if your voice echoes from the cosmos itself.

Examples:
- "As sombras se agitam sob a Montanha Esquecida, onde o último dragão dorme..."
- "A Estrela Caída não era uma estrela, mas uma prisão..."
- "A coragem de um herói é forjada no silêncio, não no grito de guerra."
- "Busquem o reflexo da lua na água que não se move..."
`,
  });

  const { output } = await prompt(input);
  return output!;
}
