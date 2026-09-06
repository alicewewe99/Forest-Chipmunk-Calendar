import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, QrCode, Download, Upload, Sparkles, 
  Heart, Flame, BookOpen, Layers, Smartphone
} from 'lucide-react';
import { FairytaleTab, DayStamp } from './types';
import { CalendarView } from './components/CalendarView';
import { RainbowCardView } from './components/RainbowCardView';
import { ZhenhaiTempleView } from './components/ZhenhaiTempleView';
import { RomanceAngelsView } from './components/RomanceAngelsView';
import { LoveBookView } from './components/LoveBookView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { ExportImportModal } from './components/ExportImportModal';
import { ParsedImportData } from './utils/icalExport';

// Initial sample stamps for delightful first impression (using requested emojis)
const DEFAULT_STAMPS: Record<string, DayStamp[]> = {
  '2026-09-06': [
    { id: 'init-1', emoji: '⭐', note: '今日幸福美好啟程', createdAt: Date.now() },
    { id: 'init-2', emoji: '🌰', note: '森林漫步撿橡子', createdAt: Date.now() }
  ],
  '2026-09-25': [
    { id: 'init-3', emoji: '🎂', note: '中秋賞月吃月餅', createdAt: Date.now() }
  ],
};

const DEFAULT_WEIGHTS: Record<string, number> = {
  '2026-09-06': 52.5,
};

