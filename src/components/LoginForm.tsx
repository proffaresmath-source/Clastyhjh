import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface LoginFormProps {
  onLogin: (username: string) => void;
  onGoToSignUp: () => void;
  onOpenForgotPassword: () => void;
  lang: Language;
}

export default function LoginForm({
  onLogin,
  onGoToSignUp,
  onOpenForgotPassword,
  lang,
}: LoginFormProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isArabic = lang === 'ar';
  const isFormFilled = identifier.trim().length > 0 && password.length >= 6;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormFilled) return;

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      onLogin(identifier.trim());
    }, 650);
  };

  const handleQuickDemo = () => {
    setIdentifier('vintage_vibes');
    setPassword('clasty2026!');
    setErrorMessage('');
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin('fb_vintage_user');
    }, 600);
  };

  return (
    <div className="w-full max-w-[350px] mx-auto text-center" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Main Login Box */}
      <div className="bg-white border border-[#dbdbdb] rounded-sm px-10 pt-8 pb-6 mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Vintage Instagram Cursive Script Logo */}
        <div className="mb-6">
          <h1
            className="font-vintage-insta text-5xl md:text-6xl text-[#262626] select-none tracking-normal"
            style={{ textRendering: 'optimizeLegibility' }}
          >
            clasty zoom
          </h1>
          <p className="text-[11px] text-neutral-400 mt-1 tracking-wider uppercase">
            {isArabic ? 'تسجيل الدخول' : 'Sign in'}
          </p>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-medium rounded-full transition shadow-xs"
            id="btn-quick-demo-fill"
          >
            <Sparkles size={13} className="text-amber-600" />
            <span>{isArabic ? 'ملء حساب تجريبي للتجربة' : 'One-click demo credentials'}</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded text-center">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Username / Phone / Email */}
          <div className="relative">
            <input
              type="text"
              aria-label={
                isArabic
                  ? 'رقم الهاتف أو اسم المستخدم أو البريد الإلكتروني'
                  : 'Phone number, username, or email'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                isArabic
                  ? 'رقم الهاتف أو اسم المستخدم أو البريد الإلكتروني'
                  : 'Phone number, username, or email'
              }
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2.5 py-2 text-xs text-[#262626] focus:outline-none focus:border-[#a8a8a8] focus:bg-white transition"
              required
              id="input-login-username"
            />
          </div>

          {/* Password with Show / Hide Toggle */}
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              aria-label={isArabic ? 'كلمة السر' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isArabic ? 'كلمة السر' : 'Password'}
              className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] px-2.5 py-2 text-xs text-[#262626] focus:outline-none focus:border-[#a8a8a8] focus:bg-white transition pr-9 rtl:pr-2.5 rtl:pl-9"
              required
              id="input-login-password"
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 rtl:right-auto rtl:left-2.5 text-neutral-600 hover:text-neutral-900 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormFilled || isLoading}
            className={`w-full py-1.5 mt-2 rounded-[4px] text-xs font-semibold text-white transition ${
              isFormFilled && !isLoading
                ? 'bg-[#0095f6] hover:bg-[#1877f2] cursor-pointer shadow-xs active:opacity-90'
                : 'bg-[#4cb5f9] opacity-70 cursor-not-allowed'
            }`}
            id="btn-login-submit"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isArabic ? 'جارٍ تسجيل الدخول...' : 'Logging in...'}</span>
              </div>
            ) : (
              <span>{isArabic ? 'تسجيل الدخول' : 'Log In'}</span>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#dbdbdb]" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="bg-white px-4 text-[#737373] font-semibold">
              {isArabic ? 'أو' : 'OR'}
            </span>
          </div>
        </div>

        {/* Log in with Facebook */}
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#385185] hover:text-[#1877f2] transition py-1"
          id="btn-login-facebook"
        >
          {/* Authentic Facebook SVG logo */}
          <svg className="w-4 h-4 fill-[#385185]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>{isArabic ? 'تسجيل الدخول بحساب فيسبوك' : 'Log in with Facebook'}</span>
        </button>

        {/* Forgot password */}
        <div className="mt-3">
          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="text-[11px] text-[#00376b] hover:underline"
            id="btn-forgot-password-link"
          >
            {isArabic ? 'هل نسيت كلمة السر؟' : 'Forgot password?'}
          </button>
        </div>
      </div>

      {/* Switch to Sign Up Box */}
      <div className="bg-white border border-[#dbdbdb] rounded-sm py-4 px-6 mb-4 text-xs text-[#262626]">
        <span>{isArabic ? 'ليس لديك حساب؟ ' : "Don't have an account? "}</span>
        <button
          onClick={onGoToSignUp}
          className="text-[#0095f6] font-semibold hover:text-[#00376b] transition"
          id="btn-switch-to-signup"
        >
          {isArabic ? 'تسجيل' : 'Sign up'}
        </button>
      </div>

      {/* App badges */}
      <div className="text-center">
        <p className="text-xs text-[#262626] mb-3">
          {isArabic ? 'احصل على التطبيق.' : 'Get the app.'}
        </p>
        <div className="flex items-center justify-center gap-2">
          {/* Google Play style button */}
          <div className="h-9 px-3 bg-black text-white rounded-md flex items-center gap-2 cursor-pointer hover:opacity-85 transition">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.61-1.428V3.242c0-.55.225-1.05.609-1.428z" />
              <path d="M17.156 8.636l-2.073 2.073 2.073 2.073 2.378-1.348a1.21 1.21 0 0 0 0-2.138l-2.378-1.348z" />
              <path d="M4.646 1.058l10.437 5.922-2.382 2.382L4.646 1.058z" />
              <path d="M12.701 14.638l2.382 2.382-10.437 5.922 8.055-8.304z" />
            </svg>
            <div className="text-left text-[9px] leading-tight">
              <div className="text-[8px] text-white/70">GET IT ON</div>
              <div className="font-semibold">Google Play</div>
            </div>
          </div>

          {/* App Store style button */}
          <div className="h-9 px-3 bg-black text-white rounded-md flex items-center gap-2 cursor-pointer hover:opacity-85 transition">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-.99 1.74-.86 2.76 1.01.08 1.97-.51 2.59-1.26z" />
            </svg>
            <div className="text-left text-[9px] leading-tight">
              <div className="text-[8px] text-white/70">Download on the</div>
              <div className="font-semibold">App Store</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
