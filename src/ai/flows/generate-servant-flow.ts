
'use server';
/**
 * @fileOverview An AI flow to summon a unique Heroic Spirit (Servant) for a Holy Grail War.
 *
 * - generateServant - A function that summons a Servant based on the Master's profile.
 * - GenerateServantInput - The input type for the function.
 * - GenerateServantOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateServantInputSchema = z.object({
  masterName: z.string().describe('The name of the Master performing the summoning ritual.'),
  masterDescription: z.string().describe("A paragraph written by the Master describing their ideals, desires, personality, and combat style. This will be the catalyst for the summoning."),
});
export type GenerateServantInput = z.infer<typeof GenerateServantInputSchema>;

const NoblePhantasmSchema = z.object({
    name: z.string().describe("The name of the Noble Phantasm."),
    rank: z.enum(['E', 'D', 'C', 'B', 'A', 'EX']).describe("The rank of the Noble Phantasm."),
    type: z.string().describe("The type of Noble Phantasm (e.g., Anti-Unit, Anti-Army, Anti-Fortress, Barrier)."),
    description: z.string().describe("A detailed description of what the Noble Phantasm does."),
});

const GenerateServantOutputSchema = z.object({
  className: z.enum(['Saber', 'Archer', 'Lancer', 'Rider', 'Caster', 'Assassin', 'Berserker']).describe("The Servant's class."),
  trueName: z.string().describe("The Servant's true name from history, mythology, or literature."),
  backstory: z.string().describe("The Servant's backstory, explaining their legend and how it relates to their class and abilities. 2-3 paragraphs."),
  personality: z.string().describe("A description of the Servant's personality and how they might interact with their Master."),
  parameters: z.array(z.object({
    name: z.enum(['Força', 'Resistência', 'Agilidade', 'Mana', 'Sorte', 'NP']),
    rank: z.enum(['E', 'D', 'C', 'B', 'A', 'EX']),
  })).describe("The Servant's six main parameters."),
  classSkills: z.array(z.object({
      name: z.string(),
      rank: z.string(),
      description: z.string(),
  })).describe("A list of 1-2 skills inherent to the Servant's class (e.g., Magic Resistance for Saber, Independent Action for Archer)."),
  personalSkills: z.array(z.object({
      name: z.string(),
      rank: z.string(),
      description: z.string(),
  })).describe("A list of 2-3 unique skills derived from the Servant's personal legend."),
  noblePhantasm: NoblePhantasmSchema.describe("The Servant's ultimate weapon or ability."),
  imageUrl: z.string().url().describe("A placeholder image URL for the servant, using picsum.photos for a character portrait."),
  imageHint: z.string().describe("One or two keywords for an AI image generator to create a better image, e.g., 'female knight' or 'armored mage'."),
});
export type GenerateServantOutput = z.infer<typeof GenerateServantOutputSchema>;

export async function generateServant(
  input: GenerateServantInput
): Promise<GenerateServantOutput> {
  return generateServantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServantPrompt',
  input: { schema: GenerateServantInputSchema },
  output: { schema: GenerateServantOutputSchema },
  prompt: `You are the Holy Grail, selecting and summoning a Heroic Spirit (Servant) for a Master participating in the Holy Grail War. The Servant you summon must be a creative and fitting match for the Master's catalyst.

**Master's Name:** {{{masterName}}}
**Master's Catalyst (Ideals and Description):**
"{{{masterDescription}}}"

Based *entirely* on the Master's catalyst, summon a fitting Heroic Spirit. This can be a figure from any mythology, history, or literature. Avoid overly common choices like King Arthur or Heracles unless the catalyst is extremely specific. Be creative.

**Your task is to generate a complete Servant profile with the following structure:**

1.  **Class Name:** Choose one of the seven standard classes (Saber, Archer, Lancer, Rider, Caster, Assassin, Berserker) that best fits the summoned hero's legend and the Master's catalyst.
2.  **True Name:** The actual name of the Heroic Spirit.
3.  **Backstory:** 2-3 paragraphs detailing the hero's legend, their deeds in life, and why they qualify for their summoned class.
4.  **Personality:** Describe the Servant's personality and how they would likely interact with their Master, {{{masterName}}}.
5.  **Parameters:** Assign a rank (E, D, C, B, A, EX) for each of the six parameters: Força (Strength), Resistência (Endurance), Agilidade (Agility), Mana (Magical Energy), Sorte (Luck), and NP (Noble Phantasm). The ranks should reflect the hero's legend.
6.  **Class Skills:** Define 1 or 2 skills inherent to the Servant's class (e.g., Riding for a Rider, Presence Concealment for an Assassin).
7.  **Personal Skills:** Define 2-3 unique skills derived from the Servant's specific legend and life.
8.  **Noble Phantasm:** Create a compelling ultimate ability for the Servant. It must have a name, rank, type (e.g., Anti-Unit, Anti-Army), and a detailed description of its function and power. This should be the pinnacle of their legend.
9.  **Image:** Provide a placeholder image URL using 'https://picsum.photos/seed/{a random number}/600/800'.
10. **Image Hint:** Provide one or two keywords for an AI image generator that capture the essence of the Servant (e.g., "female knight", "old wizard", "shadowy assassin").

Respond ONLY with the requested JSON output structure. Do not add any commentary.
`,
});

const generateServantFlow = ai.defineFlow(
  {
    name: 'generateServantFlow',
    inputSchema: GenerateServantInputSchema,
    outputSchema: GenerateServantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The Holy Grail did not respond to the summoning.");
    }
    return output;
  }
);
