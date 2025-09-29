
export type GameClass = {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  image: string;
};

export type Race = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Temple = {
    name: string;
    type: string;
    description: string;
}

export type Character = {
  id: string;
  name: string;
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

export const gameClasses: GameClass[] = [
  {
    id: 'warrior',
    name: 'Guerreiro',
    description: 'Mestres do combate corpo a corpo, os guerreiros confiam na força bruta e em armaduras pesadas para dominar o campo de batalha.',
    strengths: ['Alta vida', 'Defesa robusta', 'Dano consistente'],
    weaknesses: ['Vulnerável à magia', 'Baixa mobilidade'],
    image: 'warrior-class',
  },
  {
    id: 'mage',
    name: 'Mago',
    description: 'Manipuladores das artes arcanas, os magos podem dizimar inimigos à distância com feitiços poderosos, mas são frágeis em combate próximo.',
    strengths: ['Dano em área massivo', 'Controle de grupo', 'Utilidade versátil'],
    weaknesses: ['Baixa vida', 'Defesa fraca', 'Dependente de mana'],
    image: 'mage-class',
  },
  {
    id: 'archer',
    name: 'Arqueiro',
    description: 'Precisos e ágeis, os arqueiros se destacam em eliminar alvos de longe, usando sua velocidade para manter distância dos perigos.',
    strengths: ['Alto dano a um único alvo', 'Excelente alcance', 'Alta mobilidade'],
    weaknesses: ['Fraco em combate corpo a corpo', 'Vulnerável a controle de grupo'],
    image: 'archer-class',
  },
];

export const races: Race[] = [
  {
    id: 'human',
    name: 'Humano',
    description: 'Adaptáveis e versáteis, os humanos são a raça mais comum e podem se destacar em qualquer classe que escolherem.',
    image: 'human-race'
  },
  {
    id: 'elf',
    name: 'Elfo',
    description: 'Graciosos e com uma afinidade natural com a magia e a natureza, os elfos são excelentes magos e arqueiros.',
    image: 'elf-race'
  },
  {
    id: 'dwarf',
    name: 'Anão',
    description: 'Robustos e resilientes, os anões são mestres ferreiros e guerreiros formidáveis, conhecidos por sua resistência inabalável.',
    image: 'dwarf-race'
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
