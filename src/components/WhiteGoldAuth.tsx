import { useState, useEffect, FormEvent } from 'react';
import {
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types';
import { ALGERIA_WILAYAS, ACADEMIC_GROUPS, ACADEMIC_YEARS } from '../data/algeriaData';
import { triggerGoldenLoader } from './GoldenTubeLoader';
import {
  isEmailAlreadyUsed,
  isPhoneAlreadyUsed,
  generateSixDigitAccountCode,
  saveNewUser,
  findUserByAccountCode,
  findUserByEmail,
  findUserByIdentifier,
  getOrCreateDeviceId,
} from '../utils/userStore';

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  academicYear: string;
  wilaya: string;
  commune: string;
  accountCode: string;
  password?: string;
}

interface WhiteGoldAuthProps {
  onLoginSubmit: (emailOrCode: string) => void;
  onSignUpSubmit: (userData: SignUpData) => void;
  lang?: Language;
}

export default function WhiteGoldAuth({
  onLoginSubmit,
  onSignUpSubmit,
}: WhiteGoldAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Errors & Status
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const trimmedInput = loginEmail.trim();
    if (!trimmedInput || !loginPassword) return;

    const user = findUserByIdentifier(trimmedInput) || findUserByEmail(trimmedInput);
    if (user) {
      if (user.password && user.password !== loginPassword) {
        setLoginError('كلمة المرور غير صحيحة، يرجى إعادة المحاولة.');
        return;
      }
      onLoginSubmit(user.email);
    } else {
      // If it looks like a valid email, allow login or register in session
      if (trimmedInput.includes('@')) {
        onLoginSubmit(trimmedInput);
      } else {
        setLoginError('يرجى إدخال بريد إلكتروني صحيح');
      }
    }
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    // 1. Password validation: at least 6 characters (letters, numbers, symbols)
    if (!signUpPassword || signUpPassword.length < 6) {
      setSignUpError('كلمة المرور يجب أن تتكون من 6 أحرف أو أرقام أو رموز على الأقل.');
      return;
    }

    // 3. Email validation
    const cleanEmail = signUpEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setSignUpError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }

    if (isEmailAlreadyUsed(cleanEmail)) {
      setSignUpError('هذا البريد الإلكتروني مستعمل مسبقاً، يرجى استخدام بريد آخر.');
      return;
    }

    // 4. Phone validation
    const cleanPhone = signUpPhone.trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      setSignUpError('يرجى إدخال رقم هاتف جزائري صحيح.');
      return;
    }

    if (isPhoneAlreadyUsed(cleanPhone)) {
      setSignUpError('رقم الهاتف هذا مستعمل مسبقاً، يرجى استخدام رقم آخر.');
      return;
    }

    // 5. Name validation
    if (!firstName.trim() || !lastName.trim()) {
      setSignUpError('يرجى إدخال الاسم واللقب.');
      return;
    }

    // Generate unique 6-digit code: CZ-XXXXXX
    const generatedCode = generateSixDigitAccountCode();

    const newUserData: SignUpData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      academicYear: academicYear || ACADEMIC_YEARS[0],
      wilaya: wilaya || ALGERIA_WILAYAS[15],
      commune: commune.trim() || 'البلدية المركزية',
      accountCode: generatedCode,
      password: signUpPassword,
    };

    // Save user & bind to this device ID
    saveNewUser({
      id: `u_${Date.now()}`,
      accountCode: generatedCode,
      password: signUpPassword,
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      email: newUserData.email,
      phone: newUserData.phone,
      academicYear: newUserData.academicYear,
      wilaya: newUserData.wilaya,
      commune: newUserData.commune,
      registeredAt: new Date().toISOString(),
      deviceId: getOrCreateDeviceId(),
    });

    onSignUpSubmit(newUserData);
  };

  return (
    <div
      className="w-full max-w-[420px] mx-auto bg-white pt-2 pb-6 px-3 sm:px-4 select-text"
      id="white-gold-auth-card"
      dir="rtl"
    >
      {/* 
        Clean, Uncluttered Top Section (Header/App Bar):
        Free of distractions, containing only the brand logo and name
      */}
      <header className="flex flex-col items-center justify-center text-center mx-auto mb-6 select-none" dir="ltr">
        {/* Subtle, Balanced Feather Logo */}
        <div className="flex items-center justify-center mx-auto mb-1">
          <img
            src="/logo.png"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-vertical.png';
            }}
            alt="Clasty Zoom"
            className="h-16 sm:h-20 w-auto object-contain mx-auto select-none pointer-events-none transition-all duration-300"
          />
        </div>

        {/* Vintage Instagram Cursive Script */}
        <h1
          className="grid grid-cols-2 items-baseline font-vintage-insta text-4xl sm:text-5xl text-[#1a1a1a] tracking-wide my-0.5 leading-none select-none w-full max-w-[290px] mx-auto"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          <span className="text-right pr-1">clasty</span>
          <span className="text-left pl-1">zoom</span>
        </h1>

        {/* Smaller, Refined Subtitle that does not overpower the app name */}
        <p
          className="text-[9px] sm:text-[9.5px] font-normal text-[#9e741a] mt-0.5 tracking-wider text-center h-[40px] w-[134px] mx-auto flex items-center justify-center"
          dir="rtl"
        >
          أول منصة دروس دعم في الجزائر
        </p>
      </header>

      {/* Tabs: Login & Sign Up - Instant switching with tactile feedback */}
      <div className="grid grid-cols-2 gap-2 mb-5 p-1.5 bg-[#fbf9f4] rounded-xl border border-[#ecdba8]/70 shadow-xs">
        <button
          type="button"
          onClick={() => {
            triggerGoldenLoader();
            setActiveTab('login');
            setSignUpError(null);
            setLoginError(null);
          }}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-colors duration-100 cursor-pointer ${
            activeTab === 'login'
              ? 'bg-gradient-to-r from-[#cf9b16] to-[#a77405] text-white shadow-xs'
              : 'text-neutral-700 hover:text-neutral-900 hover:bg-[#f3ede0] font-semibold'
          }`}
          id="btn-tab-login"
        >
          تسجيل الدخول
        </button>

        <button
          type="button"
          onClick={() => {
            triggerGoldenLoader();
            setActiveTab('signup');
            setSignUpError(null);
            setLoginError(null);
          }}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-colors duration-100 cursor-pointer ${
            activeTab === 'signup'
              ? 'bg-gradient-to-r from-[#cf9b16] to-[#a77405] text-white shadow-xs'
              : 'text-neutral-700 hover:text-neutral-900 hover:bg-[#f3ede0] font-semibold'
          }`}
          id="btn-tab-signup"
        >
          إنشاء حساب جديد
        </button>
      </div>

      {/* ================= LOGIN FORM (Pre-mounted for instant 0ms switching) ================= */}
      <form
        onSubmit={handleLogin}
        className={`space-y-4 ${activeTab === 'login' ? 'block' : 'hidden'}`}
        id="form-login"
      >
        {loginError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-rose-600" />
            <span>{loginError}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-neutral-800 mb-1.5">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
            required
            id="input-login-email"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-800 mb-1.5">
            كلمة المرور
          </label>
          <div className="relative flex items-center">
            <input
              type={showLoginPassword ? 'text' : 'password'}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3.5 pl-11 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
              required
              id="input-login-password"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              className="absolute left-2.5 text-neutral-500 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
              aria-label="تبديل إظهار كلمة المرور"
            >
              {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!loginEmail.trim() || !loginPassword}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold shadow-md shadow-[#d4af37]/20 transition active:scale-[0.99] disabled:opacity-50 disabled:shadow-none cursor-pointer"
            id="btn-submit-login"
          >
            تسجيل الدخول
          </button>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-neutral-500">ليس لديك حساب بعد؟ </span>
          <button
            type="button"
            onClick={() => {
              triggerGoldenLoader();
              setActiveTab('signup');
            }}
            className="text-xs font-bold text-[#a77405] hover:text-[#8b6508] underline underline-offset-2 cursor-pointer transition"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </form>

      {/* ================= SIGN UP FORM (Pre-mounted for instant 0ms switching) ================= */}
      <form
        onSubmit={handleSignUp}
        className={`space-y-3.5 ${activeTab === 'signup' ? 'block' : 'hidden'}`}
        id="form-signup"
      >
          {signUpError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600 mt-0.5" />
              <span>{signUpError}</span>
            </div>
          )}

          {/* Name & Surname */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                الاسم
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="الاسم"
                className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
                required
                id="input-signup-firstname"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                اللقب
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="اللقب"
                className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
                required
                id="input-signup-lastname"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
              required
              id="input-signup-email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={signUpPhone}
              onChange={(e) => setSignUpPhone(e.target.value)}
              placeholder="05 / 06 / 07 XX XX XX XX"
              className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 text-right transition shadow-xs"
              dir="ltr"
              required
              id="input-signup-phone"
            />
          </div>

          {/* Academic Level */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              السنة الدراسية والشعبة
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3.5 text-xs text-neutral-900 outline-none cursor-pointer transition shadow-xs"
              required
              id="select-signup-academic-year"
            >
              <option value="" disabled>
                -- اختر المستوى والشعبة --
              </option>
              {ACADEMIC_GROUPS.map((group) => (
                <optgroup key={group.category} label={group.category} className="font-bold text-neutral-800">
                  {group.levels.map((level) => (
                    <option key={level} value={level} className="font-normal text-neutral-700">
                      {level}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Wilaya & Commune */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                الولاية
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-2.5 text-xs text-neutral-900 outline-none cursor-pointer transition shadow-xs"
                required
                id="select-signup-wilaya"
              >
                <option value="" disabled>
                  -- الولاية --
                </option>
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                البلدية
              </label>
              <input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="البلدية"
                className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-2.5 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
                required
                id="input-signup-commune"
              />
            </div>
          </div>

          {/* Password: 6 chars min with high contrast validation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800">
                كلمة المرور
              </label>
              <span className={`text-[11px] ${signUpPassword.length >= 6 ? 'text-emerald-700 font-bold' : 'text-neutral-500'}`}>
                {signUpPassword.length >= 6 ? '✓ 6 رموز مقبولة' : '6 خانات على الأقل'}
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type={showSignUpPassword ? 'text' : 'password'}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="كلمة المرور (6 خانات على الأقل)"
                minLength={6}
                className="w-full bg-white border border-[#d4af37]/60 focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/25 rounded-xl py-2.5 px-3.5 pl-11 text-xs text-neutral-900 outline-none placeholder:text-neutral-500 transition shadow-xs"
                required
                id="input-signup-password"
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="absolute left-2.5 text-neutral-500 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition cursor-pointer"
                aria-label="تبديل إظهار كلمة المرور"
              >
                {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={
                !firstName.trim() ||
                !lastName.trim() ||
                !signUpPhone.trim() ||
                signUpPassword.length < 6
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold shadow-md shadow-[#d4af37]/20 transition active:scale-[0.99] disabled:opacity-50 disabled:shadow-none cursor-pointer"
              id="btn-submit-signup"
            >
              إنشاء الحساب
            </button>
          </div>
        </form>
    </div>
  );
}
