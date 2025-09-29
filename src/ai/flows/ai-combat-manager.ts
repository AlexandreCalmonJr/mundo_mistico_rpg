'use server';
/**
 * @fileOverview An AI Combat Manager that controls enemy actions in a turn-based battle.
 *
 * - aiCombatManager - A function that processes a combat turn.
 * - AICombatManagerInput - The input type for the function.
 * - AICombatManagerOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AICombatManagerInputSchema = z.object({
  playerCharacterDetails: z.string().describe("A summary of the player's character, including stats."),
  enemyDetails: z.string().describe("A summary of the enemy's details, including stats."),
  playerAction: z.string().describe("The action the player just took (e.g., 'Attacked with sword', 'Cast Fireball', 'Used Healing Potion')."),
});
export type AICombatManagerInput = z.infer<typeof AICombatManagerInputSchema>;

const AICombatManagerOutputSchema = z.object({
  enemyAction: z.string().describe("The action the enemy takes in response, described in a narrative style. E.g., 'The goblin lunges with its rusty dagger!' or 'The troll roars and swings its massive club.'"),
  playerDamage: z.number().describe("The amount of damage dealt to the player in this turn. Can be 0."),
  enemyDamage: z.number().describe("The amount of damage dealt to the enemy in this turn. Can be 0."),
  turnResultNarrative: z.string().describe("A brief, epic-toned narrative describing the outcome of the entire turn (player's action and enemy's response). E.g., 'Your blade finds its mark, wounding the beast, but it retaliates with a furious swipe of its claws.'"),
});
export type AICombatManagerOutput = z.infer<typeof AICombatManagerOutputSchema>;

export async function aiCombatManager(input: AICombatManagerInput): Promise<AICombatManagerOutput> {
  return aiCombatManagerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCombatManagerPrompt',
  input: { schema: AICombatManagerInputSchema },
  output: { schema: AICombatManagerOutputSchema },
  prompt: `You are the AI controlling an enemy in a turn-based RPG battle.
Your goal is to act like a plausible video game enemy.

**Player Character:**
{{{playerCharacterDetails}}}

**Enemy You Are Controlling:**
{{{enemyDetails}}}

**Player's Last Action:**
"{{{playerAction}}}"

Based on the player's action and the current state of both combatants, determine the enemy's next action.
Calculate the damage for both the player's action and the enemy's action. The damage should be based on the provided stats. A simple calculation like (Attacker's Attack - Defender's Defense) is a good starting point, with some randomness.
A character with high defense should take less damage. A character with high attack should deal more.

Generate a response with:
1.  `enemyAction`: What the enemy does this turn.
2.  `playerDamage`: Damage the player takes.
3.  `enemyDamage`: Damage the enemy takes from the player's last action.
4.  `turnResultNarrative`: A short, engaging summary of the turn's outcome.
`,
});

const aiCombatManagerFlow = ai.defineFlow(
  {
    name: 'aiCombatManagerFlow',
    inputSchema: AICombatManagerInputSchema,
    outputSchema: AICombatManagerOutputSchema,
  },
  async (input) => {
    // A simple damage calculation logic can be added here before or after the prompt
    // to make the combat more deterministic, but for now, we'll let the AI decide.
    const { output } = await prompt(input);
    return output!;
  }
);
