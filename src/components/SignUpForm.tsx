import { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';

interface SignUpFormProps {
  onSignUp: (username: string, name: string) => void;
  onGoToLogin: () => void;
  lang: Language;
}

export default function SignUpForm({ onSignUp, onGoToLogin, lang }: SignUpFormProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isArabic = lang === 'ar';
  const isFormValid =
    emailOrPhone.trim().length > 3 &&
    fullName.trim().length > 1 &&
    username.trim().length > 2 &&
    password.length >= 6;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignUp(username.trim(), fullName.trim());
    }, 700);
  };

  return (
    <div className="w-full max-w-[350px] mx-auto text-center" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Main Signup Box */}
      <div className="bg-white border border-[#dbdbdb] rounded-sm px-10 pt-7 pb-6 mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Vintage Instagram Cursive Script Logo */}
        <h1
          className="font-vintage-insta text-5xl md:text-6xl text-[#262626] select-none tracking-normal mb-2"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          clasty zoom
        </h1>

        <p className="text-xs font-semibold text-[#737373] mb-4 leading-normal">
          {isArabic
            ? 'اشترك لمشاهدة الصور ومقاطع الفيديو من أصدقائك وذكرياتك العتيقة.'
            : 'Sign up to see photos and videos from your friends and vintage memories.'}
        </p>

        {/* Facebook Signup Button */}
        <button
          type="button"
          onClick={() => onSignUp('fb_user', 'Facebook User')}
          className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold py-2 rounded flex items-center justify-center gap-2 mb-3 shadow-xs transition"
          id="btn-signup-facebook"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>{isArabic ? 'تسجيل الدخول بحساب فيسبوك' : 'Log in with Facebook'}</span>
        </button>

        {/* OR Divider */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#dbdbdb]" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="bg-white px-3 text-[#737373] font-semibold">
              {isArabic ? 'أو' : 'OR'}
            </span>
          </div>
        </div>

        {/* Sign up form */}
        <form onSubmit={handleSubmit} className="space-y-2 text-left rtl:text-right">
          <input
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder={
              isArabic ? 'رقم الهاتف المحمول أو البريد الإلكتروني' : 'Mobile Number or Email'
            }
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2.5 py-2 text-xs text-[#262626] focus:outline-none focus:border-[#a8a8a8] focus:bg-white transition"
            required
            id="input-signup-email"
          />

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isArabic ? 'الاسم بالكامل' : 'Full Name'}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2.5 py-2 text-xs text-[#262626] focus:outline-none focus:border-[#a8a8a8] focus:bg-white transition"
            required
            id="input-signup-fullname"
          />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
            placeholder={isArabic ? 'اسم المستخدم' : 'Username'}
            className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2.5 py-2 text-xs text-[#262626] focus:outline-none focus:border-[#a8a8a8] focus:bg-white transition"
            required
            id="input-signup-username"
          />

          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isArabic ? 'كلمة السر' : 'Password'}
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2.5 py-2 text-xs text-[#262626] focus:outline-none focus:border-[#a8a8a8] focus:bg-white transition pr-9 rtl:pr-2.5 rtl:pl-9"
              required
              id="input-signup-password"
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 rtl:right-auto rtl:left-2.5 text-neutral-600 hover:text-neutral-900 transition"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>

          <p className="text-[10px] text-neutral-400 py-1 text-center leading-tight">
            {isArabic
              ? 'بالتسجيل، أنت توافق على الشروط وسياسة الخصوصية وسياسة ملفات تعريف الارتباط الخاصة بـ Clasty Zoom.'
              : 'By signing up, you agree to our Terms, Privacy Policy and Cookies Policy on Clasty Zoom.'}
          </p>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-1.5 mt-1 rounded-[4px] text-xs font-semibold text-white transition ${
              isFormValid && !isLoading
                ? 'bg-[#0095f6] hover:bg-[#1877f2] cursor-pointer shadow-xs'
                : 'bg-[#4cb5f9] opacity-70 cursor-not-allowed'
            }`}
            id="btn-signup-submit"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isArabic ? 'جارٍ إنشاء الحساب...' : 'Creating account...'}</span>
              </div>
            ) : (
              <span>{isArabic ? 'تسجيل' : 'Sign Up'}</span>
            )}
          </button>
        </form>
      </div>

      {/* Switch to Login Box */}
      <div className="bg-white border border-[#dbdbdb] rounded-sm py-4 px-6 mb-4 text-xs text-[#262626]">
        <span>{isArabic ? 'هل لديك حساب بالفعل؟ ' : 'Have an account? '}</span>
        <button
          onClick={onGoToLogin}
          className="text-[#0095f6] font-semibold hover:text-[#00376b] transition"
          id="btn-switch-to-login"
        >
          {isArabic ? 'تسجيل الدخول' : 'Log in'}
        </button>
      </div>
    </div>
  );
}
