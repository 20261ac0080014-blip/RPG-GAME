import React, { useState } from 'react';
import { Swords, Shield, Sparkles } from 'lucide-react';
import { TITLE_BACKDROP_URL } from '../../data/gameData';
import { HeroPixelSprite, EnemyPixelSprite } from '../PixelSprites';

interface TitleScreenProps {
  onStartAdventure: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartAdventure }) => {
  const [bgError, setBgError] = useState(false);

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-[540px] flex-1 items-center justify-center overflow-hidden border-b border-[#2E2246] px-4 py-12 sm:px-6 lg:min-h-[600px]">
        {!bgError ? (
          <img
            src={TITLE_BACKDROP_URL}
            alt="Cidadela medieval de Eldoria sob um céu roxo ao luar"
            referrerPolicy="no-referrer"
            onError={() => setBgError(true)}
            className="pixelated absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#23143D] via-[#130D21] to-[#09070E]"
            aria-hidden="true"
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#09070E] via-[#09070E]/75 to-[#0B0814]/50"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="mb-6 flex items-end justify-center gap-6 sm:gap-10">
            <div className="animate-rpg-idle flex flex-col items-center">
              <HeroPixelSprite origin="cavaleiro" className="h-20 w-20 sm:h-24 sm:w-24" />
            </div>
            <div className="animate-rpg-boss flex flex-col items-center">
              <EnemyPixelSprite enemyId="dragao" className="h-24 w-28 sm:h-28 sm:w-32" />
            </div>
          </div>

          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#EAB308] uppercase">
            Crônicas de Fantasia Medieval
          </p>

          <h1 className="font-display max-w-2xl text-balance text-4xl font-extrabold tracking-tight text-[#FBF7EE] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl">
            Lendas de Eldoria
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#DDD5EA] sm:text-lg">
            Criaturas corrompidas avançam sobre as muralhas do reino. Empunhe sua lâmina,
            domine batalhas por turnos e derrote o temível Dragão das Sombras para devolver
            a paz a Eldoria.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartAdventure}
              className="inline-flex min-h-[48px] items-center gap-2.5 whitespace-nowrap rounded-md border border-[#FDE047] bg-[#D4AF37] px-8 py-3 text-base font-bold text-[#0D0A14] shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#EAB308] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDE047]"
            >
              <Swords className="h-5 w-5" />
              <span>Começar Aventura</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-[#2D2244] bg-[#130E1F] p-6">
            <div className="mb-3 flex items-center gap-2.5 text-[#EAB308]">
              <Swords className="h-5 w-5 shrink-0" />
              <h2 className="font-display text-base font-bold text-[#F4EFE6]">
                Combate Tático em Turnos
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#BEB4D1]">
              Alterne entre ataques normais, golpes especiais com energia, postura defensiva
              para reduzir dano e poções de cura no momento certo.
            </p>
          </div>

          <div className="rounded-lg border border-[#2D2244] bg-[#130E1F] p-6">
            <div className="mb-3 flex items-center gap-2.5 text-[#EAB308]">
              <Sparkles className="h-5 w-5 shrink-0" />
              <h2 className="font-display text-base font-bold text-[#F4EFE6]">
                Progressão de Herói
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#BEB4D1]">
              Cada criatura vencida concede experiência e pontuação. Suba de nível para
              elevar sua vida máxima e seu poder de ataque antes do chefão.
            </p>
          </div>

          <div className="rounded-lg border border-[#2D2244] bg-[#130E1F] p-6">
            <div className="mb-3 flex items-center gap-2.5 text-[#EAB308]">
              <Shield className="h-5 w-5 shrink-0" />
              <h2 className="font-display text-base font-bold text-[#F4EFE6]">
                Quatro Desafios Crescentes
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-[#BEB4D1]">
              Enfrente o Slime dos pântanos, o Goblin saqueador, o Esqueleto da cripta e
              o poderoso Dragão das Sombras no salão do trono.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
