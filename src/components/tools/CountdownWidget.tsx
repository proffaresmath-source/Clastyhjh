import { useState, useEffect } from 'react';
import { CountdownConfig } from '../../types';
import FlipCardUnit from './FlipCardUnit';

interface CountdownWidgetProps {
  config: CountdownConfig;
  configBem?: CountdownConfig;
  activeMode?: 'bac' | 'bem' | 'both';
  onModeChange?: (mode: 'bac' | 'bem' | 'both') => void;
  onOpenManage?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function useCountdown(targetDateStr: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (isNaN(target) || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return timeLeft;
}

interface CountdownCardProps {
  title: string;
  targetDate: string;
  quote?: string;
}

function CountdownCard({ title, targetDate, quote }: CountdownCardProps) {
  const time = useCountdown(targetDate);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-3 sm:p-4 text-right shadow-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs sm:text-sm font-bold text-neutral-800">
          {title}
        </h3>
        {quote && (
          <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline-block">
            {quote}
          </span>
        )}
      </div>

      {time.isExpired ? (
        <div className="p-4 bg-neutral-100 rounded-xl text-center text-xs font-semibold text-neutral-600">
          انتهى الموعد المحدد! بالتوفيق والنجاح لجميع المترشحين.
        </div>
      ) : (
        /* Days on the left (dir="ltr") */
        <div
          className="grid grid-cols-4 gap-2 sm:gap-3 bg-neutral-50/70 p-2.5 sm:p-3.5 rounded-2xl border border-neutral-200/60"
          dir="ltr"
        >
          {/* Days on the LEFT */}
          <FlipCardUnit value={time.days} label="الأيام" padLength={time.days >= 100 ? 3 : 2} />

          {/* Hours */}
          <FlipCardUnit value={time.hours} label="الساعات" padLength={2} />

          {/* Minutes */}
          <FlipCardUnit value={time.minutes} label="الدقائق" padLength={2} />

          {/* Seconds on the RIGHT */}
          <FlipCardUnit value={time.seconds} label="الثواني" padLength={2} />
        </div>
      )}
    </div>
  );
}

export default function CountdownWidget({
  config,
  configBem,
  activeMode = 'both',
  onModeChange,
}: CountdownWidgetProps) {
  const [selectedView, setSelectedView] = useState<'bac' | 'bem' | 'both'>(activeMode);

  const bemConfig = configBem || {
    id: 'countdown_widget_bem',
    enabled: true,
    examType: 'bem' as const,
    title: 'العد التنازلي لشهادة التعليم المتوسط (BEM 2026)',
    targetDate: '2026-06-01T08:00',
    motivationalQuote: 'شهادة التعليم المتوسط، خطوتك الأولى نحو التميز الثانوي!',
  };

  const handleSelectMode = (mode: 'bac' | 'bem' | 'both') => {
    setSelectedView(mode);
    if (onModeChange) onModeChange(mode);
  };

  return (
    <div className="w-full select-none space-y-3" id="countdown-widget" dir="rtl">
      {/* Top Controller: Switch between BAC, BEM, or BOTH cleanly */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200/80">
          <button
            type="button"
            onClick={() => handleSelectMode('bac')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer outline-none ${
              selectedView === 'bac'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            بكالوريا 2026
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('bem')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer outline-none ${
              selectedView === 'bem'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            بيام BEM 2026
          </button>
          <button
            type="button"
            onClick={() => handleSelectMode('both')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer outline-none ${
              selectedView === 'both'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            كلاهما معاً
          </button>
        </div>

        <span className="text-[11px] text-neutral-400 font-medium">
          {selectedView === 'both' ? 'مؤقتا البكالوريا والبيام' : 'مؤقت الامتحان المختار'}
        </span>
      </div>

      {/* Countdown Cards Container */}
      <div className="space-y-3">
        {(selectedView === 'bac' || selectedView === 'both') && (
          <CountdownCard
            title={config.title || 'العد التنازلي لبكالوريا 2026'}
            targetDate={config.targetDate || '2026-06-07T08:00'}
            quote={config.motivationalQuote}
          />
        )}

        {(selectedView === 'bem' || selectedView === 'both') && (
          <CountdownCard
            title={bemConfig.title || 'العد التنازلي لشهادة التعليم المتوسط (BEM 2026)'}
            targetDate={bemConfig.targetDate || '2026-06-01T08:00'}
            quote={bemConfig.motivationalQuote}
          />
        )}
      </div>
    </div>
  );
}
