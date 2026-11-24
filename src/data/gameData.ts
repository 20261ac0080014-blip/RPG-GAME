import { EnemyDefinition, HeroOrigin, PlayerState } from '../types/game';

export const TITLE_BACKDROP_URL = '/src/assets/images/eldoria_title_backdrop_1795519459792.jpg';
export const BATTLE_ARENA_URL = '/src/assets/images/eldoria_battle_arena_1795519462071.jpg';

export const SPECIAL_ATTACK_ENERGY_COST = 35;
export const NORMAL_ATTACK_ENERGY_GAIN = 15;
export const DEFEND_ENERGY_GAIN = 25;
export const POTION_HEAL_AMOUNT = 30;
export const DEFEND_DAMAGE_REDUCTION = 0.65;

export const HERO_ORIGINS: HeroOrigin[] = [
  {
    id: 'cavaleiro',
    title: 'Cavaleiro de Eldoria',
    subtitle: 'Guarda Real da Cidadela',
    lore: 'Forjado nos pátios da antiga fortaleza real, empunha aço consagrado e escudo dourado para proteger o reino.',
    weaponName: 'Lâmina da Coroa',
    specialName: 'Golpe Real Dourado',
  },
  {
    id: 'arcano',
    title: 'Guardião Arcano',
    subtitle: 'Ordem da Chama Violeta',
    lore: 'Mestre das runas ancestrais de Eldoria, canaliza a energia púrpura da cidadela diretamente na ponta de sua espada.',
    weaponName: 'Espada Rúnica',
    specialName: 'Fúria Violeta',
  },
  {
    id: 'sentinela',
    title: 'Sentinela das Sombras',
    subtitle: 'Vanguarda da Fronteira',
    lore: 'Veterano das muralhas externas, combina precisão mortal e disciplina inabalável contra as hordas sombrias.',
    weaponName: 'Alfanje Real',
    specialName: 'Corte Crepuscular',
  },
];

export const ENEMIES: EnemyDefinition[] = [
  {
    id: 'slime',
    stageNumber: 1,
    name: 'Slime',
    difficultyLabel: 'Inimigo Inicial',
    title: 'Limo Corrompido dos Pântanos',
    description:
      'Uma criatura gelatinosa impregnada pela névoa sombria que avançou pelos portões inferiores do reino.',
    storyIntro:
      'Nos arredores das muralhas de Eldoria, o solo treme sob um limo escuro que devora as colheitas. Derrote o Slime para abrir caminho até a floresta maldita.',
    maxHp: 65,
    attack: 11,
    xpReward: 50,
    scoreReward: 120,
    potionDrop: 0,
    isBoss: false,
  },
  {
    id: 'goblin',
    stageNumber: 2,
    name: 'Goblin',
    difficultyLabel: 'Inimigo Intermediário',
    title: 'Saqueador da Mata Negra',
    description:
      'Um guerreiro ágil armado com adaga serrilhada e armadura roubada dos batedores reais.',
    storyIntro:
      'Com os pântanos livres, você adentra a estrada da Ponte Antiga. Um Goblin saqueador bloqueia a passagem rumo às catacumbas da cidadela.',
    maxHp: 105,
    attack: 16,
    xpReward: 80,
    scoreReward: 260,
    potionDrop: 1,
    isBoss: false,
  },
  {
    id: 'esqueleto',
    stageNumber: 3,
    name: 'Esqueleto',
    difficultyLabel: 'Inimigo Difícil',
    title: 'Guardião Amaldiçoado da Cripta',
    description:
      'Um antigo cavaleiro reanimado por magia negra, protegido por escudo férreo e golpes implacáveis.',
    storyIntro:
      'Diante das portas da Cidadela Sombria, os ossos de um antigo defensor erguem-se envoltos em chamas violetas. Somente superando-o você alcançará o trono.',
    maxHp: 150,
    attack: 22,
    xpReward: 120,
    scoreReward: 450,
    potionDrop: 1,
    isBoss: false,
  },
  {
    id: 'dragao',
    stageNumber: 4,
    name: 'Dragão das Sombras',
    difficultyLabel: 'Chefão Final',
    title: 'Soberano do Eclipse de Eldoria',
    description:
      'A fera colossal que lançou a escuridão sobre o reino. Alterna garras devastadoras com seu temido Sopro Sombrio.',
    storyIntro:
      'No salão mais alto da cidadela em ruínas, o Dragão das Sombras abre suas asas negras. O destino de toda Eldoria será decidido neste duelo final.',
    maxHp: 240,
    attack: 29,
    xpReward: 300,
    scoreReward: 1200,
    potionDrop: 0,
    isBoss: true,
    specialAttackName: 'Sopro Sombrio',
  },
];

export function createInitialPlayer(name = 'Aldric', origin: HeroOrigin['id'] = 'cavaleiro'): PlayerState {
  return {
    name: name.trim() || 'Aldric',
    origin,
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 20,
    energy: 100,
    maxEnergy: 100,
    xp: 0,
    xpToNextLevel: 50,
    potions: 3,
    maxPotions: 5,
    score: 0,
    defeatedCount: 0,
  };
}

export function getXpThresholdForLevel(level: number): number {
  if (level === 1) return 50;
  if (level === 2) return 80;
  if (level === 3) return 120;
  return 120 + (level - 3) * 60;
}
