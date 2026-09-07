import { useState } from 'react';
import {
  LogOut,
  CheckCircle2,
  GraduationCap,
  MapPin,
  KeyRound,
  Phone,
  Mail,
  BookOpen,
} from 'lucide-react';
import { Language, User as UserType } from '../types';

interface WhiteGoldSessionProps {
  user: UserType;
  lang?: Language;
  onLogout: () => void;
}

export default function WhiteGoldSession({
  user,
  lang = 'ar',
  onLogout,
}: WhiteGoldSessionProps) {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const isArabic = lang === 'ar';

  return (
    <div
      className="w-full max-w-[440px] mx-auto bg-white text-center"
      id="white-gold-session-card"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Central Big Frameless Logo & Vintage Font - Harmoniously Aligned on Vertical Axis passing between y and z */}
      <div className="flex flex-col items-center justify-center text-center mx-auto mb-6 select-none" dir="ltr">
        <div className="flex items-center justify-center mx-auto mb-1">
          <img
            src="/logo.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-vertical.png';
            }}
            alt="Clasty Zoom"
            className="h-44 sm:h-52 w-auto object-contain mx-auto drop-shadow-xs select-none pointer-events-none"
          />
        </div>

        {/* Vintage Instagram Cursive Script with vertical axis passing exactly between y and z */}
        <h1
          className="grid grid-cols-2 items-baseline font-vintage-insta text-5xl sm:text-6xl text-[#1a1a1a] tracking-wide my-1 leading-none select-none w-full max-w-[340px] mx-auto"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          <span className="text-right pr-1 sm:pr-1.5">clasty</span>
          <span className="text-left pl-1 sm:pl-1.5">zoom</span>
        </h1>

        {/* Subtitle in smaller, elegant font */}
        <p className="text-xs sm:text-[13px] font-medium text-[#b8860b] mt-0.5 mb-1 tracking-normal text-center" dir="rtl">
          أول تطبيق دروس دعم في الجزائر
        </p>
      </div>

      {/* Student Profile Card */}
      <div className="bg-[#faf9f5] rounded-2xl p-5 mb-5 text-center">
        <div className="relative inline-block mb-3">
          <div className="w-18 h-18 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f7e7a9] to-[#b8860b] shadow-sm">
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full text-white flex items-center justify-center border-2 border-white shadow-xs">
            <CheckCircle2 size={12} />
          </div>
        </div>

        <h2 className="text-base font-bold text-neutral-900">{user.name}</h2>

        {/* رمز الحساب */}
        <div className="inline-flex items-center gap-1 px-3 py-1 mt-1.5 bg-amber-50 rounded-full border border-amber-200/80 text-[#996515] text-xs font-bold">
          <KeyRound size={13} className="text-[#d4af37]" />
          <span>رمز الحساب:</span>
          <span className="font-mono tracking-wider">{user.accountCode || 'CZ-2026'}</span>
        </div>

        {/* تفاصيل التلميذ */}
        <div className="space-y-2 mt-4 text-xs text-right">
          {/* السنة الدراسية */}
          {user.academicYear && (
            <div className="bg-white rounded-xl p-2.5 shadow-xs flex items-center justify-between border border-[#ecdba8]/40">
              <div className="flex items-center gap-2 text-neutral-700">
                <GraduationCap size={15} className="text-[#b8860b]" />
                <span className="text-neutral-500 text-[11px]">السنة الدراسية:</span>
              </div>
              <span className="font-bold text-neutral-900 text-xs">
                {user.academicYear}
              </span>
            </div>
          )}

          {/* الولاية والبلدية */}
          {(user.wilaya || user.commune) && (
            <div className="bg-white rounded-xl p-2.5 shadow-xs flex items-center justify-between border border-[#ecdba8]/40">
              <div className="flex items-center gap-2 text-neutral-700">
                <MapPin size={15} className="text-[#b8860b]" />
                <span className="text-neutral-500 text-[11px]">الموقع:</span>
              </div>
              <span className="font-bold text-neutral-900 text-xs">
                {user.wilaya} {user.commune ? `- ${user.commune}` : ''}
              </span>
            </div>
          )}

          {/* رقم الهاتف */}
          {user.phone && (
            <div className="bg-white rounded-xl p-2.5 shadow-xs flex items-center justify-between border border-[#ecdba8]/40">
              <div className="flex items-center gap-2 text-neutral-700">
                <Phone size={15} className="text-[#b8860b]" />
                <span className="text-neutral-500 text-[11px]">الهاتف:</span>
              </div>
              <span className="font-bold text-neutral-900 text-xs" dir="ltr">
                {user.phone}
              </span>
            </div>
          )}

          {/* البريد الإلكتروني */}
          {user.email && (
            <div className="bg-white rounded-xl p-2.5 shadow-xs flex items-center justify-between border border-[#ecdba8]/40">
              <div className="flex items-center gap-2 text-neutral-700">
                <Mail size={15} className="text-[#b8860b]" />
                <span className="text-neutral-500 text-[11px]">البريد:</span>
              </div>
              <span className="font-medium text-neutral-800 text-xs" dir="ltr">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Log Out Button */}
      {showConfirmLogout ? (
        <div className="bg-rose-50 rounded-2xl p-4 text-center animate-in fade-in duration-150">
          <p className="text-xs font-bold text-rose-800 mb-3">
            هل أنت متأكد من رغبتك في تسجيل الخروج؟
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              id="btn-confirm-logout"
            >
              <LogOut size={14} />
              <span>نعم، تسجيل خروج</span>
            </button>
            <button
              onClick={() => setShowConfirmLogout(false)}
              className="flex-1 py-2.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              id="btn-cancel-logout"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirmLogout(true)}
          className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          id="btn-trigger-logout"
        >
          <LogOut size={16} />
          <span>تسجيل الخروج من الحساب</span>
        </button>
      )}
    </div>
  );
}
