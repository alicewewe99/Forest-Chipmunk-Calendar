export type StickerEmoji = '🌰' | '⭐' | '🎂' | '📌' | '💼' | '🏥' | '🍔' | '❤️' | '🌱' | '🍗';

export interface DayStamp {
  id: string;
  emoji: string;
  note?: string;
  time?: string;
  createdAt: number;
}

export interface DayInfo {
  date: string; // YYYY-MM-DD
  year: number;
  month: number; // 1-12
  day: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  lunarMonthName: string; // e.g. "正月", "七月", "臘月"
  lunarMonthNum?: number; // 1-12
  lunarDayName: string; // e.g. "初一", "廿六", "三十"
  lunarDayNum?: number; // 1-30
  lunarDateStr: string; // e.g. "農曆七月廿六"
  lunarFestival?: string; // e.g. "重陽節", "七夕", "中元節"
  solarTerm?: string; // e.g. "立春", "秋分"
  holidayName?: string; // e.g. "中秋節", "兒童節"
  isNationalHoliday: boolean; // 國定假日
  isRestDay: boolean; // 休假日 (紅色顯示)
  isToday: boolean;
  westernFestival?: string;
  weight?: number; // 當日體重 (kg)
  memo?: string; // 備忘錄內容 📝
}

// Rainbow Cards
export type ChakraType = 'root' | 'sacral' | 'solarPlexus' | 'heart' | 'throat' | 'thirdEye' | 'crown';

export interface RainbowCard {
  id: string;
  colorName: string;
  colorHex: string;
  bgGradient: string;
  chakra: string;
  chakraLocation: string;
  keyword: string;
  imbalanceDesc: string;
  affirmation: string;
  wisdom: string;
}

// 60 Jiazi Lingqian
export interface ZhenhaiLot {
  number: number;
  ganzhi: string; // e.g. "甲子", "乙丑"
  rank: string; // e.g. "大吉", "上吉", "中平"
  poem: string[]; // 4 lines
  story: string; // 典故
  meaning: string;
  career: string; // 事業
  marriage: string; // 姻緣
  wealth: string; // 財運
  health: string; // 健康
  family: string; // 家運
}

// 44 Romance Angels Cards
export interface RomanceAngelCard {
  id: number;
  titleZh: string;
  titleEn: string;
  keywords: string[];
  message: string;
  guidance: string;
  iconName: string;
}

// Love Book Answer
export interface LoveAnswer {
  id: number;
  quote: string;
  guidance: string;
  category: 'encouragement' | 'action' | 'patience' | 'reflection';
}

// Active Tab in the fairytale storybook
export type FairytaleTab = 'calendar' | 'rainbow' | 'zhenhai' | 'romance' | 'lovebook' | 'yesno';
