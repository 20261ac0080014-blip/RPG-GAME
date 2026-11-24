import React from 'react';
import { EnemyId, HeroOriginId } from '../types/game';

interface PixelGridProps {
  grid: string[];
  palette: Record<string, string>;
  pixelSize?: number;
  className?: string;
  flipX?: boolean;
  label: string;
}

const PixelGrid: React.FC<PixelGridProps> = ({
  grid,
  palette,
  className = '',
  flipX = false,
  label,
}) => {
  const height = grid.length;
  const width = grid[0]?.length ?? 16;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={`pixelated select-none ${className}`}
      role="img"
      aria-label={label}
      style={flipX ? { transform: 'scaleX(-1)' } : undefined}
    >
      {grid.map((row, y) =>
        Array.from(row).map((char, x) => {
          if (char === '.') return null;
          const fill = palette[char];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
};

const HERO_GRIDS: Record<HeroOriginId, string[]> = {
  cavaleiro: [
    '......GGGG......',
    '.....GYYYYG.....',
    '....KKKKKKKK....',
    '...KKSSSSSSKK...',
    '...KKGGGGGGKK...',
    '...KKKEEEEKKK...',
    '....KKKKKKKK....',
    '..PPKKKKKKKK....',
    '.PPPKKGGGGKK.WW.',
    '.PPPKSSSSSSK.WS.',
    '.PPKKSGGGGSK.WS.',
    '.PPKKSSSSSSK.GG.',
    '..PKKGGGGGGK.YY.',
    '...KKSSSSSSK....',
    '...KKK....KKK...',
    '...KKK....KKK...',
    '..GGGG....GGGG..',
    '................',
  ],
  arcano: [
    '.....PPPPPP.....',
    '....PPPPPPPP....',
    '...PPGGGGGGPP...',
    '...PPKKKKKKPP...',
    '...PPKKEEEEPP...',
    '....PKKKKKKP....',
    '..PPPKGGGGKPPP..',
    '.PPPPKPPPPKPPPP.',
    '.PPPKPPGGPPK.VV.',
    '.PPPKPPPPPPK.VP.',
    '..PPKPGYYGPK.VP.',
    '..PPKPPPPPPK.GG.',
    '...PKKGGGGKK.YY.',
    '...KKP....PKK...',
    '...KKK....KKK...',
    '...KKK....KKK...',
    '..GGGG....GGGG..',
    '................',
  ],
  sentinela: [
    '.....GGGGGG.....',
    '....KKKKKKKK....',
    '...KKPPPPPPKK...',
    '...KKKGGGGKKK...',
    '...KKKEEEEKKK...',
    '....KKKKKKKK....',
    '..GGKKKKKKKK....',
    '.GGPKKPPPPKK.SS.',
    '.PPPKKGGGGKK.SW.',
    '.PPKKSKKKKKS.SW.',
    '..PKKSPPPPSK.GG.',
    '..PKKKKKKKKK.YY.',
    '...KKKGGGGKK....',
    '...KKK....KKK...',
    '...KKK....KKK...',
    '...PPP....PPP...',
    '..GGGG....GGGG..',
    '................',
  ],
};

const HERO_PALETTES: Record<HeroOriginId, Record<string, string>> = {
  cavaleiro: {
    K: '#1B1726',
    S: '#CBD5E1',
    G: '#D4AF37',
    Y: '#FDE68A',
    E: '#A855F7',
    P: '#5B21B6',
    W: '#F8FAFC',
  },
  arcano: {
    K: '#14101F',
    P: '#6D28D9',
    G: '#EAB308',
    Y: '#FEF08A',
    E: '#38BDF8',
    V: '#C084FC',
  },
  sentinela: {
    K: '#181424',
    P: '#4C1D95',
    G: '#D97706',
    Y: '#FCD34D',
    E: '#F59E0B',
    S: '#94A3B8',
    W: '#E2E8F0',
  },
};

const SLIME_GRID = [
  '................',
  '......GGGG......',
  '....GGGGGGGG....',
  '...GGGLLLLGGG...',
  '..GGLLWWWWLLGG..',
  '..GGLGGGGGGGGG..',
  '.GGGGKKGGKKGGGG.',
  '.GGGGKYGGYKGGGG.',
  '.GGGGGGGGGGGGGG.',
  '.GGGDDDDDDDDGGG.',
  '.GGDDDDDDDDDDGG.',
  '..DDDDDDDDDDDD..',
  '...DDDD..DDDD...',
  '................',
];

const SLIME_PALETTE: Record<string, string> = {
  G: '#7E22CE',
  L: '#A855F7',
  W: '#F3E8FF',
  D: '#3B0764',
  K: '#09070E',
  Y: '#FACC15',
};

const GOBLIN_GRID = [
  '................',
  '.EE..........EE.',
  '.EEE..GGGG..EEE.',
  '..EEGGGGGGGGEE..',
  '...GGGGGGGGGG...',
  '...GGKKGGKKGG...',
  '...GGYYGGYYGG...',
  '...GGGGKKGGGG...',
  '....GGWWWWGG....',
  '..SS.PPPPPP.....',
  '.SSW.PPYYPP.GG..',
  '.SS..PPPPPP.GG..',
  '.....KKKKKK.....',
  '....GGG..GGG....',
  '....KKK..KKK....',
  '................',
];

const GOBLIN_PALETTE: Record<string, string> = {
  E: '#4D7C0F',
  G: '#65A30D',
  K: '#110D1B',
  Y: '#FACC15',
  W: '#FEF9C3',
  P: '#581C87',
  S: '#94A3B8',
};

const ESQUELETO_GRID = [
  '.....BBBBBB.....',
  '....BBBBBBBB....',
  '...BBBBBBBBBB...',
  '...BBKKBBKKBB...',
  '...BBPEBBPEBB...',
  '....BBBBBBBB....',
  '....BKBKBKBK....',
  '..SS.KKKKKK.....',
  '.SSW.KBBBBK.GG..',
  '.SSW.KBBBBK.GP..',
  '.SS..KBBBBK.GP..',
  '..B..KKKKKK.GG..',
  '.....PP..PP.....',
  '....BBB..BBB....',
  '....BBB..BBB....',
  '...BBBB..BBBB...',
  '................',
];

const ESQUELETO_PALETTE: Record<string, string> = {
  B: '#E2E8F0',
  K: '#171226',
  P: '#A855F7',
  E: '#FDE047',
  S: '#CBD5E1',
  W: '#F8FAFC',
  G: '#B45309',
};

const DRAGAO_GRID = [
  '......GG........GG......',
  '.....GYYG......GYYG.....',
  '...PPKKKK......KKKKPP...',
  '..PPPPKKK......KKKPPPP..',
  '.PPPPPPKKKGGGGKKKPPPPPP.',
  'PPPPPPPKKKKKKKKKKPPPPPPP',
  'PPPP..KKKPPKKPPKKK..PPPP',
  'PPP...KKKEPKKPKEKK...PPP',
  '.P....KKKKKKKKKKKK....P.',
  '......KKWKKKKKKWKK......',
  '.....GKKKKKKKKKKKKG.....',
  '....GGKKKKPPPPKKKKGG....',
  '...KKGKKKPPPPPPKKKGKK...',
  '..KKKKKKKPPYYPPKKKKKKK..',
  '.KKKK.KKKPPPPPPKKK.KKKK.',
  'KKK...KKKKKKKKKKKK...KKK',
  '......KKK..KK..KKK......',
  '.....KKKK..KK..KKKK.....',
  '....GGGG...KK...GGGG....',
  '...........KKK..........',
];

const DRAGAO_PALETTE: Record<string, string> = {
  K: '#120D1D',
  P: '#6B21A8',
  G: '#D97706',
  Y: '#FDE047',
  E: '#EF4444',
  W: '#F8FAFC',
};

export const HeroPixelSprite: React.FC<{
  origin: HeroOriginId;
  className?: string;
}> = ({ origin, className = 'w-28 h-28' }) => {
  return (
    <PixelGrid
      grid={HERO_GRIDS[origin]}
      palette={HERO_PALETTES[origin]}
      className={className}
      label={`Herói ${origin}`}
    />
  );
};

export const EnemyPixelSprite: React.FC<{
  enemyId: EnemyId;
  className?: string;
}> = ({ enemyId, className }) => {
  switch (enemyId) {
    case 'slime':
      return (
        <PixelGrid
          grid={SLIME_GRID}
          palette={SLIME_PALETTE}
          className={className ?? 'w-24 h-24'}
          label="Slime"
        />
      );
    case 'goblin':
      return (
        <PixelGrid
          grid={GOBLIN_GRID}
          palette={GOBLIN_PALETTE}
          className={className ?? 'w-28 h-28'}
          label="Goblin"
        />
      );
    case 'esqueleto':
      return (
        <PixelGrid
          grid={ESQUELETO_GRID}
          palette={ESQUELETO_PALETTE}
          className={className ?? 'w-28 h-28'}
          label="Esqueleto"
        />
      );
    case 'dragao':
      return (
        <PixelGrid
          grid={DRAGAO_GRID}
          palette={DRAGAO_PALETTE}
          className={className ?? 'w-40 h-36 sm:w-48 sm:h-40'}
          label="Dragão das Sombras"
        />
      );
  }
};

export const PotionPixelIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <PixelGrid
    grid={[
      '....GGGG....',
      '....YYYY....',
      '.....KK.....',
      '....KWWK....',
      '...KRRRRK...',
      '..KRRRRWRK..',
      '..KRRRRRRK..',
      '..KRRRRRRK..',
      '..KDDDDDDK..',
      '...KKKKKK...',
    ]}
    palette={{
      G: '#D97706',
      Y: '#FDE68A',
      K: '#1E1B2E',
      W: '#FECDD3',
      R: '#E11D48',
      D: '#9F1239',
    }}
    className={className}
    label="Poção de Vida"
  />
);
