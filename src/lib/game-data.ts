

export type Attribute = {
  name: string;
  value: number;
};

export type AttributeModifier = {
    attribute: string;
    modifier: number;
}

export type Ability = {
  id: string;
  name: string;
  description: string;
  type: 'Ataque' | 'Defesa' | 'Suporte' | 'Utilidade';
  cost: number;
  levelRequirement: number;
  classId: string; // ID da classe que pode usar a habilidade
}

export type Weapon = {
  id: string;
  name: string;
  description: string;
  type: 'Espada' | 'Machado' | 'Arco' | 'Cajado' | 'Adaga' | 'Lança';
  damage: number;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  classRequirement: string[]; // Array de IDs de classes
}

export type Enemy = {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
}

export type Mythology = {
    id: string;
    name: string;
}

export type GameClass = {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  image: string;
  mythology: string; // 'Norse', 'Greek', 'Egyptian', etc.
  attributeModifiers: AttributeModifier[];
};

export type Race = {
  id: string;
  name: string;
  description: string;
  image: string;
  mythology: string; // 'Norse', 'Greek', 'Egyptian', etc.
  attributeModifiers: AttributeModifier[];
};

export type GameMap = {
    name: string;
    type: string;
    description: string;
}

export type GameAttribute = {
    id: string;
    name: string;
    description: string;
}

export type Character = {
  id: string; // This will be the user's UID from Firebase Auth
  name: string;
  mythology: string;
  race: string;
  gameClass: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  attributePoints: number;
  attributes: Attribute[];
  maxHp: number;
  currentHp: number;
}

export type ClassGroup = {
  id: string;
  name: string;
  baseClassId: string;
  levelRequirement: number;
}

export type Clan = {
  id: string;
  name: string;
  description: string;
  members: string[];
}

export const enemies: Enemy[] = [
    {
        id: 'goblin',
        name: 'Goblin',
        maxHp: 50,
        currentHp: 50,
        attack: 10,
        defense: 5,
    },
    {
        id: 'troll',
        name: 'Troll da Caverna',
        maxHp: 120,
        currentHp: 120,
        attack: 25,
        defense: 15,
    },
    {
        id: 'golem',
        name: 'Golem de Pedra',
        maxHp: 200,
        currentHp: 200,
        attack: 20,
        defense: 30,
    }
];
