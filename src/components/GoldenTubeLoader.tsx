import React, { useEffect, useState, useCallback } from 'react';

// Custom event name for triggering the loader
const LOADER_TRIGGER_EVENT = 'clasty-trigger-golden-loader';

/**
 * Utility function to manually trigger the golden progress bar anywhere in the app
 */
export function triggerGoldenLoader() {
  window.dispatchEvent(new CustomEvent(LOADER_TRIGGER_EVENT));
}

export default function GoldenTubeLoader() {
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    setVisible(true);
    setProgress(15);

    // Rapid Instagram-like fill animation
    const t1 = setTimeout(() => {
      setProgress(55);
    }, 60);

    const t2 = setTimeout(() => {
      setProgress(85);
    }, 180);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 320);

    const t4 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    // 1. Trigger immediately on page load / refresh ("عند تحديث")
    startAnimation();

    // 2. Listen to custom trigger events
    const handleCustomTrigger = () => {
      startAnimation();
    };
    window.addEventListener(LOADER_TRIGGER_EVENT, handleCustomTrigger);

    // 3. Global click listener on any button, tab, link or interactive element ("نقر على زر مثل انستغرام")
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, [role="button"], input[type="submit"], select, .cursor-pointer');
      if (interactive) {
        startAnimation();
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      window.removeEventListener(LOADER_TRIGGER_EVENT, handleCustomTrigger);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [startAnimation]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3.5px] overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
      }}
      aria-hidden="true"
      id="instagram-golden-tube-loader"
    >
      {/* Golden Tube Bar */}
      <div
        className="h-full rounded-r-full shadow-[0_0_12px_#ffd700,0_0_4px_#d4af37]"
        style={{
          width: `${progress}%`,
          transition: progress === 15 ? 'width 0.08s ease-out' : progress === 100 ? 'width 0.15s ease-out' : 'width 0.2s cubic-bezier(0.1, 0.7, 0.1, 1)',
          background: 'linear-gradient(90deg, #996515 0%, #b8860b 25%, #d4af37 55%, #ffd700 80%, #fff7b8 100%)',
        }}
      >
        {/* Leading edge glow sparkle */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/90 blur-[1px] transform translate-x-1/2" />
      </div>
    </div>
  );
}
