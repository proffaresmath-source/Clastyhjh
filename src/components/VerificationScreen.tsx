import { useEffect, useState } from 'react';

interface VerificationScreenProps {
  mode: 'login' | 'signup';
  onComplete: () => void;
  userIdentifier?: string;
  studentName?: string;
}

export default function VerificationScreen({
  onComplete,
}: VerificationScreenProps) {
  const [filledDots, setFilledDots] = useState(0);

  // Non-uniform random delay between 12 seconds (12000ms) and 20 seconds (20000ms)
  useEffect(() => {
    // Generate random total duration between 12000ms and 20000ms
    const totalDuration = Math.floor(Math.random() * (20000 - 12000 + 1)) + 12000;

    // Irregular, non-uniform weights for the 6 dots:
    // Some are slower (delay/handshake/verification pause), some are faster bursts
    const rawWeights = [
      Math.random() * 1.5 + 2.2, // Step 1: Initial delay / handshake (slower)
      Math.random() * 0.6 + 0.5, // Step 2: Fast burst
      Math.random() * 1.8 + 2.0, // Step 3: Slower verification phase
      Math.random() * 0.7 + 0.6, // Step 4: Quick step
      Math.random() * 2.0 + 2.4, // Step 5: Longer wait / authentication check (slower)
      Math.random() * 0.8 + 0.8, // Step 6: Final check
    ];

    const sumWeights = rawWeights.reduce((acc, val) => acc + val, 0);
    // Reserve ~800ms at the end when all 6 dots are filled before firing onComplete
    const fillDuration = totalDuration - 800;

    let accumulatedTime = 0;
    const timers: NodeJS.Timeout[] = [];

    rawWeights.forEach((weight, idx) => {
      accumulatedTime += (weight / sumWeights) * fillDuration;
      timers.push(
        setTimeout(() => {
          setFilledDots(idx + 1);
        }, Math.round(accumulatedTime))
      );
    });

    timers.push(
      setTimeout(() => {
        onComplete();
      }, totalDuration)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between py-16 px-4 text-center select-none"
      id="verification-screen"
      dir="rtl"
    >
      {/* Empty top spacing */}
      <div className="h-4" />

      {/* Center content: Clean minimalist screen with 6 flat black dots */}
      <div className="flex flex-col items-center justify-center max-w-sm w-full mx-auto">
        {/* Brand Name */}
        <div className="flex flex-col items-center justify-center text-center mb-8 select-none" dir="ltr">
          <div className="flex items-center justify-center mx-auto mb-2">
            <img
              src="/logo.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo-vertical.png';
              }}
              alt="Clasty Zoom"
              className="h-16 sm:h-20 w-auto object-contain mx-auto select-none pointer-events-none"
            />
          </div>

          <h1
            className="grid grid-cols-2 items-baseline font-vintage-insta text-4xl sm:text-5xl text-[#1a1a1a] tracking-wide my-0.5 leading-none select-none w-full max-w-[280px] mx-auto"
            style={{ textRendering: 'optimizeLegibility' }}
          >
            <span className="text-right pr-1">clasty</span>
            <span className="text-left pl-1">zoom</span>
          </h1>

          <p className="w-[134px] h-[40px] flex items-center justify-center mx-auto text-[9px] sm:text-[9.5px] font-normal text-[#9e741a] mt-0.5 tracking-wider text-center" dir="rtl">
            أول منصة دروس دعم في الجزائر
          </p>
        </div>

        {/* The 6 Dots: Smaller size, filled with flat black, NO shadows, NO glow */}
        <div className="flex items-center justify-center gap-3 sm:gap-3.5 my-6" dir="ltr">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const isFilled = filledDots > index;
            return (
              <div
                key={index}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-200 ${
                  isFilled
                    ? 'bg-black border border-black'
                    : 'bg-transparent border border-neutral-300'
                }`}
              />
            );
          })}
        </div>

        {/* Minimal status indicator */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs text-neutral-500 font-medium tracking-wide animate-pulse">
            {filledDots < 6 ? 'جاري التحقق والمصادقة...' : 'اكتمل التحقق، جاري الدخول...'}
          </p>
        </div>
      </div>

      {/* Clean bottom footer branding like Meta / Instagram */}
      <div className="text-[11px] text-neutral-400 font-sans" dir="ltr">
        from <span className="font-semibold text-neutral-600">CLASTY ZOOM</span>
      </div>
    </div>
  );
}
