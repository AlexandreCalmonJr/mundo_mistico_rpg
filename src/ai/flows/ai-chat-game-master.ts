'use server';
/**
 * @fileOverview An AI Chat Game Master that guides players through adventures.
 *
 * - aiChatGameMaster - A function that initiates and manages the AI-driven adventure.
 * - AIChatGameMasterInput - The input type for the aiChatGameMaster function.
 * - AIChatGameMasterOutput - The return type for the aiChatGameMaster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatGameMasterInputSchema = z.object({
  templeType: z
    .string()
    .describe("The type of temple the player is exploring (e.g., Aztec, Inca, Norse)."),
  playerCharacterDetails: z
    .string()
    .describe("A summary of the player's character, including name, race, class, and level."),
  playerMessage: z
    .string()
    .describe('The player’s message or action within the adventure.'),
});
export type AIChatGameMasterInput = z.infer<typeof AIChatGameMasterInputSchema>;

const AIChatGameMasterOutputSchema = z.object({
  gameMasterResponse: z
    .string()
    .describe('The AI Game Master’s response, continuing the adventure narrative.'),
});
export type AIChatGameMasterOutput = z.infer<typeof AIChatGameMasterOutputSchema>;

export async function aiChatGameMaster(
  input: AIChatGameMasterInput
): Promise<AIChatGameMasterOutput> {
  return aiChatGameMasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatGameMasterPrompt',
  input: {schema: AIChatGameMasterInputSchema},
  output: {schema: AIChatGameMasterOutputSchema},
  prompt: `You are an AI Chat Game Master guiding a player through an adventure in a virtual world.

The player is currently exploring a {{{templeType}}} temple. The temple is filled with logical and mathematical reasoning puzzles.
Incorporate the setting and mythology of the temple into the narrative.
To introduce a puzzle, embed a special instruction in your response like [PUZZLE:puzzle_id], replacing "puzzle_id" with a real puzzle ID from this list: logic_1, math_1, riddle_1. For example: [PUZZLE:logic_1]. The front-end will detect this and show the corresponding puzzle.

Use the following player character details to tailor the adventure: {{{playerCharacterDetails}}}.

Player message: {{{playerMessage}}}

Respond with a narrative that continues the adventure, presents challenges, and incorporates the player's actions. Keep the tone dark, mysterious, and epic.
`,
});

const aiChatGameMasterFlow = ai.defineFlow(
  {
    name: 'aiChatGameMasterFlow',
    inputSchema: AIChatGameMasterInputSchema,
    outputSchema: AIChatGameMasterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
