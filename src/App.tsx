import { useState } from 'react';
import { GameHeader } from './components/GameHeader';
import { BattleScreen } from './components/screens/BattleScreen';
import { CharacterScreen } from './components/screens/CharacterScreen';
import { DefeatScreen } from './components/screens/DefeatScreen';
import { FinalVictoryScreen } from './components/screens/FinalVictoryScreen';
import { HubScreen } from './components/screens/HubScreen';
import { TitleScreen } from './components/screens/TitleScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import {
  ENEMIES,
  POTION_HEAL_AMOUNT,
  createInitialPlayer,
  getXpThresholdForLevel,
} from './data/gameData';
import {
  EnemyDefinition,
  GameScreen,
  HeroOriginId,
  LevelUpSummary,
  PlayerState,
  VictorySummary,
} from './types/game';
import { soundEngine } from './utils/sound';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [player, setPlayer] = useState<PlayerState>(() => createInitialPlayer());
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [battleRunId, setBattleRunId] = useState(1);
  const [lastVictory, setLastVictory] = useState<VictorySummary | null>(null);
  const [defeatedBy, setDefeatedBy] = useState<EnemyDefinition | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const currentEnemy = ENEMIES[currentStageIndex] ?? ENEMIES[ENEMIES.length - 1];

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.play('click');
    }
  };

  const performFullRestart = () => {
    soundEngine.play('click');
    setPlayer(createInitialPlayer());
    setCurrentStageIndex(0);
    setBattleRunId((id) => id + 1);
    setLastVictory(null);
    setDefeatedBy(null);
    setShowRestartConfirm(false);
    setScreen('TITLE');
  };

  const handleHeaderRestartClick = () => {
    soundEngine.play('click');
    if (screen === 'HUB' || screen === 'BATTLE') {
      setShowRestartConfirm(true);
    } else {
      performFullRestart();
    }
  };

  const handleStartAdventure = () => {
    soundEngine.play('click');
    setScreen('CHARACTER');
  };

  const handleConfirmCharacter = (name: string, origin: HeroOriginId) => {
    soundEngine.play('click');
    setPlayer(createInitialPlayer(name, origin));
    setCurrentStageIndex(0);
    setLastVictory(null);
    setDefeatedBy(null);
    setScreen('HUB');
  };

  const handleEnterBattle = () => {
    soundEngine.play('click');
    setBattleRunId((id) => id + 1);
    setScreen('BATTLE');
  };

  const handleUseHubPotion = () => {
    if (player.potions <= 0 || player.hp >= player.maxHp) return;
    soundEngine.play('potion');
    setPlayer((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + POTION_HEAL_AMOUNT),
      potions: Math.max(0, prev.potions - 1),
    }));
  };

  const handleBattleVictory = (turnsTaken: number) => {
    const defeatedEnemy = currentEnemy;
    const levelUps: LevelUpSummary[] = [];

    let updatedLevel = player.level;
    let updatedMaxHp = player.maxHp;
    let updatedHp = player.hp;
    let updatedAttack = player.attack;
    let updatedMaxEnergy = player.maxEnergy;
    let updatedXp = player.xp + defeatedEnemy.xpReward;
    let updatedXpThreshold = player.xpToNextLevel;

    while (updatedXp >= updatedXpThreshold) {
      updatedXp -= updatedXpThreshold;
      const previousLevel = updatedLevel;
      updatedLevel += 1;
      const hpBonus = 25;
      const attackBonus = 6;
      const energyBonus = 15;

      updatedMaxHp += hpBonus;
      updatedAttack += attackBonus;
      updatedMaxEnergy += energyBonus;
      updatedHp = Math.min(updatedMaxHp, updatedHp + 30);
      updatedXpThreshold = getXpThresholdForLevel(updatedLevel);

      levelUps.push({
        previousLevel,
        newLevel: updatedLevel,
        hpBonus,
        attackBonus,
        energyBonus,
      });
    }

    const potionRoom = Math.max(0, player.maxPotions - player.potions);
    const potionsGained = Math.min(defeatedEnemy.potionDrop, potionRoom);
    const updatedScore = player.score + defeatedEnemy.scoreReward;

    const nextPlayer: PlayerState = {
      ...player,
      level: updatedLevel,
      maxHp: updatedMaxHp,
      hp: Math.min(updatedMaxHp, updatedHp),
      attack: updatedAttack,
      maxEnergy: updatedMaxEnergy,
      energy: updatedMaxEnergy,
      xp: updatedXp,
      xpToNextLevel: updatedXpThreshold,
      potions: player.potions + potionsGained,
      score: updatedScore,
      defeatedCount: player.defeatedCount + 1,
    };

    const summary: VictorySummary = {
      enemy: defeatedEnemy,
      xpGained: defeatedEnemy.xpReward,
      scoreGained: defeatedEnemy.scoreReward,
      potionsGained,
      turnsTaken,
      levelUps,
    };

    setPlayer(nextPlayer);
    setLastVictory(summary);

    if (defeatedEnemy.isBoss) {
      soundEngine.play('dragonVictory');
      setScreen('FINAL_VICTORY');
    } else {
      if (levelUps.length > 0) {
        soundEngine.play('levelUp');
      } else {
        soundEngine.play('victory');
      }
      setScreen('VICTORY');
    }
  };

  const handleBattleDefeat = (enemy: EnemyDefinition) => {
    setDefeatedBy(enemy);
    setScreen('DEFEAT');
  };

  const handleContinueAfterVictory = () => {
    soundEngine.play('click');
    const nextIndex = Math.min(ENEMIES.length - 1, currentStageIndex + 1);
    setCurrentStageIndex(nextIndex);
    setScreen('HUB');
  };

  const showHeaderStats = screen !== 'TITLE' && screen !== 'CHARACTER';

  return (
    <div className="flex min-h-screen flex-col bg-[#09070E] text-[#F4EFE6]">
      <GameHeader
        player={player}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRestart={handleHeaderRestartClick}
        showPlayerStats={showHeaderStats}
      />

      {screen === 'TITLE' && <TitleScreen onStartAdventure={handleStartAdventure} />}

      {screen === 'CHARACTER' && (
        <CharacterScreen
          initialName={player.name}
          initialOrigin={player.origin}
          onConfirm={handleConfirmCharacter}
          onBack={() => {
            soundEngine.play('click');
            setScreen('TITLE');
          }}
        />
      )}

      {screen === 'HUB' && (
        <HubScreen
          player={player}
          currentStageIndex={currentStageIndex}
          nextEnemy={currentEnemy}
          onEnterBattle={handleEnterBattle}
          onUseHubPotion={handleUseHubPotion}
        />
      )}

      {screen === 'BATTLE' && (
        <BattleScreen
          key={`${currentStageIndex}-${battleRunId}`}
          player={player}
          enemy={currentEnemy}
          onUpdatePlayerInBattle={setPlayer}
          onBattleVictory={handleBattleVictory}
          onBattleDefeat={handleBattleDefeat}
        />
      )}

      {screen === 'VICTORY' && lastVictory && (
        <VictoryScreen
          player={player}
          summary={lastVictory}
          onContinue={handleContinueAfterVictory}
          onRestart={performFullRestart}
        />
      )}

      {screen === 'DEFEAT' && defeatedBy && (
        <DefeatScreen
          player={player}
          defeatedBy={defeatedBy}
          onRestart={performFullRestart}
        />
      )}

      {screen === 'FINAL_VICTORY' && lastVictory && (
        <FinalVictoryScreen
          player={player}
          summary={lastVictory}
          onRestart={performFullRestart}
        />
      )}

      {showRestartConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="restart-dialog-title"
        >
          <div className="w-full max-w-sm rounded-lg border border-[#4D3B16] bg-[#140F22] p-6 shadow-2xl">
            <h2 id="restart-dialog-title" className="font-display text-lg font-bold text-[#FDE68A]">
              Reiniciar Aventura?
            </h2>
            <p className="mt-2 text-sm text-[#CFC4DC]">
              Todo o progresso atual de {player.name} será perdido e você retornará à tela
              inicial.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.play('click');
                  setShowRestartConfirm(false);
                }}
                className="min-h-[40px] rounded-md border border-[#3B2D59] bg-[#19122A] px-4 py-2 text-xs font-semibold text-[#DFD7EC] transition-colors hover:border-[#6B549E]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={performFullRestart}
                className="min-h-[40px] rounded-md border border-[#FDE047] bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#0D0A14] transition-colors hover:bg-[#EAB308]"
              >
                Confirmar Reinício
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
