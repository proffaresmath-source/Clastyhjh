import {
  Video,
  BookOpen,
  FileCheck2,
  MessageSquare,
  Award,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface AppIntroProps {
  onNext: () => void;
  studentName?: string;
}

export default function AppIntro({ onNext, studentName }: AppIntroProps) {
  return (
    <div
      className="w-full max-w-[460px] mx-auto bg-white"
      id="app-intro-screen"
      dir="rtl"
    >
      {/* Raised Logo & Branding */}
      <div className="flex flex-col items-center justify-center text-center mx-auto mb-3 select-none" dir="ltr">
        <div className="flex items-center justify-center mx-auto mb-0.5">
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
          className="grid grid-cols-2 items-baseline font-vintage-insta text-4xl sm:text-5xl text-[#1a1a1a] tracking-wide my-0.5 leading-none select-none w-full max-w-[290px] mx-auto"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          <span className="text-right pr-1">clasty</span>
          <span className="text-left pl-1">zoom</span>
        </h1>

        <p className="text-[9px] sm:text-[9.5px] font-normal text-[#9e741a] mt-0.5 tracking-wider text-center" dir="rtl">
          أول منصة دروس دعم في الجزائر
        </p>
      </div>

      {/* Intro Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-neutral-900 leading-tight">
          {studentName ? `أهلاً بك يا ${studentName}` : 'أهلاً بك في منصة Clasty Zoom'}
        </h2>
        <p className="text-xs text-neutral-600 mt-1 leading-relaxed max-w-sm mx-auto">
          دليلك التعليمي الشامل لمرافقتك نحو التفوق في دراستك وشهاداتك الرسمية
        </p>
      </div>

      {/* Core Features List */}
      <div className="space-y-3 mb-6">
        {/* Feature 1: Live Interactive Lessons */}
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#faf9f5] border border-[#ece4d0] hover:border-[#d4af37] transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#b8860b] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Video size={20} />
          </div>
          <div className="text-right flex-1">
            <h3 className="text-xs font-bold text-neutral-900 mb-0.5">
              حصص دعم تفاعلية مباشرة عبر Zoom
            </h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              تواصل حي بالصوت والصورة مع نخبة من أفضل أساتذة الجزائر، مع إمكانية المشاركة وحل التمارين على السبورة الذكية.
            </p>
          </div>
        </div>

        {/* Feature 2: Exercises & Exams Bank */}
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#faf9f5] border border-[#ece4d0] hover:border-[#d4af37] transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2d3748] to-[#1a202c] text-amber-400 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <FileCheck2 size={20} />
          </div>
          <div className="text-right flex-1">
            <h3 className="text-xs font-bold text-neutral-900 mb-0.5">
              بنك تمارين، ملخصات وحوليات رسمية
            </h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              سلاسل تمارين شاملة لكل وحدة دراسية، ملخصات PDF مركزة، ومواضيع البكالوريا وBEM مع الحلول المفصلة وسلم التنقيط.
            </p>
          </div>
        </div>

        {/* Feature 3: Recorded Lessons on Demand */}
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#faf9f5] border border-[#ece4d0] hover:border-[#d4af37] transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <BookOpen size={20} />
          </div>
          <div className="text-right flex-1">
            <h3 className="text-xs font-bold text-neutral-900 mb-0.5">
              تسجيلات الحصص متاحة 24/7
            </h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              فاتك درس؟ لا تقلق! كل الحصص المباشرة يتم تسجيلها تلقائياً لتراجعها في أي وقت وتثبت المفاهيم قبل الفروض والامتحانات.
            </p>
          </div>
        </div>

        {/* Feature 4: Interactive Forum & Q&A */}
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#faf9f5] border border-[#ece4d0] hover:border-[#d4af37] transition duration-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <MessageSquare size={20} />
          </div>
          <div className="text-right flex-1">
            <h3 className="text-xs font-bold text-neutral-900 mb-0.5">
              فضاء الأسئلة والمرافقة المستمرة
            </h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              اطرح أسئلتك واستفساراتك الصعبة وسيجيبك الأساتذة المتخصصون ومساعدونا البيداغوجيون لمرافقتك خطوة بخطوة.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary Highlights */}
      <div className="grid grid-cols-3 gap-2 text-center mb-6 py-2.5 px-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
        <div>
          <span className="block text-xs font-bold text-[#b8860b]">+58 ولاية</span>
          <span className="text-[10px] text-neutral-500">تغطية وطنية</span>
        </div>
        <div className="border-x border-amber-200/80">
          <span className="block text-xs font-bold text-[#b8860b]">100% حي وتفاعلي</span>
          <span className="text-[10px] text-neutral-500">دروس مباشرة</span>
        </div>
        <div>
          <span className="block text-xs font-bold text-[#b8860b]">تفوق مضمون</span>
          <span className="text-[10px] text-neutral-500">مرافقة مستمرة</span>
        </div>
      </div>

      {/* Next to Main Home Page */}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8860b] hover:from-[#c59b27] hover:to-[#aa7a1e] text-white text-xs font-bold shadow-md shadow-[#d4af37]/25 transition active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        id="btn-intro-to-home"
      >
        <span>التالي: الدخول إلى الصفحة الرئيسية</span>
        <ArrowRight size={16} className="rotate-180" />
      </button>
    </div>
  );
}
