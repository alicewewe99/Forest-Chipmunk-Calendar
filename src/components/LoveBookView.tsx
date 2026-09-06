import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, RefreshCw, HelpCircle, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOVE_BOOK_ANSWERS, YES_NO_RESPONSES } from '../data/loveBookAnswers';
import { LoveAnswer } from '../types';

export const LoveBookView: React.FC = () => {
  const [subTab, setSubTab] = useState<'book' | 'yesno'>('book');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<LoveAnswer | null>(null);
  const [yesNoResult, setYesNoResult] = useState<any | null>(null);
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const handleOpenBook = () => {
    setIsOpening(true);
    setTimeout(() => {
      const rand = LOVE_BOOK_ANSWERS[Math.floor(Math.random() * LOVE_BOOK_ANSWERS.length)];
      setCurrentAnswer(rand);
      setIsOpening(false);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#A855F7', '#EAB308'],
        });
      } catch (e) {}
    }, 600);
  };

  const handleAskYesNo = () => {
    setIsOpening(true);
    setTimeout(() => {
      const rand = YES_NO_RESPONSES[Math.floor(Math.random() * YES_NO_RESPONSES.length)];
      setYesNoResult(rand);
      setIsOpening(false);
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold border border-pink-200">
          <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-500" />
          心靈對話・解答迷惘
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
          📖 愛的解答之書 &amp; YES/NO 神諭
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/90 max-w-lg mx-auto leading-relaxed">
          把手輕輕放在心口，在心中默想那個人或那道愛情的難題，翻開書頁，聆聽命運給你的溫柔絮語。
        </p>
      </div>

      {/* Switcher */}
      <div className="flex justify-center gap-2 p-1.5 bg-amber-100/70 rounded-2xl border border-amber-200 max-w-xs mx-auto">
        <button
          onClick={() => setSubTab('book')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            subTab === 'book'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'text-amber-900 hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          愛的解答之書
        </button>
        <button
          onClick={() => setSubTab('yesno')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            subTab === 'yesno'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'text-amber-900 hover:bg-white/60'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          YES / NO 愛情神諭
        </button>
      </div>

      {/* Mode 1: The Book of Love Answers */}
      {subTab === 'book' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md text-center space-y-4">
            <p className="text-xs text-amber-800">
              請在心中默想或輸入你想問愛情的疑問（例如：「我該主動聯繫他嗎？」）：
            </p>

            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder="請輸入你的問題..."
              className="w-full max-w-md text-xs px-4 py-3 rounded-2xl bg-amber-50/70 border border-amber-300 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600 text-center"
            />

            <div>
              <button
                onClick={handleOpenBook}
                disabled={isOpening}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-700 to-rose-700 hover:from-amber-800 hover:to-rose-800 text-white font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95 disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                <BookOpen className="w-4 h-4" />
                {isOpening ? '翻開書頁中...' : '閉眼冥想・翻開解答之書'}
              </button>
            </div>
          </div>

          {/* Book Page Reveal */}
          {currentAnswer && (
            <div className="relative bg-gradient-to-b from-[#fffefc] to-[#f9f5ec] rounded-3xl p-8 sm:p-10 border-4 border-amber-300/80 shadow-2xl text-center space-y-4 transform animate-scale-up">
              <span className="text-[11px] font-bold text-amber-800 tracking-widest uppercase">
                ✦ The Book of Love Answers ✦
              </span>

              <div className="py-4">
                <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-950 leading-relaxed drop-shadow-sm">
                  「{currentAnswer.quote}」
                </p>
              </div>

              <div className="pt-4 border-t border-amber-200 max-w-md mx-auto text-xs text-amber-800 leading-relaxed bg-amber-50/60 p-3 rounded-xl">
                <strong>心靈微語：</strong>{currentAnswer.guidance}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: YES / NO Love Oracle */}
      {subTab === 'yesno' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-md text-center space-y-6">
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-amber-950">快速 YES / NO 愛情決策</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              猶豫不決時，讓森林的精靈為你擲出一枚命運的指引徽章。
            </p>
          </div>

          <button
            onClick={handleAskYesNo}
            disabled={isOpening}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95 disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            {isOpening ? '感應中...' : '擲出 YES / NO 答案'}
          </button>

          {yesNoResult && (
            <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-200 space-y-3 animate-scale-up max-w-sm mx-auto">
              <div className="text-4xl">{yesNoResult.symbol}</div>
              <h4 className="text-2xl font-bold text-amber-950">
                {yesNoResult.answer}
              </h4>
              <p className="text-xs text-amber-800">
                {yesNoResult.subtext}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
