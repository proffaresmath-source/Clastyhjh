import { useState, useRef, MouseEvent, ChangeEvent } from 'react';
import {
  Calculator,
  Award,
  Coins,
  ArrowRight,
  Clock,
  Plus,
  ChevronLeft,
  Camera,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { ToolsSpaceConfig, User } from '../../types';
import CountdownWidget from './CountdownWidget';
import AverageCalculatorWidget from './AverageCalculatorWidget';
import ReferralEarnWidget from './ReferralEarnWidget';
import HistoryGameWidget from './HistoryGameWidget';
import { saveToolsConfig } from '../../data/toolsData';

type ServiceKey = 'calculator' | 'history' | 'referral';

interface ToolsSpaceHomeProps {
  config: ToolsSpaceConfig;
  user: User;
  onOpenManage: () => void;
}

export default function ToolsSpaceHome({ config, user, onOpenManage }: ToolsSpaceHomeProps) {
  const [selectedService, setSelectedService] = useState<ServiceKey | null>(null);

  // Custom Card Covers state
  const [covers, setCovers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('bac_custom_card_covers_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return config.customCovers || {};
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetCoverKey, setTargetCoverKey] = useState<ServiceKey | null>(null);

  const handleOpenCoverUpload = (serviceKey: ServiceKey, e: MouseEvent) => {
    e.stopPropagation(); // don't trigger card click
    setTargetCoverKey(serviceKey);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetCoverKey) return;

    // Read image as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updated = { ...covers, [targetCoverKey]: dataUrl };
      setCovers(updated);
      try {
        localStorage.setItem('bac_custom_card_covers_v2', JSON.stringify(updated));
        // also sync with config
        saveToolsConfig({
          ...config,
          customCovers: updated,
        });
      } catch (err) {
        console.error('Error saving cover image:', err);
      }
      setTargetCoverKey(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = (serviceKey: ServiceKey, e: MouseEvent) => {
    e.stopPropagation();
    const updated = { ...covers, [serviceKey]: '' };
    setCovers(updated);
    try {
      localStorage.setItem('bac_custom_card_covers_v2', JSON.stringify(updated));
      saveToolsConfig({
        ...config,
        customCovers: updated,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCountdownModeChange = (mode: 'bac' | 'bem' | 'both') => {
    saveToolsConfig({
      ...config,
      activeCountdownMode: mode,
    });
  };

  const hasAnyActiveTool =
    config.countdown.enabled ||
    (config.countdownBem?.enabled ?? true) ||
    config.averageCalc.enabled ||
    config.referral.enabled ||
    config.historyGame.enabled;

  if (!hasAnyActiveTool) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in select-none"
        id="empty-tools-space"
        dir="rtl"
      >
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-300 text-neutral-800 flex items-center justify-center mb-4">
          <Clock size={28} />
        </div>

        <h2 className="text-base font-bold text-neutral-900 mb-1.5">
          الواجهة فارغة
        </h2>
        <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mb-6">
          يمكنك تفعيل مؤقت البكالوريا أو البيام، أو خيارات الخدمات من خلال الزر أدناه.
        </p>

        <button
          type="button"
          onClick={onOpenManage}
          className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-none active:scale-95 outline-none"
        >
          <Plus size={16} />
          <span>تفعيل وتخصيص الأدوات (+)</span>
        </button>
      </div>
    );
  }

  // ================= DEDICATED SERVICE VIEW =================
  if (selectedService !== null) {
    return (
      <div className="space-y-4 pb-6 animate-in fade-in" id="dedicated-service-view" dir="rtl">
        {/* Top Service Navigation Header with Clean Back Button */}
        <div className="flex items-center justify-between bg-white px-3 sm:px-4 py-2.5 rounded-2xl border border-neutral-200 shadow-none select-none">
          <button
            type="button"
            onClick={() => setSelectedService(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 transition cursor-pointer outline-none shadow-none"
            id="btn-back-to-tools"
          >
            <ArrowRight size={16} className="text-neutral-900" />
            <span>الرجوع للمؤقت والخيارات</span>
          </button>

          <span className="text-[11px] font-bold text-neutral-500">
            {selectedService === 'calculator' && 'كشف نقاط وحاسبة المعدل'}
            {selectedService === 'history' && 'تدريب واختبار التاريخ'}
            {selectedService === 'referral' && 'مكافآت الدعوات'}
          </span>
        </div>

        {/* Selected Service Body */}
        {selectedService === 'calculator' && (
          <AverageCalculatorWidget config={config.averageCalc} onOpenManage={onOpenManage} />
        )}

        {selectedService === 'history' && (
          <HistoryGameWidget config={config.historyGame} onOpenManage={onOpenManage} />
        )}

        {selectedService === 'referral' && (
          <ReferralEarnWidget config={config.referral} user={user} onOpenManage={onOpenManage} />
        )}
      </div>
    );
  }

  // ================= MAIN VIEW: DUAL / SINGLE COUNTDOWN + 3 SIMPLE CUSTOMIZABLE CARDS =================
  return (
    <div className="space-y-5 pb-6 animate-in fade-in" id="active-tools-space" dir="rtl">
      {/* Hidden Global File Input for Cover Images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. COUNTDOWN WIDGET (Supports BAC, BEM, and Both together, Days on Left) */}
      {config.countdown.enabled && (
        <CountdownWidget
          config={config.countdown}
          configBem={config.countdownBem}
          activeMode={config.activeCountdownMode || 'both'}
          onModeChange={handleCountdownModeChange}
          onOpenManage={onOpenManage}
        />
      )}

      {/* 2. THE THREE SERVICES CARDS (Simple, Clean, with Cover Image Upload) */}
      <div className="space-y-2 select-none" id="services-launcher-section">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-bold text-neutral-800">
            خيارات وأدوات التلميذ
          </h3>
          <span className="text-[11px] text-neutral-400">
            يمكنك رفع صورة غلاف لكل خيار بالضغط على أيقونة الكاميرا
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Calculator (كشف نقاط وحاسبة المعدل) */}
          {config.averageCalc.enabled && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedService('calculator')}
              className="group relative bg-white hover:bg-neutral-50/70 rounded-2xl border border-neutral-200 overflow-hidden text-right transition cursor-pointer flex flex-col justify-between shadow-none outline-none focus:outline-none focus:ring-0 active:scale-[0.99]"
              id="service-card-calculator"
            >
              {/* Optional Custom Cover Banner */}
              {covers.calculator ? (
                <div className="relative w-full h-28 overflow-hidden bg-neutral-100 border-b border-neutral-200">
                  <img
                    src={covers.calculator}
                    alt="غلاف الحاسبة"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Remove Cover button */}
                  <button
                    type="button"
                    title="حذف صورة الغلاف"
                    onClick={(e) => handleRemoveCover('calculator', e)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition"
                  >
                    <Trash2 size={13} />
                  </button>
                  {/* Change Cover button */}
                  <button
                    type="button"
                    title="تغيير صورة الغلاف"
                    onClick={(e) => handleOpenCoverUpload('calculator', e)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition flex items-center gap-1 text-[10px] font-semibold"
                  >
                    <Camera size={13} />
                    <span>تغيير الغلاف</span>
                  </button>
                </div>
              ) : (
                <div className="px-3.5 pt-3 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200">
                    <Calculator size={18} />
                  </div>
                  {/* Upload Cover button */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenCoverUpload('calculator', e)}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition"
                  >
                    <ImageIcon size={12} />
                    <span>إضافة غلاف</span>
                  </button>
                </div>
              )}

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                    كشف نقاط وحاسبة المعدل
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    كشف نقاط رسمي للبكالوريا والبيام مع احتساب المعاملات
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 mt-3">
                  <span>فتح الكشف</span>
                  <ChevronLeft size={14} />
                </div>
              </div>
            </div>
          )}

          {/* Card 2: History Training & Dates (تدريب التاريخ والتواريخ) */}
          {config.historyGame.enabled && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedService('history')}
              className="group relative bg-white hover:bg-neutral-50/70 rounded-2xl border border-neutral-200 overflow-hidden text-right transition cursor-pointer flex flex-col justify-between shadow-none outline-none focus:outline-none focus:ring-0 active:scale-[0.99]"
              id="service-card-history"
            >
              {/* Optional Custom Cover Banner */}
              {covers.history ? (
                <div className="relative w-full h-28 overflow-hidden bg-neutral-100 border-b border-neutral-200">
                  <img
                    src={covers.history}
                    alt="غلاف التاريخ"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    title="حذف صورة الغلاف"
                    onClick={(e) => handleRemoveCover('history', e)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition"
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    type="button"
                    title="تغيير صورة الغلاف"
                    onClick={(e) => handleOpenCoverUpload('history', e)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition flex items-center gap-1 text-[10px] font-semibold"
                  >
                    <Camera size={13} />
                    <span>تغيير الغلاف</span>
                  </button>
                </div>
              ) : (
                <div className="px-3.5 pt-3 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200">
                    <Award size={18} />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleOpenCoverUpload('history', e)}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition"
                  >
                    <ImageIcon size={12} />
                    <span>إضافة غلاف</span>
                  </button>
                </div>
              )}

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                    تدريب وتحدي التاريخ
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    حفظ التواريخ، اختبارات تفاعلية، وتدريب المنصة بأسئلة مخصصة
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 mt-3">
                  <span>بدء التدريب</span>
                  <ChevronLeft size={14} />
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Referral / Earn Money (ربح المال من الدعوات) */}
          {config.referral.enabled && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedService('referral')}
              className="group relative bg-white hover:bg-neutral-50/70 rounded-2xl border border-neutral-200 overflow-hidden text-right transition cursor-pointer flex flex-col justify-between shadow-none outline-none focus:outline-none focus:ring-0 active:scale-[0.99]"
              id="service-card-referral"
            >
              {/* Optional Custom Cover Banner */}
              {covers.referral ? (
                <div className="relative w-full h-28 overflow-hidden bg-neutral-100 border-b border-neutral-200">
                  <img
                    src={covers.referral}
                    alt="غلاف ربح المال"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    title="حذف صورة الغلاف"
                    onClick={(e) => handleRemoveCover('referral', e)}
                    className="absolute top-2 left-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition"
                  >
                    <Trash2 size={13} />
                  </button>
                  <button
                    type="button"
                    title="تغيير صورة الغلاف"
                    onClick={(e) => handleOpenCoverUpload('referral', e)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition flex items-center gap-1 text-[10px] font-semibold"
                  >
                    <Camera size={13} />
                    <span>تغيير الغلاف</span>
                  </button>
                </div>
              ) : (
                <div className="px-3.5 pt-3 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200">
                    <Coins size={18} />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleOpenCoverUpload('referral', e)}
                    className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition"
                  >
                    <ImageIcon size={12} />
                    <span>إضافة غلاف</span>
                  </button>
                </div>
              )}

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                    ربح المال من الدعوات
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    دعوة الأصدقاء، رصيدك وسحب الأرباح عبر بريدي موب / CCP
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900 mt-3">
                  <span>عرض المحفظة</span>
                  <ChevronLeft size={14} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
