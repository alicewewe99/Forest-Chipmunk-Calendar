import React, { useState, useRef } from 'react';
import { 
  Download, Upload, Check, AlertCircle, FileText, 
  Smartphone, Apple, X, Scale
} from 'lucide-react';
import { DayStamp } from '../types';
import { generateICS, downloadFile, parseImportFile, ParsedImportData } from '../utils/icalExport';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stamps: Record<string, DayStamp[]>;
  weights?: Record<string, number>;
  memos?: Record<string, string>;
  onImportSuccess: (imported: ParsedImportData) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  stamps,
  weights = {},
  memos = {},
  onImportSuccess,
}) => {
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const totalEventsCount = Object.values(stamps).reduce((acc: number, curr: DayStamp[]) => acc + (curr?.length || 0), 0);
  const totalWeightCount = Object.keys(weights).length;
  const totalMemoCount = Object.keys(memos).length;

  const handleExportICS = () => {
    const icsContent = generateICS(stamps, weights, memos);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadFile(icsContent, `童話日曆行程_${dateStr}.ics`, 'text/calendar');
    setCopiedStatus('已成功匯出 .ics 行事曆檔案（含行程標記、體重與備忘錄）！');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleExportJSON = () => {
    const fullBackup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      stamps,
      weights,
      memos,
    };
    const jsonContent = JSON.stringify(fullBackup, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadFile(jsonContent, `童話日曆完整備份_${dateStr}.json`, 'application/json');
    setCopiedStatus('已成功備份完整 JSON 檔案！');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseImportFile(file);
      const stampCount = Object.values(parsed.stamps).reduce((acc, curr) => acc + curr.length, 0);
      const weightCount = Object.keys(parsed.weights).length;
      const memoCount = Object.keys(parsed.memos).length;

      if (stampCount === 0 && weightCount === 0 && memoCount === 0) {
        setImportStatus({
          type: 'error',
          msg: '未能在檔案中找到可匯入的行程、體重或備忘資料。',
        });
      } else {
        onImportSuccess(parsed);
        setImportStatus({
          type: 'success',
          msg: `成功匯入！包含 ${stampCount} 個標記、${weightCount} 筆體重、${memoCount} 則備忘錄。`,
        });
        setTimeout(() => setImportStatus(null), 4000);
      }
    } catch (err: any) {
      setImportStatus({
        type: 'error',
        msg: `匯入失敗：${err?.message || '檔案格式不符'}`,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#fcf8f2] rounded-3xl shadow-2xl border-2 border-[#e8ded2] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-100/90 to-orange-100/90 border-b border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl border border-amber-200">
              📲
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950">匯入 / 匯出手機行事曆與資料</h3>
              <p className="text-xs text-amber-800/80">
                支援 iPhone、Android、Google 日曆與提醒事項同步
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-amber-900 flex items-center justify-center transition-colors border border-amber-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status feedback */}
          {copiedStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{copiedStatus}</span>
            </div>
          )}

          {importStatus && (
            <div className={`p-3 text-xs rounded-xl flex items-center gap-2 border ${
              importStatus.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {importStatus.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{importStatus.msg}</span>
            </div>
          )}

          {/* Section 1: Export */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-700" />
                匯出我的童話行程與資料
              </h4>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {totalEventsCount} 個標記
                </span>
                {totalWeightCount > 0 && (
                  <span className="text-[11px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full font-bold">
                    ⚖️ {totalWeightCount} 筆體重
                  </span>
                )}
                {totalMemoCount > 0 && (
                  <span className="text-[11px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                    📝 {totalMemoCount} 則備忘
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-amber-800/80 leading-relaxed">
              匯出標準 <code className="text-amber-900 bg-amber-50 px-1 py-0.5 rounded font-mono">.ics</code> 行事曆格式，在 iPhone 點擊即可直接加入「行事曆」或「提醒事項」；在 Android 手機可直接匯入 Google 日曆。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleExportICS}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition transform active:scale-95"
              >
                <Apple className="w-4 h-4" />
                匯出 iPhone / Google 日曆 (.ics)
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition transform active:scale-95"
              >
                <FileText className="w-4 h-4 text-amber-700" />
                備份全部資料 (.json)
              </button>
            </div>
          </div>

          {/* Section 2: Import */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-700" />
              匯入手機或外部檔案
            </h4>
            <p className="text-xs text-amber-800/80 leading-relaxed">
              選取任何標準的 <code className="text-amber-900 bg-amber-50 px-1 py-0.5 rounded font-mono">.ics</code> 或先前的備份 <code className="text-amber-900 bg-amber-50 px-1 py-0.5 rounded font-mono">.json</code> 檔案，即可將行程標記、體重與備忘錄直接同步到日曆中！
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".ics,.json,text/calendar,application/json"
              className="hidden"
              id="calendar-file-import"
            />
            <label
              htmlFor="calendar-file-import"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer text-xs font-bold transition"
            >
              <Smartphone className="w-4 h-4 text-emerald-700" />
              點擊選取手機檔案 (.ics 或 .json)
            </label>
          </div>

          {/* Instructions Box */}
          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              💡 如何在手機上開啟匯出的 .ics 檔案：
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-800 leading-relaxed">
              <li><strong>iPhone / iPad：</strong> 下載完成後，點擊檔案選擇「加入全部到行事曆」，即可在 iOS 內建行事曆與提醒事項中同步查看！</li>
              <li><strong>Android / Google 日曆：</strong> 打開 Google 日曆網頁版或 App 設定 &gt;「匯入與匯出」，上傳剛下載的檔案即可完整合併。</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-xl transition"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
