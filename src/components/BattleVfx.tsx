import React from 'react';
import { FloatingPopup } from '../types/game';

interface BattleVfxProps {
  popups: FloatingPopup[];
  target: 'player' | 'enemy';
  activeEffect: 'slash' | 'special' | 'defend' | 'heal' | 'dragon' | null;
}

export const BattleVfxLayer: React.FC<BattleVfxProps> = ({ popups, target, activeEffect }) => {
  const targetPopups = popups.filter((p) => p.target === target);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {activeEffect === 'slash' && target === 'enemy' && (
        <svg
          viewBox="0 0 100 100"
          className="animate-rpg-slash absolute inset-0 m-auto h-28 w-28"
          aria-hidden="true"
        >
          <path
            d="M18 82 L84 16"
            stroke="#FDE68A"
            strokeWidth="6"
            strokeLinecap="square"
          />
          <path
            d="M28 86 L88 26"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="square"
          />
        </svg>
      )}

      {activeEffect === 'special' && target === 'enemy' && (
        <svg
          viewBox="0 0 120 120"
          className="animate-rpg-slash absolute inset-0 m-auto h-36 w-36"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="42" fill="rgba(168, 85, 247, 0.24)" stroke="#EAB308" strokeWidth="3" />
          <path d="M16 104 L104 16" stroke="#FDE047" strokeWidth="7" />
          <path d="M16 16 L104 104" stroke="#C084FC" strokeWidth="6" />
        </svg>
      )}

      {activeEffect === 'dragon' && target === 'player' && (
        <svg
          viewBox="0 0 120 120"
          className="animate-rpg-slash absolute inset-0 m-auto h-36 w-36"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="44" fill="rgba(220, 38, 38, 0.25)" stroke="#A855F7" strokeWidth="4" />
          <path d="M24 30 L96 90 M96 30 L24 90" stroke="#EF4444" strokeWidth="6" />
        </svg>
      )}

      {activeEffect === 'defend' && target === 'player' && (
        <svg
          viewBox="0 0 100 100"
          className="animate-rpg-shield absolute inset-0 m-auto h-32 w-32"
          aria-hidden="true"
        >
          <path
            d="M50 10 L82 24 V50 C82 70 67 84 50 92 C33 84 18 70 18 50 V24 Z"
            fill="rgba(234, 179, 8, 0.18)"
            stroke="#FACC15"
            strokeWidth="3.5"
          />
        </svg>
      )}

      {activeEffect === 'heal' && target === 'player' && (
        <svg
          viewBox="0 0 100 100"
          className="animate-rpg-shield absolute inset-0 m-auto h-32 w-32"
          aria-hidden="true"
        >
          <rect x="44" y="22" width="12" height="56" fill="#10B981" opacity="0.8" />
          <rect x="22" y="44" width="56" height="12" fill="#10B981" opacity="0.8" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#6EE7B7" strokeWidth="2.5" />
        </svg>
      )}

      {targetPopups.map((popup) => {
        const colorClass =
          popup.variant === 'critical'
            ? 'text-[#FDE047]'
            : popup.variant === 'heal'
              ? 'text-[#34D399]'
              : popup.variant === 'block'
                ? 'text-[#FBBF24]'
                : popup.variant === 'energy'
                  ? 'text-[#C084FC]'
                  : 'text-[#FCA5A5]';

        return (
          <div
            key={popup.id}
            className={`animate-rpg-damage font-mono-num absolute left-1/2 -top-2 z-30 whitespace-nowrap text-lg font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] sm:text-xl ${colorClass}`}
          >
            {popup.text}
          </div>
        );
      })}
    </div>
  );
};
