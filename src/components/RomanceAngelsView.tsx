import React, { useState } from 'react';
import { Heart, Sparkles, RefreshCw, Layers, Search, Eye, Compass, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ROMANCE_ANGELS_CARDS } from '../data/romanceAngels';
import { RomanceAngelCard } from '../types';

export const RomanceAngelsView: React.FC = () => {
  const [mode, setMode] = useState<'single' | 'three' | 'gallery'>('single');
  const [singleCard, setSingleCard] = useState<RomanceAngelCard | null>(() => {
    return ROMANCE_ANGELS_CARDS[0];
  });
  const [threeCards, setThreeCards] = useState<RomanceAngelCard[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [activeGalleryCard, setActiveGalleryCard] = useState<RomanceAngelCard | null>(null);

  // Draw 1 card
  const handleDrawSingle = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const rand = ROMANCE_ANGELS_CARDS[Math.floor(Math.random() * ROMANCE_ANGELS_CARDS.length)];
      setSingleCard(rand);
      setIsFlipping(false);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#FFE4E6'],
        });
      } catch (e) {}
    }, 400);
  };

  // Draw 3-card spread (過去 / 現在 / 未來)
  const handleDrawThree = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const shuffled = [...ROMANCE_ANGELS_CARDS].sort(() => 0.5 - Math.random());
      setThreeCards(shuffled.slice(0, 3));
      setIsFlipping(false);
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#EC4899', '#A855F7'],
        });
      } catch (e) {}
    }, 450);
  };

  const filteredCards = ROMANCE_ANGELS_CARDS.filter(
    (c) =>
      c.titleZh.includes(searchQuery) ||
      c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.some((k) => k.includes(searchQuery))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200">
          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
          浪漫天使・朵琳芙秋原創44張神諭卡
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
          👼 浪漫天使指引卡（全44張牌陣）
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/90 max-w-xl mx-auto leading-relaxed">
          連結守護浪漫愛情的浪漫天使群，透過心靈指引牌卡洞悉彼此的心意、前世今生、化學反應與靈魂伴侶的神聖契機。
        </p>
      </div>

      {/* Mode Switches */}
      <div className="flex justify-center gap-2 p-1.5 bg-rose-100/60 rounded-2xl border border-rose-200/80 max-w-md mx-auto">
        <button
          onClick={() => {
            setMode('single');
            if (!singleCard) handleDrawSingle();
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'single'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          單張每日指引
        </button>
        <button
          onClick={() => {
            setMode('three');
            if (threeCards.length === 0) handleDrawThree();
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'three'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          三張牌愛情時光陣
        </button>
        <button
          onClick={() => setMode('gallery')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            mode === 'gallery'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-900 hover:bg-white/60'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          44張圖鑑總覽
        </button>
      </div>

      {/* Mode 1: Single Card Draw */}
      {mode === 'single' && singleCard && (
        <div className="flex flex-col items-center">
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-rose-50 via-white to-amber-50/60 border-2 border-rose-200/90 shadow-xl text-amber-950 transition-all duration-300 transform ${
              isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
            }`}
          >
            {/* Card Top */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-800 rounded-full">
                No. {singleCard.id} / 44
              </span>
              <span className="text-xs font-serif text-rose-700 italic">
                Romance Angels
              </span>
            </div>

            {/* Card Center */}
            <div className="py-6 text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-3xl shadow-inner">
                💖
              </div>
              <h3 className="text-2xl font-bold text-rose-950">
                {singleCard.titleZh}
              </h3>
              <p className="text-xs text-rose-600 font-semibold tracking-wider">
                {singleCard.titleEn}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {singleCard.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 bg-rose-100/80 text-rose-900 rounded-md"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Angel Message */}
            <div className="p-4 bg-rose-50/90 rounded-2xl border border-rose-200/80 text-center text-xs font-bold text-rose-950 leading-relaxed">
              「{singleCard.message}」
            </div>

            {/* Angel Guidance */}
            <div className="mt-4 pt-4 border-t border-rose-100 space-y-1.5 text-xs text-amber-900">
              <h4 className="font-bold text-rose-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                浪漫天使指引與建議：
              </h4>
              <p className="leading-relaxed text-amber-800/90 bg-white/70 p-3 rounded-xl border border-rose-100">
                {singleCard.guidance}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleDrawSingle}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
              抽取今日天使指引
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Three-Card Spread */}
      {mode === 'three' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['過去能量 / 基礎', '當前現狀 / 關鍵', '未來指引 / 契機'].map((label, idx) => {
              const card = threeCards[idx];
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-md flex flex-col justify-between space-y-3"
                >
                  <div className="text-center pb-2 border-b border-rose-100">
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      {label}
                    </span>
                  </div>

                  {card ? (
                    <div className="space-y-3 text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-rose-50 flex items-center justify-center text-2xl">
                        🌹
                      </div>
                      <h4 className="text-lg font-bold text-rose-950">
                        {card.titleZh}
                      </h4>
                      <p className="text-[11px] text-rose-600 font-medium">
                        {card.titleEn}
                      </p>
                      <p className="text-xs font-semibold text-rose-900 bg-rose-50/80 p-2.5 rounded-xl border border-rose-100">
                        「{card.message}」
                      </p>
                      <p className="text-[11px] text-amber-800 text-left leading-relaxed">
                        {card.guidance}
                      </p>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-rose-400">
                      點擊下方按鈕揭牌
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={handleDrawThree}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95"
            >
              重新抽取三張牌愛情時光陣
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: 44 Cards Gallery */}
      {mode === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋牌卡名稱或關鍵字（如：靈魂伴侶、欺騙、吸引力...）"
              className="w-full text-xs px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-amber-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto p-1">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setActiveGalleryCard(card)}
                className="bg-white hover:bg-rose-50/60 p-3.5 rounded-2xl border border-rose-200/80 shadow-sm cursor-pointer transition flex flex-col justify-between space-y-2 hover:border-rose-400"
              >
                <div className="flex items-center justify-between text-[10px] text-rose-600">
                  <span>#{card.id}</span>
                  <span className="font-bold">天使卡</span>
                </div>
                <div className="text-center py-1">
                  <p className="font-bold text-xs text-rose-950">{card.titleZh}</p>
                  <p className="text-[10px] text-rose-500 truncate">{card.titleEn}</p>
                </div>
                <div className="text-[10px] text-amber-800/80 bg-rose-50/50 p-1.5 rounded-lg line-clamp-2">
                  {card.message}
                </div>
              </div>
            ))}
          </div>

          {/* Modal for viewing details of gallery card */}
          {activeGalleryCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm">
              <div 
                className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-rose-200 shadow-2xl space-y-4 animate-scale-up"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    No. {activeGalleryCard.id} / 44
                  </span>
                  <button
                    onClick={() => setActiveGalleryCard(null)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950"
                  >
                    關閉 ✕
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-xl font-bold text-rose-950">
                    {activeGalleryCard.titleZh}
                  </h3>
                  <p className="text-xs text-rose-600">{activeGalleryCard.titleEn}</p>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs font-bold text-rose-950 text-center">
                  「{activeGalleryCard.message}」
                </div>

                <div className="space-y-2 text-xs text-amber-900">
                  <h5 className="font-bold text-rose-900">牌卡指引解析：</h5>
                  <p className="leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                    {activeGalleryCard.guidance}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {activeGalleryCard.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
