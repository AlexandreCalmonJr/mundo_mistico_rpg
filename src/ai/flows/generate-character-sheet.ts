'use server';
/**
 * @fileOverview An AI flow to generate a complete character sheet for a fantasy RPG.
 *
 * - generateCharacterSheet - A function that creates a character's backstory, attributes, and abilities.
 * - GenerateCharacterSheetInput - The input type for the function.
 * - GenerateCharacterSheetOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCharacterSheetInputSchema = z.object({
  characterName: z.string().describe('The name of the character.'),
  characterMythology: z.string().describe('The mythological pantheon of the character (e.g., Norse, Greek, Egyptian).'),
  characterRace: z.string().describe('The race of the character (e.g., Aesir, Demigod, Kitsune).'),
  characterClass: z.string().describe('The class of the character (e.g., Berserker, Hoplite, Samurai).'),
  classStrengths: z.array(z.string()).describe('List of strengths for the character\'s class.'),
  classWeaknesses: z.array(z.string()).describe('List of weaknesses for the character\'s class.'),
});
export type GenerateCharacterSheetInput = z.infer<typeof GenerateCharacterSheetInputSchema>;

const GenerateCharacterSheetOutputSchema = z.object({
  backstory: z.string().describe("The character's backstory, around 2-3 paragraphs long."),
  attributes: z.array(z.object({
    name: z.string().describe("The name of the attribute (Força, Agilidade, Inteligência, Defesa)."),
    value: z.number().describe('The value of the attribute, from 1 to 100.'),
  })).describe('A list of four main character attributes.'),
  initialAbilities: z.array(z.string()).describe("A list of 3-4 initial thematic abilities for the character."),
  suggestedEquipment: z.array(z.object({
      name: z.string().describe("The name of the equipment."),
      description: z.string().describe("A brief description of the equipment."),
  })).describe('A list of 2-3 pieces of suggested starting equipment.'),
});
export type GenerateCharacterSheetOutput = z.infer<typeof GenerateCharacterSheetOutputSchema>;

export async function generateCharacterSheet(
  input: GenerateCharacterSheetInput
): Promise<GenerateCharacterSheetOutput> {
  return generateCharacterSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterSheetPrompt',
  input: { schema: GenerateCharacterSheetInputSchema },
  output: { schema: GenerateCharacterSheetOutputSchema },
  prompt: `Você é um mestre de RPG experiente criando um novo personagem para um jogador em um mundo de fantasia sombria e mística.

Crie uma ficha de personagem completa para:
- Nome: {{{characterName}}}
- Mitologia: {{{characterMythology}}}
- Raça: {{{characterRace}}}
- Classe: {{{characterClass}}}

Considere os pontos fortes e fracos da classe e raça ao gerar os atributos:
- Pontos Fortes da Classe: {{#each classStrengths}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Pontos Fracos da Classe: {{#each classWeaknesses}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Gere os seguintes detalhes:
1.  **História (backstory):** Uma história de origem convincente com 2 ou 3 parágrafos. Deve ser sombria e misteriosa, mas com um pingo de esperança. A história deve ser profundamente temática e enraizada na mitologia ({{{characterMythology}}}), raça ({{{characterRace}}}), e classe ({{{characterClass}}}) do personagem.
2.  **Atributos:** Gere quatro atributos principais: Força, Agilidade, Inteligência e Defesa. Os valores devem ser de 1 a 100 e devem refletir os pontos fortes e fracos da classe e raça do personagem. Por exemplo, um Berserker Nórdico deve ter alta Força mas talvez baixa Inteligência, enquanto um Oráculo Grego deve ter alta Inteligência.
3.  **Habilidades Iniciais (initialAbilities):** Crie uma lista de 3 ou 4 nomes de habilidades iniciais que soem únicas e temáticas para a classe, raça e mitologia.
4.  **Equipamento Sugerido (suggestedEquipment):** Sugira 2 ou 3 peças de equipamento inicial que sejam tematicamente apropriadas para a mitologia. Dê um nome e uma breve descrição para cada item.

Responda apenas com a estrutura de saída solicitada.
`,
});

const generateCharacterSheetFlow = ai.defineFlow(
  {
    name: 'generateCharacterSheetFlow',
    inputSchema: GenerateCharacterSheetInputSchema,
    outputSchema: GenerateCharacterSheetOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
