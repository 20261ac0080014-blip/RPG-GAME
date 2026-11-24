import React, { useState } from 'react';
import { Crown, RotateCcw, Trophy } from 'lucide-react';
import { TITLE_BACKDROP_URL } from '../../data/gameData';
import { PlayerState, VictorySummary } from '../../types/game';
import { HeroPixelSprite } from '../PixelSprites';

interface FinalVictoryScreenProps {
  player: PlayerState;
  summary: VictorySummary;
  onRestart: () => void;
}

export const FinalVictoryScreen: React.FC<FinalVictoryScreenProps> = ({
  player,
  summary,
  onRestart,
}) => {
  const [bgError, setBgError] = useState(false);

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      {!bgError ? (
        <img
          src={TITLE_BACKDROP_URL}
          alt="Reino de Eldoria salvo após a queda do Dragão das Sombras"
          referrerPolicy="no-referrer"
          onError={() => setBgError(true)}
          className="pixelated absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#2A1947] via-[#130C21] to-[#09070E]"
          aria-hidden="true"
        />
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#09070E] via-[#09070E]/80 to-[#09070E]/60"
        aria-hidden="true"
      />

      <section className="relative z-10 w-full max-w-2xl rounded-lg border border-[#D4AF37] bg-[#120D1E]/95 p-6 text-center shadow-[0_0_40px_rgba(212,175,55,0.2)] sm:p-10">
        <div className="mb-4 flex justify-center">
          <div className="animate-rpg-idle flex h-28 w-28 items-center justify-center rounded-lg border border-[#EAB308]/60 bg-[#0B0813]">
            <HeroPixelSprite origin={player.origin} className="h-24 w-24" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#FDE047] uppercase">
          <Crown className="h-4 w-4" />
          <span>Vitória Final · O Dragão das Sombras Caiu</span>
        </div>

        <h1 className="font-display mt-2 text-balance text-3xl font-extrabold text-[#FBF7EE] sm:text-4xl">
          Eldoria Está Salva!
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#DDD5EA] sm:text-base">
          Com um golpe derradeiro em {summary.turnsTaken} turnos,{' '}
          <strong className="text-[#FDE68A]">{player.name}</strong> derrotou o Dragão das
          Sombras. A névoa maligna dissipou-se dos céus e seu nome será cantado para sempre
          nas crônicas de Eldoria.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-[#3B2C59] bg-[#0B0813] p-3">
            <div className="text-xs text-[#A598BE]">Pontuação Total</div>
            <div className="font-mono-num mt-1 flex items-center justify-center gap-1 text-lg font-bold text-[#FDE047]">
              <Trophy className="h-4 w-4" />
              <span>{player.score}</span>
            </div>
          </div>

          <div className="rounded-md border border-[#3B2C59] bg-[#0B0813] p-3">
            <div className="text-xs text-[#A598BE]">Nível Final</div>
            <div className="font-mono-num mt-1 text-lg font-bold text-[#C084FC]">
              {player.level}
            </div>
          </div>

          <div className="rounded-md border border-[#3B2C59] bg-[#0B0813] p-3">
            <div className="text-xs text-[#A598BE]">Batalhas Vencidas</div>
            <div className="font-mono-num mt-1 text-lg font-bold text-[#34D399]">
              4 / 4
            </div>
          </div>

          <div className="rounded-md border border-[#3B2C59] bg-[#0B0813] p-3">
            <div className="text-xs text-[#A598BE]">HP Restante</div>
            <div className="font-mono-num mt-1 text-lg font-bold text-[#F4EFE6]">
              {player.hp}/{player.maxHp}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#FDE047] bg-[#D4AF37] px-8 py-3 text-sm font-bold text-[#0D0A14] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDE047]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Jogar Novamente</span>
          </button>
        </div>
      </section>
    </main>
  );
};
