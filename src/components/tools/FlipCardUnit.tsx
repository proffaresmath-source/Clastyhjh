import { useState, useEffect, useRef } from 'react';

interface FlipCardUnitProps {
  value: number;
  label: string;
  padLength?: number;
}

export default function FlipCardUnit({ value, label, padLength = 2 }: FlipCardUnitProps) {
  const formattedCurrent = String(value).padStart(padLength, '0');
  const [currentVal, setCurrentVal] = useState(formattedCurrent);
  const [prevVal, setPrevVal] = useState(formattedCurrent);
  const [isFlipping, setIsFlipping] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (formattedCurrent !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(formattedCurrent);
      setIsFlipping(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsFlipping(false);
        setPrevVal(formattedCurrent);
      }, 500);
    }
  }, [formattedCurrent, currentVal]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center select-none w-full" dir="rtl">
      {/* 3D Flip Card Container */}
      <div className="relative w-full h-20 sm:h-24 md:h-26 max-w-[96px] sm:max-w-[110px] flip-card-container">
        
        {/* === LAYER 1: STATIC TOP HALF (Shows Current / New Value) === */}
        <div className="absolute top-0 inset-x-0 h-1/2 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-[#26262e] to-[#1c1c22] border-t border-x border-[#383844] border-b border-black/80 z-10">
          <div className="absolute top-0 inset-x-0 h-[200%] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight leading-none select-none">
            {currentVal}
          </div>
        </div>

        {/* === LAYER 2: STATIC BOTTOM HALF (Shows Previous / Old Value while flipping) === */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 overflow-hidden rounded-b-xl sm:rounded-b-2xl bg-gradient-to-b from-[#16161c] to-[#0f0f13] border-b border-x border-[#383844] border-t border-white/5 z-10">
          <div className="absolute -top-full inset-x-0 h-[200%] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black font-mono text-neutral-200 tracking-tight leading-none select-none">
            {prevVal}
          </div>
        </div>

        {/* === LAYER 3: FLIPPING TOP HALF (Rotates Downwards) === */}
        {isFlipping && (
          <div className="absolute top-0 inset-x-0 h-1/2 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-gradient-to-b from-[#26262e] to-[#1c1c22] border-t border-x border-[#383844] border-b border-black/80 z-20 flip-card-top-animate shadow-md">
            <div className="absolute top-0 inset-x-0 h-[200%] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black font-mono text-neutral-200 tracking-tight leading-none select-none">
              {prevVal}
            </div>
          </div>
        )}

        {/* === LAYER 4: FLIPPING BOTTOM HALF (Flips into view) === */}
        {isFlipping && (
          <div className="absolute bottom-0 inset-x-0 h-1/2 overflow-hidden rounded-b-xl sm:rounded-b-2xl bg-gradient-to-b from-[#16161c] to-[#0f0f13] border-b border-x border-[#383844] border-t border-white/5 z-30 flip-card-bottom-animate shadow-md">
            <div className="absolute -top-full inset-x-0 h-[200%] flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight leading-none select-none">
              {currentVal}
            </div>
          </div>
        )}

        {/* === CENTER NOTCHES & DIVIDER SLIT (Mechanical Flip Clock Details) === */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1px] bg-black/90 z-40 flex items-center justify-between pointer-events-none px-0.5">
          {/* Left Notch */}
          <div className="w-1.5 h-2 -ml-1 rounded-r-full bg-[#f4f4f5] border-r border-[#383844]" />
          {/* Right Notch */}
          <div className="w-1.5 h-2 -mr-1 rounded-l-full bg-[#f4f4f5] border-l border-[#383844]" />
        </div>
      </div>

      {/* Label beneath the Flip Unit */}
      <span className="text-[11px] sm:text-xs font-semibold text-neutral-500 mt-2 block tracking-wide">
        {label}
      </span>
    </div>
  );
}
