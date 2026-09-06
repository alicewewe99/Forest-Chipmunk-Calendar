import { DayStamp } from '../types';

/**
 * Generate standard RFC 5545 iCalendar (.ics) string
 * Fully compatible with:
 * - iPhone Apple Calendar & Reminders (雙擊即可匯入 iPhone 行事曆)
 * - Android Google Calendar / Samsung Calendar
 * - Google Calendar Web & Outlook
 */
export function generateICS(
  stamps: Record<string, DayStamp[]>,
  weights: Record<string, number> = {},
  memos: Record<string, string> = {}
): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//童話故事日曆//Fairytale Story Calendar//ZH-TW',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:童話故事日曆記事',
    'X-WR-TIMEZONE:Asia/Taipei',
  ];

  // Helper for next day
  const getNextDate = (dateStr: string) => {
    const nextDateObj = new Date(dateStr + 'T00:00:00');
    nextDateObj.setDate(nextDateObj.getDate() + 1);
    return nextDateObj.toISOString().slice(0, 10).replace(/-/g, '');
  };

  // 1. Export stamps
  Object.entries(stamps).forEach(([dateStr, dayStamps]) => {
    const cleanDate = dateStr.replace(/-/g, '');
    const nextCleanDate = getNextDate(dateStr);

    dayStamps.forEach((stamp, index) => {
      const uid = `fairy-cal-${dateStr}-${index}-${stamp.createdAt || Date.now()}@fairytalecalendar.app`;
      const summary = `${stamp.emoji} ${stamp.note || '生活標記'}`;
      const description = `來自【童話故事日曆】的生活紀錄\\n標記: ${stamp.emoji}\\n備註: ${stamp.note || '無'}`;

      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`UID:${uid}`);
      icsLines.push(`DTSTAMP:${timestamp}`);
      icsLines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      icsLines.push(`DTEND;VALUE=DATE:${nextCleanDate}`);
      icsLines.push(`SUMMARY:${summary}`);
      icsLines.push(`DESCRIPTION:${description}`);
      icsLines.push('STATUS:CONFIRMED');
      icsLines.push('TRANSP:TRANSPARENT');
      icsLines.push('END:VEVENT');
    });
  });

  // 2. Export weights
  Object.entries(weights).forEach(([dateStr, weightKg]) => {
    if (weightKg === undefined || weightKg === null) return;
    const cleanDate = dateStr.replace(/-/g, '');
    const nextCleanDate = getNextDate(dateStr);
    const uid = `fairy-weight-${dateStr}@fairytalecalendar.app`;
    const summary = `⚖️ 體重: ${weightKg} kg`;
    const description = `今日體重記錄: ${weightKg} kg`;

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${uid}`);
    icsLines.push(`DTSTAMP:${timestamp}`);
    icsLines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
    icsLines.push(`DTEND;VALUE=DATE:${nextCleanDate}`);
    icsLines.push(`SUMMARY:${summary}`);
    icsLines.push(`DESCRIPTION:${description}`);
    icsLines.push('STATUS:CONFIRMED');
    icsLines.push('TRANSP:TRANSPARENT');
    icsLines.push('END:VEVENT');
  });

  // 3. Export memos
  Object.entries(memos).forEach(([dateStr, memoText]) => {
    if (!memoText || !memoText.trim()) return;
    const cleanDate = dateStr.replace(/-/g, '');
    const nextCleanDate = getNextDate(dateStr);
    const uid = `fairy-memo-${dateStr}@fairytalecalendar.app`;
    const firstLine = memoText.split('\n')[0].slice(0, 30);
    const summary = `📝 備忘錄: ${firstLine}`;
    const description = memoText.replace(/\n/g, '\\n');

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${uid}`);
    icsLines.push(`DTSTAMP:${timestamp}`);
    icsLines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
    icsLines.push(`DTEND;VALUE=DATE:${nextCleanDate}`);
    icsLines.push(`SUMMARY:${summary}`);
    icsLines.push(`DESCRIPTION:${description}`);
    icsLines.push('STATUS:CONFIRMED');
    icsLines.push('TRANSP:TRANSPARENT');
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

/**
 * Trigger file download on mobile or desktop
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ParsedImportData {
  stamps: Record<string, DayStamp[]>;
  weights: Record<string, number>;
  memos: Record<string, string>;
}

/**
 * Parse an imported .ics or .json file
 */
export async function parseImportFile(file: File): Promise<ParsedImportData> {
  const text = await file.text();

  // If JSON format
  if (file.name.endsWith('.json') || text.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'object' && parsed !== null) {
        // Check if it's the new container format { stamps, weights, memos }
        if (parsed.stamps || parsed.weights || parsed.memos) {
          return {
            stamps: parsed.stamps || {},
            weights: parsed.weights || {},
            memos: parsed.memos || {},
          };
        }
        // Legacy stamps-only format
        return {
          stamps: parsed as Record<string, DayStamp[]>,
          weights: {},
          memos: {},
        };
      }
    } catch {
      // Fall through to ics parser
    }
  }

  // Parse ICS format
  const importedStamps: Record<string, DayStamp[]> = {};
  const importedWeights: Record<string, number> = {};
  const importedMemos: Record<string, string> = {};

  const lines = text.split(/\r\n|\n|\r/);
  let inEvent = false;
  let dtStart = '';
  let summary = '';
  let description = '';

  for (let line of lines) {
    line = line.trim();
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      dtStart = '';
      summary = '';
      description = '';
    } else if (line === 'END:VEVENT') {
      if (dtStart && inEvent) {
        // Parse date YYYYMMDD
        let dateStr = '';
        if (dtStart.length >= 8) {
          const y = dtStart.slice(0, 4);
          const m = dtStart.slice(4, 6);
          const d = dtStart.slice(6, 8);
          dateStr = `${y}-${m}-${d}`;
        }
        if (dateStr) {
          if (summary.startsWith('⚖️ 體重:')) {
            const weightVal = parseFloat(summary.replace('⚖️ 體重:', '').replace('kg', '').trim());
            if (!isNaN(weightVal)) {
              importedWeights[dateStr] = weightVal;
            }
          } else if (summary.startsWith('📝 備忘錄:')) {
            const cleanMemo = description ? description.replace(/\\n/g, '\n') : summary.replace('📝 備忘錄:', '').trim();
            importedMemos[dateStr] = cleanMemo;
          } else {
            // Extract emoji if present, else default to ⭐
            const emojiMatch = summary.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
            const emoji = emojiMatch ? emojiMatch[0] : '⭐';
            const cleanNote = summary.replace(emoji, '').trim();

            if (!importedStamps[dateStr]) {
              importedStamps[dateStr] = [];
            }
            importedStamps[dateStr].push({
              id: 'imp_' + Math.random().toString(36).substring(2, 9),
              emoji,
              note: cleanNote || (description ? description.replace(/\\n/g, '\n') : undefined),
              createdAt: Date.now(),
            });
          }
        }
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const val = line.split(':')[1] || '';
        dtStart = val.replace(/[^0-9]/g, '');
      } else if (line.startsWith('SUMMARY:')) {
        summary = line.substring(8).replace(/\\n/g, ' ');
      } else if (line.startsWith('DESCRIPTION:')) {
        description = line.substring(12).replace(/\\n/g, '\n');
      }
    }
  }

  return {
    stamps: importedStamps,
    weights: importedWeights,
    memos: importedMemos,
  };
}
