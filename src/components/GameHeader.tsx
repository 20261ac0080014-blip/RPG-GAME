import React from 'react';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { PlayerState } from '../types/game';

interface GameHeaderProps {
  player: PlayerState;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  showPlayerStats: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  player,
  isMuted,
  onToggleMute,
  onRestart,
  showPlayerStats,
}) => {
  return (
    <header className="w-full border-b border-[#2E2246] bg-[#0C0914]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
        <span className="font-display whitespace-nowrap shrink-0 text-base font-bold tracking-wide text-[#EAB308] sm:text-lg">
          Lendas de Eldoria
        </span>

        {showPlayerStats ? (
          <div className="hidden items-center gap-3 text-xs text-[#C4B8D9] md:flex whitespace-nowrap">
            <span className="font-medium text-[#F4EFE6]">{player.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">Nível {player.level}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">
              HP {player.hp}/{player.maxHp}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num text-[#FDE047]">{player.score} pts</span>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="flex items-center gap-2 shrink-0 sm:gap-3">
          <button
            type="button"
            onClick={onToggleMute}
            className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#362954] bg-[#161024] px-3 py-2 text-xs font-medium text-[#DFD7EC] transition-colors hover:border-[#D4AF37]/60 hover:text-[#FDE68A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            <span>{isMuted ? 'Mudo' : 'Som'}</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-[#5B4317] bg-[#1C140A] px-3 py-2 text-xs font-semibold text-[#FDE68A] transition-colors hover:border-[#EAB308] hover:bg-[#2A1D0C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
