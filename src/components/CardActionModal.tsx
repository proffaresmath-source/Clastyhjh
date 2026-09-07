import { useState, useRef, ChangeEvent } from 'react';
import {
  X,
  CheckCircle,
  CreditCard,
  Copy,
  Check,
  Upload,
  User as UserIcon,
  Phone,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { DynamicRowCard, User } from '../types';

interface CardActionModalProps {
  card: DynamicRowCard | null;
  onClose: () => void;
  user: User;
}

export default function CardActionModal({ card, onClose, user }: CardActionModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'payment'>('details');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentNote, setStudentNote] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!card) return null;

  const isVideo = card.mediaType === 'video' && !!card.videoUrl;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReceiptUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReceiptFile(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmOrder = () => {
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150 select-text"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#d4af37]/40 text-right animate-in zoom-in-95 duration-150 my-auto">
        {/* Media Player Area (Video or Image) */}
        {/* عندما يرفع فيديو يشتغل تلقائياً ومستمر بدون صوت ولا يستطيع توقيفه أو تقديمه أو تأخيره */}
        <div className="relative aspect-[16/9] w-full bg-neutral-950 overflow-hidden select-none">
          {isVideo ? (
            <video
              src={card.videoUrl}
              className="w-full h-full object-contain bg-black pointer-events-none select-none"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
            />
          ) : (
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover opacity-95 pointer-events-none"
            />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
            title="إغلاق"
          >
            <X size={17} />
          </button>

          {/* Subject badge if present */}
          {card.subject && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-neutral-900/90 text-[#d4af37] border border-[#d4af37]/40 text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                {card.subject}
              </span>
            </div>
          )}

          {/* Price Tag if provided by publisher */}
          {card.price && (
            <div className="absolute bottom-3 right-3 bg-black/85 text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-xs">
              السعر: {card.price}
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs: [تفاصيل الدورة] | [صفحة الدفع] */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 pt-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 text-xs sm:text-[13px] font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-[#d4af37] text-neutral-950 font-black'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'details' ? 'text-[#b8860b]' : ''} />
            <span>تفاصيل ومحتوى الدورة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`pb-2.5 px-3 text-xs sm:text-[13px] font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payment'
                ? 'border-[#d4af37] text-neutral-950 font-black'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <CreditCard size={14} className={activeTab === 'payment' ? 'text-[#b8860b]' : ''} />
            <span>صفحة الدفع والاشتراك</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[55vh] overflow-y-auto">
          {/* TAB 1: DETAILS (Strictly real data input by the user) */}
          {activeTab === 'details' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                )}
              </div>

              {card.teacherName && (
                <div className="p-2.5 bg-[#faf7ee] rounded-xl border border-[#ebdcb3] flex items-center justify-between text-xs">
                  <span className="text-neutral-500">الأستاذ المشرف:</span>
                  <strong className="text-neutral-900 font-bold flex items-center gap-1">
                    <UserIcon size={13} className="text-[#b8860b]" />
                    <span>{card.teacherName}</span>
                  </strong>
                </div>
              )}

              {/* Real Course Details & Syllabus written by Publisher */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <FileText size={14} className="text-[#b8860b]" />
                  <span>محتوى ومنهاج الدورة:</span>
                </span>
                {card.details ? (
                  <div className="text-xs text-neutral-700 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 leading-relaxed whitespace-pre-wrap">
                    {card.details}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200 text-xs text-neutral-400">
                    لم يقم الناشر بإضافة وصف إضافي لهذه الدورة بعد.
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('payment')}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CreditCard size={15} />
                  <span>
                    الانتقال لصفحة الدفع والاشتراك
                    {card.price ? ` (${card.price})` : ''}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT & REGISTRATION (Strictly real data input by the user) */}
          {activeTab === 'payment' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {isSubmitted ? (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2.5 animate-in zoom-in-95 duration-150">
                  <CheckCircle size={30} className="mx-auto text-emerald-600" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    تم إرسال طلب الاشتراك في {card.title}!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    شكراً لك، عزيزي التلميذ <strong>{user.name}</strong>. تم تسجيل طلبك وإرفاق بيانات الدفع بنجاح. سيتم تفعيل حسابك مباشرة بعد مراجعة الوصل من الإدارة.
                  </p>
                  <div className="bg-white/90 p-2 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-900 mt-1 inline-block px-4">
                    كود التلميذ: {user.accountCode || 'CZ-STUDENT'}
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Course and Price Summary */}
                  <div className="bg-[#faf8f2] p-3 rounded-2xl border border-[#ebdcb3] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">الدورة:</span>
                      <strong className="text-xs text-neutral-900 font-bold">{card.title}</strong>
                    </div>
                    {card.price && (
                      <div className="text-left">
                        <span className="text-[10px] text-neutral-500 block">سعر الدورة:</span>
                        <strong className="text-xs text-[#b8860b] font-bold">{card.price}</strong>
                      </div>
                    )}
                  </div>

                  {/* Payment Details written by Publisher */}
                  {card.paymentDetails && (
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-neutral-800 block">
                        تعليمات ومعلومات الدفع:
                      </span>
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-neutral-800 leading-relaxed whitespace-pre-wrap">
                        {card.paymentDetails}
                      </div>
                    </div>
                  )}

                  {/* Accounts added by publisher (BaridiMob / CCP / Phone) */}
                  {(card.baridimobRip || card.ccpAccount || card.contactPhone) && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-neutral-800 block">
                        بيانات الحسابات المعتمدة للدفع:
                      </span>

                      {/* BaridiMob RIP if set by publisher */}
                      {card.baridimobRip && (
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-neutral-500 block">رقم بريدي موب (BaridiMob RIP):</span>
                            <code className="font-mono font-bold text-neutral-900 text-xs">
                              {card.baridimobRip}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(card.baridimobRip!, 'rip')}
                            className="p-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="نسخ الرقم"
                          >
                            {copiedField === 'rip' ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                            <span>{copiedField === 'rip' ? 'تم النسخ' : 'نسخ'}</span>
                          </button>
                        </div>
                      )}

                      {/* CCP Account if set by publisher */}
                      {card.ccpAccount && (
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-neutral-500 block">رقم حساب بريد الجزائر (CCP):</span>
                            <code className="font-mono font-bold text-neutral-900 text-xs">
                              {card.ccpAccount}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(card.ccpAccount!, 'ccp')}
                            className="p-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                            title="نسخ الرقم"
                          >
                            {copiedField === 'ccp' ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                            <span>{copiedField === 'ccp' ? 'تم النسخ' : 'نسخ'}</span>
                          </button>
                        </div>
                      )}

                      {/* Contact Phone if set by publisher */}
                      {card.contactPhone && (
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-[#b8860b]" />
                            <div>
                              <span className="text-[10px] text-neutral-500 block">هاتف الاستفسار وتأكيد الدفع:</span>
                              <span className="font-bold text-neutral-900 text-xs">{card.contactPhone}</span>
                            </div>
                          </div>
                          <a
                            href={`tel:${card.contactPhone}`}
                            className="text-[10px] text-amber-700 font-bold hover:underline"
                          >
                            اتصال
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If publisher didn't provide any accounts or instructions */}
                  {!card.paymentDetails && !card.baridimobRip && !card.ccpAccount && !card.contactPhone && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0 text-amber-600" />
                      <span>
                        لم يقم الناشر بإضافة أرقام حسابات الدفع بعد. يمكنك الضغط على تأكيد التسجيل وسيتم التواصل معك مباشرة.
                      </span>
                    </div>
                  )}

                  {/* Receipt Upload Section */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-neutral-800 block">
                      إرفاق وصل الدفع (اختياري):
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleReceiptUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-300 hover:border-[#d4af37] rounded-xl p-3 text-center cursor-pointer bg-neutral-50/60 hover:bg-neutral-50 transition"
                    >
                      {receiptFile ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-bold">
                          <Check size={14} />
                          <span>تم إرفاق صورة الوصل بنجاح</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-xs text-neutral-600">
                          <Upload size={14} className="text-[#b8860b]" />
                          <span>اضغط هنا لرفع صورة وصل التحويل من جهازك</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student note */}
                  <div>
                    <label className="text-[11px] text-neutral-600 block mb-1">
                      ملاحظة أو استفسار إضافي (اختياري):
                    </label>
                    <input
                      type="text"
                      value={studentNote}
                      onChange={(e) => setStudentNote(e.target.value)}
                      placeholder="أي ملاحظة تود إرسالها مع الطلب..."
                      className="w-full text-xs p-2 rounded-xl border border-neutral-300 outline-none bg-neutral-50"
                    />
                  </div>

                  {/* Confirm Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <CheckCircle size={15} />
                      <span>تأكيد إرسال طلب الاشتراك</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
