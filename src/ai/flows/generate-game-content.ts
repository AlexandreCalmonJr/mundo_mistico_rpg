
'use server';
/**
 * @fileOverview An AI flow to generate various types of game content in JSON format.
 *
 * - generateGameContent - A function that creates game content based on a type and a prompt.
 * - GenerateGameContentInput - The input type for the function.
 * - GenerateGameContentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGameContentInputSchema = z.object({
  contentType: z.string().describe('The type of content to generate (e.g., Classe, Raça, Habilidade, Arma, Mapa, Grupo de Classe, Temporada, Mitologia).'),
  prompt: z.string().describe('A text prompt describing the desired content. For a season, describe the theme.'),
});
export type GenerateGameContentInput = z.infer<typeof GenerateGameContentInputSchema>;

const GeneratedJsonSchema = z.string().describe('The generated game content as a JSON string.');

const GenerateGameContentOutputSchema = z.object({
  generatedJson: GeneratedJsonSchema,
});
export type GenerateGameContentOutput = z.infer<typeof GenerateGameContentOutputSchema>;


export async function generateGameContent(
  input: GenerateGameContentInput
): Promise<GenerateGameContentOutput> {
  return generateGameContentFlow(input);
}

const mainPrompt = ai.definePrompt({
  name: 'generateGameContentPrompt',
  input: { schema: GenerateGameContentInputSchema },
  output: { schema: GenerateGameContentOutputSchema },
  prompt: `
Você é um assistente de criação de conteúdo para um jogo de RPG de fantasia chamado "Mundo Mítico".
Sua tarefa é gerar uma estrutura JSON para um novo conteúdo de jogo com base no tipo e no prompt fornecidos.

**Tipo de Conteúdo:** {{{contentType}}}
**Prompt do Usuário:** {{{prompt}}}

Responda APENAS com uma string JSON válida e completa no campo 'generatedJson'. Não inclua markdown (como \`\`\`json), comentários ou qualquer outro texto explicativo fora da string JSON.
O JSON deve ser um objeto único ou um array de objetos, dependendo do que for mais apropriado para a solicitação.

Use as seguintes estruturas como modelo para cada tipo de conteúdo. Preencha todos os campos com valores temáticos e apropriados.

**Estruturas de Exemplo:**

**Se o tipo for "Classe":**
{
  "id": "gerado-pela-ia-id-unico",
  "name": "Nome da Classe",
  "description": "Descrição detalhada e temática.",
  "strengths": ["Força 1", "Força 2"],
  "weaknesses": ["Fraqueza 1", "Fraqueza 2"],
  "image": "id-da-imagem-placeholder",
  "mythology": "Norse | Greek | Egyptian | Japanese | Aztec",
  "attributeModifiers": [
    { "attribute": "Força", "modifier": 10 },
    { "attribute": "Agilidade", "modifier": 5 },
    { "attribute": "Inteligência", "modifier": -5 },
    { "attribute": "Defesa", "modifier": 0 }
  ]
}

**Se o tipo for "Raça":**
{
  "id": "gerado-pela-ia-id-unico",
  "name": "Nome da Raça",
  "description": "Descrição detalhada e temática da raça.",
  "image": "id-da-imagem-placeholder",
  "mythology": "Norse | Greek | Egyptian | Japanese | Aztec",
  "attributeModifiers": [
    { "attribute": "Força", "modifier": 5 },
    { "attribute": "Agilidade", "modifier": 10 },
    { "attribute": "Inteligência", "modifier": -5 },
    { "attribute": "Defesa", "modifier": 0 }
  ]
}

**Se o tipo for "Habilidade":**
{
  "id": "gerado-pela-ia-id-unico",
  "name": "Nome da Habilidade",
  "description": "O que a habilidade faz.",
  "type": "Ataque",
  "cost": 15,
  "levelRequirement": 5,
  "classId": ""
}

**Se o tipo for "Arma":**
{
  "id": "gerado-pela-ia-id-unico",
  "name": "Nome da Arma",
  "description": "Descrição temática da arma.",
  "type": "Espada | Machado | Arco | Cajado | Adaga | Lança",
  "damage": 25,
  "rarity": "Comum | Incomum | Raro | Épico | Lendário",
  "classRequirement": ["id-da-classe-1", "id-da-classe-2"]
}

**Se o tipo for "Mapa":**
{
    "name": "Nome do Mapa",
    "type": "IdUnicoDoMapa",
    "description": "Descrição do mapa ou aventura."
}

**Se o tipo for "Grupo de Classe":**
{
  "id": "gerado-pela-ia-id-unico",
  "name": "Nome do Grupo/Evolução",
  "baseClassId": "id-da-classe-base",
  "levelRequirement": 20
}

**Se o tipo for "Mitologia":**
{
    "id": "id-unico-mitologia",
    "name": "Nome da Mitologia"
}

**Se o tipo for "Temporada" ou um tema amplo, gere um array de objetos contendo classes, raças, armas, etc., que se encaixem no tema.**
Exemplo para "Temporada Fim do Mundo":
[
  {
    "collection": "classes",
    "data": { "id": "sobrevivente", "name": "Sobrevivente", "description": "...", "mythology": "Post-Apocalyptic" }
  },
  {
    "collection": "races",
    "data": { "id": "mutante", "name": "Mutante", "description": "...", "mythology": "Post-Apocalyptic" }
  },
  {
    "collection": "weapons",
    "data": { "id": "cano-enferrujado", "name": "Cano Enferrujado", "description": "...", "type": "Machado", "damage": 12 }
  }
]
Neste caso, cada objeto no array deve ter uma chave "collection" (o nome da coleção no Firestore) e uma chave "data" com o conteúdo a ser inserido.

Agora, gere o JSON para o prompt do usuário.
`,
});

const fixJsonPrompt = ai.definePrompt({
    name: 'fixJsonPrompt',
    input: { schema: z.object({ badJson: z.string() }) },
    output: { schema: GenerateGameContentOutputSchema },
    prompt: `O seguinte texto JSON está malformado. Corrija-o e retorne apenas a string JSON válida no campo 'generatedJson'. Não inclua nenhum outro texto ou explicação.

JSON Inválido:
{{{badJson}}}
`,
});

const generateGameContentFlow = ai.defineFlow(
  {
    name: 'generateGameContentFlow',
    inputSchema: GenerateGameContentInputSchema,
    outputSchema: GenerateGameContentOutputSchema,
  },
  async (input) => {
    const { output: initialOutput } = await mainPrompt(input);
    if (!initialOutput) {
      throw new Error("A IA não conseguiu gerar o conteúdo inicial.");
    }
    
    let jsonString = initialOutput.generatedJson.replace(/^```json\n|```$/g, '').trim();

    try {
      JSON.parse(jsonString);
      return { generatedJson: jsonString };
    } catch (e) {
      console.warn("IA retornou JSON inválido na primeira tentativa. Tentando corrigir...");
      console.warn("JSON Inválido:", jsonString);

      const { output: fixedOutput } = await fixJsonPrompt({ badJson: jsonString });
       if (!fixedOutput) {
         throw new Error("A IA não conseguiu corrigir o JSON.");
       }
       
       const fixedJsonString = fixedOutput.generatedJson.replace(/^```json\n|```$/g, '').trim();
       
       try {
           JSON.parse(fixedJsonString);
           console.log("JSON corrigido com sucesso!");
           return { generatedJson: fixedJsonString };
       } catch (finalError) {
            console.error("A IA falhou em corrigir o JSON:", fixedJsonString);
            throw new Error("A resposta da IA não era um JSON válido, mesmo após a tentativa de correção.");
       }
    }
  }
);

