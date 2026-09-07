import { useState, FormEvent } from 'react';
import { Lock, X, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export default function ForgotPasswordModal({ isOpen, onClose, lang }: ForgotPasswordModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isArabic = lang === 'ar';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      id="forgot-password-modal-backdrop"
    >
      <div
        className="relative w-full max-w-[380px] bg-white rounded-xl shadow-2xl p-6 text-center border border-neutral-200"
        id="forgot-password-card"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 text-neutral-400 hover:text-neutral-700 transition"
          aria-label="Close"
          id="btn-close-modal"
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-neutral-900 flex items-center justify-center">
          <Lock size={36} className="text-neutral-900 stroke-[1.75]" />
        </div>

        <h2 className="text-base font-semibold text-neutral-900 mb-2">
          {isArabic ? 'هل تواجه مشكلة في تسجيل الدخول؟' : 'Trouble logging in?'}
        </h2>

        <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
          {isArabic
            ? 'أدخل بريدك الإلكتروني أو رقم هاتفك أو اسم المستخدم وسنرسل لك رابطاً لاستعادة حسابك على Clasty Zoom.'
            : "Enter your email, phone, or username and we'll send you a link to get back into your Clasty Zoom account."}
        </p>

        {isSent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 text-xs flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>
              {isArabic
                ? 'تم إرسال رابط تسجيل الدخول بنجاح! تفقد بريدك الإلكتروني.'
                : 'Login link sent successfully! Check your inbox.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 mb-4">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                isArabic
                  ? 'البريد الإلكتروني، رقم الهاتف، أو اسم المستخدم'
                  : 'Email, Phone, or Username'
              }
              className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
              required
              id="input-reset-identifier"
            />

            <button
              type="submit"
              disabled={isLoading || !identifier.trim()}
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded transition shadow-sm"
              id="btn-send-login-link"
            >
              {isLoading
                ? isArabic
                  ? 'جارٍ الإرسال...'
                  : 'Sending link...'
                : isArabic
                ? 'إرسال رابط تسجيل الدخول'
                : 'Send login link'}
            </button>
          </form>
        )}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-neutral-400 font-medium">
              {isArabic ? 'أو' : 'OR'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded transition"
          id="btn-back-to-login"
        >
          {isArabic ? 'العودة إلى تسجيل الدخول' : 'Back to login'}
        </button>
      </div>
    </div>
  );
}
