import React from 'react';
import { RotateCcw, Skull } from 'lucide-react';
import { EnemyDefinition, PlayerState } from '../../types/game';
import { EnemyPixelSprite, HeroPixelSprite } from '../PixelSprites';

interface DefeatScreenProps {
  player: PlayerState;
  defeatedBy: EnemyDefinition;
  onRestart: () => void;
}

export const DefeatScreen: React.FC<DefeatScreenProps> = ({
  player,
  defeatedBy,
  onRestart,
}) => {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
      <section className="rounded-lg border border-[#5B2130] bg-[#150C16] p-6 text-center sm:p-8">
        <div className="mb-5 flex items-center justify-center gap-6">
          <div className="opacity-55 grayscale">
            <HeroPixelSprite origin={player.origin} className="h-20 w-20" />
          </div>
          <div className="animate-rpg-idle">
            <EnemyPixelSprite enemyId={defeatedBy.id} className="h-24 w-24" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#F87171] uppercase">
          <Skull className="h-4 w-4" />
          <span>Derrota em Eldoria</span>
        </div>

        <h1 className="font-display mt-1 text-balance text-3xl font-bold text-[#FBF7EE]">
          Sua Jornada Terminou Aqui
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#CFC4DC]">
          {player.name} tombou diante de <strong>{defeatedBy.name}</strong>. Mas as lendas
          de Eldoria nunca morrem — erga-se novamente e tente uma nova estratégia!
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-md border border-[#3B202C] bg-[#0D070E] p-3">
            <div className="text-xs text-[#A598BE]">Nível Alcançado</div>
            <div className="font-mono-num mt-1 text-lg font-bold text-[#F4EFE6]">
              {player.level}
            </div>
          </div>
          <div className="rounded-md border border-[#3B202C] bg-[#0D070E] p-3">
            <div className="text-xs text-[#A598BE]">Inimigos Vencidos</div>
            <div className="font-mono-num mt-1 text-lg font-bold text-[#F4EFE6]">
              {player.defeatedCount} / 4
            </div>
          </div>
          <div className="rounded-md border border-[#3B202C] bg-[#0D070E] p-3">
            <div className="text-xs text-[#A598BE]">Pontuação Final</div>
            <div className="font-mono-num mt-1 text-lg font-bold text-[#FDE047]">
              {player.score}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#FDE047] bg-[#D4AF37] px-8 py-3 text-sm font-bold text-[#0D0A14] transition-colors hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDE047]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar Jogo</span>
          </button>
        </div>
      </section>
    </main>
  );
};
