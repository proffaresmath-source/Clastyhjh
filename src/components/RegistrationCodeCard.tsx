import { useState, useRef } from 'react';
import {
  Copy,
  Check,
  Camera,
  Download,
  KeyRound,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  MapPin,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

interface RegistrationCodeCardProps {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    academicYear: string;
    wilaya: string;
    commune: string;
    accountCode: string;
  };
  onNext: () => void;
}

export default function RegistrationCodeCard({
  userData,
  onNext,
}: RegistrationCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [hasTakenScreenshot, setHasTakenScreenshot] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(userData.accountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = userData.accountCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTakeScreenshot = () => {
    setIsGeneratingCard(true);

    try {
      // Create high-resolution graphic voucher of the student card via HTML5 Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 1000;
      canvas.height = 740;

      // Background: clean luxury off-white with subtle warm border
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient border frame
      const borderGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      borderGrad.addColorStop(0, '#d4af37');
      borderGrad.addColorStop(0.5, '#f5e29f');
      borderGrad.addColorStop(1, '#b8860b');

      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Inner header box
      ctx.fillStyle = '#FAF8F0';
      ctx.fillRect(35, 35, canvas.width - 70, 130);

      // Top title
      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Clasty Zoom', canvas.width / 2, 90);

      ctx.fillStyle = '#9E741A';
      ctx.font = '19px sans-serif';
      ctx.fillText('أول منصة دروس دعم في الجزائر - بطاقة التلميذ الرسمية', canvas.width / 2, 132);

      // Student Account Code box
      ctx.fillStyle = '#FFFDF8';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(80, 195, canvas.width - 160, 170, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#8B6508';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('رمز تسجيل الدخول الخاص بك (Login Code)', canvas.width / 2, 240);

      // Big Golden Code
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 62px monospace';
      ctx.fillText(userData.accountCode, canvas.width / 2, 320);

      // Student info grid
      ctx.textAlign = 'right';
      ctx.font = 'bold 23px sans-serif';
      ctx.fillStyle = '#222222';

      const startY = 415;
      const rightX = canvas.width - 100;

      ctx.fillText(`• اسم الطالب: ${userData.firstName} ${userData.lastName}`, rightX, startY);
      ctx.fillText(`• المستوى / الشعبة: ${userData.academicYear}`, rightX, startY + 48);
      ctx.fillText(`• الولاية والبلدية: ${userData.wilaya} (${userData.commune})`, rightX, startY + 96);
      ctx.fillText(`• رقم الهاتف: ${userData.phone}`, rightX, startY + 144);
      ctx.fillText(`• البريد الإلكتروني: ${userData.email}`, rightX, startY + 192);

      // Footer notice
      ctx.textAlign = 'center';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#8B6508';
      ctx.fillText('⚠️ احتفظ بلقطة الشاشة هذه بعناية. ستستعمل هذا الرمز للدخول إلى حصصك دائماً.', canvas.width / 2, 690);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ClastyZoom-LoginCard-${userData.accountCode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setHasTakenScreenshot(true);
      setShowWarning(false);
    } catch (err) {
      console.error('Error creating screenshot voucher', err);
      setHasTakenScreenshot(true);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleNextClick = () => {
    if (!hasTakenScreenshot) {
      setShowWarning(true);
      return;
    }
    onNext();
  };

  return (
    <div
      className="w-full max-w-[440px] mx-auto bg-white pt-2 pb-6 px-3 sm:px-4 select-text"
      id="registration-code-card-screen"
      dir="rtl"
    >
      {/* Clean Top Branding Header */}
      <header className="flex flex-col items-center justify-center text-center mx-auto mb-4 select-none" dir="ltr">
        <div className="flex items-center justify-center mx-auto mb-0.5">
          <img
            src="/logo.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-vertical.png';
            }}
            alt="Clasty Zoom"
            className="h-16 sm:h-20 w-auto object-contain mx-auto select-none pointer-events-none transition-all"
          />
        </div>

        <h1
          className="grid grid-cols-2 items-baseline font-vintage-insta text-4xl sm:text-5xl text-[#1a1a1a] tracking-wide my-0.5 leading-none select-none w-full max-w-[290px] mx-auto"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          <span className="text-right pr-1">clasty</span>
          <span className="text-left pl-1">zoom</span>
        </h1>

        {/* Small, refined tagline */}
        <p
          className="text-[9px] sm:text-[9.5px] font-normal text-[#9e741a] mt-0.5 tracking-wider text-center"
          dir="rtl"
        >
          أول منصة دروس دعم في الجزائر
        </p>
      </header>

      {/* Success Title */}
      <div className="text-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
          تم إنشاء حسابك بنجاح!
        </h2>
        <p className="text-xs text-neutral-600 mt-1">
          مرحباً بك يا <span className="font-bold text-neutral-900">{userData.firstName} {userData.lastName}</span>. تم إصدار بطاقة الدخول الخاصة بك:
        </p>
      </div>

      {/* 
        The Official Student Access Card:
        High contrast, clearly distributed student information, responsive for small devices
      */}
      <div
        ref={cardRef}
        className="relative bg-[#ffffff] border-2 border-[#d4af37] rounded-2xl p-4 sm:p-5 shadow-lg shadow-[#d4af37]/10 mb-5 overflow-hidden"
        id="student-official-login-card"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ebdcb3]/70">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#a77405]" />
            <span className="text-xs sm:text-sm font-extrabold text-[#7a5303]">
              بطاقة التلميذ الرسمية
            </span>
          </div>
          <span className="text-[10px] font-bold text-neutral-700 bg-[#fbf8f0] px-2.5 py-1 rounded-md border border-[#e2d19f]">
            معتمد • Clasty ID
          </span>
        </div>

        {/* Big High-Contrast Login Code Display */}
        <div className="my-4 text-center">
          <span className="block text-[11px] font-bold text-[#8b6508] mb-1.5">
            رمز تسجيل الدخول الخاص بك (Login Code)
          </span>

          {/* Code Container with Prominent Copy Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 bg-[#fbf9f2] p-3 rounded-xl border-2 border-[#d4af37] shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <KeyRound size={20} className="text-[#a77405] shrink-0" />
              <span
                className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-[#111111] select-all"
                id="displayed-login-code"
              >
                {userData.accountCode}
              </span>
            </div>

            {/* Prominent Copy Button */}
            <button
              type="button"
              onClick={handleCopyCode}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-[#f6eed2] text-[#8b6508] border border-[#d4af37]/70'
              }`}
              title="نسخ رمز تسجيل الدخول"
              id="btn-copy-login-code"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-white" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy size={15} className="text-[#a77405]" />
                  <span>نسخ الرمز</span>
                </>
              )}
            </button>
          </div>

          {copied && (
            <p className="text-[11px] font-bold text-emerald-700 mt-1.5 animate-in fade-in duration-200">
              ✓ تم نسخ رمز الحساب بنجاح إلى الحافظة!
            </p>
          )}
        </div>

        {/* 
          Student Details Grid:
          High contrast, clearly distributed, easily readable on small mobile screens
        */}
        <div className="bg-[#fcfbf8] rounded-xl p-3.5 border border-[#ece1c0] divide-y divide-neutral-100 text-xs text-neutral-800">
          {/* Student Name */}
          <div className="flex items-center justify-between py-1.5 gap-2">
            <div className="flex items-center gap-1.5 text-neutral-500 shrink-0">
              <UserCheck size={14} className="text-[#a77405]" />
              <span className="font-medium">اسم التلميذ:</span>
            </div>
            <span className="font-bold text-neutral-950 text-right truncate">
              {userData.firstName} {userData.lastName}
            </span>
          </div>

          {/* Academic Year & Stream */}
          <div className="flex items-start justify-between py-2 gap-2">
            <div className="flex items-center gap-1.5 text-neutral-500 shrink-0 mt-0.5">
              <GraduationCap size={14} className="text-[#a77405]" />
              <span className="font-medium">المستوى:</span>
            </div>
            <span className="font-bold text-neutral-950 text-right leading-snug break-words max-w-[220px]">
              {userData.academicYear}
            </span>
          </div>

          {/* Wilaya & Commune */}
          <div className="flex items-center justify-between py-1.5 gap-2">
            <div className="flex items-center gap-1.5 text-neutral-500 shrink-0">
              <MapPin size={14} className="text-[#a77405]" />
              <span className="font-medium">الولاية / البلدية:</span>
            </div>
            <span className="font-bold text-neutral-950 text-right truncate">
              {userData.wilaya} ({userData.commune})
            </span>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between py-1.5 gap-2">
            <div className="flex items-center gap-1.5 text-neutral-500 shrink-0">
              <Smartphone size={14} className="text-[#a77405]" />
              <span className="font-medium">رقم الهاتف:</span>
            </div>
            <span className="font-mono font-bold text-neutral-950 tracking-wider" dir="ltr">
              {userData.phone}
            </span>
          </div>
        </div>

        {/* Security Warning Footnote */}
        <p className="text-[10px] text-center text-neutral-500 mt-3">
          الرمز أعلاه هو وسيلة تسجيل دخولك الدائمة، يرجى حفظه فوراً.
        </p>
      </div>

      {/* 
        Prominent Call-to-Action (CTA):
        "أخذ لقطة الشاشة وحفظ بطاقة الرمز"
        High visual appeal, distinct color, mandatory before proceeding
      */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleTakeScreenshot}
          disabled={isGeneratingCard}
          className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2.5 shadow-md cursor-pointer active:scale-[0.99] ${
            hasTakenScreenshot
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-gradient-to-r from-[#b8860b] via-[#cf9b16] to-[#8b6508] text-white hover:brightness-105 shadow-[#d4af37]/30 border border-amber-300/40 animate-pulse'
          }`}
          id="btn-take-screenshot-mandatory"
        >
          {hasTakenScreenshot ? (
            <>
              <Check size={18} className="text-white shrink-0" />
              <span>✓ تم حفظ بطاقة الرمز في جهازك (انقر لإعادة التحميل)</span>
            </>
          ) : (
            <>
              <Camera size={19} className="text-white shrink-0" />
              <Download size={17} className="text-white shrink-0" />
              <span>أخذ لقطة شاشة وحفظ بطاقة الرمز (إجباري)</span>
            </>
          )}
        </button>

        {/* Clear Instructions / Guidance Note */}
        {hasTakenScreenshot ? (
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl mt-2.5 border border-emerald-200 shadow-xs">
            <Check size={16} className="shrink-0 text-emerald-600" />
            <span className="font-semibold">
              ممتاز! تم تحميل بطاقة الدخول بنجاح. يمكنك الآن المتابعة بالضغط على "التالي".
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-1.5 text-xs text-amber-900 bg-amber-50 px-3.5 py-2 rounded-xl mt-2.5 border border-amber-200">
            <AlertCircle size={15} className="shrink-0 text-amber-700 mt-0.5" />
            <span>
              <strong>تنبيه إجباري:</strong> يجب حفظ لقطة الشاشة أولاً لتفعيل زر "التالي" وضمان عدم فقدان رمزك.
            </span>
          </div>
        )}
      </div>

      {/* Warning popup if user attempts to click next prematurely */}
      {showWarning && !hasTakenScreenshot && (
        <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold text-center flex items-center justify-center gap-2 shadow-xs">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>يرجى الضغط أولاً على الزر أعلاه لحفظ بطاقة الرمز في هاتفك!</span>
        </div>
      )}

      {/* Next Step Button */}
      <button
        type="button"
        onClick={handleNextClick}
        className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
          hasTakenScreenshot
            ? 'bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white shadow-[#d4af37]/25 active:scale-[0.99]'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
        }`}
        id="btn-code-next-step"
      >
        <span>التالي: التعرّف على التطبيق</span>
        <ArrowRight size={16} className="rotate-180 shrink-0" />
      </button>
    </div>
  );
}
