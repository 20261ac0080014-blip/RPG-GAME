import React from 'react';
import { Swords, Shield, Sparkles, Skull, CheckCircle2, Lock } from 'lucide-react';
import { ENEMIES, HERO_ORIGINS, POTION_HEAL_AMOUNT } from '../../data/gameData';
import { EnemyDefinition, PlayerState } from '../../types/game';
import { EnemyPixelSprite, HeroPixelSprite, PotionPixelIcon } from '../PixelSprites';
import { StatBar } from '../StatBar';

interface HubScreenProps {
  player: PlayerState;
  currentStageIndex: number;
  nextEnemy: EnemyDefinition;
  onEnterBattle: () => void;
  onUseHubPotion: () => void;
}

export const HubScreen: React.FC<HubScreenProps> = ({
  player,
  currentStageIndex,
  nextEnemy,
  onEnterBattle,
  onUseHubPotion,
}) => {
  const originInfo = HERO_ORIGINS.find((o) => o.id === player.origin) ?? HERO_ORIGINS[0];
  const canUsePotion = player.potions > 0 && player.hp < player.maxHp;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left/Main Column: Story & Enemy Roadmap */}
        <div className="space-y-6 lg:col-span-8">
          <section className="rounded-lg border border-[#34274E] bg-[#130E20] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#C4B8D9]">
              <span className="font-semibold tracking-wider text-[#EAB308] uppercase">
                Capítulo {nextEnemy.stageNumber} de {ENEMIES.length}
              </span>
              <span className="font-mono-num">
                Ameaça Atual: {nextEnemy.name} ({nextEnemy.difficultyLabel})
              </span>
            </div>

            <h1 className="font-display mt-2 text-balance text-2xl font-bold text-[#FBF7EE] sm:text-3xl">
              {nextEnemy.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-[#DDD5EA] sm:text-base">
              {nextEnemy.storyIntro}
            </p>

            <div className="mt-6 flex flex-col gap-4 rounded-md border border-[#2D2144] bg-[#0B0813] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-[#382A54] bg-[#140E22]">
                  <EnemyPixelSprite
                    enemyId={nextEnemy.id}
                    className={nextEnemy.isBoss ? 'h-16 w-18' : 'h-14 w-14'}
                  />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#FDE68A]">
                    {nextEnemy.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-[#BEB4D1]">{nextEnemy.description}</p>
                  <div className="font-mono-num mt-2 flex flex-wrap items-center gap-2 text-xs text-[#DFD7EC]">
                    <span>HP {nextEnemy.maxHp}</span>
                    <span aria-hidden="true">·</span>
                    <span>Ataque {nextEnemy.attack}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#EAB308]">+{nextEnemy.xpReward} XP</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onEnterBattle}
                className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#FDE047] bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#0D0A14] transition-transform duration-150 hover:scale-[1.02] hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDE047]"
              >
                <Swords className="h-4 w-4" />
                <span>Enfrentar {nextEnemy.name}</span>
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-[#34274E] bg-[#130E20] p-6">
            <h2 className="font-display mb-4 text-lg font-bold text-[#FBF7EE]">
              Trilha de Libertação de Eldoria
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ENEMIES.map((enemy, idx) => {
                const isDefeated = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isLocked = idx > currentStageIndex;

                return (
                  <div
                    key={enemy.id}
                    className={`flex items-center gap-3.5 rounded-md border p-3.5 ${
                      isCurrent
                        ? 'border-[#EAB308] bg-[#1F1633]'
                        : isDefeated
                          ? 'border-[#273F38] bg-[#0D1614]'
                          : 'border-[#271D3B] bg-[#0B0813] opacity-75'
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-[#33264D] bg-[#09070E]">
                      <EnemyPixelSprite enemyId={enemy.id} className="h-11 w-11" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display truncate text-sm font-bold text-[#F4EFE6]">
                          0{enemy.stageNumber}. {enemy.name}
                        </span>
                        {isDefeated && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#34D399]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Vencido</span>
                          </span>
                        )}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FDE047]">
                            <Skull className="h-3.5 w-3.5" />
                            <span>Atual</span>
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1 text-xs text-[#9488AD]">
                            <Lock className="h-3.5 w-3.5" />
                            <span>Bloqueado</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 text-xs text-[#BEB4D1]">{enemy.difficultyLabel}</div>
                      <div className="font-mono-num mt-1 text-xs text-[#9D90B5]">
                        HP {enemy.maxHp} · ATQ {enemy.attack} · {enemy.xpReward} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Player Attributes & Status */}
        <aside className="rounded-lg border border-[#34274E] bg-[#130E20] p-6 lg:col-span-4">
          <div className="flex items-center gap-4 border-b border-[#2D2144] pb-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md border border-[#3D2E5E] bg-[#0B0813]">
              <div className="animate-rpg-idle">
                <HeroPixelSprite origin={player.origin} className="h-16 w-16" />
              </div>
            </div>
            <div className="min-w-0">
              <h2 className="font-display truncate text-xl font-bold text-[#FDE68A]">
                {player.name}
              </h2>
              <p className="text-xs text-[#BEB4D1]">{originInfo.title}</p>
              <p className="font-mono-num mt-1 text-xs font-semibold text-[#F4EFE6]">
                Nível {player.level} · {player.score} Pontos
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <StatBar label="Vida (HP)" current={player.hp} max={player.maxHp} variant="hp" />
            <StatBar
              label="Energia"
              current={player.energy}
              max={player.maxEnergy}
              variant="energy"
            />
            <StatBar
              label="Experiência (XP)"
              current={player.xp}
              max={player.xpToNextLevel}
              variant="xp"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#2D2144] pt-5">
            <div className="rounded-md border border-[#2D2144] bg-[#0B0813] p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#A598BE]">
                <Swords className="h-3.5 w-3.5 text-[#EAB308]" />
                <span>Ataque</span>
              </div>
              <div className="font-mono-num mt-1 text-lg font-bold text-[#FDE047]">
                {player.attack}
              </div>
            </div>

            <div className="rounded-md border border-[#2D2144] bg-[#0B0813] p-3">
              <div className="flex items-center gap-1.5 text-xs text-[#A598BE]">
                <Sparkles className="h-3.5 w-3.5 text-[#C084FC]" />
                <span>Vitórias</span>
              </div>
              <div className="font-mono-num mt-1 text-lg font-bold text-[#F4EFE6]">
                {player.defeatedCount} / {ENEMIES.length}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-[#2D2144] bg-[#0B0813] p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <PotionPixelIcon className="h-7 w-7 shrink-0" />
                <div>
                  <div className="text-xs text-[#A598BE]">Poções de Cura</div>
                  <div className="font-mono-num text-sm font-bold text-[#F4EFE6]">
                    {player.potions} disponíveis (+{POTION_HEAL_AMOUNT} HP)
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canUsePotion}
                onClick={onUseHubPotion}
                className="inline-flex min-h-[40px] items-center justify-center whitespace-nowrap rounded border border-[#4C3973] bg-[#1C142E] px-3 py-1.5 text-xs font-semibold text-[#F4EFE6] transition-colors hover:border-[#10B981] hover:text-[#6EE7B7] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
              >
                Usar Poção
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-md border border-[#2A2040] bg-[#0F0B19] p-3 text-xs leading-relaxed text-[#BEB4D1]">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#EAB308]" />
            <span>
              Dica tática: use <strong>Defender</strong> para reduzir golpes pesados do
              inimigo e recuperar energia para o <strong>Ataque Especial</strong>.
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
};
