import { User, Language } from '../types';

interface SavedAccountLoginProps {
  user: User;
  lang: Language;
  onLoginAsSaved: () => void;
  onSwitchAccounts: () => void;
  onRemoveAccount: () => void;
}

export default function SavedAccountLogin({
  user,
  lang,
  onLoginAsSaved,
  onSwitchAccounts,
  onRemoveAccount,
}: SavedAccountLoginProps) {
  const isArabic = lang === 'ar';

  return (
    <div className="w-full max-w-[350px] mx-auto text-center" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="bg-white border border-[#dbdbdb] rounded-sm px-10 py-8 mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Vintage Instagram cursive logo */}
        <h1
          className="font-vintage-insta text-5xl md:text-6xl text-[#262626] select-none tracking-normal py-3"
          style={{ letterSpacing: '0.02em' }}
        >
          clasty zoom
        </h1>

        {/* User avatar & info */}
        <div className="my-6 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5]">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="text-sm font-semibold text-neutral-800">@{user.username}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{user.name}</p>
        </div>

        {/* Continue as user button */}
        <button
          onClick={onLoginAsSaved}
          className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold py-2 rounded transition active:scale-[0.99] shadow-sm mb-3"
          id="btn-continue-saved-user"
        >
          {isArabic ? `متابعة كـ ${user.username}` : `Continue as ${user.username}`}
        </button>

        {/* Switch accounts */}
        <div className="text-xs flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onSwitchAccounts}
            className="text-[#0095f6] font-semibold hover:text-[#00376b] transition"
            id="btn-switch-account"
          >
            {isArabic ? 'تبديل الحسابات' : 'Switch accounts'}
          </button>
          <span className="text-neutral-300">•</span>
          <button
            onClick={onRemoveAccount}
            className="text-neutral-500 hover:text-rose-600 transition"
            id="btn-remove-account"
          >
            {isArabic ? 'إزالة الحساب' : 'Remove account'}
          </button>
        </div>
      </div>

      {/* Switch to sign up card */}
      <div className="bg-white border border-[#dbdbdb] rounded-sm py-5 px-6 text-center text-xs text-neutral-700">
        <span>{isArabic ? 'ليس حسابك؟ ' : 'Not your account? '}</span>
        <button
          onClick={onSwitchAccounts}
          className="text-[#0095f6] font-semibold hover:underline"
          id="btn-login-with-another"
        >
          {isArabic ? 'تسجيل الدخول بحساب آخر' : 'Log into another account'}
        </button>
      </div>
    </div>
  );
}
