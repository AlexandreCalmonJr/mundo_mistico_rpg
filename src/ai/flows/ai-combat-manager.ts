
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
import { getRandomPokemonMove } from '@/services/pokeapi';

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

const getRandomPokemonMoveTool = ai.defineTool(
  {
    name: 'getRandomPokemonMove',
    description: 'Busca um golpe de Pokémon aleatório para usar como ataque de um inimigo.',
    inputSchema: z.object({}),
    outputSchema: z.string(),
  },
  async () => {
    return await getRandomPokemonMove();
  }
)

const prompt = ai.definePrompt({
  name: 'aiCombatManagerPrompt',
  input: { schema: AICombatManagerInputSchema },
  output: { schema: AICombatManagerOutputSchema },
  tools: [getRandomPokemonMoveTool],
  prompt: `Você é a IA controlando um inimigo em uma batalha de RPG por turnos.
Seu objetivo é agir como um inimigo plausível de videogame.

**Personagem do Jogador:**
{{{playerCharacterDetails}}}

**Inimigo que Você Está Controlando:**
{{{enemyDetails}}}

**Última Ação do Jogador:**
"{{{playerAction}}}"

Baseado na ação do jogador e no estado atual de ambos os combatentes, determine a próxima ação do inimigo.
Para a ação do inimigo, use a ferramenta 'getRandomPokemonMove' para obter um nome de golpe de Pokémon e incorpore-o criativamente na descrição da ação. Por exemplo, "O goblin usa 'Arranhão' e te ataca com suas garras!".

Calcule o dano para a ação do jogador e a ação do inimigo. O dano deve ser baseado nas estatísticas fornecidas. Um cálculo simples como (Ataque do Atacante - Defesa do Defensor) é um bom ponto de partida, com alguma aleatoriedade.
Um personagem com defesa alta deve sofrer menos dano. Um personagem com ataque alto deve causar mais dano.

Gere uma resposta com os seguintes campos:
- 'enemyAction': O que o inimigo faz neste turno, usando um golpe de Pokémon obtido pela ferramenta.
- 'playerDamage': Dano que o jogador sofre.
- 'enemyDamage': Dano que o inimigo sofre da última ação do jogador.
- 'turnResultNarrative': Um resumo curto e envolvente do resultado do turno.
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
