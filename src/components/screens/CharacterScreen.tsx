import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HERO_ORIGINS } from '../../data/gameData';
import { HeroOriginId } from '../../types/game';
import { HeroPixelSprite, PotionPixelIcon } from '../PixelSprites';

interface CharacterScreenProps {
  initialName: string;
  initialOrigin: HeroOriginId;
  onConfirm: (name: string, origin: HeroOriginId) => void;
  onBack: () => void;
}

export const CharacterScreen: React.FC<CharacterScreenProps> = ({
  initialName,
  initialOrigin,
  onConfirm,
  onBack,
}) => {
  const [name, setName] = useState(initialName);
  const [selectedOrigin, setSelectedOrigin] = useState<HeroOriginId>(initialOrigin);

  const activeOrigin =
    HERO_ORIGINS.find((origin) => origin.id === selectedOrigin) ?? HERO_ORIGINS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name.trim() || 'Aldric', selectedOrigin);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-wider text-[#EAB308] uppercase">
          Preparação da Jornada
        </p>
        <h1 className="font-display mt-1 text-balance text-2xl font-bold text-[#FBF7EE] sm:text-3xl">
          Apresentação do Aventureiro
        </h1>
        <p className="mt-1.5 text-sm text-[#BEB4D1]">
          Escolha o nome e a ordem de seu guerreiro antes de partir para defender o reino de
          Eldoria.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch"
      >
        <div className="flex flex-col justify-between rounded-lg border border-[#34274E] bg-[#130E20] p-6 lg:col-span-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-40 w-40 items-center justify-center rounded-lg border border-[#3C2D5A] bg-[#0B0813]">
              <div className="animate-rpg-idle">
                <HeroPixelSprite origin={selectedOrigin} className="h-28 w-28" />
              </div>
            </div>

            <h2 className="font-display text-xl font-bold text-[#FDE68A]">
              {name.trim() || 'Aldric'}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-[#C4B8D9]">
              {activeOrigin.title} · {activeOrigin.subtitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#BEB4D1]">{activeOrigin.lore}</p>
          </div>

          <div className="mt-6 border-t border-[#2D2144] pt-5">
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-[#EAB308] uppercase">
              Atributos Iniciais
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-[#2D2144] bg-[#0C0915] px-3 py-2.5">
                <div className="text-xs text-[#A598BE]">Vida (HP)</div>
                <div className="font-mono-num mt-0.5 text-base font-bold text-[#34D399]">
                  100 / 100
                </div>
              </div>
              <div className="rounded-md border border-[#2D2144] bg-[#0C0915] px-3 py-2.5">
                <div className="text-xs text-[#A598BE]">Ataque</div>
                <div className="font-mono-num mt-0.5 text-base font-bold text-[#FDE047]">
                  20
                </div>
              </div>
              <div className="rounded-md border border-[#2D2144] bg-[#0C0915] px-3 py-2.5">
                <div className="text-xs text-[#A598BE]">Nível / Energia</div>
                <div className="font-mono-num mt-0.5 text-base font-bold text-[#C084FC]">
                  Nív. 1 · 100
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[#2D2144] bg-[#0C0915] px-3 py-2.5">
                <div>
                  <div className="text-xs text-[#A598BE]">Poções</div>
                  <div className="font-mono-num mt-0.5 text-base font-bold text-[#F4EFE6]">
                    3 unidades
                  </div>
                </div>
                <PotionPixelIcon className="h-6 w-6 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-[#34274E] bg-[#130E20] p-6 lg:col-span-7">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="hero-name-input"
                className="mb-2 block text-sm font-semibold text-[#F4EFE6]"
              >
                Nome do Aventureiro
              </label>
              <input
                id="hero-name-input"
                type="text"
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do herói..."
                className="w-full rounded-md border border-[#3E2F5E] bg-[#0B0813] px-4 py-3 text-sm text-[#F4EFE6] placeholder-[#7C6F96] transition-colors focus:border-[#EAB308] focus:outline-none"
              />
            </div>

            <div>
              <span className="mb-2.5 block text-sm font-semibold text-[#F4EFE6]">
                Ordem e Estilo Visual
              </span>
              <div className="grid grid-cols-1 gap-3">
                {HERO_ORIGINS.map((origin) => {
                  const isSelected = origin.id === selectedOrigin;
                  return (
                    <button
                      key={origin.id}
                      type="button"
                      onClick={() => setSelectedOrigin(origin.id)}
                      className={`flex items-center gap-4 rounded-md border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] ${
                        isSelected
                          ? 'border-[#EAB308] bg-[#211738]'
                          : 'border-[#2E2246] bg-[#0D0A16] hover:border-[#533D7D]'
                      }`}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-[#362954] bg-[#09070E]">
                        <HeroPixelSprite origin={origin.id} className="h-11 w-11" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-sm font-bold text-[#FBF7EE]">
                            {origin.title}
                          </span>
                          <span className="text-xs font-medium text-[#EAB308]">
                            {isSelected ? 'Selecionado' : 'Escolher'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#BEB4D1]">
                          Arma: {origin.weaponName} · Especial: {origin.specialName}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#2D2144] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#3B2D59] bg-[#161024] px-5 py-2.5 text-sm font-medium text-[#DFD7EC] transition-colors hover:border-[#6B549E] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>

            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#FDE047] bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#0D0A14] transition-colors hover:bg-[#EAB308] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDE047]"
            >
              <span>Iniciar Jornada</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
