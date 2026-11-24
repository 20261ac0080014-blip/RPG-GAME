import React, { useEffect, useRef, useState } from 'react';
import { Swords, Zap, Shield } from 'lucide-react';
import {
  BATTLE_ARENA_URL,
  DEFEND_DAMAGE_REDUCTION,
  DEFEND_ENERGY_GAIN,
  HERO_ORIGINS,
  NORMAL_ATTACK_ENERGY_GAIN,
  POTION_HEAL_AMOUNT,
  SPECIAL_ATTACK_ENERGY_COST,
} from '../../data/gameData';
import { BattleLogEntry, EnemyDefinition, FloatingPopup, PlayerState } from '../../types/game';
import { soundEngine } from '../../utils/sound';
import { BattleVfxLayer } from '../BattleVfx';
import { EnemyPixelSprite, HeroPixelSprite, PotionPixelIcon } from '../PixelSprites';
import { StatBar } from '../StatBar';

interface BattleScreenProps {
  player: PlayerState;
  enemy: EnemyDefinition;
  onUpdatePlayerInBattle: (updater: (prev: PlayerState) => PlayerState) => void;
  onBattleVictory: (turnsTaken: number) => void;
  onBattleDefeat: (defeatedBy: EnemyDefinition) => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  player,
  enemy,
  onUpdatePlayerInBattle,
  onBattleVictory,
  onBattleDefeat,
}) => {
  const [enemyHp, setEnemyHp] = useState(enemy.maxHp);
  const [turnNumber, setTurnNumber] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isDefending, setIsDefending] = useState(false);
  const [bgError, setBgError] = useState(false);

  const [heroAnim, setHeroAnim] = useState<'idle' | 'lunge' | 'hit'>('idle');
  const [enemyAnim, setEnemyAnim] = useState<'idle' | 'lunge' | 'hit'>('idle');
  const [activeVfx, setActiveVfx] = useState<
    'slash' | 'special' | 'defend' | 'heal' | 'dragon' | null
  >(null);

  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([
    {
      id: 1,
      turn: 1,
      actor: 'system',
      message: `${enemy.name} surgiu na arena! Prepare-se para a batalha.`,
    },
  ]);

  const timersRef = useRef<number[]>([]);
  const idCounterRef = useRef(2);
  const isFinishedRef = useRef(false);

  const originInfo = HERO_ORIGINS.find((o) => o.id === player.origin) ?? HERO_ORIGINS[0];
  const isBossBreathTurn = enemy.isBoss && turnNumber % 3 === 0;

  const scheduleTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const addLog = (actor: BattleLogEntry['actor'], message: string, turn = turnNumber) => {
    const entryId = idCounterRef.current++;
    setBattleLog((prev) => [{ id: entryId, turn, actor, message }, ...prev].slice(0, 12));
  };

  const spawnPopup = (
    target: FloatingPopup['target'],
    text: string,
    variant: FloatingPopup['variant']
  ) => {
    const popupId = idCounterRef.current++;
    setPopups((prev) => [...prev, { id: popupId, target, text, variant }]);
    scheduleTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== popupId));
    }, 950);
  };

  const triggerEnemyTurn = (defendingThisTurn: boolean, currentTurn: number, currentPlayerHp: number) => {
    if (isFinishedRef.current) return;

    scheduleTimeout(() => {
      if (isFinishedRef.current) return;

      const bossBreath = enemy.isBoss && currentTurn % 3 === 0;
      const variance = Math.floor(Math.random() * 5) - 2; // -2 a +2
      const rawBase = bossBreath ? Math.round(enemy.attack * 1.38) : enemy.attack;
      const rawDamage = Math.max(4, rawBase + variance);
      const finalDamage = defendingThisTurn
        ? Math.max(2, Math.round(rawDamage * (1 - DEFEND_DAMAGE_REDUCTION)))
        : rawDamage;

      setEnemyAnim('lunge');
      setHeroAnim('hit');
      setActiveVfx(bossBreath ? 'dragon' : null);
      soundEngine.play('enemyHit');

      const nextHp = Math.max(0, currentPlayerHp - finalDamage);
      onUpdatePlayerInBattle((prev) => ({
        ...prev,
        hp: Math.max(0, prev.hp - finalDamage),
      }));

      if (defendingThisTurn) {
        spawnPopup('player', `-${finalDamage} (Defendido)`, 'block');
        addLog(
          'enemy',
          bossBreath
            ? `${enemy.name} lançou ${enemy.specialAttackName}, mas sua defesa reduziu o dano para ${finalDamage} HP!`
            : `${enemy.name} atacou, mas sua postura defensiva bloqueou parte do golpe! Você sofreu ${finalDamage} de dano.`,
          currentTurn
        );
      } else {
        spawnPopup('player', `-${finalDamage} HP`, bossBreath ? 'critical' : 'damage');
        addLog(
          'enemy',
          bossBreath
            ? `${enemy.name} usou ${enemy.specialAttackName} e causou ${finalDamage} de dano devastador!`
            : `${enemy.name} atacou e causou ${finalDamage} de dano!`,
          currentTurn
        );
      }

      scheduleTimeout(() => {
        setEnemyAnim('idle');
        setHeroAnim('idle');
        setActiveVfx(null);
        setIsDefending(false);

        if (nextHp <= 0) {
          isFinishedRef.current = true;
          soundEngine.play('defeat');
          scheduleTimeout(() => {
            onBattleDefeat(enemy);
          }, 420);
        } else {
          setTurnNumber((t) => t + 1);
          setIsPlayerTurn(true);
        }
      }, 420);
    }, 640);
  };

  const handleNormalAttack = () => {
    if (!isPlayerTurn || isFinishedRef.current) return;
    setIsPlayerTurn(false);
    setIsDefending(false);

    const variance = Math.floor(Math.random() * 5) - 2; // -2 a +2
    const damage = Math.max(8, player.attack + variance);
    const nextEnemyHp = Math.max(0, enemyHp - damage);

    setHeroAnim('lunge');
    setEnemyAnim('hit');
    setActiveVfx('slash');
    soundEngine.play('attack');

    setEnemyHp(nextEnemyHp);
    onUpdatePlayerInBattle((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + NORMAL_ATTACK_ENERGY_GAIN),
    }));

    spawnPopup('enemy', `-${damage}`, 'damage');
    addLog(
      'player',
      `Você desferiu um Ataque Normal com ${originInfo.weaponName}, causando ${damage} de dano e recuperando +${NORMAL_ATTACK_ENERGY_GAIN} de Energia.`
    );

    scheduleTimeout(() => {
      setHeroAnim('idle');
      setEnemyAnim('idle');
      setActiveVfx(null);

      if (nextEnemyHp <= 0) {
        isFinishedRef.current = true;
        scheduleTimeout(() => onBattleVictory(turnNumber), 380);
      } else {
        triggerEnemyTurn(false, turnNumber, player.hp);
      }
    }, 400);
  };

  const handleSpecialAttack = () => {
    if (!isPlayerTurn || isFinishedRef.current) return;
    if (player.energy < SPECIAL_ATTACK_ENERGY_COST) return;

    setIsPlayerTurn(false);
    setIsDefending(false);

    const variance = Math.floor(Math.random() * 6) - 1;
    const damage = Math.max(18, Math.round(player.attack * 1.85) + variance);
    const nextEnemyHp = Math.max(0, enemyHp - damage);

    setHeroAnim('lunge');
    setEnemyAnim('hit');
    setActiveVfx('special');
    soundEngine.play('special');

    setEnemyHp(nextEnemyHp);
    onUpdatePlayerInBattle((prev) => ({
      ...prev,
      energy: Math.max(0, prev.energy - SPECIAL_ATTACK_ENERGY_COST),
    }));

    spawnPopup('enemy', `-${damage} ESPECIAL!`, 'critical');
    addLog(
      'player',
      `Você canalizou ${originInfo.specialName} (-${SPECIAL_ATTACK_ENERGY_COST} Energia) e causou ${damage} de dano em ${enemy.name}!`
    );

    scheduleTimeout(() => {
      setHeroAnim('idle');
      setEnemyAnim('idle');
      setActiveVfx(null);

      if (nextEnemyHp <= 0) {
        isFinishedRef.current = true;
        scheduleTimeout(() => onBattleVictory(turnNumber), 420);
      } else {
        triggerEnemyTurn(false, turnNumber, player.hp);
      }
    }, 440);
  };

  const handleDefend = () => {
    if (!isPlayerTurn || isFinishedRef.current) return;
    setIsPlayerTurn(false);
    setIsDefending(true);
    setActiveVfx('defend');
    soundEngine.play('defend');

    onUpdatePlayerInBattle((prev) => ({
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + DEFEND_ENERGY_GAIN),
    }));

    spawnPopup('player', `+${DEFEND_ENERGY_GAIN} Energia`, 'energy');
    addLog(
      'player',
      `Você ergueu sua guarda! O próximo ataque sofrerá 65% menos dano e você recuperou +${DEFEND_ENERGY_GAIN} de Energia.`
    );

    scheduleTimeout(() => {
      setActiveVfx(null);
      triggerEnemyTurn(true, turnNumber, player.hp);
    }, 360);
  };

  const handleUsePotion = () => {
    if (!isPlayerTurn || isFinishedRef.current) return;
    if (player.potions <= 0 || player.hp >= player.maxHp) return;

    setIsPlayerTurn(false);
    setIsDefending(false);
    setActiveVfx('heal');
    soundEngine.play('potion');

    const healedAmount = Math.min(POTION_HEAL_AMOUNT, player.maxHp - player.hp);
    const updatedHp = Math.min(player.maxHp, player.hp + POTION_HEAL_AMOUNT);

    onUpdatePlayerInBattle((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + POTION_HEAL_AMOUNT),
      potions: Math.max(0, prev.potions - 1),
    }));

    spawnPopup('player', `+${healedAmount} HP`, 'heal');
    addLog(
      'player',
      `Você usou uma Poção de Cura e recuperou ${healedAmount} pontos de vida! Restam ${player.potions - 1} poções.`
    );

    scheduleTimeout(() => {
      setActiveVfx(null);
      triggerEnemyTurn(false, turnNumber, updatedHp);
    }, 440);
  };

  const canSpecial = isPlayerTurn && player.energy >= SPECIAL_ATTACK_ENERGY_COST;
  const canPotion = isPlayerTurn && player.potions > 0 && player.hp < player.maxHp;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
      {/* Top Combatant Status HUD */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-[#34274E] bg-[#130E20] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-display text-base font-bold text-[#FDE68A]">
                {player.name}
              </span>
              <span className="ml-2 text-xs text-[#BEB4D1]">
                Nível {player.level} · ATQ {player.attack}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              {isDefending && (
                <span className="text-[#FACC15]">Defesa Ativa</span>
              )}
              <span className="font-mono-num text-[#DFD7EC]">
                Poções: {player.potions}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <StatBar
              label="Vida (HP)"
              current={player.hp}
              max={player.maxHp}
              variant="hp"
              compact
            />
            <StatBar
              label="Energia"
              current={player.energy}
              max={player.maxEnergy}
              variant="energy"
              compact
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#47253B] bg-[#160D1D] p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <span className="font-display text-base font-bold text-[#FCA5A5]">
                {enemy.name}
              </span>
              <span className="ml-2 text-xs text-[#C4B8D9]">
                {enemy.difficultyLabel} · ATQ {enemy.attack}
              </span>
            </div>
            <span className="font-mono-num text-xs font-semibold text-[#EAB308]">
              Turno {turnNumber}
            </span>
          </div>

          <StatBar
            label={
              isBossBreathTurn
                ? `Vida · Atenção: ${enemy.specialAttackName} iminente!`
                : 'Vida do Inimigo'
            }
            current={enemyHp}
            max={enemy.maxHp}
            variant="enemyHp"
            compact
          />
        </div>
      </div>

      {/* 2D Pixel-Art Arena */}
      <section className="relative flex min-h-[260px] items-end justify-between overflow-hidden rounded-lg border border-[#3C2C5C] bg-[#0B0813] px-4 pt-12 pb-6 sm:min-h-[330px] sm:px-14 sm:pb-8 lg:px-24">
        {!bgError ? (
          <img
            src={BATTLE_ARENA_URL}
            alt="Arena medieval de pedra com tochas douradas e névoa roxa"
            referrerPolicy="no-referrer"
            onError={() => setBgError(true)}
            className="pixelated absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#1E1433] via-[#120C1F] to-[#0A0712]"
            aria-hidden="true"
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#09070E]/80 via-[#09070E]/20 to-[#09070E]/55"
          aria-hidden="true"
        />

        {/* Turn Banner */}
        <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded border border-[#423264] bg-[#0D0916]/90 px-4 py-1 text-xs font-semibold text-[#FDE68A]">
          {isPlayerTurn
            ? `Sua Vez · Escolha uma ação`
            : `Turno de ${enemy.name}...`}
        </div>

        {/* Hero Fighter */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <BattleVfxLayer popups={popups} target="player" activeEffect={activeVfx} />
            <div
              className={
                heroAnim === 'lunge'
                  ? 'animate-rpg-lunge-right'
                  : heroAnim === 'hit'
                    ? 'animate-rpg-hit'
                    : 'animate-rpg-idle'
              }
            >
              <HeroPixelSprite
                origin={player.origin}
                className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
              />
            </div>
          </div>
          <div className="mt-1 h-2.5 w-20 rounded-[100%] bg-black/70 sm:w-28" aria-hidden="true" />
        </div>

        {/* Enemy Fighter */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <BattleVfxLayer popups={popups} target="enemy" activeEffect={activeVfx} />
            <div
              className={
                enemyAnim === 'lunge'
                  ? 'animate-rpg-lunge-left'
                  : enemyAnim === 'hit'
                    ? 'animate-rpg-hit'
                    : enemy.isBoss
                      ? 'animate-rpg-boss'
                      : 'animate-rpg-idle'
              }
            >
              <EnemyPixelSprite
                enemyId={enemy.id}
                className={
                  enemy.isBoss
                    ? 'h-32 w-36 sm:h-40 sm:w-48 lg:h-44 lg:w-52'
                    : 'h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36'
                }
              />
            </div>
          </div>
          <div
            className={`mt-1 h-2.5 rounded-[100%] bg-black/70 ${
              enemy.isBoss ? 'w-32 sm:w-44' : 'w-20 sm:w-28'
            }`}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Bottom Actions + Battle Log */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 4 Battle Action Buttons */}
        <section
          aria-label="Ações de batalha"
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:col-span-7"
        >
          <button
            type="button"
            disabled={!isPlayerTurn}
            onClick={handleNormalAttack}
            className="flex min-h-[64px] items-center gap-3.5 rounded-lg border border-[#5B4317] bg-[#1A1329] px-4 py-3 text-left transition-colors hover:border-[#EAB308] hover:bg-[#251A3B] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#4D3B16] bg-[#120D1D] text-[#FDE047]">
              <Swords className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#FBF7EE]">Ataque Normal</div>
              <div className="font-mono-num text-xs text-[#BEB4D1]">
                ~{player.attack} dano · +{NORMAL_ATTACK_ENERGY_GAIN} Energia
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={!canSpecial}
            onClick={handleSpecialAttack}
            className="flex min-h-[64px] items-center gap-3.5 rounded-lg border border-[#5B21B6] bg-[#1D1233] px-4 py-3 text-left transition-colors hover:border-[#C084FC] hover:bg-[#291947] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C084FC]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#6D28D9] bg-[#120A22] text-[#D8B4FE]">
              <Zap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#FBF7EE]">Ataque Especial</div>
              <div className="font-mono-num text-xs text-[#C4B8D9]">
                {player.energy >= SPECIAL_ATTACK_ENERGY_COST
                  ? `~${Math.round(player.attack * 1.85)} dano · -${SPECIAL_ATTACK_ENERGY_COST} Energia`
                  : `Energia insuficiente (${player.energy}/${SPECIAL_ATTACK_ENERGY_COST})`}
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={!isPlayerTurn}
            onClick={handleDefend}
            className="flex min-h-[64px] items-center gap-3.5 rounded-lg border border-[#3E305D] bg-[#161024] px-4 py-3 text-left transition-colors hover:border-[#FACC15] hover:bg-[#211836] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#4D3D70] bg-[#0F0B19] text-[#FACC15]">
              <Shield className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#FBF7EE]">Defender</div>
              <div className="font-mono-num text-xs text-[#BEB4D1]">
                -65% dano recebido · +{DEFEND_ENERGY_GAIN} Energia
              </div>
            </div>
          </button>

          <button
            type="button"
            disabled={!canPotion}
            onClick={handleUsePotion}
            className="flex min-h-[64px] items-center gap-3.5 rounded-lg border border-[#1E4D3E] bg-[#101D1A] px-4 py-3 text-left transition-colors hover:border-[#34D399] hover:bg-[#162924] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34D399]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[#245948] bg-[#0A1311]">
              <PotionPixelIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-[#FBF7EE]">Usar Poção</div>
              <div className="font-mono-num text-xs text-[#BEB4D1]">
                {player.potions <= 0
                  ? 'Sem poções disponíveis'
                  : player.hp >= player.maxHp
                    ? `Vida já está cheia (${player.potions} rest.)`
                    : `+${POTION_HEAL_AMOUNT} HP · Restam ${player.potions}`}
              </div>
            </div>
          </button>
        </section>

        {/* Battle Log */}
        <section
          aria-label="Diário de batalha"
          className="flex flex-col rounded-lg border border-[#34274E] bg-[#110C1C] p-4 lg:col-span-5"
        >
          <h2 className="font-display mb-2.5 text-sm font-bold text-[#EAB308]">
            Diário de Batalha
          </h2>
          <ul className="max-h-36 space-y-2 overflow-y-auto pr-1 text-xs leading-relaxed">
            {battleLog.map((entry) => {
              const color =
                entry.actor === 'player'
                  ? 'text-[#FDE68A]'
                  : entry.actor === 'enemy'
                    ? 'text-[#FCA5A5]'
                    : 'text-[#C4B8D9]';
              return (
                <li
                  key={entry.id}
                  className="border-b border-[#251C38] pb-1.5 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono-num mr-1.5 text-[#8E80A8]">[T{entry.turn}]</span>
                  <span className={color}>{entry.message}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
};
