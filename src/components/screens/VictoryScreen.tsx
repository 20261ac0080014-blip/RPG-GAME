import React from 'react';
import { ArrowRight, RotateCcw, TrendingUp, Trophy } from 'lucide-react';
import { PlayerState, VictorySummary } from '../../types/game';
import { EnemyPixelSprite, HeroPixelSprite, PotionPixelIcon } from '../PixelSprites';
import { StatBar } from '../StatBar';

interface VictoryScreenProps {
  player: PlayerState;
  summary: VictorySummary;
  onContinue: () => void;
  onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  player,
  summary,
  onContinue,
  onRestart,
}) => {
  const leveledUp = summary.levelUps.length > 0;
  const lastLevelUp = leveledUp ? summary.levelUps[summary.levelUps.length - 1] : null;
  const firstLevelUp = leveledUp ? summary.levelUps[0] : null;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
      <section className="rounded-lg border border-[#5B4317] bg-[#130E20] p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-6">
            <div className="animate-rpg-idle">
              <HeroPixelSprite origin={player.origin} className="h-20 w-20 sm:h-24 sm:w-24" />
            </div>
            <div className="opacity-45 grayscale">
              <EnemyPixelSprite enemyId={summary.enemy.id} className="h-16 w-16 sm:h-20 sm:w-20" />
            </div>
          </div>

          <p className="text-xs font-semibold tracking-widest text-[#34D399] uppercase">
            Inimigo Derrotado
          </p>
          <h1 className="font-display mt-1 text-balance text-2xl font-bold text-[#FDE68A] sm:text-3xl">
            Vitória contra {summary.enemy.name}!
          </h1>
          <p className="mt-2 text-sm text-[#BEB4D1]">
            Você superou {summary.enemy.name} em {summary.turnsTaken}{' '}
            {summary.turnsTaken === 1 ? 'turno' : 'turnos'} e abriu caminho rumo ao coração
            de Eldoria.
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-[#2D2144] bg-[#0B0813] p-3.5 text-center">
            <div className="text-xs text-[#A598BE]">Experiência Ganha</div>
            <div className="font-mono-num mt-1 text-xl font-bold text-[#EAB308]">
              +{summary.xpGained} XP
            </div>
          </div>

          <div className="rounded-md border border-[#2D2144] bg-[#0B0813] p-3.5 text-center">
            <div className="text-xs text-[#A598BE]">Pontuação</div>
            <div className="font-mono-num mt-1 flex items-center justify-center gap-1.5 text-xl font-bold text-[#FBF7EE]">
              <Trophy className="h-4 w-4 text-[#EAB308]" />
              <span>+{summary.scoreGained}</span>
            </div>
          </div>

          <div className="rounded-md border border-[#2D2144] bg-[#0B0813] p-3.5 text-center">
            <div className="text-xs text-[#A598BE]">Espólio</div>
            <div className="font-mono-num mt-1 flex items-center justify-center gap-1.5 text-base font-bold text-[#34D399]">
              {summary.potionsGained > 0 ? (
                <>
                  <PotionPixelIcon className="h-5 w-5" />
                  <span>+{summary.potionsGained} Poção</span>
                </>
              ) : (
                <span className="text-sm text-[#9488AD]">Nenhuma poção</span>
              )}
            </div>
          </div>
        </div>

        {/* Level Up Highlight */}
        {leveledUp && firstLevelUp && lastLevelUp && (
          <div className="mt-5 rounded-md border border-[#EAB308] bg-[#21180E] p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#FDE047]">
              <TrendingUp className="h-4 w-4 shrink-0" />
              <span>
                Subiu de Nível! Nível {firstLevelUp.previousLevel} → Nível{' '}
                {lastLevelUp.newLevel}
              </span>
            </div>
            <p className="font-mono-num mt-1.5 text-xs text-[#F4EFE6]">
              Vida Máxima +
              {summary.levelUps.reduce((acc, l) => acc + l.hpBonus, 0)} (Total:{' '}
              {player.maxHp}) · Ataque +
              {summary.levelUps.reduce((acc, l) => acc + l.attackBonus, 0)} (Total:{' '}
              {player.attack}) · Energia restaurada!
            </p>
          </div>
        )}

        {/* Current Bars */}
        <div className="mt-5 space-y-3 border-t border-[#2D2144] pt-5">
          <StatBar label="Vida Atual (HP)" current={player.hp} max={player.maxHp} variant="hp" />
          <StatBar
            label={`Experiência (Nível ${player.level})`}
            current={player.xp}
            max={player.xpToNextLevel}
            variant="xp"
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#3B2D59] bg-[#161024] px-5 py-2.5 text-sm font-medium text-[#DFD7EC] transition-colors hover:border-[#6B549E] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar Jogo</span>
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#FDE047] bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#0D0A14] transition-colors hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDE047]"
          >
            <span>Continuar Aventura</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
};
