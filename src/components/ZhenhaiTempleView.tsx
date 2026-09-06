import React, { useState } from 'react';
import { Sparkles, RefreshCw, Flame, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_60_LOTS } from '../data/zhenhaiLots';
import { ZhenhaiLot } from '../types';

type DivinationStep = 'pray' | 'draw' | 'bwa_bwei' | 'result';
type BweiResult = 'sheng' | 'xiao' | 'yin'; // 聖筊 (一陽一陰), 笑筊 (兩陽), 陰筊 (兩陰)

export const ZhenhaiTempleView: React.FC = () => {
  const [step, setStep] = useState<DivinationStep>('pray');
  const [question, setQuestion] = useState<string>('');
  const [selectedLot, setSelectedLot] = useState<ZhenhaiLot | null>(null);
  const [bweiResult, setBweiResult] = useState<BweiResult | null>(null);
  const [bweiCount, setBweiCount] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Step 1 -> Draw Lot
  const handleStartDraw = () => {
    setIsRolling(true);
    setStep('draw');
    setTimeout(() => {
      const random = ALL_60_LOTS[Math.floor(Math.random() * ALL_60_LOTS.length)];
      setSelectedLot(random);
      setIsRolling(false);
      setStep('bwa_bwei');
      setBweiResult(null);
      setBweiCount(0);
    }, 1200);
  };

  // Step 2 -> 擲筊
  const handleBwaBwei = () => {
    setIsRolling(true);
    setTimeout(() => {
      // 55% chance Sheng (聖筊), 25% Xiao (笑筊), 20% Yin (陰筊)
      const rand = Math.random();
      let result: BweiResult = 'sheng';
      if (rand < 0.60) {
        result = 'sheng';
      } else if (rand < 0.85) {
        result = 'xiao';
      } else {
        result = 'yin';
      }

      setBweiResult(result);
      setIsRolling(false);

      if (result === 'sheng') {
        const nextCount = bweiCount + 1;
        setBweiCount(nextCount);
        // Single continuous sheng bwei confirms in modern mobile app
        setTimeout(() => {
          setStep('result');
          try {
            confetti({
              particleCount: 40,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
        }, 800);
      }
    }, 600);
  };

  const handleReset = () => {
    setStep('pray');
    setSelectedLot(null);
    setBweiResult(null);
    setBweiCount(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold border border-red-200">
          <Flame className="w-3.5 h-3.5 text-red-600" />
          東港鎮海宮・溫府千歲
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
          ⛩️ 六十甲子靈籤（指點迷津）
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/90 max-w-lg mx-auto leading-relaxed">
          源自古老干支紀年曆法與神明庇佑，心誠則靈。為您的事業、姻緣、家庭、財運與健康提供方向與安定的力量。
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between p-3 bg-amber-100/70 rounded-2xl border border-amber-200 text-xs font-bold">
        <span className={step === 'pray' ? 'text-red-700' : 'text-amber-800'}>1. 虔心默禱</span>
        <span className="text-amber-400">→</span>
        <span className={step === 'draw' ? 'text-red-700' : 'text-amber-800'}>2. 搖籤出筒</span>
        <span className="text-amber-400">→</span>
        <span className={step === 'bwa_bwei' ? 'text-red-700' : 'text-amber-800'}>3. 擲筊請示</span>
        <span className="text-amber-400">→</span>
        <span className={step === 'result' ? 'text-red-700' : 'text-amber-800'}>4. 開籤解惑</span>
      </div>

      {/* Step 1: Pray */}
      {step === 'pray' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/80 shadow-md space-y-4 text-center">
          <div className="text-4xl animate-bounce">🙏</div>
          <h3 className="text-lg font-bold text-amber-950">向神明恭敬稟報</h3>
          <p className="text-xs text-amber-800 leading-relaxed max-w-md mx-auto">
            請先靜心片刻，默念自己的姓名、農曆生辰、現居地址，並在心中清晰提問您所要請示的疑惑或事情。
          </p>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="（選填）請輸入心中所求之事，例如：近期工作轉職、姻緣發展..."
              className="w-full text-xs px-4 py-3 rounded-2xl bg-amber-50/70 border border-amber-300 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <button
            onClick={handleStartDraw}
            className="px-8 py-3.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95 flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            秉告完畢，開始抽籤
          </button>
        </div>
      )}

      {/* Step 2: Draw Animation */}
      {step === 'draw' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-md text-center space-y-4">
          <div className="text-5xl animate-spin">🏮</div>
          <h3 className="text-lg font-bold text-amber-950">正在虔誠搖籤...</h3>
          <p className="text-xs text-amber-800">六十甲子神籤流轉中，感應神明開示...</p>
        </div>
      )}

      {/* Step 3: Bwa Bwei (擲筊) */}
      {step === 'bwa_bwei' && selectedLot && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md text-center space-y-5">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 max-w-sm mx-auto">
            <span className="text-xs text-amber-700 font-bold">搖出籤支</span>
            <h3 className="text-2xl font-bold text-red-900 mt-1">
              第 {selectedLot.number} 籤【{selectedLot.ganzhi}】
            </h3>
            <span className="inline-block mt-1 text-xs px-2.5 py-0.5 bg-amber-200 text-amber-900 font-bold rounded-full">
              籤等：{selectedLot.rank}
            </span>
          </div>

          <p className="text-xs text-amber-800 leading-relaxed max-w-md mx-auto">
            抽得此籤，需向溫府千歲神明「擲筊」請示確認：是否為賜予此籤？
          </p>

          {/* Bwa Bwei visualization */}
          <div className="flex items-center justify-center gap-6 py-4">
            <div className={`w-16 h-12 bg-red-800 text-white font-bold rounded-tr-full rounded-bl-full flex items-center justify-center text-xs shadow-md transform transition-all duration-300 ${
              isRolling ? 'rotate-45 scale-90' : bweiResult === 'sheng' ? 'rotate-12' : ''
            }`}>
              筊杯
            </div>
            <div className={`w-16 h-12 bg-red-800 text-white font-bold rounded-tl-full rounded-br-full flex items-center justify-center text-xs shadow-md transform transition-all duration-300 ${
              isRolling ? '-rotate-45 scale-90' : bweiResult === 'sheng' ? '-rotate-12' : ''
            }`}>
              筊杯
            </div>
          </div>

          {bweiResult && (
            <div className="animate-fade-in">
              {bweiResult === 'sheng' && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  【聖筊】神明允准！賜封此籤，正在為您揭籤解詩...
                </div>
              )}
              {bweiResult === 'xiao' && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold inline-flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  【笑筊】神明笑而不答或狀況未明，請端正心念再擲一次！
                </div>
              )}
              {bweiResult === 'yin' && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs font-bold inline-flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  【陰筊】並非此籤，神明另有指引，請重新抽籤！
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            {bweiResult === 'yin' ? (
              <button
                onClick={handleStartDraw}
                className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-2xl transition shadow flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重新搖籤
              </button>
            ) : (
              <button
                onClick={handleBwaBwei}
                disabled={isRolling || bweiResult === 'sheng'}
                className="px-8 py-3.5 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-bold text-sm rounded-2xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isRolling ? '擲筊中...' : '擲筊請示'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'result' && selectedLot && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-amber-200 gap-2 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                東港鎮海宮靈籤
              </span>
              <h3 className="text-2xl font-bold text-amber-950 mt-1">
                第 {selectedLot.number} 籤【{selectedLot.ganzhi}】
              </h3>
            </div>
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-900 font-bold rounded-2xl border border-amber-300 self-center sm:self-auto">
              <span>籤等：</span>
              <span className="text-red-700 text-base">{selectedLot.rank}</span>
            </div>
          </div>

          {/* Authentic 4-line poem box */}
          <div className="p-6 bg-gradient-to-b from-[#fdfbf7] to-amber-50/50 rounded-2xl border-2 border-dashed border-amber-300 text-center space-y-2">
            <span className="text-xs text-amber-700 font-bold">📜 聖 意 籤 詩</span>
            <div className="space-y-1.5 py-2 font-serif text-base sm:text-lg text-amber-950 font-bold tracking-widest leading-relaxed">
              {selectedLot.poem.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
            <div className="pt-2 text-xs text-amber-800 italic">
              典故：{selectedLot.story}
            </div>
          </div>

          {/* General Meaning */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              【籤意總解】
            </h4>
            <p className="text-xs sm:text-sm text-amber-950 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 leading-relaxed">
              {selectedLot.meaning}
            </p>
          </div>

          {/* Categorized Guidances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200">
              <span className="font-bold text-orange-950">💼 事業 / 功名：</span>
              <p className="text-orange-900 mt-1 leading-relaxed">{selectedLot.career}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200">
              <span className="font-bold text-rose-950">💖 姻緣 / 感情：</span>
              <p className="text-rose-900 mt-1 leading-relaxed">{selectedLot.marriage}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
              <span className="font-bold text-amber-950">💰 財運 / 投資：</span>
              <p className="text-amber-900 mt-1 leading-relaxed">{selectedLot.wealth}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <span className="font-bold text-emerald-950">🌱 健康 / 疾病：</span>
              <p className="text-emerald-900 mt-1 leading-relaxed">{selectedLot.health}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 sm:col-span-2">
              <span className="font-bold text-purple-950">🏡 家運 / 出行：</span>
              <p className="text-purple-900 mt-1 leading-relaxed">{selectedLot.family}</p>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-2 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition"
            >
              感謝神恩・再次請示
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
