import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { phoneSlides } from '../data/mockData';
import { Camera, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

export default function PhoneMockup() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % phoneSlides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative hidden lg:flex items-center justify-center select-none" id="phone-mockup-container">
      {/* Device Exterior Frame */}
      <div className="relative w-[340px] h-[640px] rounded-[48px] bg-[#1a1a1a] p-3 shadow-2xl ring-1 ring-black/20 border-4 border-[#2b2b2b]">
        {/* Subtle Glass Reflection */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none rounded-[44px]" />
        
        {/* Inner Screen */}
        <div className="relative w-full h-full bg-black rounded-[38px] overflow-hidden flex flex-col justify-between border border-[#333]">
          
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-[#333] ml-auto mr-2" />
          </div>

          {/* Mini Phone Instagram Top Bar */}
          <div className="pt-8 px-4 pb-2 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-sm z-20">
            <span className="font-vintage-insta text-2xl text-white tracking-wide">clasty zoom</span>
            <div className="flex items-center gap-3 text-white/80">
              <Heart size={18} />
              <MessageCircle size={18} />
            </div>
          </div>

          {/* Image Slide Carousel */}
          <div className="relative flex-1 w-full overflow-hidden bg-zinc-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img
                  src={phoneSlides[currentSlide]}
                  alt="Clasty Zoom preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </motion.div>
            </AnimatePresence>

            {/* Simulated Post Overlay */}
            <div className="absolute bottom-3 inset-x-3 text-white z-20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                  <MessageCircle size={18} />
                  <Send size={18} />
                </div>
                <Bookmark size={18} />
              </div>
              <p className="text-xs font-semibold text-white/90">
                1,428 likes
              </p>
              <p className="text-[11px] text-white/70 truncate mt-0.5">
                <span className="font-semibold text-white">retro_lens</span> Vintage vibes with classic memories
              </p>
            </div>
          </div>

          {/* Mini Bottom Nav */}
          <div className="h-10 bg-black px-6 flex items-center justify-between text-white/70 border-t border-white/10 z-20">
            <div className="w-4 h-4 rounded-full border border-white/60" />
            <Camera size={16} />
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
