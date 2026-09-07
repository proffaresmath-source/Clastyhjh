import { useState, FormEvent } from 'react';
import { Gift, Copy, Check, Users, Wallet, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { ReferralConfig, User } from '../../types';

interface ReferralEarnWidgetProps {
  config: ReferralConfig;
  user: User;
  onOpenManage?: () => void;
}

export default function ReferralEarnWidget({ config, user, onOpenManage }: ReferralEarnWidgetProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Mock balance in localStorage or default
  const referralCode = user.accountCode || `BAC-${user.username.slice(0, 4).toUpperCase() || '77'}`;
  const inviteLink = `https://bac-dz.app/register?ref=${referralCode}`;

  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(`referral_balance_${user.id}`);
    return saved ? parseInt(saved, 10) : 600; // start with 600 DA
  });

  const [invitedCount, setInvitedCount] = useState<number>(() => {
    const saved = localStorage.getItem(`referral_count_${user.id}`);
    return saved ? parseInt(saved, 10) : 3;
  });

  const [withdrawMethod, setWithdrawMethod] = useState<'baridimob' | 'ccp'>('baridimob');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(config.minWithdrawal || 1000);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRequestWithdraw = (e: FormEvent) => {
    e.preventDefault();
    if (balance < withdrawAmount) {
      alert(`رصيدك الحالي (${balance} دج) أقل من المبلغ المطلوب سحبه (${withdrawAmount} دج).`);
      return;
    }
    if (!withdrawAccount.trim()) {
      alert('يرجى إدخال رقم حساب بريدي موب RIP أو CCP.');
      return;
    }

    const newBalance = balance - withdrawAmount;
    setBalance(newBalance);
    localStorage.setItem(`referral_balance_${user.id}`, String(newBalance));
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 2200);
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8dfc8] shadow-none text-right space-y-4 select-none"
      id="referral-earn-widget"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center border border-amber-200">
            <Gift size={18} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
              {config.title || 'اربح المال من دعوة أصدقائك للدراسة'}
            </h3>
            <p className="text-[10px] text-neutral-500">
              احصل على <b className="text-[#b8860b]">{config.rewardPerFriend} دج</b> عن كل تلميذ ينضم للمنصة
            </p>
          </div>
        </div>
      </div>

      {/* Referral Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/80 text-center shadow-none">
          <div className="flex items-center justify-center gap-1 text-[#b8860b] mb-1">
            <Wallet size={14} />
            <span className="text-[10px] font-bold">رصيدك القابل للسحب</span>
          </div>
          <div className="text-base sm:text-xl font-black text-neutral-900 font-mono">
            {balance.toLocaleString()} <span className="text-xs font-bold text-neutral-500">دج</span>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-200 text-center shadow-none">
          <div className="flex items-center justify-center gap-1 text-neutral-600 mb-1">
            <Users size={14} />
            <span className="text-[10px] font-bold">التلاميذ المدعوون</span>
          </div>
          <div className="text-base sm:text-xl font-black text-neutral-900 font-mono">
            {invitedCount} <span className="text-xs font-bold text-neutral-500">أصدقاء</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-neutral-50 rounded-2xl p-3 border border-neutral-200 text-center flex flex-col justify-center shadow-none">
          <span className="text-[10px] font-bold text-neutral-500 mb-0.5">مكافأة كل صديق</span>
          <span className="text-sm sm:text-base font-black text-[#b8860b] font-mono">
            +{config.rewardPerFriend} دج
          </span>
        </div>
      </div>

      {/* Code and Link Sharing */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div className="truncate text-left flex-1" dir="ltr">
            <span className="text-[11px] font-mono text-neutral-700 select-all">{inviteLink}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0 shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none"
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">كود الإحالة الخاص بك:</span>
            <span className="text-xs font-mono font-black text-[#b8860b] bg-white px-2 py-0.5 rounded-lg border border-amber-200">
              {referralCode}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-lg text-[11px] font-medium flex items-center gap-1 transition cursor-pointer shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none"
          >
            {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
          </button>
        </div>
      </div>

      {/* Withdraw Trigger Button */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <p className="text-[11px] text-neutral-500 leading-snug max-w-xs">
          {config.instructions || 'اسحب أرباحك مباشرة إلى حساب بريدي موب بمجرد وصولك للحد الأدنى.'}
        </p>
        <button
          type="button"
          onClick={() => setIsWithdrawModalOpen(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none"
        >
          <ArrowUpRight size={14} />
          <span>طلب السحب</span>
        </button>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 border border-neutral-200 shadow-xl space-y-4 text-right animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <Wallet size={16} className="text-[#b8860b]" />
                <span>طلب سحب أرباح الإحالة</span>
              </h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="text-sm font-bold text-neutral-900">تم تسجيل طلب السحب بنجاح!</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  سيتم معالجة الطلب وتحويل المبلغ لحسابك خلال أقل من 24 ساعة.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestWithdraw} className="space-y-3">
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-neutral-700 flex justify-between items-center">
                  <span>الرصيد المتوفر:</span>
                  <span className="font-bold text-neutral-900 font-mono">{balance} دج</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">طريقة الاستلام</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('baridimob')}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        withdrawMethod === 'baridimob'
                          ? 'bg-[#faf0d0] border-[#d4af37] text-[#996515]'
                          : 'bg-white border-neutral-200 text-neutral-600'
                      }`}
                    >
                      بريدي موب (BaridiMob RIP)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('ccp')}
                      className={`p-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        withdrawMethod === 'ccp'
                          ? 'bg-[#faf0d0] border-[#d4af37] text-[#996515]'
                          : 'bg-white border-neutral-200 text-neutral-600'
                      }`}
                    >
                      حساب بريد الجزائر (CCP)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {withdrawMethod === 'baridimob' ? 'رقم الـ RIP (20 رقماً)' : 'رقم حساب الـ CCP والمفتاح'}
                  </label>
                  <input
                    type="text"
                    required
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    placeholder={withdrawMethod === 'baridimob' ? '00799999000000000000' : '12345678 مفتاح 99'}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">المبلغ المراد سحبه (دج)</label>
                  <input
                    type="number"
                    required
                    min={config.minWithdrawal || 500}
                    max={balance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
                    dir="ltr"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    الحد الأدنى للسحب: {config.minWithdrawal || 1000} دج
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={balance < (config.minWithdrawal || 1000)}
                    className="w-full py-2.5 bg-[#d4af37] hover:bg-[#b8860b] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    تأكيد وإرسال طلب السحب
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
