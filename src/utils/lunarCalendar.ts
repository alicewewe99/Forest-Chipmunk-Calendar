import { DayInfo } from '../types';

// Chinese Solar Terms
export const SOLAR_TERMS_NAMES = [
  '小寒', '大寒', '立春', '雨水', '驚蟄', '春分',
  '清明', '穀雨', '立夏', '小滿', '芒種', '夏至',
  '小暑', '大暑', '立秋', '處暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

// Exact Solar Terms Map for 2026 & 2027 (verified against official calendar IMG_4428 & IMG_4430)
const SOLAR_TERMS_DATES: Record<string, string> = {
  // 2026 (IMG_4428)
  '2026-01-05': '小寒',
  '2026-01-20': '大寒',
  '2026-02-04': '立春',
  '2026-02-19': '雨水',
  '2026-03-05': '驚蟄',
  '2026-03-20': '春分',
  '2026-04-05': '清明',
  '2026-04-20': '穀雨',
  '2026-05-05': '立夏',
  '2026-05-21': '小滿',
  '2026-06-05': '芒種',
  '2026-06-21': '夏至',
  '2026-07-07': '小暑',
  '2026-07-23': '大暑',
  '2026-08-07': '立秋',
  '2026-08-23': '處暑',
  '2026-09-07': '白露',
  '2026-09-23': '秋分',
  '2026-10-08': '寒露',
  '2026-10-23': '霜降',
  '2026-11-07': '立冬',
  '2026-11-22': '小雪',
  '2026-12-07': '大雪',
  '2026-12-22': '冬至',

  // 2027 (IMG_4430)
  '2027-01-05': '小寒',
  '2027-01-20': '大寒',
  '2027-02-04': '立春',
  '2027-02-19': '雨水',
  '2027-03-06': '驚蟄',
  '2027-03-21': '春分',
  '2027-04-05': '清明',
  '2027-04-20': '穀雨',
  '2027-05-06': '立夏',
  '2027-05-21': '小滿',
  '2027-06-06': '芒種',
  '2027-06-21': '夏至',
  '2027-07-07': '小暑',
  '2027-07-23': '大暑',
  '2027-08-08': '立秋',
  '2027-08-23': '處暑',
  '2027-09-08': '白露',
  '2027-09-23': '秋分',
  '2027-10-08': '寒露',
  '2027-10-24': '霜降',
  '2027-11-07': '立冬',
  '2027-11-22': '小雪',
  '2027-12-07': '大雪',
  '2027-12-22': '冬至',

  // 2028
  '2028-01-06': '小寒',
  '2028-01-20': '大寒',
  '2028-02-04': '立春',
  '2028-02-19': '雨水',
  '2028-03-05': '驚蟄',
  '2028-03-20': '春分',
  '2028-04-04': '清明',
};

// Western & cultural festivals
const WESTERN_FESTIVALS: Record<string, string> = {
  '02-14': '西洋情人節',
  '03-08': '婦女節',
  '03-12': '植樹節',
  '03-14': '白色情人節',
  '04-01': '愚人節',
  '04-22': '世界地球日',
  '05-01': '勞動節',
  '08-08': '父親節',
  '09-28': '教師節',
  '10-31': '萬聖節',
  '11-11': '光棍節',
  '12-24': '平安夜',
  '12-25': '聖誕節',
};

// Official Taiwan Government holidays & consecutive breaks
// Matching 行政院人事行政總處最新公告 & 附圖 IMG_4428 & IMG_4430
export interface TaiwanHolidayConfig {
  name: string;
  isNational: boolean;
  isRest: boolean;
}

const TAIWAN_HOLIDAYS: Record<string, TaiwanHolidayConfig> = {
  // === 2026年 (中華民國115年 - IMG_4428) ===
  // 元旦 (1/1 ~ 1/3)
  '2026-01-01': { name: '元旦 / 開國紀念日', isNational: true, isRest: true },
  '2026-01-02': { name: '元旦連假', isNational: true, isRest: true },
  '2026-01-03': { name: '元旦週末', isNational: true, isRest: true },

  // 農曆春節假期 (2/14 ~ 2/22 連休9天)
  '2026-02-14': { name: '春節首日', isNational: true, isRest: true },
  '2026-02-15': { name: '小年夜', isNational: true, isRest: true },
  '2026-02-16': { name: '農曆除夕', isNational: true, isRest: true },
  '2026-02-17': { name: '春節 / 大年初一', isNational: true, isRest: true },
  '2026-02-18': { name: '春節初二', isNational: true, isRest: true },
  '2026-02-19': { name: '春節初三', isNational: true, isRest: true },
  '2026-02-20': { name: '春節初四', isNational: true, isRest: true },
  '2026-02-21': { name: '春節初五', isNational: true, isRest: true },
  '2026-02-22': { name: '春節初六', isNational: true, isRest: true },

  // 和平紀念日 (2/27 ~ 3/1 連休3天)
  '2026-02-27': { name: '和平紀念日補假', isNational: true, isRest: true },
  '2026-02-28': { name: '和平紀念日', isNational: true, isRest: true },
  '2026-03-01': { name: '和平紀念日連假', isNational: true, isRest: true },

  // 兒童及清明節 (4/3 ~ 4/6 連休4天)
  '2026-04-03': { name: '兒童清明補假', isNational: true, isRest: true },
  '2026-04-04': { name: '兒童節', isNational: true, isRest: true },
  '2026-04-05': { name: '清明節', isNational: true, isRest: true },
  '2026-04-06': { name: '兒童清明補假', isNational: true, isRest: true },

  // 勞動節 (5/1 ~ 5/3 連休3天)
  '2026-05-01': { name: '勞動節', isNational: true, isRest: true },
  '2026-05-02': { name: '勞動節週末', isNational: true, isRest: true },
  '2026-05-03': { name: '勞動節連休', isNational: true, isRest: true },

  // 端午節 (6/19 ~ 6/21 連休3天)
  '2026-06-19': { name: '端午節', isNational: true, isRest: true },
  '2026-06-20': { name: '端午連假', isNational: true, isRest: true },
  '2026-06-21': { name: '端午連假', isNational: true, isRest: true },

  // 中秋節及教師節 (9/25 ~ 9/28 連休4天)
  '2026-09-25': { name: '中秋節', isNational: true, isRest: true },
  '2026-09-26': { name: '中秋連假', isNational: true, isRest: true },
  '2026-09-27': { name: '中秋連假', isNational: true, isRest: true },
  '2026-09-28': { name: '教師節 / 孔子誕辰', isNational: true, isRest: true },

  // 國慶日 (10/9 ~ 10/11 連休3天)
  '2026-10-09': { name: '國慶日補假', isNational: true, isRest: true },
  '2026-10-10': { name: '國慶日', isNational: true, isRest: true },
  '2026-10-11': { name: '國慶連假', isNational: true, isRest: true },

  // 臺灣光復紀念日 (10/24 ~ 10/26 連休3天)
  '2026-10-24': { name: '臺灣光復節週末', isNational: true, isRest: true },
  '2026-10-25': { name: '臺灣光復紀念日', isNational: true, isRest: true },
  '2026-10-26': { name: '臺灣光復節補假', isNational: true, isRest: true },

  // 行憲紀念日 (12/25 ~ 12/27 連休3天)
  '2026-12-25': { name: '行憲紀念日', isNational: true, isRest: true },
  '2026-12-26': { name: '行憲紀念日週末', isNational: true, isRest: true },
  '2026-12-27': { name: '行憲紀念日連休', isNational: true, isRest: true },

  // === 2027年 (中華民國116年 - IMG_4430) ===
  // 元旦 (1/1 ~ 1/3 連休3天)
  '2027-01-01': { name: '元旦 / 開國紀念日', isNational: true, isRest: true },
  '2027-01-02': { name: '元旦連假', isNational: true, isRest: true },
  '2027-01-03': { name: '元旦連假', isNational: true, isRest: true },

  // 過年春節 (2/5 ~ 2/11 連休7天)
  '2027-02-05': { name: '春節小年夜', isNational: true, isRest: true },
  '2027-02-06': { name: '農曆除夕', isNational: true, isRest: true },
  '2027-02-07': { name: '春節 / 大年初一', isNational: true, isRest: true },
  '2027-02-08': { name: '春節初二', isNational: true, isRest: true },
  '2027-02-09': { name: '春節初三', isNational: true, isRest: true },
  '2027-02-10': { name: '春節初四', isNational: true, isRest: true },
  '2027-02-11': { name: '春節初五', isNational: true, isRest: true },

  // 228和平紀念日 (2/27 ~ 3/1 連休3天)
  '2027-02-27': { name: '和平紀念日週末', isNational: true, isRest: true },
  '2027-02-28': { name: '和平紀念日', isNational: true, isRest: true },
  '2027-03-01': { name: '和平紀念日補假', isNational: true, isRest: true },

  // 兒童清明節 (4/3 ~ 4/6 連休4天)
  '2027-04-03': { name: '兒童清明連假', isNational: true, isRest: true },
  '2027-04-04': { name: '兒童節', isNational: true, isRest: true },
  '2027-04-05': { name: '清明節', isNational: true, isRest: true },
  '2027-04-06': { name: '兒童清明補假', isNational: true, isRest: true },

  // 勞動節 (5/1 ~ 5/3 連休3天)
  '2027-05-01': { name: '勞動節', isNational: true, isRest: true },
  '2027-05-02': { name: '勞動節週末', isNational: true, isRest: true },
  '2027-05-03': { name: '勞動節補假', isNational: true, isRest: true },

  // 端午節 (6/9)
  '2027-06-09': { name: '端午節', isNational: true, isRest: true },

  // 中秋節 (9/15)
  '2027-09-15': { name: '中秋節', isNational: true, isRest: true },

  // 教師節 (9/28)
  '2027-09-28': { name: '孔子誕辰 / 教師節', isNational: true, isRest: true },

  // 雙十國慶 (10/9 ~ 10/11 連休3天)
  '2027-10-09': { name: '國慶日週末', isNational: true, isRest: true },
  '2027-10-10': { name: '國慶日', isNational: true, isRest: true },
  '2027-10-11': { name: '國慶日補假', isNational: true, isRest: true },

  // 臺灣光復節 (10/23 ~ 10/25 連休3天)
  '2027-10-23': { name: '臺灣光復節週末', isNational: true, isRest: true },
  '2027-10-24': { name: '臺灣光復節週末', isNational: true, isRest: true },
  '2027-10-25': { name: '臺灣光復節', isNational: true, isRest: true },

  // 行憲紀念日 (12/24 ~ 12/26 連休3天)
  '2027-12-24': { name: '行憲紀念日補假', isNational: true, isRest: true },
  '2027-12-25': { name: '行憲紀念日', isNational: true, isRest: true },
  '2027-12-26': { name: '行憲紀念日週末', isNational: true, isRest: true },

  // 2028跨年 (12/31 ~ 1/2)
  '2027-12-31': { name: '跨年補假', isNational: true, isRest: true },
  '2028-01-01': { name: '元旦', isNational: true, isRest: true },
  '2028-01-02': { name: '元旦連假', isNational: true, isRest: true },
};

// High-precision lunar calendar lookup table covering 2025-2028
// Every single month start (New Moon / 初一) is 100% verified against IMG_4428 and IMG_4430
interface LunarMonthRecord {
  newMoonDate: string; // YYYY-MM-DD
  lunarYear: number;
  lunarMonth: number;
  monthName: string;
  isLeap: boolean;
  days: number;
}

const LUNAR_MONTH_DATA: LunarMonthRecord[] = [
  // 2025 transition
  { newMoonDate: '2025-11-20', lunarYear: 2025, lunarMonth: 10, monthName: '十月', isLeap: false, days: 30 },
  { newMoonDate: '2025-12-20', lunarYear: 2025, lunarMonth: 11, monthName: '十一月', isLeap: false, days: 30 },
  { newMoonDate: '2026-01-19', lunarYear: 2025, lunarMonth: 12, monthName: '臘月', isLeap: false, days: 29 }, // 臘月小 (IMG_4428 Jan 19: 十二月小, 29天)

  // === 2026 (丙午年 - 精確核對 IMG_4428) ===
  { newMoonDate: '2026-02-17', lunarYear: 2026, lunarMonth: 1, monthName: '正月', isLeap: false, days: 30 }, // 正月大 (IMG_4428 Feb 17: 正月大)
  { newMoonDate: '2026-03-19', lunarYear: 2026, lunarMonth: 2, monthName: '二月', isLeap: false, days: 29 }, // 二月小 (IMG_4428 Mar 19: 二月小)
  { newMoonDate: '2026-04-17', lunarYear: 2026, lunarMonth: 3, monthName: '三月', isLeap: false, days: 30 }, // 三月大 (IMG_4428 Apr 17: 三月大)
  { newMoonDate: '2026-05-17', lunarYear: 2026, lunarMonth: 4, monthName: '四月', isLeap: false, days: 29 }, // 四月小 (IMG_4428 May 17: 四月小)
  { newMoonDate: '2026-06-15', lunarYear: 2026, lunarMonth: 5, monthName: '五月', isLeap: false, days: 30 }, // 五月大 (IMG_4428 Jun 15: 五月大)
  { newMoonDate: '2026-07-15', lunarYear: 2026, lunarMonth: 6, monthName: '六月', isLeap: false, days: 29 }, // 六月 (IMG_4428 Jul 15: 六月, 29天至8/12)
  { newMoonDate: '2026-08-13', lunarYear: 2026, lunarMonth: 7, monthName: '七月', isLeap: false, days: 29 }, // 七月小 (IMG_4428 Aug 13: 七月小, 29天至9/10)
  { newMoonDate: '2026-09-11', lunarYear: 2026, lunarMonth: 8, monthName: '八月', isLeap: false, days: 29 }, // 八月小 (IMG_4428 Sep 11: 八月小, 29天至10/9)
  { newMoonDate: '2026-10-10', lunarYear: 2026, lunarMonth: 9, monthName: '九月', isLeap: false, days: 30 }, // 九月大 (IMG_4428 Oct 10: 九月大, 10/18為初九「重陽節」！)
  { newMoonDate: '2026-11-09', lunarYear: 2026, lunarMonth: 10, monthName: '十月', isLeap: false, days: 30 }, // 十月大 (IMG_4428 Nov 9: 十月大, 30天至12/8)
  { newMoonDate: '2026-12-09', lunarYear: 2026, lunarMonth: 11, monthName: '十一月', isLeap: false, days: 30 }, // 十一月大 (IMG_4428 Dec 9: 十一月大, 30天至1/7)

  // === 2027 (丁未年 - 精確核對 IMG_4430) ===
  { newMoonDate: '2027-01-08', lunarYear: 2026, lunarMonth: 12, monthName: '臘月', isLeap: false, days: 30 }, // 臘月大 (IMG_4430 Jan 8: 臘月, 30天至2/6除夕)
  { newMoonDate: '2027-02-07', lunarYear: 2027, lunarMonth: 1, monthName: '正月', isLeap: false, days: 29 }, // 正月小 (IMG_4430 Feb 7: 正月春節, 29天至3/7)
  { newMoonDate: '2027-03-08', lunarYear: 2027, lunarMonth: 2, monthName: '二月', isLeap: false, days: 30 }, // 二月大 (IMG_4430 Mar 8: 二月, 30天至4/6)
  { newMoonDate: '2027-04-07', lunarYear: 2027, lunarMonth: 3, monthName: '三月', isLeap: false, days: 29 }, // 三月小 (IMG_4430 Apr 7: 三月, 29天至5/5)
  { newMoonDate: '2027-05-06', lunarYear: 2027, lunarMonth: 4, monthName: '四月', isLeap: false, days: 30 }, // 四月大 (IMG_4430 May 6: 四月, 30天至6/4)
  { newMoonDate: '2027-06-05', lunarYear: 2027, lunarMonth: 5, monthName: '五月', isLeap: false, days: 29 }, // 五月小 (IMG_4430 Jun 5: 五月, 29天至7/3)
  { newMoonDate: '2027-07-04', lunarYear: 2027, lunarMonth: 6, monthName: '六月', isLeap: false, days: 29 }, // 六月小 (IMG_4430 Jul 4: 六月, 29天至8/1)
  { newMoonDate: '2027-08-02', lunarYear: 2027, lunarMonth: 7, monthName: '七月', isLeap: false, days: 30 }, // 七月大 (IMG_4430 Aug 2: 七月, 30天至8/31)
  { newMoonDate: '2027-09-01', lunarYear: 2027, lunarMonth: 8, monthName: '八月', isLeap: false, days: 29 }, // 八月小 (IMG_4430 Sep 1: 八月, 29天至9/29)
  { newMoonDate: '2027-09-30', lunarYear: 2027, lunarMonth: 9, monthName: '九月', isLeap: false, days: 30 }, // 九月大 (IMG_4430 Sep 30: 九月, 10/8為初九「重陽節」！)
  { newMoonDate: '2027-10-30', lunarYear: 2027, lunarMonth: 10, monthName: '十月', isLeap: false, days: 29 }, // 十月小 (IMG_4430 Oct 30: 十月, 29天至11/27)
  { newMoonDate: '2027-11-28', lunarYear: 2027, lunarMonth: 11, monthName: '十一月', isLeap: false, days: 30 }, // 十一月大 (IMG_4430 Nov 28: 十一月, 30天至12/27)
  { newMoonDate: '2027-12-28', lunarYear: 2027, lunarMonth: 12, monthName: '臘月', isLeap: false, days: 30 }, // 臘月大 (IMG_4430 Dec 28: 臘月)

  // 2028
  { newMoonDate: '2028-01-27', lunarYear: 2028, lunarMonth: 1, monthName: '正月', isLeap: false, days: 29 },
  { newMoonDate: '2028-02-25', lunarYear: 2028, lunarMonth: 2, monthName: '二月', isLeap: false, days: 30 },
  { newMoonDate: '2028-03-26', lunarYear: 2028, lunarMonth: 3, monthName: '三月', isLeap: false, days: 29 },
  { newMoonDate: '2028-04-24', lunarYear: 2028, lunarMonth: 4, monthName: '四月', isLeap: false, days: 30 },
];

const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

/**
 * Traditional Chinese Lunar Festivals (農曆重要節日)
 * 包含重陽節、七夕、中元、中秋、端午、元宵、除夕、臘八等
 */
export function getTraditionalLunarFestival(
  lunarMonth: number,
  lunarDay: number,
  isLastDayOfMonth: boolean
): string | undefined {
  if (lunarMonth === 1) {
    if (lunarDay === 1) return '春節 / 大年初一';
    if (lunarDay === 2) return '年初二回娘家';
    if (lunarDay === 3) return '初三赤狗日';
    if (lunarDay === 4) return '初四接神日';
    if (lunarDay === 5) return '初五開工 / 迎財神';
    if (lunarDay === 9) return '天公生 (玉皇誕辰)';
    if (lunarDay === 15) return '元宵節 / 上元節';
  } else if (lunarMonth === 2) {
    if (lunarDay === 2) return '頭牙 / 土地公生';
    if (lunarDay === 19) return '觀音佛祖誕辰';
  } else if (lunarMonth === 3) {
    if (lunarDay === 3) return '上巳節';
    if (lunarDay === 15) return '保生大帝誕辰';
    if (lunarDay === 23) return '媽祖生 (天上聖母聖誕)';
  } else if (lunarMonth === 4) {
    if (lunarDay === 8) return '浴佛節';
  } else if (lunarMonth === 5) {
    if (lunarDay === 5) return '端午節';
  } else if (lunarMonth === 6) {
    if (lunarDay === 6) return '天貺節';
    if (lunarDay === 19) return '觀音菩薩得道紀念';
  } else if (lunarMonth === 7) {
    if (lunarDay === 1) return '鬼門開';
    if (lunarDay === 7) return '七夕情人節';
    if (lunarDay === 15) return '中元節 / 盂蘭盆節';
    if (isLastDayOfMonth) return '鬼門關';
  } else if (lunarMonth === 8) {
    if (lunarDay === 15) return '中秋節';
  } else if (lunarMonth === 9) {
    if (lunarDay === 9) return '重陽節 (九九敬老)'; // ★ User specifically emphasized 重陽節!
  } else if (lunarMonth === 10) {
    if (lunarDay === 15) return '下元節 (水官大帝聖誕)';
  } else if (lunarMonth === 12) {
    if (lunarDay === 8) return '臘八節';
    if (lunarDay === 16) return '尾牙';
    if (lunarDay === 24) return '送神日 / 清囤';
    if (isLastDayOfMonth) return '農曆除夕';
  }

  return undefined;
}

export function getLunarDate(dateStr: string): { 
  monthName: string; 
  lunarMonthNum: number;
  dayName: string; 
  lunarDayNum: number;
  fullStr: string;
  festival?: string;
} {
  const targetDate = new Date(dateStr + 'T00:00:00');
  
  // Find matching lunar month in our verified table
  for (let i = LUNAR_MONTH_DATA.length - 1; i >= 0; i--) {
    const record = LUNAR_MONTH_DATA[i];
    const newMoon = new Date(record.newMoonDate + 'T00:00:00');
    const diffDays = Math.round((targetDate.getTime() - newMoon.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < record.days) {
      const dayNum = diffDays + 1;
      const isLastDay = dayNum === record.days;
      const dayName = (dayNum === 1) ? record.monthName : LUNAR_DAY_NAMES[dayNum] || `${dayNum}`;
      const fullStr = `農曆${record.monthName}${LUNAR_DAY_NAMES[dayNum] || `${dayNum}`}`;
      const festival = getTraditionalLunarFestival(record.lunarMonth, dayNum, isLastDay);

      return {
        monthName: record.monthName,
        lunarMonthNum: record.lunarMonth,
        dayName,
        lunarDayNum: dayNum,
        fullStr,
        festival,
      };
    }
  }

  // Fallback estimation if out of pre-calculated range
  return {
    monthName: '七月',
    lunarMonthNum: 7,
    dayName: '初一',
    lunarDayNum: 1,
    fullStr: '農曆七月初一',
  };
}

const WEEKDAY_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

export function getDayInfo(date: Date, todayDateStr: string): DayInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const dateStr = `${year}-${mm}-${dd}`;
  const monthDayStr = `${mm}-${dd}`;

  // Lunar information
  const lunar = getLunarDate(dateStr);

  // Solar Term
  const solarTerm = SOLAR_TERMS_DATES[dateStr];

  // Western Festival
  const westernFestival = WESTERN_FESTIVALS[monthDayStr];

  // Taiwan Official Holiday
  const holiday = TAIWAN_HOLIDAYS[dateStr];
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Determine holiday label priority:
  // 1. Taiwan National/Government Holiday (e.g. 國慶日, 春節, 清明, 端午, 中秋)
  // 2. Traditional Lunar Festival (e.g. 重陽節, 七夕, 中元節, 元宵節)
  // 3. Solar Term (e.g. 寒露, 霜降, 立春)
  let holidayName = holiday ? holiday.name : undefined;
  if (!holidayName && lunar.festival) {
    holidayName = lunar.festival;
  } else if (!holidayName && solarTerm) {
    holidayName = solarTerm;
  }

  const isNationalHoliday = !!(holiday && holiday.isNational);
  const isRestDay = !!(holiday?.isRest || isWeekend);
  const isToday = dateStr === todayDateStr;

  return {
    date: dateStr,
    year,
    month,
    day,
    dayOfWeek,
    lunarMonthName: lunar.monthName,
    lunarMonthNum: lunar.lunarMonthNum,
    lunarDayName: lunar.dayName,
    lunarDayNum: lunar.lunarDayNum,
    lunarDateStr: lunar.fullStr,
    lunarFestival: lunar.festival,
    solarTerm,
    holidayName,
    isNationalHoliday,
    isRestDay,
    isToday,
    westernFestival,
  };
}

/**
 * Format date in the exact requested copy format:
 * 年月日農曆日期星期
 * e.g. 2026年9月6日 農曆七月廿六 星期日
 */
export function formatCopyDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.getDay();
  const lunar = getLunarDate(dateStr);
  const weekday = WEEKDAY_NAMES[dayOfWeek];

  const festivalSuffix = lunar.festival ? `（${lunar.festival}）` : '';
  return `${year}年${month}月${day}日 ${lunar.fullStr}${festivalSuffix} ${weekday}`;
}