const DEFAULT_MEMOS: Record<string, string> = {
  '2026-09-06': '閱讀秋日好書，記錄美好時光',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<FairytaleTab>('calendar');
  
  // 1. Stamps state
  const [stamps, setStamps] = useState<Record<string, DayStamp[]>>(() => {
    try {
      const saved = localStorage.getItem('fairytale_calendar_stamps');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STAMPS;
  });

  // 2. Weights state (kg)
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('fairytale_calendar_weights');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_WEIGHTS;
  });

  // 3. Memos state
  const [memos, setMemos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('fairytale_calendar_memos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_MEMOS;
  });

  // Modals
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Desktop PWA install prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Save stamps to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fairytale_calendar_stamps', JSON.stringify(stamps));
    } catch (e) {
      console.error(e);
    }
  }, [stamps]);

  // Save weights to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fairytale_calendar_weights', JSON.stringify(weights));
    } catch (e) {
      console.error(e);
    }
  }, [weights]);

  // Save memos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fairytale_calendar_memos', JSON.stringify(memos));
    } catch (e) {
      console.error(e);
    }
  }, [memos]);

  // Add stamp to date
  const handleAddStamp = (dateStr: string, emoji: string, note?: string) => {
    setStamps((prev) => {
      const dayList = prev[dateStr] || [];
      const newStamp: DayStamp = {
        id: 'st_' + Math.random().toString(36).substring(2, 9),
        emoji,
        note,
        createdAt: Date.now(),
      };
      return {
        ...prev,
        [dateStr]: [...dayList, newStamp],
      };
    });
  };

  // Remove single stamp from date
  const handleRemoveStamp = (dateStr: string, stampId: string) => {
    setStamps((prev) => {
      const dayList = prev[dateStr] || [];
      const filtered = dayList.filter((s) => s.id !== stampId);
      if (filtered.length === 0) {
        const copy = { ...prev };
        delete copy[dateStr];
        return copy;
      }
      return {
        ...prev,
        [dateStr]: filtered,
      };
    });
  };

  // Clear all stamps from date (One-click delete / Blank key)
  const handleClearDayStamps = (dateStr: string) => {
    setStamps((prev) => {
      const copy = { ...prev };
      delete copy[dateStr];
      return copy;
    });
  };

  // Update weight (kg)
  const handleUpdateWeight = (dateStr: string, weightKg?: number) => {
    setWeights((prev) => {
      const copy = { ...prev };
      if (weightKg === undefined || isNaN(weightKg)) {
        delete copy[dateStr];
      } else {
        copy[dateStr] = weightKg;
      }
      return copy;
    });
  };

  // Update memo 📝
  const handleUpdateMemo = (dateStr: string, memoText?: string) => {
    setMemos((prev) => {
      const copy = { ...prev };
      if (!memoText || !memoText.trim()) {
        delete copy[dateStr];
      } else {
        copy[dateStr] = memoText.trim();
      }
      return copy;
    });
  };

  // Import data (stamps, weights, memos)
  const handleImportSuccess = (imported: ParsedImportData) => {
    if (imported.stamps && Object.keys(imported.stamps).length > 0) {
      setStamps((prev) => ({
        ...prev,
        ...imported.stamps,
      }));
    }
    if (imported.weights && Object.keys(imported.weights).length > 0) {
      setWeights((prev) => ({
        ...prev,
        ...imported.weights,
      }));
    }
    if (imported.memos && Object.keys(imported.memos).length > 0) {
      setMemos((prev) => ({
        ...prev,
        ...imported.memos,
      }));
    }
  };

  // Trigger desktop PWA install
  const handleInstallDesktop = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#423326] flex flex-col font-['Zen_Maru_Gothic',sans-serif]">
      {/* Top App Header */}
      <header className="sticky top-0 z-40 bg-[#fbf6ee]/90 backdrop-blur-md border-b border-[#e9ded3] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('calendar')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 shadow-sm flex items-center justify-center p-0.5 group-hover:scale-105 transition transform overflow-hidden">
              <img 
                src="/icon.png" 
                alt="手繪花栗鼠拿著月曆" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-amber-950 leading-tight flex items-center gap-1.5">
                <span>童話故事日曆</span>
                <span className="text-xs px-1.5 py-0.2 bg-amber-200/70 text-amber-900 rounded font-semibold hidden xs:inline">
                  森林小動物
                </span>
              </h1>
              <p className="text-[11px] text-amber-800/80 font-medium hidden sm:block">
                森林小動物風格・2026~2027 台灣國定假・體重記錄與備忘錄
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Sync / Export */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold transition shadow-xs"
              title="匯入與匯出手機行事曆"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline">手機同步</span>
            </button>

            {/* PWA QR Code & App Download */}
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-sm transform active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-200" />
              <span>下載 App</span>
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-2.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'calendar'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              📅 童話日曆
            </button>

            <button
              onClick={() => setActiveTab('rainbow')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'rainbow'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              🌈 彩虹卡（245張）
            </button>

            <button
              onClick={() => setActiveTab('zhenhai')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'zhenhai'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-500" />
              ⛩️ 鎮海宮靈籤（60甲子）
            </button>

            <button
              onClick={() => setActiveTab('romance')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'romance'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              👼 浪漫天使（44張）
            </button>

            <button
              onClick={() => setActiveTab('lovebook')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'lovebook'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-500" />
              📖 愛的解答之書 &amp; YES/NO
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'calendar' && (
          <CalendarView
            stamps={stamps}
            onAddStamp={handleAddStamp}
            onRemoveStamp={handleRemoveStamp}
            onClearDayStamps={handleClearDayStamps}
            weights={weights}
            onUpdateWeight={handleUpdateWeight}
            memos={memos}
            onUpdateMemo={handleUpdateMemo}
          />
        )}

        {activeTab === 'rainbow' && <RainbowCardView />}

        {activeTab === 'zhenhai' && <ZhenhaiTempleView />}

        {activeTab === 'romance' && <RomanceAngelsView />}

        {activeTab === 'lovebook' && <LoveBookView />}
      </main>

      {/* Sweet Fairytale Footer */}
      <footer className="mt-auto py-6 border-t border-[#e8ded2] text-center text-xs text-amber-800/80 bg-[#f9f5ed]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="flex items-center justify-center gap-1 font-semibold text-amber-900">
            <span>🐿️</span>
            <span>童話故事日曆・陪伴您走過四季的溫暖與平靜</span>
            <span>🌰</span>
          </p>
          <p className="text-[11px] text-amber-700/70">
            精準農曆 24 節氣・行政院人事總處國定假日・體重追蹤・備忘錄📝・離線 PWA 支援・iCalendar (.ics) 同步
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallDesktop={handleInstallDesktop}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        stamps={stamps}
        weights={weights}
        memos={memos}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
