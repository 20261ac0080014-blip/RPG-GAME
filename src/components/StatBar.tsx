import React from 'react';

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  variant: 'hp' | 'enemyHp' | 'energy' | 'xp';
  compact?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  current,
  max,
  variant,
  compact = false,
}) => {
  const safeMax = Math.max(1, max);
  const clamped = Math.max(0, Math.min(safeMax, current));
  const percent = Math.round((clamped / safeMax) * 100);

  const barColor =
    variant === 'hp'
      ? percent > 50
        ? 'bg-[#10B981]'
        : percent > 25
          ? 'bg-[#F59E0B]'
          : 'bg-[#EF4444]'
      : variant === 'enemyHp'
        ? 'bg-[#DC2626]'
        : variant === 'energy'
          ? 'bg-[#8B5CF6]'
          : 'bg-[#D4AF37]';

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-medium">
        <span className="text-[#CFC6DC]">{label}</span>
        <span className="font-mono-num text-[#F4EFE6]">
          {clamped} / {safeMax}
        </span>
      </div>
      <div
        className={`w-full overflow-hidden rounded-sm border border-[#34284E] bg-[#0B0812] ${
          compact ? 'h-2.5' : 'h-3'
        }`}
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
      >
        <div
          className={`h-full transition-[width] duration-200 ease-out ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
