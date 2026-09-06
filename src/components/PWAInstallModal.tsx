import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Download, Copy, Check, Smartphone, Monitor, Apple, 
  ExternalLink, Sparkles, X, Share2, Info
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallDesktop: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallDesktop,
}) => {
  const [appUrl, setAppUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activePlatformTab, setActivePlatformTab] = useState<'iphone' | 'android' | 'desktop'>('iphone');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Determine best URL: strip trailing hashes or iframe query params if needed
      const cleanUrl = window.location.href.split('#')[0];
      setAppUrl(cleanUrl);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!appUrl) return;
    
    // Generate high-resolution QR code
    QRCode.toDataURL(appUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#5a3825', // Forest animal theme warm dark brown
        light: '#fdfbf7', // Warm off-white
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
      });
  }, [appUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = '童話故事日曆-PWA下載QR碼.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#fcf8f2] rounded-3xl shadow-2xl border-2 border-[#e8ded2] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-100/90 to-orange-100/90 border-b border-amber-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl border border-amber-200">
              🐿️
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                安裝童話故事日曆 App
                <span className="text-xs bg-amber-700 text-white px-2 py-0.5 rounded-full font-medium">PWA</span>
              </h3>
              <p className="text-xs text-amber-800/80">掃描 QR Code 或一鍵安裝至手機桌面</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-amber-900 flex items-center justify-center transition-colors border border-amber-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* QR Code Section */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-sm flex flex-col items-center text-center">
            <div className="relative p-3 bg-gradient-to-b from-[#fbf8f3] to-amber-50 rounded-2xl border-2 border-dashed border-amber-300/80 shadow-inner">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="PWA QR Code" 
                  className="w-48 h-48 rounded-xl object-contain shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-amber-700 text-sm">
                  正在生成 QR Code...
                </div>
              )}
              {/* Cute chipmunk badge in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center text-lg shadow">
                🐿️
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleDownloadQr}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition shadow-sm border border-amber-300"
              >
                <Download className="w-3.5 h-3.5" />
                下載 QR Code 圖片
              </button>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition shadow-sm border border-emerald-300"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '已複製網址' : '複製安裝網址'}
              </button>
            </div>

            {/* URL Fix & Verification Box */}
            <div className="w-full mt-4 text-left">
              <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  QR Code 連結網址（確保手機掃碼能精準開啟）：
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="請輸入或確認您的分享網址"
                  className="flex-1 text-xs px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-300 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-amber-800/70 mt-1">
                💡 提示：若您在分享網址或自訂網域開啟，此處會自動同步成手機可直接連線的專屬網址。
              </p>
            </div>
          </div>

          {/* Platform Tabs & Guide */}
          <div className="space-y-3">
            <div className="flex rounded-xl bg-amber-100/80 p-1 border border-amber-200">
              <button
                onClick={() => setActivePlatformTab('iphone')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePlatformTab === 'iphone'
                    ? 'bg-white text-amber-950 shadow-sm'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                iPhone / iPad
              </button>
              <button
                onClick={() => setActivePlatformTab('android')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePlatformTab === 'android'
                    ? 'bg-white text-amber-950 shadow-sm'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Android 手機
              </button>
              <button
                onClick={() => setActivePlatformTab('desktop')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePlatformTab === 'desktop'
                    ? 'bg-white text-amber-950 shadow-sm'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                電腦 / 桌面
              </button>
            </div>

            {/* Platform Guides */}
            {activePlatformTab === 'iphone' && (
              <div className="bg-white rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Apple className="w-4 h-4 text-rose-500" />
                  iPhone (iOS Safari) 安裝步驟：
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-amber-800 leading-relaxed">
                  <li>使用 iPhone 相機掃描上方 QR Code，並在 <strong>Safari 瀏覽器</strong>中開啟。</li>
                  <li>點擊底部中央的 <strong>「分享」按鈕</strong>（帶有向上箭頭的正方形圖示）。</li>
                  <li>向下滾動，點選 <strong>「加入主畫面」</strong>（Add to Home Screen）。</li>
                  <li>點擊右上角「新增」，桌面上即會出現抱著月曆的小花栗鼠 App 圖示！</li>
                </ol>
              </div>
            )}

            {activePlatformTab === 'android' && (
              <div className="bg-white rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  Android 手機 (Google Chrome) 安裝步驟：
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-amber-800 leading-relaxed">
                  <li>使用手機相機掃描 QR Code，在 <strong>Chrome 瀏覽器</strong>開啟。</li>
                  <li>點擊右上角的 <strong>三個點點選單（⋮）</strong>。</li>
                  <li>點選 <strong>「安裝應用程式」</strong> 或 <strong>「新增至主畫面」</strong>。</li>
                  <li>確認安裝，即可像原生 App 一樣離線秒開，享受全螢幕童話日曆！</li>
                </ol>
              </div>
            )}

            {activePlatformTab === 'desktop' && (
              <div className="bg-white rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-3">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  電腦桌面版 PWA 安裝：
                </p>
                <p className="text-amber-800">
                  支援 Chrome、Edge、Brave 等瀏覽器，可直接將本網站安裝為獨立視窗運行的桌面應用程式。
                </p>
                {deferredPrompt ? (
                  <button
                    onClick={onInstallDesktop}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    立即一鍵安裝到桌面
                  </button>
                ) : (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                    💡 您可以直接點擊瀏覽器網址列右側的「安裝」圖示（帶有電腦螢幕與箭頭的圖示），隨時安裝至桌面。
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-xl transition"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
