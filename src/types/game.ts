export type GameScreen =
  | 'TITLE'
  | 'CHARACTER'
  | 'HUB'
  | 'BATTLE'
  | 'VICTORY'
  | 'DEFEAT'
  | 'FINAL_VICTORY';

export type HeroOriginId = 'cavaleiro' | 'arcano' | 'sentinela';

export type EnemyId = 'slime' | 'goblin' | 'esqueleto' | 'dragao';

export interface HeroOrigin {
  id: HeroOriginId;
  title: string;
  subtitle: string;
  lore: string;
  weaponName: string;
  specialName: string;
}

export interface PlayerState {
  name: string;
  origin: HeroOriginId;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  energy: number;
  maxEnergy: number;
  xp: number;
  xpToNextLevel: number;
  potions: number;
  maxPotions: number;
  score: number;
  defeatedCount: number;
}

export interface EnemyDefinition {
  id: EnemyId;
  stageNumber: number;
  name: string;
  difficultyLabel: string;
  title: string;
  description: string;
  storyIntro: string;
  maxHp: number;
  attack: number;
  xpReward: number;
  scoreReward: number;
  potionDrop: number;
  isBoss: boolean;
  specialAttackName?: string;
}

export interface BattleLogEntry {
  id: number;
  turn: number;
  actor: 'player' | 'enemy' | 'system';
  message: string;
}

export interface LevelUpSummary {
  previousLevel: number;
  newLevel: number;
  hpBonus: number;
  attackBonus: number;
  energyBonus: number;
}

export interface VictorySummary {
  enemy: EnemyDefinition;
  xpGained: number;
  scoreGained: number;
  potionsGained: number;
  turnsTaken: number;
  levelUps: LevelUpSummary[];
}

export interface FloatingPopup {
  id: number;
  target: 'player' | 'enemy';
  text: string;
  variant: 'damage' | 'critical' | 'heal' | 'block' | 'energy';
}
