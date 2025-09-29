
export type GameClass = {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  image: string;
  mythology: string; // 'Norse', 'Greek', 'Egyptian', etc.
};

export type Race = {
  id: string;
  name: string;
  description: string;
  image: string;
  mythology: string; // 'Norse', 'Greek', 'Egyptian', etc.
};

export type Temple = {
    name: string;
    type: string;
    description: string;
}

export type Character = {
  id: string;
  name: string;
  mythology: string;
  race: string;
  gameClass: string;
  level: number;
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

export const mythologies = [
    { id: 'Norse', name: 'Nórdica' },
    { id: 'Greek', name: 'Grega' },
    { id: 'Egyptian', name: 'Egípcia' },
    { id: 'Japanese', name: 'Japonesa' },
    { id: 'Aztec', name: 'Asteca' },
];

export const gameClasses: GameClass[] = [
  // Norse
  {
    id: 'berserker',
    name: 'Berserker',
    description: 'Guerreiros ferozes que entram em fúria de batalha, canalizando espíritos animais para força e resistência sobrenaturais.',
    strengths: ['Dano massivo', 'Resistência a dano', 'Imunidade a controle'],
    weaknesses: ['Defesa baixa após fúria', 'Sem ataques à distância'],
    image: 'berserker-class',
    mythology: 'Norse',
  },
  {
    id: 'seidr',
    name: 'Seidr',
    description: 'Feiticeiros do destino que manipulam os fios da realidade, usando runas para prever o futuro e lançar maldições ou bênçãos.',
    strengths: ['Controle de grupo', 'Debuffs poderosos', 'Suporte'],
    weaknesses: ['Dano direto baixo', 'Frágil'],
    image: 'seidr-class',
    mythology: 'Norse',
  },
  // Greek
  {
    id: 'hoplite',
    name: 'Hoplita',
    description: 'Soldados disciplinados que lutam em formação, usando lança e escudo com precisão mortal e táticas de batalha superiores.',
    strengths: ['Defesa impenetrável', 'Trabalho em equipe', 'Contra-ataque'],
    weaknesses: ['Lento', 'Vulnerável a flanqueamento'],
    image: 'hoplite-class',
    mythology: 'Greek',
  },
  {
    id: 'oracle',
    name: 'Oráculo',
    description: 'Escolhidos pelos deuses para transmitir profecias, seus poderes vêm da inspiração divina, curando aliados e punindo inimigos.',
    strengths: ['Cura poderosa', 'Buffs de grupo', 'Dano sagrado'],
    weaknesses: ['Baixa vida', 'Dependente dos favores divinos'],
    image: 'oracle-class',
    mythology: 'Greek',
  },
  // Egyptian
  {
    id: 'medjay',
    name: 'Medjay',
    description: 'Protetores do faraó e guardiões do deserto, são guerreiros versáteis, proficientes com arco e lâmina dupla.',
    strengths: ['Versatilidade', 'Mobilidade', 'Dano consistente'],
    weaknesses: ['Sem especialização extrema', 'Defesa mediana'],
    image: 'medjay-class',
    mythology: 'Egyptian',
  },
  {
    id: 'priest-of-ra',
    name: 'Sacerdote de Rá',
    description: 'Invocadores que canalizam o poder do sol para queimar inimigos com fogo sagrado e curar aliados com sua luz.',
    strengths: ['Dano de fogo', 'Cura em área', 'Anti-mortos-vivos'],
    weaknesses: ['Poder reduzido à noite', 'Armadura leve'],
    image: 'priest-class',
    mythology: 'Egyptian',
  },
  // Japanese
  {
    id: 'samurai',
    name: 'Samurai',
    description: 'Guerreiros nobres que seguem o código do Bushido, mestres da katana, cuja honra e precisão são inigualáveis.',
    strengths: ['Duelos 1v1', 'Dano preciso e alto', 'Posturas de combate'],
    weaknesses: ['Pouco dano em área', 'Rígido código de conduta'],
    image: 'samurai-class',
    mythology: 'Japanese',
  },
    {
    id: 'onmyoji',
    name: 'Onmyoji',
    description: 'Mestres do yin e yang, usam talismãs de papel (shikigami) para invocar espíritos e controlar os elementos.',
    strengths: ['Invocação de familiares', 'Controle elemental', 'Exorcismo'],
    weaknesses: ['Longo tempo de conjuração', 'Vulnerável sem seus talismãs'],
    image: 'onmyoji-class',
    mythology: 'Japanese',
  },
  // Aztec
  {
    id: 'jaguar-warrior',
    name: 'Guerreiro Jaguar',
    description: 'Guerreiros de elite que vestem peles de jaguar, conhecidos por sua ferocidade, furtividade e maestria com a macuahuitl.',
    strengths: ['Furtividade', 'Dano de emboscada', 'Combate selvagem'],
    weaknesses: ['Armadura leve', 'Suscetível a armadilhas'],
    image: 'jaguar-warrior-class',
    mythology: 'Aztec',
  },
  {
    id: 'sun-priest',
    name: 'Sacerdote do Sol',
    description: 'Devotos de Huitzilopochtli que realizam sacrifícios para alimentar o sol, usando sangue e fogo em seus rituais de poder.',
    strengths: ['Magia de sangue', 'Dano de fogo sacrificial', 'Fortalecimento de aliados'],
    weaknesses: ['Requer sacrifício de vida', 'Moralidade questionável'],
    image: 'sun-priest-class',
    mythology: 'Aztec',
  },
];

export const races: Race[] = [
    // Norse
    {
        id: 'aesir',
        name: 'Aesir',
        description: 'Descendentes dos deuses da guerra e do poder, como Odin e Thor. Nascidos para liderar e lutar, com uma afinidade natural para o combate.',
        image: 'aesir-race',
        mythology: 'Norse',
    },
    {
        id: 'vanir',
        name: 'Vanir',
        description: 'Ligados à natureza, magia e prosperidade, os Vanir são um povo mais pacífico, mas ferozes quando protegem suas terras e entes queridos.',
        image: 'vanir-race',
        mythology: 'Norse',
    },
    // Greek
    {
        id: 'demigod',
        name: 'Semideus',
        description: 'Filhos de um deus e um mortal, possuem habilidades extraordinárias herdadas de seu parente divino, mas carregam o peso de grandes expectativas.',
        image: 'demigod-race',
        mythology: 'Greek',
    },
    {
        id: 'nymph',
        name: 'Ninfa',
        description: 'Espíritos da natureza ligados a uma localização específica, como uma fonte, uma gruta ou uma floresta. São belas, graciosas e protetoras.',
        image: 'nymph-race',
        mythology: 'Greek',
    },
    // Egyptian
    {
        id: 'blessed-of-horus',
        name: 'Abençoado de Hórus',
        description: 'Mortais que carregam a bênção do deus-falcão Hórus. Possuem visão aguçada e um senso inato de justiça e liderança.',
        image: 'horus-race',
        mythology: 'Egyptian',
    },
    {
        id: 'risen-mummy',
        name: 'Múmia Renascida',
        description: 'Almas que foram mumificadas e retornaram à vida por um ritual poderoso. São resistentes, imortais e guardam segredos antigos.',
        image: 'mummy-race',
        mythology: 'Egyptian',
    },
    // Japanese
    {
        id: 'kitsune',
        name: 'Kitsune',
        description: 'Espíritos de raposa mágicos e inteligentes, conhecidos por suas ilusões, sabedoria e caudas múltiplas que indicam seu poder.',
        image: 'kitsune-race',
        mythology: 'Japanese',
    },
    {
        id: 'oni-kin',
        name: 'Oni-Kin',
        description: 'Humanoides com sangue de demônios Oni, possuem grande força e uma aparência intimidadora, mas nem todos são maus por natureza.',
        image: 'oni-race',
        mythology: 'Japanese',
    },
    // Aztec
    {
        id: 'nagual',
        name: 'Nagual',
        description: 'Xamãs que possuem a habilidade de se transformar em uma forma animal, geralmente um jaguar, puma ou águia.',
        image: 'nagual-race',
        mythology: 'Aztec',
    },
     {
        id: 'born-of-quetzalcoatl',
        name: 'Nascido de Quetzalcoatl',
        description: 'Descendentes da Serpente Emplumada, são sábios e artísticos, com uma conexão profunda com o céu, o conhecimento e a criação.',
        image: 'quetzalcoatl-race',
        mythology: 'Aztec',
    },
];


export const temples: Temple[] = [
    {
        name: 'Templo Asteca',
        type: 'Aztec',
        description: 'Explore ruínas antigas e decifre enigmas baseados em calendários solares e sacrifícios rituais.',
    },
    {
        name: 'Cidadela Inca',
        type: 'Inca',
        description: 'Navegue por terraços de pedra e pontes de corda, resolvendo quebra-cabeças de quipus e astronomia.',
    },
    {
        name: 'Salão Nórdico',
        type: 'Norse',
        description: 'Enfrente o frio e prove seu valor aos deuses nórdicos com desafios de runas e sagas épicas.',
    },
    {
        name: 'Acrópole Grega',
        type: 'Greek',
        description: 'Suba ao panteão e enfrente os enigmas lógicos dos filósofos e os doze trabalhos de Hércules.',
    },
    {
        name: 'Pagode Japonês',
        type: 'Japanese',
        description: 'Encontre a harmonia e a iluminação através de koans Zen, haikais e a estratégia do Go.',
    },
    {
        name: 'Pirâmide Egípcia',
        type: 'Egyptian',
        description: 'Desvende hieróglifos, evite armadilhas mortais e responda ao enigma da Esfinge para saquear o tesouro do faraó.',
    },
]

export const classGroups: ClassGroup[] = [
  {
    id: 'group-1',
    name: 'Gladiador',
    baseClassId: 'warrior',
    levelRequirement: 10,
  },
  {
    id: 'group-2',
    name: 'Senhor da Guerra',
    baseClassId: 'warrior',
    levelRequirement: 20,
  },
   {
    id: 'group-3',
    name: 'Arcanista',
    baseClassId: 'mage',
    levelRequirement: 10,
  }
]

export const clans: Clan[] = [
  {
    id: 'clan-1',
    name: 'Guardiões de Aço',
    description: 'Um clã de guerreiros honrados que protegem os fracos.',
    members: ['Jogador1', 'Admin', 'HeróiAnônimo'],
  },
  {
    id: 'clan-2',
    name: 'Círculo Arcano',
    description: 'Mestres das artes místicas em busca de conhecimento proibido.',
    members: ['FeiticeiroSupremo', 'MagaEstelar'],
  },
  {
    id: 'clan-3',
    name: 'Flechas Sombrias',
    description: 'Rastreadores e assassinos que operam nas sombras.',
    members: ['ArqueiraFantasma', 'SombraSilenciosa', 'CaçadorNoturno'],
  }
];
