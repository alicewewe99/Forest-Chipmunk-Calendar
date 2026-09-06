import React, { useState } from 'react';
import { Sparkles, RefreshCw, Heart, Info, Filter, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_RAINBOW_CARDS, CHAKRA_INFO } from '../data/rainbowCards';
import { RainbowCard, ChakraType } from '../types';

export const RainbowCardView: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<RainbowCard | null>(() => {
    // Pick a gentle starting card
    return ALL_RAINBOW_CARDS[Math.floor(Math.random() * ALL_RAINBOW_CARDS.length)];
  });
  const [selectedChakra, setSelectedChakra] = useState<string>('all');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const drawCard = (chakraKey?: string) => {
    setIsFlipping(true);
    setTimeout(() => {
      let pool = ALL_RAINBOW_CARDS;
      if (chakraKey && chakraKey !== 'all') {
        const info = CHAKRA_INFO[chakraKey as ChakraType];
        if (info) {
          pool = ALL_RAINBOW_CARDS.filter(c => c.colorName === info.colorName);
        }
      }
      const randomCard = pool[Math.floor(Math.random() * pool.length)];
      setCurrentCard(randomCard);
      setIsFlipping(false);

      // Cute sprinkle confetti
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#6366F1', '#A855F7'],
        });
      } catch (e) {
        // ignore
      }
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          心靈療癒・七彩脈輪能量
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-950 flex items-center justify-center gap-2">
          🌈 彩虹卡（245張身心靈智慧語）
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/90 max-w-xl mx-auto leading-relaxed">
          由藝術治療師 Doris Wenzel 創作，彭瑛瑛老師翻譯。每一張彩虹卡都是智慧與肯定，為您點亮當下的能量與心靈方向。
        </p>
      </div>

      {/* Chakra Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-amber-100/60 rounded-2xl border border-amber-200/80">
        <button
          onClick={() => {
            setSelectedChakra('all');
            drawCard('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
            selectedChakra === 'all'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'bg-white/80 text-amber-900 hover:bg-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          全色系隨機抽
        </button>

        {Object.entries(CHAKRA_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedChakra(key);
              drawCard(key);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              selectedChakra === key
                ? 'text-white shadow-sm ring-2 ring-offset-1'
                : 'bg-white/90 text-neutral-800 hover:bg-white'
            }`}
            style={{
              backgroundColor: selectedChakra === key ? info.colorHex : undefined,
              borderColor: info.colorHex,
            }}
          >
            <span>{info.symbol}</span>
            <span>{info.colorName}</span>
          </button>
        ))}
      </div>

      {/* Main Rainbow Card Stage */}
      {currentCard && (
        <div className="flex flex-col items-center">
          <div
            className={`w-full max-w-md aspect-[1.4/1] rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all duration-300 transform flex flex-col justify-between relative overflow-hidden border-4 border-white/60 ${
              isFlipping ? 'scale-95 opacity-50 rotate-1' : 'scale-100 opacity-100'
            }`}
            style={{
              background: `linear-gradient(135deg, ${currentCard.colorHex}dd, ${currentCard.colorHex})`,
              boxShadow: `0 20px 35px -10px ${currentCard.colorHex}55`,
            }}
          >
            {/* Background subtle watermark & sparkles */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold px-3 py-1 bg-white/20 backdrop-blur-md rounded-full tracking-wider border border-white/30">
                {currentCard.colorName}・{currentCard.chakra}
              </span>
              <span className="text-xs text-white/80 font-medium">
                {currentCard.chakraLocation}
              </span>
            </div>

            {/* Affirmation Text */}
            <div className="my-auto py-4 z-10 text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed tracking-wide drop-shadow-sm">
                「{currentCard.affirmation}」
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-white/90 z-10">
              <span>象徵：{currentCard.keyword}</span>
              <span className="italic opacity-80">Rainbow Card</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => drawCard(selectedChakra)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
              抽取今日能量指引卡
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-1.5 px-4 py-3 bg-white text-amber-900 font-bold text-xs rounded-2xl border border-amber-200 hover:bg-amber-50 shadow-sm transition"
            >
              <Info className="w-4 h-4 text-amber-700" />
              {showInfo ? '收起脈輪解析' : '查看脈輪與能量意義'}
            </button>
          </div>

          {/* Detailed Wisdom Accordion */}
          {showInfo && (
            <div className="mt-6 w-full max-w-md bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3 text-xs text-amber-950 animate-fade-in">
              <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCard.colorHex }} />
                【{currentCard.colorName}能量解析】
              </h4>
              <p className="leading-relaxed text-amber-900">
                <strong>能量核心：</strong>{currentCard.keyword}。
              </p>
              <p className="leading-relaxed text-amber-800">
                <strong>身心對應：</strong>位於{currentCard.chakraLocation}的{currentCard.chakra}。
              </p>
              <p className="leading-relaxed text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-100">
                <strong>⚠️ 失衡提醒：</strong>{currentCard.imbalanceDesc}
              </p>
              <p className="leading-relaxed text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                <strong>✨ 肯定句調養：</strong>大聲朗讀今日小卡「{currentCard.affirmation}」三次，將溫暖的能量吸納進心田。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
