import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicRow, DynamicRowCard, User } from '../types';
import { Layers, Plus, CreditCard, X } from 'lucide-react';

interface DynamicRowsHomeProps {
  user: User;
  rows: DynamicRow[];
  onOpenAdmin: () => void;
  onCardClick: (card: DynamicRowCard) => void;
  onNavigateToLessons?: () => void;
  onNavigateToExams?: () => void;
}

export default function DynamicRowsHome({
  rows,
  onOpenAdmin,
  onCardClick,
}: DynamicRowsHomeProps) {
  // State for dramatically enlarged card
  const [enlargedCard, setEnlargedCard] = useState<DynamicRowCard | null>(null);

  // If no shelves exist at all, show clean empty state
  if (!rows || rows.length === 0) {
    return (
      <div
        className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-white/60 backdrop-blur-xs rounded-3xl border border-[#ecdba8]/60 shadow-xs space-y-3 my-2 select-text animate-in fade-in duration-200"
        id="empty-shelves-container"
      >
        <div className="w-13 h-13 rounded-2xl bg-[#faf7ec] text-[#b8860b] border border-[#ecdba8] flex items-center justify-center shadow-xs">
          <Layers size={26} />
        </div>

        <div className="max-w-sm space-y-1">
          <h2 className="text-sm font-bold text-neutral-900">
            واجهة الرفوف الديناميكية جاهزة
          </h2>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            الواجهة فارغة حالياً. اضغط على زر{' '}
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-100 text-[#996515] font-bold text-[11px] mx-0.5">
              +
            </span>{' '}
            في الشريط العلوي لإنشاء الرفوف وإضافة قوالب الباقات.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="mt-1 py-2 px-5 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          id="btn-create-first-shelf"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>+ إضافة رف جديد وقوالب</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-200 select-text" id="dynamic-home-content">
      {/* Dynamic Shelves (الرفوف قريبة جداً من بعضها بدون فوارق متباعدة) */}
      {rows.map((row) => {
        if (!row.cards || row.cards.length === 0) return null;

        return (
          <div
            key={row.id}
            className="space-y-1"
            id={`shelf-${row.id}`}
          >
            {/* Shelf Title - Calm, Compact and Direct */}
            {row.title && (
              <div className="px-0.5 flex items-center justify-between">
                <h3 className="text-[11px] sm:text-xs font-bold text-neutral-800 tracking-normal">
                  {row.title}
                </h3>
              </div>
            )}

            {/* Shelf Templates Container - Super close gap (gap-1 to gap-1.5) without touching */}
            <div
              className="flex items-stretch gap-1 sm:gap-1.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scroll-smooth snap-x snap-mandatory scrollbar-none"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
              dir="rtl"
            >
              {row.cards.map((card) => {
                const isVideo = card.mediaType === 'video' && !!card.videoUrl;

                return (
                  <div
                    key={card.id}
                    onClick={() => setEnlargedCard(card)}
                    className="w-[120px] sm:w-[130px] h-[240px] sm:h-[260px] shrink-0 snap-start rounded-xl overflow-hidden border border-neutral-200 hover:border-[#d4af37] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between bg-white group cursor-pointer p-0.5"
                    title="انقر لتكبير القالب ومشاهدته بوضوح"
                  >
                    {/* 85% Area: Pure Video or Image */}
                    {/* عندما يرفع فيديو يشتغل تلقائياً ومستمر بدون صوت ولا يستطيع توقيفه أو تقديمه */}
                    <div className="h-[84%] w-full rounded-lg overflow-hidden relative bg-neutral-900 select-none">
                      {isVideo ? (
                        <video
                          src={card.videoUrl}
                          className="w-full h-full object-cover pointer-events-none select-none"
                          playsInline
                          autoPlay
                          loop
                          muted
                          preload="auto"
                          disablePictureInPicture
                          disableRemotePlayback
                        />
                      ) : (
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition duration-300 pointer-events-none"
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* 15% Area: Title & Action Button */}
                    <div className="h-[16%] flex flex-col justify-between px-1 py-0.5 text-right bg-white rounded-b-lg">
                      <h4 className="text-[9.5px] sm:text-[10px] font-bold text-neutral-800 truncate leading-tight group-hover:text-[#b8860b] transition">
                        {card.title}
                      </h4>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardClick(card);
                        }}
                        className="w-full py-0.5 px-1 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-[8px] sm:text-[8.5px] font-semibold rounded-md shadow-2xs transition flex items-center justify-center gap-0.5 cursor-pointer active:scale-95"
                      >
                        <CreditCard size={8} />
                        <span className="truncate">{card.actionText || 'تفاصيل الدورة'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ================= DRAMATIC ENLARGED CARD MODAL ================= */}
      {/* يكبر القالب بطريقة درامية وسلسة مع بقائه هو نفسه ويشتغل الفيديو تلقائياً ومستمر بدون صوت ولا يمكن توقيفه */}
      <AnimatePresence>
        {enlargedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setEnlargedCard(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto select-text"
            dir="rtl"
          >
            {/* The Enlarged Card Container - Same layout & ratio, but enlarged dramatically */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 15 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                mass: 0.7,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[280px] sm:w-[310px] h-[540px] sm:h-[580px] rounded-2xl overflow-hidden border border-[#d4af37]/60 shadow-2xl bg-white flex flex-col justify-between p-1.5 text-right group"
            >
              {/* Close Button Top Corner */}
              <button
                type="button"
                onClick={() => setEnlargedCard(null)}
                className="absolute top-3 left-3 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-md"
                title="إغلاق"
              >
                <X size={15} />
              </button>

              {/* 85% Area: Enlarged Pure Media View - Non-stop autoplaying looping muted video */}
              <div className="h-[85%] w-full rounded-xl overflow-hidden relative bg-neutral-950 select-none">
                {enlargedCard.mediaType === 'video' && enlargedCard.videoUrl ? (
                  <video
                    src={enlargedCard.videoUrl}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                  />
                ) : (
                  <img
                    src={enlargedCard.imageUrl}
                    alt={enlargedCard.title}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}
              </div>

              {/* 15% Area: Card Title & Action Button (Triggers Details Transition) */}
              <div className="h-[15%] flex flex-col justify-between px-1 py-0.5 text-right bg-white rounded-b-xl">
                <div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900 truncate leading-tight">
                    {enlargedCard.title}
                  </h4>
                  {enlargedCard.subject && (
                    <span className="text-[9.5px] text-neutral-500 truncate block">
                      {enlargedCard.subject}
                    </span>
                  )}
                </div>

                {/* Main Action Button -> Directly transitions to the full details page */}
                <button
                  type="button"
                  onClick={() => {
                    const cardToOpen = enlargedCard;
                    setEnlargedCard(null);
                    onCardClick(cardToOpen);
                  }}
                  className="w-full py-1.5 px-3 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <CreditCard size={13} />
                  <span>{enlargedCard.actionText || 'تفاصيل الدورة'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
