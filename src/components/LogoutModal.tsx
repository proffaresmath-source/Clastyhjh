import { Language, User } from '../types';

interface LogoutModalProps {
  isOpen: boolean;
  user: User;
  lang: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ isOpen, user, lang, onConfirm, onCancel }: LogoutModalProps) {
  if (!isOpen) return null;

  const isArabic = lang === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-150"
      id="logout-modal-backdrop"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden text-center divide-y divide-neutral-200 border border-neutral-100 animate-in zoom-in-95 duration-150"
        id="logout-modal-content"
        onClick={(e) => e.stopPropagation()}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div className="py-6 px-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden border border-neutral-200 shadow-sm">
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            {isArabic ? 'تسجيل الخروج؟' : 'Log out of your account?'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
            {isArabic
              ? `هل أنت متأكد من رغبتك في تسجيل الخروج من @${user.username} على Clasty Zoom؟`
              : `Are you sure you want to log out of @${user.username} on Clasty Zoom?`}
          </p>
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-3.5 text-sm font-bold text-[#ed4956] hover:bg-rose-50 transition active:bg-rose-100"
          id="btn-confirm-logout"
        >
          {isArabic ? 'تسجيل الخروج' : 'Log Out'}
        </button>

        <button
          onClick={onCancel}
          className="w-full py-3.5 text-sm font-normal text-neutral-700 hover:bg-neutral-50 transition"
          id="btn-cancel-logout"
        >
          {isArabic ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}
