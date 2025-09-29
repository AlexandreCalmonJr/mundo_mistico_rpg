
'use server';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_POKEMON_ID = 1025; // Número atual de Pokémon

// Helper para buscar um recurso da PokeAPI
async function fetchFromPokeAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${POKEAPI_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch from PokeAPI: ${response.statusText}`);
  }
  return response.json();
}

type MoveInfo = {
  name: string;
};

type PokemonInfo = {
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
};

/**
 * Busca um golpe aleatório de um Pokémon aleatório da PokeAPI.
 * @returns O nome do golpe em letras maiúsculas.
 */
export async function getRandomPokemonMove(): Promise<string> {
  try {
    // 1. Pega um Pokémon aleatório
    const randomPokemonId = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    const pokemon = await fetchFromPokeAPI<PokemonInfo>(`pokemon/${randomPokemonId}`);

    if (pokemon.moves.length === 0) {
      // Caso raro de um Pokémon sem golpes
      return 'Struggle'; 
    }

    // 2. Pega um golpe aleatório da lista de golpes desse Pokémon
    const randomMoveIndex = Math.floor(Math.random() * pokemon.moves.length);
    const moveName = pokemon.moves[randomMoveIndex].move.name;
    
    // Capitaliza a primeira letra de cada parte do nome do golpe
    const formattedMoveName = moveName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

    return formattedMoveName;

  } catch (error) {
    console.error("Error fetching from PokeAPI:", error);
    // Retorna um golpe padrão em caso de erro na API
    return "Tackle";
  }
}
