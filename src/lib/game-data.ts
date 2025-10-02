

// Basic types used across different data structures
export type Parameter = {
  name: 'Força' | 'Resistência' | 'Agilidade' | 'Mana' | 'Sorte' | 'NP';
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'EX';
};

export type Skill = {
  name: string;
  rank: string;
  description: string;
};

export type NoblePhantasm = {
  name: string;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'EX';
  type: string;
  description: string;
};

// The Heroic Spirit, summoned by a Master
export type Servant = {
  className: 'Saber' | 'Archer' | 'Lancer' | 'Rider' | 'Caster' | 'Assassin' | 'Berserker';
  trueName: string;
  backstory: string;
  personality: string;
  parameters: Parameter[];
  classSkills: Skill[];
  personalSkills: Skill[];
  noblePhantasm: NoblePhantasm;
  imageUrl: string;
  imageHint: string;
};

// The Player Character, a Master in the Holy Grail War
export type Character = {
  id: string; // This will be the user's UID from Firebase Auth
  name: string; // Master's name
  level: number;
  servant: Servant | null;
}

// Represents an enemy in a battle scenario
export type Enemy = {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
}

// Maps or locations for battles/events
export type GameMap = {
    name: string;
    type: string;
    description: string;
}

// --- Legacy Types (to be phased out or repurposed) ---

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
  classId: string; 
}

export type Weapon = {
  id: string;
  name: string;
  description: string;
  type: 'Espada' | 'Machado' | 'Arco' | 'Cajado' | 'Adaga' | 'Lança';
  damage: number;
  rarity: 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário';
  classRequirement: string[];
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
  mythology: string; 
  attributeModifiers: AttributeModifier[];
};

export type Race = {
  id: string;
  name: string;
  description: string;
  image: string;
  mythology: string; 
  attributeModifiers: AttributeModifier[];
};

export type GameAttribute = {
    id: string;
    name: string;
    description: string;
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
        name: 'Homúnculo Defeituoso',
        maxHp: 50,
        currentHp: 50,
        attack: 10,
        defense: 5,
    },
    {
        id: 'troll',
        name: 'Besta Mágica Descontrolada',
        maxHp: 120,
        currentHp: 120,
        attack: 25,
        defense: 15,
    },
    {
        id: 'golem',
        name: 'Golem Guardião de Oficina',
        maxHp: 200,
        currentHp: 200,
        attack: 20,
        defense: 30,
    }
];
