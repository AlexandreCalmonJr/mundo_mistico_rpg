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
  characterRace: z.string().describe('The race of the character (e.g., Human, Elf, Dwarf).'),
  characterClass: z.string().describe('The class of the character (e.g., Warrior, Mage, Archer).'),
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
  prompt: `Você é um mestre de RPG experiente criando um novo personagem para um jogador em um mundo de fantasia sombria e mística chamado "Mundo Mítico".

Crie uma ficha de personagem completa para:
- Nome: {{{characterName}}}
- Raça: {{{characterRace}}}
- Classe: {{{characterClass}}}

Gere os seguintes detalhes:
1.  **História (backstory):** Uma história de origem convincente com 2 ou 3 parágrafos. Deve ser sombria e misteriosa, mas com um pingo de esperança. Conecte a história à sua raça e classe.
2.  **Atributos:** Gere quatro atributos principais: Força, Agilidade, Inteligência e Defesa. Os valores devem ser de 1 a 100 e devem refletir os pontos fortes e fracos típicos da classe do personagem. Por exemplo, um Guerreiro deve ter alta Força e Defesa.
3.  **Habilidades Iniciais (initialAbilities):** Crie uma lista de 3 ou 4 nomes de habilidades iniciais que soem únicas e temáticas para a classe e raça.
4.  **Equipamento Sugerido (suggestedEquipment):** Sugira 2 ou 3 peças de equipamento inicial, incluindo uma arma e uma peça de armadura. Dê um nome e uma breve descrição para cada item.

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
