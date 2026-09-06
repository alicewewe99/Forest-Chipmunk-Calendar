import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Copy, Check, Sparkles, Plus, 
  Trash2, X, Scale, FileText, Eraser
} from 'lucide-react';
import { DayInfo, DayStamp, StickerEmoji } from '../types';
import { getDayInfo, formatCopyDate } from '../utils/lunarCalendar';

interface CalendarViewProps {
  stamps: Record<string, DayStamp[]>;
  onAddStamp: (dateStr: string, emoji: string, note?: string) => void;
  onRemoveStamp: (dateStr: string, stampId: string) => void;
  onClearDayStamps: (dateStr: string) => void;
  
  weights: Record<string, number>;
  onUpdateWeight: (dateStr: string, weightKg?: number) => void;

  memos: Record<string, string>;
  onUpdateMemo: (dateStr: string, memo?: string) => void;
}

// User specified emojis: 🌰 ⭐ 🎂 📌 💼 🏥 🍔 ❤️ 🌱 🍗
export const QUICK_STAMPS: StickerEmoji[] = [
  '🌰', '⭐', '🎂', '📌', '💼', '🏥', '🍔', '❤️', '🌱', '🍗'
];

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  stamps,
  onAddStamp,
  onRemoveStamp,
  onClearDayStamps,
  weights,
  onUpdateWeight,
  memos,
  onUpdateMemo,
}) => {
  // Current real date
  const today = useMemo(() => new Date(), []);
  const todayDateStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Calendar starts on current month/year
  const [currentYear, setCurrentYear] = useState<number>(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => today.getMonth() + 1); // 1-12
  
  // Selected stamp emoji or 'BLANK' (eraser / 空白鍵)
  const [activeStampEmoji, setActiveStampEmoji] = useState<string>('⭐');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Day detail modal
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [dayNoteInput, setDayNoteInput] = useState<string>('');
  
  // Weight & Memo modal state
  const [weightInput, setWeightInput] = useState<string>('');
  const [memoInput, setMemoInput] = useState<string>('');

  // When selectedDay opens, pre-fill its weight & memo
  const handleOpenDayModal = (dayInfo: DayInfo) => {
    setSelectedDay(dayInfo);
    setDayNoteInput('');
    const currentW = weights[dayInfo.date];
    setWeightInput(currentW !== undefined ? String(currentW) : '');
    setMemoInput(memos[dayInfo.date] || '');
  };

  // Month & Year navigation
  const handlePrevYear = () => {
    setCurrentYear((y) => y - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((y) => y + 1);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  // Copy today's date in exact format: 年月日農曆日期星期
  const handleCopyToday = async () => {
    const formatted = formatCopyDate(todayDateStr);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // One-click clear today's stamps
  const handleClearTodayStamps = () => {
    if (stamps[todayDateStr]?.length > 0) {
      onClearDayStamps(todayDateStr);
      setActionNotice('已清空今日印章標記！');
      setTimeout(() => setActionNotice(null), 2500);
    } else {
      setActionNotice('今日尚無標記');
      setTimeout(() => setActionNotice(null), 2000);
    }
  };

  // Build the fixed-size 6-row (42 cells) calendar matrix
  const calendarCells = useMemo(() => {
    const cells: (DayInfo | null)[] = [];

    // First day of current month
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const startDayOfWeek = firstDay.getDay(); // 0-6

    // Total days in current month
    const lastDay = new Date(currentYear, currentMonth, 0);
    const totalDays = lastDay.getDate();

    // Previous month filler to keep fixed layout
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(currentYear, currentMonth - 2, prevMonthLastDay - i);
      cells.push(getDayInfo(prevDate, todayDateStr));
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const curDate = new Date(currentYear, currentMonth - 1, d);
      cells.push(getDayInfo(curDate, todayDateStr));
    }

    // Next month filler to reach exactly 42 cells (6 rows x 7 days)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(currentYear, currentMonth, i);
      cells.push(getDayInfo(nextDate, todayDateStr));
    }

    return cells;
  }, [currentYear, currentMonth, todayDateStr]);

  // Click on a day
  const handleCellClick = (dayInfo: DayInfo, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      setCurrentYear(dayInfo.year);
      setCurrentMonth(dayInfo.month);
      return;
    }

    // If active tool is 'BLANK' (eraser mode), clear day's stamps
    if (activeStampEmoji === 'BLANK') {
      onClearDayStamps(dayInfo.date);
      setActionNotice(`已清除 ${dayInfo.month}月${dayInfo.day}日 標記`);
      setTimeout(() => setActionNotice(null), 1800);
      return;
    }

    // Open detail modal
    handleOpenDayModal(dayInfo);
  };

  // Quick 1-click stamp button on cell
  const handleQuickStampCell = (e: React.MouseEvent, dateStr: string) => {
    e.stopPropagation();
    if (activeStampEmoji === 'BLANK') {
      onClearDayStamps(dateStr);
    } else {
      onAddStamp(dateStr, activeStampEmoji);
    }
  };

  // Weight save
  const handleSaveWeight = (dateStr: string) => {
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 0) {
      onUpdateWeight(dateStr, parseFloat(val.toFixed(1)));
    } else {
      onUpdateWeight(dateStr, undefined);
    }
  };

  const handleAdjustWeight = (delta: number) => {
    const current = parseFloat(weightInput) || 50.0;
    const newVal = Math.max(10, Math.min(250, current + delta));
    setWeightInput(newVal.toFixed(1));
  };

  // Memo save
  const handleSaveMemo = (dateStr: string) => {
    if (memoInput.trim()) {
      onUpdateMemo(dateStr, memoInput.trim());
    } else {
      onUpdateMemo(dateStr, undefined);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Banner: Today's Date & 1-Click Copy */}
      <div className="bg-gradient-to-r from-amber-100/90 via-orange-100/80 to-amber-100/90 rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center p-1 border border-amber-300">
            <img 
              src="/icon.svg" 
              alt="手繪花栗鼠" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-800 text-white">
                今日焦點
              </span>
              <span className="text-xs text-amber-900 font-semibold">
                {formatCopyDate(todayDateStr)}
              </span>
            </div>
            <p className="text-xs text-amber-800/80 mt-0.5">
              可愛手繪花栗鼠陪伴您的四季！支援體重記錄、備忘錄與一鍵印章！
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyToday}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-950 bg-white hover:bg-amber-50 rounded-2xl shadow-sm border border-amber-300 transition transform active:scale-95 whitespace-nowrap"
        >
          {copiedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700">已複製當天日期！</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-700" />
              <span>複製當天日期（年月日農曆星期）</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Stamp Dock with 10 Emojis, Blank Key (Eraser), and 1-Click Delete */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-amber-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-950 whitespace-nowrap">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>印章標記：</span>
        </div>

        {/* 10 Emojis + Blank Key + 1-Click Clear */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full lg:w-auto">
          {QUICK_STAMPS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setActiveStampEmoji(emoji)}
              className={`w-9 h-9 rounded-2xl text-base flex items-center justify-center transition transform active:scale-90 ${
                activeStampEmoji === emoji
                  ? 'bg-amber-200/90 ring-2 ring-amber-600 scale-110 shadow-sm'
                  : 'bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200'
              }`}
              title={`點選 ${emoji} 標記`}
            >
              {emoji}
            </button>
          ))}

          {/* Blank Key / Eraser Button (空白鍵) */}
          <button
            onClick={() => setActiveStampEmoji('BLANK')}
            className={`px-3 h-9 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition transform active:scale-90 ${
              activeStampEmoji === 'BLANK'
                ? 'bg-rose-100 text-rose-800 ring-2 ring-rose-500 scale-105 shadow-sm'
                : 'bg-neutral-100/80 hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
            }`}
            title="空白鍵（點擊任一日曆格子即可擦除標記）"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>空白鍵（擦除）</span>
          </button>

          {/* One-Click Delete Today (一鍵刪除) */}
          <button
            onClick={handleClearTodayStamps}
            className="px-3 h-9 rounded-2xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition transform active:scale-95"
            title="一鍵刪除今日所有印章標記"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>一鍵刪除今日</span>
          </button>
        </div>
      </div>

      {/* Floating Action Notice Toast */}
      {actionNotice && (
        <div className="bg-amber-800 text-white text-xs font-bold py-1.5 px-4 rounded-full mx-auto w-fit shadow-md animate-bounce">
          {actionNotice}
        </div>
      )}

      {/* Main Calendar Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md overflow-hidden flex flex-col">
        {/* Month Header with Year Adjustment Controls */}
        <div className="px-3 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#fbf8f3] via-amber-50/50 to-[#fbf8f3] border-b border-amber-200 flex flex-wrap md:flex-nowrap items-center justify-between gap-2.5">
          {/* Previous Controls (Year & Month) */}
          <div className="flex items-center gap-1.5 order-2 md:order-1">
            <button
              onClick={handlePrevYear}
              className="flex items-center gap-0.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs transition transform active:scale-95 whitespace-nowrap"
              title="調整到上一年"
            >
              <span>« 上一年</span>
            </button>

            <button
              onClick={handlePrevMonth}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 shadow-sm transition transform active:scale-95 whitespace-nowrap"
              aria-label="上個月"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
              <span>上個月</span>
            </button>
          </div>

          {/* Center: Year & Month Direct Selectors */}
          <div className="text-center order-1 md:order-2 w-full md:w-auto flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2">
              {/* Year Selector with - / + buttons */}
              <div className="flex items-center bg-white border-2 border-amber-300 rounded-2xl px-1.5 sm:px-2 py-0.5 shadow-2xs">
                <button
                  onClick={handlePrevYear}
                  className="w-6 h-6 rounded-lg hover:bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center transition"
                  title="減少一年"
                >
                  -
                </button>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="bg-transparent font-black text-amber-950 text-base sm:text-xl md:text-2xl px-1 py-0.5 cursor-pointer focus:outline-none text-center"
                >
                  {Array.from({ length: 30 }, (_, i) => 2020 + i).map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} 年
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleNextYear}
                  className="w-6 h-6 rounded-lg hover:bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center transition"
                  title="增加一年"
                >
                  +
                </button>
              </div>

              {/* Month Selector Dropdown */}
              <div className="bg-white border-2 border-amber-300 rounded-2xl px-2 py-0.5 shadow-2xs">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="bg-transparent font-black text-amber-900 text-base sm:text-xl md:text-2xl px-1 py-0.5 cursor-pointer focus:outline-none text-center"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m} 月
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGoToday}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300 transition"
            >
              回到今日（{today.getFullYear()}年{today.getMonth() + 1}月）
            </button>
          </div>

          {/* Next Controls (Month & Year) */}
          <div className="flex items-center gap-1.5 order-3">
            <button
              onClick={handleNextMonth}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm border border-amber-300 shadow-sm transition transform active:scale-95 whitespace-nowrap"
              aria-label="下個月"
            >
              <span>下個月</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800" />
            </button>

            <button
              onClick={handleNextYear}
              className="flex items-center gap-0.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs transition transform active:scale-95 whitespace-nowrap"
              title="調整到下一年"
            >
              <span>下一年 »</span>
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 border-b border-amber-200 bg-amber-50/50 text-center text-xs font-bold py-2.5">
          {WEEKDAYS.map((wd, index) => {
            const isWeekend = index === 0 || index === 6;
            return (
              <div
                key={wd}
                className={`py-1 ${isWeekend ? 'text-rose-600 font-extrabold' : 'text-amber-900'}`}
              >
                週{wd}
              </div>
            );
          })}
        </div>

        {/* FIXED SIZE Calendar Grid (Strict 7 columns x 6 rows) */}
        <div className="grid grid-cols-7 divide-x divide-y divide-amber-100/80 bg-amber-50/20">
          {calendarCells.map((dayInfo, idx) => {
            if (!dayInfo) return null;

            const isCurrentMonth = dayInfo.month === currentMonth && dayInfo.year === currentYear;
            const dayStamps = stamps[dayInfo.date] || [];
            const dayWeight = weights[dayInfo.date];
            const dayMemo = memos[dayInfo.date];

            return (
              <div
                key={`${dayInfo.date}-${idx}`}
                onClick={() => handleCellClick(dayInfo, isCurrentMonth)}
                className={`min-h-[88px] sm:min-h-[105px] p-1 sm:p-2 flex flex-col justify-between transition relative cursor-pointer select-none group ${
                  !isCurrentMonth
                    ? 'opacity-35 bg-neutral-100/40'
                    : dayInfo.isToday
                    ? 'bg-amber-100/50 font-bold ring-2 ring-amber-400 inset-0'
                    : dayInfo.isRestDay
                    ? 'bg-rose-50/40 hover:bg-rose-100/40'
                    : 'bg-white hover:bg-amber-50/50'
                }`}
              >
                {/* Top of Cell: Day Number & Badges */}
                <div className="flex items-start justify-between">
                  <span
                    className={`text-xs sm:text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      dayInfo.isToday
                        ? 'bg-amber-700 text-white shadow'
                        : dayInfo.isRestDay
                        ? 'text-rose-600'
                        : 'text-amber-950'
                    }`}
                  >
                    {dayInfo.day}
                  </span>

                  {/* Holiday / Lunar Festival / Solar term tags */}
                  <div className="flex flex-col items-end gap-0.5">
                    {dayInfo.isNationalHoliday && (
                      <span className="text-[9px] sm:text-[10px] bg-rose-600 text-white font-bold px-1 py-0.2 rounded leading-tight shadow-xs">
                        國定假
                      </span>
                    )}
                    {dayInfo.lunarFestival && (
                      <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1 py-0.2 rounded leading-tight">
                        {dayInfo.lunarFestival.split(' ')[0]}
                      </span>
                    )}
                    {dayInfo.holidayName && !dayInfo.isNationalHoliday && dayInfo.holidayName !== dayInfo.lunarFestival && (
                      <span className="text-[9px] text-rose-700 font-bold max-w-[55px] truncate">
                        {dayInfo.holidayName}
                      </span>
                    )}
                    {dayInfo.solarTerm && dayInfo.holidayName !== dayInfo.solarTerm && (
                      <span className="text-[9px] text-emerald-700 font-bold">
                        {dayInfo.solarTerm}
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle: Lunar Date & Western Festivals */}
                <div className="py-0.5">
                  <div className="flex items-center gap-1">
                    <p className={`text-[10px] sm:text-[11px] font-medium truncate ${
                      dayInfo.lunarDayNum === 1 
                        ? 'text-amber-800 font-bold' 
                        : dayInfo.lunarFestival 
                        ? 'text-rose-700 font-bold' 
                        : 'text-neutral-600'
                    }`}>
                      {dayInfo.lunarDayNum === 1 ? dayInfo.lunarMonthName : dayInfo.lunarDayName}
                    </p>
                    {dayInfo.solarTerm && (
                      <span className="text-[9px] text-emerald-700 font-semibold hidden sm:inline">
                        • {dayInfo.solarTerm}
                      </span>
                    )}
                  </div>
                  {dayInfo.westernFestival && (
                    <p className="text-[9px] text-purple-700 font-medium truncate">
                      {dayInfo.westernFestival}
                    </p>
                  )}
                </div>

                {/* Daily Weight (kg) Badge: "體重數字不用標在日曆上，用💟標示" */}
                {dayWeight !== undefined && (
                  <div 
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-pink-50 border border-pink-200/90 text-pink-700 shadow-2xs w-fit"
                    title={`今日已記錄體重（數字保密不公開顯示）`}
                  >
                    <span className="text-xs sm:text-sm leading-none">💟</span>
                    <span className="text-[9px] font-bold text-pink-700 hidden sm:inline">體重</span>
                  </div>
                )}

                {/* Daily Memo 📝 Badge */}
                {dayMemo && (
                  <div 
                    className="text-[9px] sm:text-[10px] font-medium text-amber-900 bg-amber-100/90 border border-amber-300/80 px-1 py-0.5 rounded-md truncate flex items-center gap-1 mt-0.5" 
                    title={`備忘錄：${dayMemo}`}
                  >
                    <span>📝</span>
                    <span className="truncate">{dayMemo}</span>
                  </div>
                )}

                {/* User Emoji Stamps */}
                <div className="flex flex-wrap items-center gap-0.5 min-h-[18px] mt-0.5">
                  {dayStamps.slice(0, 3).map((st) => (
                    <span
                      key={st.id}
                      className="text-xs sm:text-sm leading-none"
                      title={st.note || st.emoji}
                    >
                      {st.emoji}
                    </span>
                  ))}
                  {dayStamps.length > 3 && (
                    <span className="text-[9px] text-amber-700 font-bold">
                      +{dayStamps.length - 3}
                    </span>
                  )}
                </div>

                {/* Hover Quick Action Button */}
                {isCurrentMonth && (
                  <button
                    onClick={(e) => handleQuickStampCell(e, dayInfo.date)}
                    className={`absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full text-[10px] flex items-center justify-center transition shadow-xs ${
                      activeStampEmoji === 'BLANK'
                        ? 'bg-rose-200 hover:bg-rose-300 text-rose-950'
                        : 'bg-amber-200 hover:bg-amber-300 text-amber-950'
                    }`}
                    title={activeStampEmoji === 'BLANK' ? '清除此日標記' : `快速蓋上 ${activeStampEmoji}`}
                  >
                    {activeStampEmoji === 'BLANK' ? '✕' : '+'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail, Weight & Memo Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-[#fcf8f2] rounded-3xl p-5 sm:p-6 max-w-lg w-full border-2 border-[#e8ded2] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div>
                <span className="text-xs font-bold text-amber-800">
                  {formatCopyDate(selectedDay.date)}
                </span>
                <h3 className="text-xl font-bold text-amber-950">
                  {selectedDay.year}年{selectedDay.month}月{selectedDay.day}日
                </h3>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-white text-amber-900 flex items-center justify-center border border-amber-200 hover:bg-amber-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Holiday Info */}
            <div className="p-3 bg-white rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center justify-between">
                <span><strong>農曆：</strong>{selectedDay.lunarDateStr}</span>
                {selectedDay.solarTerm && (
                  <span className="text-emerald-700 font-bold">🌿 節氣：{selectedDay.solarTerm}</span>
                )}
              </div>
              {selectedDay.lunarFestival && (
                <p className="text-amber-800 font-bold bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  🌼 傳統節慶：{selectedDay.lunarFestival}
                </p>
              )}
              {selectedDay.holidayName && selectedDay.holidayName !== selectedDay.lunarFestival && (
                <p className="text-rose-600 font-bold">
                  🎉 {selectedDay.holidayName} {selectedDay.isNationalHoliday && '（國定假日）'}
                </p>
              )}
              {selectedDay.westernFestival && (
                <p className="text-purple-700 font-bold">
                  🎈 西洋節日：{selectedDay.westernFestival}
                </p>
              )}
            </div>

            {/* 1. Daily Weight (kg) Feature */}
            <div className="p-3.5 bg-white rounded-2xl border border-pink-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                  <span className="text-base leading-none">💟</span>
                  <span>當日體重記錄（kg）：</span>
                </label>
                {weights[selectedDay.date] !== undefined && (
                  <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                    目前：{weights[selectedDay.date]} kg
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="250"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="輸入體重（如 52.5）"
                  className="flex-1 text-sm font-bold px-3 py-1.5 rounded-xl bg-pink-50/40 border border-pink-300 text-pink-950 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <span className="text-xs font-bold text-pink-900">kg</span>

                <button
                  onClick={() => handleSaveWeight(selectedDay.date)}
                  className="px-3 py-1.5 rounded-xl bg-pink-700 hover:bg-pink-800 text-white font-bold text-xs shadow-xs transition"
                >
                  儲存
                </button>
                {weights[selectedDay.date] !== undefined && (
                  <button
                    onClick={() => {
                      onUpdateWeight(selectedDay.date, undefined);
                      setWeightInput('');
                    }}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg"
                    title="清除體重記錄"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Steppers & Privacy Notice */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-pink-800/70 font-medium">微調：</span>
                  <button
                    onClick={() => handleAdjustWeight(-0.5)}
                    className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200"
                  >
                    -0.5
                  </button>
                  <button
                    onClick={() => handleAdjustWeight(-0.1)}
                    className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200"
                  >
                    -0.1
                  </button>
                  <button
                    onClick={() => handleAdjustWeight(0.1)}
                    className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200"
                  >
                    +0.1
                  </button>
                  <button
                    onClick={() => handleAdjustWeight(0.5)}
                    className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200"
                  >
                    +0.5
                  </button>
                </div>
                <span className="text-[10px] text-pink-700/75">
                  月曆僅以 💟 標記，數字保密
                </span>
              </div>
            </div>

            {/* 2. Daily Memo 📝 Feature */}
            <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>備忘錄功能月曆標記 📝：</span>
                </label>
                {memos[selectedDay.date] && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    已標記
                  </span>
                )}
              </div>

              <textarea
                value={memoInput}
                onChange={(e) => setMemoInput(e.target.value)}
                placeholder="寫下今天的待辦備忘、重要提醒或生活隨筆（將於月曆上顯示 📝 標記）..."
                rows={2}
                className="w-full text-xs px-3 py-2 rounded-xl bg-amber-50/40 border border-amber-300 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[11px] text-amber-700/70">
                  月曆格將顯示「📝 備忘內容」
                </span>
                <div className="flex items-center gap-2">
                  {memos[selectedDay.date] && (
                    <button
                      onClick={() => {
                        onUpdateMemo(selectedDay.date, undefined);
                        setMemoInput('');
                      }}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      清空備忘
                    </button>
                  )}
                  <button
                    onClick={() => handleSaveMemo(selectedDay.date)}
                    className="px-3.5 py-1 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition"
                  >
                    儲存備忘
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Stamps on this day & One-click Delete */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>印章標記（{stamps[selectedDay.date]?.length || 0} 個）：</span>
                {(stamps[selectedDay.date]?.length || 0) > 0 && (
                  <button
                    onClick={() => onClearDayStamps(selectedDay.date)}
                    className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>一鍵刪除今日所有印章</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {(stamps[selectedDay.date] || []).map((st) => (
                  <div
                    key={st.id}
                    className="p-2 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{st.emoji}</span>
                      <span className="text-amber-950">{st.note || '生活標記'}</span>
                    </div>
                    <button
                      onClick={() => onRemoveStamp(selectedDay.date, st.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1"
                      title="刪除此標記"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(stamps[selectedDay.date] || []).length === 0 && (
                  <p className="text-xs text-amber-800/60 py-2 text-center bg-white/70 rounded-xl border border-dashed border-amber-200">
                    目前尚未有印章標記，點擊下方印章即可直接加入！
                  </p>
                )}
              </div>
            </div>

            {/* 4. Direct Stamp Buttons (10 Emojis + Blank Key) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-amber-900">
                點擊印章加入此日：
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_STAMPS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onAddStamp(selectedDay.date, emoji, dayNoteInput || undefined)}
                    className="w-10 h-10 rounded-2xl bg-white hover:bg-amber-100 text-lg flex items-center justify-center border border-amber-200 transition transform active:scale-95 shadow-xs"
                    title={`加入 ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}

                {/* Blank Key in modal to clear all */}
                <button
                  onClick={() => onClearDayStamps(selectedDay.date)}
                  className="px-3 h-10 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 border border-rose-200 transition"
                  title="空白鍵（清空所有印章）"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>空白鍵清空</span>
                </button>
              </div>
            </div>

            {/* Optional Note Input for custom stamp */}
            <div className="space-y-1">
              <span className="text-[11px] text-amber-800">
                （選填自訂印章備註）：
              </span>
              <input
                type="text"
                value={dayNoteInput}
                onChange={(e) => setDayNoteInput(e.target.value)}
                placeholder="例如：看醫生、買晚餐、慶生..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-amber-200">
              <button
                onClick={() => {
                  onClearDayStamps(selectedDay.date);
                  onUpdateWeight(selectedDay.date, undefined);
                  onUpdateMemo(selectedDay.date, undefined);
                  setWeightInput('');
                  setMemoInput('');
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>一鍵清除今日所有記錄</span>
              </button>

              <button
                onClick={() => {
                  // Auto save if filled
                  if (weightInput.trim()) handleSaveWeight(selectedDay.date);
                  if (memoInput.trim()) handleSaveMemo(selectedDay.date);
                  setSelectedDay(null);
                }}
                className="px-6 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-sm transition transform active:scale-95"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
