import { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  ArrowRight,
  Plus,
  Trash2,
  Upload,
  Save,
  Layers,
  Check,
  Edit3,
  FolderPlus,
  FilePlus,
  SlidersHorizontal,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
} from 'lucide-react';
import { DynamicRow, DynamicRowCard } from '../types';

interface AdminDynamicRowsPageProps {
  rows: DynamicRow[];
  onSaveRows: (updatedRows: DynamicRow[]) => void;
  onBackToHome: () => void;
}

type AdminPageTab = 'publish_card' | 'manage_shelves' | 'manage_cards';

export default function AdminDynamicRowsPage({
  rows,
  onSaveRows,
  onBackToHome,
}: AdminDynamicRowsPageProps) {
  const [localRows, setLocalRows] = useState<DynamicRow[]>(() =>
    JSON.parse(JSON.stringify(rows))
  );

  useEffect(() => {
    setLocalRows(JSON.parse(JSON.stringify(rows)));
  }, [rows]);

  // Tab: نشر قالب جديد | إدارة الرفوف | إدارة القوالب
  const [activeTab, setActiveTab] = useState<AdminPageTab>(
    rows.length === 0 ? 'manage_shelves' : 'publish_card'
  );

  // ================= Form State: Add / Publish Card =================
  const [targetShelfId, setTargetShelfId] = useState<string>(rows[0]?.id || '');
  const [cardTitle, setCardTitle] = useState('');
  const [cardSubject, setCardSubject] = useState('');
  const [cardPrice, setCardPrice] = useState('');
  const [cardTeacherName, setCardTeacherName] = useState('');
  const [cardMediaType, setCardMediaType] = useState<'image' | 'video'>('image');
  const [cardImageUrl, setCardImageUrl] = useState(
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80'
  );
  const [cardVideoUrl, setCardVideoUrl] = useState('');
  const [cardActionText, setCardActionText] = useState('تفاصيل الدورة');
  const [cardDetails, setCardDetails] = useState('');
  const [cardPaymentDetails, setCardPaymentDetails] = useState('');
  const [cardBaridimobRip, setCardBaridimobRip] = useState('');
  const [cardCcpAccount, setCardCcpAccount] = useState('');
  const [cardContactPhone, setCardContactPhone] = useState('');
  const [cardPosition, setCardPosition] = useState<'end' | 'start'>('end');

  // ================= Form State: Add Shelf =================
  const [shelfTitle, setShelfTitle] = useState('');
  const [shelfPosition, setShelfPosition] = useState<'end' | 'start'>('end');

  // ================= In-Page Confirmation State for Deletion =================
  const [pendingDelete, setPendingDelete] = useState<{
    type: 'shelf' | 'card' | 'all';
    shelfId?: string;
    cardId?: string;
    name: string;
  } | null>(null);

  // ================= Editing State for existing cards =================
  const [editingCard, setEditingCard] = useState<{
    shelfId: string;
    card: DynamicRowCard;
  } | null>(null);

  // File upload refs
  const fileImageInputRef = useRef<HTMLInputElement>(null);
  const fileVideoInputRef = useRef<HTMLInputElement>(null);
  const [uploadContext, setUploadContext] = useState<'new_card' | 'edit_card'>('new_card');

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const commitRows = (updated: DynamicRow[]) => {
    setLocalRows(updated);
    onSaveRows(updated);
  };

  // Quick inline shelf creation
  const [quickShelfInput, setQuickShelfInput] = useState('');
  const [isQuickShelfOpen, setIsQuickShelfOpen] = useState(false);

  const handleCreateQuickShelf = () => {
    if (!quickShelfInput.trim()) return;
    const newShelfId = `shelf_${Date.now()}`;
    const newShelf: DynamicRow = {
      id: newShelfId,
      title: quickShelfInput.trim(),
      cards: [],
    };
    const updated = [...localRows, newShelf];
    commitRows(updated);
    setTargetShelfId(newShelfId);
    setQuickShelfInput('');
    setIsQuickShelfOpen(false);
    showNotification(`تم إنشاء الرف "${newShelf.title}" واختياره بنجاح!`);
  };

  // Create Shelf from Shelves Tab
  const handleCreateShelf = () => {
    if (!shelfTitle.trim()) {
      showNotification('يرجى كتابة اسم الرف أولاً');
      return;
    }
    const newShelfId = `shelf_${Date.now()}`;
    const newShelf: DynamicRow = {
      id: newShelfId,
      title: shelfTitle.trim(),
      cards: [],
    };
    const updated = shelfPosition === 'start' ? [newShelf, ...localRows] : [...localRows, newShelf];
    commitRows(updated);
    setTargetShelfId(newShelfId);
    setShelfTitle('');
    showNotification(`تم إنشاء الرف "${newShelf.title}" بنجاح!`);
  };

  // Publish / Create Card
  const handlePublishCard = () => {
    if (!targetShelfId) {
      showNotification('يرجى اختيار أو إنشاء رف أولاً لنشر القالب داخله');
      return;
    }
    if (!cardTitle.trim()) {
      showNotification('يرجى إدخال عنوان القالب / الدورة أولاً');
      return;
    }

    const newCard: DynamicRowCard = {
      id: `card_${Date.now()}`,
      title: cardTitle.trim(),
      subject: cardSubject.trim() || undefined,
      price: cardPrice.trim() || undefined,
      teacherName: cardTeacherName.trim() || undefined,
      mediaType: cardMediaType,
      imageUrl:
        cardImageUrl.trim() ||
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      videoUrl: cardVideoUrl.trim() || undefined,
      actionText: cardActionText.trim() || 'تفاصيل الدورة',
      details: cardDetails.trim() || undefined,
      paymentDetails: cardPaymentDetails.trim() || undefined,
      baridimobRip: cardBaridimobRip.trim() || undefined,
      ccpAccount: cardCcpAccount.trim() || undefined,
      contactPhone: cardContactPhone.trim() || undefined,
    };

    const updated = localRows.map((shelf) => {
      if (shelf.id !== targetShelfId) return shelf;
      const newCards =
        cardPosition === 'start' ? [newCard, ...shelf.cards] : [...shelf.cards, newCard];
      return { ...shelf, cards: newCards };
    });

    commitRows(updated);
    // Reset Form
    setCardTitle('');
    setCardSubject('');
    setCardPrice('');
    setCardTeacherName('');
    setCardDetails('');
    setCardPaymentDetails('');
    setCardBaridimobRip('');
    setCardCcpAccount('');
    setCardContactPhone('');
    setCardVideoUrl('');
    setCardMediaType('image');
    showNotification(`تم نشر قالب "${newCard.title}" بنجاح!`);
    setActiveTab('manage_cards');
  };

  // Media Handlers
  const handleTriggerImageUpload = (ctx: 'new_card' | 'edit_card') => {
    setUploadContext(ctx);
    if (fileImageInputRef.current) {
      fileImageInputRef.current.value = '';
      fileImageInputRef.current.click();
    }
  };

  const handleTriggerVideoUpload = (ctx: 'new_card' | 'edit_card') => {
    setUploadContext(ctx);
    if (fileVideoInputRef.current) {
      fileVideoInputRef.current.value = '';
      fileVideoInputRef.current.click();
    }
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (uploadContext === 'new_card') {
        setCardImageUrl(dataUrl);
        setCardMediaType('image');
      } else if (editingCard) {
        setEditingCard({
          ...editingCard,
          card: { ...editingCard.card, imageUrl: dataUrl, mediaType: 'image' },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      if (uploadContext === 'new_card') {
        setCardVideoUrl(dataUrl);
        setCardMediaType('video');
      } else if (editingCard) {
        setEditingCard({
          ...editingCard,
          card: { ...editingCard.card, videoUrl: dataUrl, mediaType: 'video' },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Safe Deletion Execution
  const confirmExecuteDelete = () => {
    if (!pendingDelete) return;

    if (pendingDelete.type === 'shelf' && pendingDelete.shelfId) {
      const updated = localRows.filter((s) => s.id !== pendingDelete.shelfId);
      commitRows(updated);
      showNotification(`تم حذف الرف "${pendingDelete.name}" بنجاح`);
    } else if (
      pendingDelete.type === 'card' &&
      pendingDelete.shelfId &&
      pendingDelete.cardId
    ) {
      const updated = localRows.map((s) => {
        if (s.id !== pendingDelete.shelfId) return s;
        return {
          ...s,
          cards: s.cards.filter((c) => c.id !== pendingDelete.cardId),
        };
      });
      commitRows(updated);
      showNotification(`تم حذف القالب "${pendingDelete.name}" بنجاح`);
    } else if (pendingDelete.type === 'all') {
      commitRows([]);
      setTargetShelfId('');
      showNotification(`تم تفريغ كافة الرفوف والقوالب`);
    }

    setPendingDelete(null);
  };

  // Card Reordering
  const handleMoveCard = (
    shelfId: string,
    cardIndex: number,
    direction: 'left' | 'right'
  ) => {
    const updated = localRows.map((shelf) => {
      if (shelf.id !== shelfId) return shelf;
      const targetIndex = direction === 'left' ? cardIndex + 1 : cardIndex - 1;
      if (targetIndex < 0 || targetIndex >= shelf.cards.length) return shelf;

      const copyCards = [...shelf.cards];
      const [movedCard] = copyCards.splice(cardIndex, 1);
      copyCards.splice(targetIndex, 0, movedCard);
      return { ...shelf, cards: copyCards };
    });
    commitRows(updated);
  };

  // Shelf Reordering
  const handleMoveShelf = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localRows.length) return;
    const copy = [...localRows];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    commitRows(copy);
  };

  const handleUpdateShelfTitle = (shelfId: string, title: string) => {
    const updated = localRows.map((s) => (s.id === shelfId ? { ...s, title } : s));
    commitRows(updated);
  };

  const handleSaveEditedCard = () => {
    if (!editingCard) return;
    const updated = localRows.map((shelf) => {
      if (shelf.id !== editingCard.shelfId) return shelf;
      return {
        ...shelf,
        cards: shelf.cards.map((c) =>
          c.id === editingCard.card.id ? editingCard.card : c
        ),
      };
    });
    commitRows(updated);
    setEditingCard(null);
    showNotification(`تم حفظ تعديل القالب بنجاح`);
  };

  return (
    <div className="w-full min-h-screen bg-[#faf9f5] flex flex-col justify-between pb-12 select-text" dir="rtl">
      {/* Hidden File Inputs for Uploads */}
      <input
        type="file"
        ref={fileImageInputRef}
        onChange={handleImageFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileVideoInputRef}
        onChange={handleVideoFileChange}
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
      />

      {/* Page Header with Direct "Back to Home" Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#f0ebd9] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <ArrowRight size={15} />
            <span>العودة للرئيسية</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
              لوحة تحكم ونشر الباقات والرفوف
            </h2>
            <p className="text-[10px] text-neutral-500 hidden sm:block">
              صفحة مخصصة لإدارة ونشر الدورات وتفاصيل الدفع الحقيقية
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="py-1.5 px-4 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Save size={14} />
          <span>تطبيق ومشاهدة الرئيسية</span>
        </button>
      </header>

      {/* Top Notification */}
      {notificationMsg && (
        <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
          <Check size={14} className="text-emerald-600" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Streamlined Tabs Navigation */}
      <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 pt-4">
        <div className="flex rounded-2xl bg-white border border-neutral-200 p-1 gap-1 text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('publish_card')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'publish_card'
                ? 'bg-[#d4af37] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FilePlus size={15} />
            <span>نشر قالب جديد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage_shelves')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manage_shelves'
                ? 'bg-[#d4af37] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FolderPlus size={15} />
            <span>الرفوف ({localRows.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage_cards')}
            className={`flex-1 py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manage_cards'
                ? 'bg-[#d4af37] text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers size={15} />
            <span>إدارة وتعديل القوالب ({localRows.reduce((a, b) => a + b.cards.length, 0)})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-4 flex-1">
        {/* ================= 1. PUBLISH CARD (REAL DATA & PAYMENT) ================= */}
        {activeTab === 'publish_card' && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-4 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2">
                <FilePlus size={17} className="text-[#b8860b]" />
                <span>إضافة ونشر قالب باقة جديدة (مع تفاصيل الدورة والدفع)</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                كل ما تدخله هنا هو ما سيظهر للتلميذ في الواجهة وبدون أي بيانات وهمية.
              </p>
            </div>

            {/* Target Shelf Selection */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800">
                  الرف المستهدف (السطر الذي سينتمي إليه القالب):
                </label>
                <button
                  type="button"
                  onClick={() => setIsQuickShelfOpen(!isQuickShelfOpen)}
                  className="text-[11px] text-[#996515] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>{isQuickShelfOpen ? 'إلغاء' : '+ إنشاء رف جديد فوراً'}</span>
                </button>
              </div>

              {isQuickShelfOpen && (
                <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-amber-200">
                  <input
                    type="text"
                    value={quickShelfInput}
                    onChange={(e) => setQuickShelfInput(e.target.value)}
                    placeholder="اسم الرف الجديد..."
                    className="flex-1 text-xs p-1.5 outline-none font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleCreateQuickShelf}
                    className="py-1.5 px-3 bg-[#b8860b] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    حفظ واختيار
                  </button>
                </div>
              )}

              {localRows.length > 0 ? (
                <select
                  value={targetShelfId}
                  onChange={(e) => setTargetShelfId(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-neutral-300 bg-white outline-none cursor-pointer"
                >
                  {localRows.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      الرف {idx + 1}: {s.title} ({s.cards.length} قوالب)
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-rose-600 font-bold p-2">
                  لا توجد رفوف بعد. يرجى إنشاء رف أولاً باستخدام الزر أعلاه.
                </div>
              )}
            </div>

            {/* Basic Card Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  عنوان الدورة / الباقة *:
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="مثال: دورة الرياضيات الشاملة"
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] outline-none bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  المادة أو التخصص:
                </label>
                <input
                  type="text"
                  value={cardSubject}
                  onChange={(e) => setCardSubject(e.target.value)}
                  placeholder="مثال: فيزياء / علوم / فلسفة"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] outline-none bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  سعر الدورة (اختياري):
                </label>
                <input
                  type="text"
                  value={cardPrice}
                  onChange={(e) => setCardPrice(e.target.value)}
                  placeholder="مثال: 3000 دج أو مجاني"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:border-[#d4af37] outline-none bg-neutral-50/50"
                />
              </div>
            </div>

            {/* Teacher Name & Button Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  اسم الأستاذ المشرف (اختياري):
                </label>
                <input
                  type="text"
                  value={cardTeacherName}
                  onChange={(e) => setCardTeacherName(e.target.value)}
                  placeholder="مثال: أستاذ بوقرة"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 outline-none bg-neutral-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  نص زر الإجراء في القالب:
                </label>
                <input
                  type="text"
                  value={cardActionText}
                  onChange={(e) => setCardActionText(e.target.value)}
                  placeholder="تفاصيل الدورة"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 outline-none bg-neutral-50/50"
                />
              </div>
            </div>

            {/* Media Upload Area (Video / Image) */}
            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  وسائط القالب (صورة أو مقطع فيديو):
                </span>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setCardMediaType('image')}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                      cardMediaType === 'image'
                        ? 'bg-amber-100 text-[#996515]'
                        : 'text-neutral-500'
                    }`}
                  >
                    صورة
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardMediaType('video')}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                      cardMediaType === 'video'
                        ? 'bg-neutral-900 text-[#d4af37]'
                        : 'text-neutral-500'
                    }`}
                  >
                    فيديو (MP4)
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {cardMediaType === 'video' ? (
                  <button
                    type="button"
                    onClick={() => handleTriggerVideoUpload('new_card')}
                    className="py-2 px-3.5 bg-neutral-900 hover:bg-black text-[#d4af37] text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Upload size={14} />
                    <span>رفع فيديو من جهازك (MP4 / WebM)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTriggerImageUpload('new_card')}
                    className="py-2 px-3.5 bg-neutral-900 hover:bg-black text-[#d4af37] text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Upload size={14} />
                    <span>رفع صورة من جهازك</span>
                  </button>
                )}
              </div>

              {/* Direct Link Input */}
              <input
                type="url"
                value={cardMediaType === 'video' ? cardVideoUrl : cardImageUrl}
                onChange={(e) =>
                  cardMediaType === 'video'
                    ? setCardVideoUrl(e.target.value)
                    : setCardImageUrl(e.target.value)
                }
                placeholder={
                  cardMediaType === 'video'
                    ? 'أو ضع رابط فيديو مباشر (MP4)...'
                    : 'أو ضع رابط صورة مباشر...'
                }
                className="w-full text-xs p-2 rounded-xl border border-neutral-200 bg-white font-mono text-[11px] outline-none"
              />

              {/* Live Preview of video or image */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-20 h-32 rounded-xl overflow-hidden bg-neutral-900 relative border border-neutral-300 shrink-0">
                  {cardMediaType === 'video' && cardVideoUrl ? (
                    <video
                      src={cardVideoUrl}
                      className="w-full h-full object-cover pointer-events-none"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={cardImageUrl}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="text-[11px] text-neutral-500 leading-relaxed">
                  {cardMediaType === 'video'
                    ? 'معاينة الفيديو: سيتم تشغيله تلقائياً وبشكل مستمر دون صوت ودون أن يتمكن الطالب من إيقافه أو تقديمه.'
                    : 'معاينة الصورة: ستظهر الصورة بكامل وضوحها داخل القالب.'}
                </div>
              </div>
            </div>

            {/* Course Details (User writes it directly) */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                تفاصيل ومنهاج الدورة (اكتب هنا المحتوى، المحاور، الحصص، وأي تفاصيل خاصة بالدورة):
              </label>
              <textarea
                rows={4}
                value={cardDetails}
                onChange={(e) => setCardDetails(e.target.value)}
                placeholder="اكتب هنا كل تفاصيل الدورة، الدروس المقررة، جدول المواعيد، أو الملاحظات الهامة..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 outline-none bg-neutral-50/50 resize-y leading-relaxed"
              />
            </div>

            {/* Payment Details Section (User writes it directly - no fake info) */}
            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <SlidersHorizontal size={14} className="text-[#b8860b]" />
                  <span>تفاصيل ومعلومات الدفع (تكتبها أنت بنفسك):</span>
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  اكتب هنا أرقام الحسابات وتعليمات الدفع الحقيقية الخاصة بك لتظهر للتلميذ عند الضغط على الدفع.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  تعليمات وطريقة الدفع:
                </label>
                <textarea
                  rows={2}
                  value={cardPaymentDetails}
                  onChange={(e) => setCardPaymentDetails(e.target.value)}
                  placeholder="مثال: يرجى التحويل عبر بريدي موب أو CCP ثم رفع صورة الوصل لتأكيد اشتراكك فوراً..."
                  className="w-full text-xs p-2.5 rounded-xl border border-amber-200 outline-none bg-white resize-y leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10.5px] font-bold text-neutral-700 block mb-0.5">
                    رقم RIP بريدي موب (BaridiMob):
                  </label>
                  <input
                    type="text"
                    value={cardBaridimobRip}
                    onChange={(e) => setCardBaridimobRip(e.target.value)}
                    placeholder="رقم الـ RIP الخاص بك..."
                    className="w-full text-xs p-2 rounded-xl border border-amber-200 outline-none bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-neutral-700 block mb-0.5">
                    رقم حساب CCP الخاص بك:
                  </label>
                  <input
                    type="text"
                    value={cardCcpAccount}
                    onChange={(e) => setCardCcpAccount(e.target.value)}
                    placeholder="رقم CCP والمفتاح..."
                    className="w-full text-xs p-2 rounded-xl border border-amber-200 outline-none bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-neutral-700 block mb-0.5">
                    رقم هاتف أو حساب للتأكيد:
                  </label>
                  <input
                    type="text"
                    value={cardContactPhone}
                    onChange={(e) => setCardContactPhone(e.target.value)}
                    placeholder="مثال: 0699001122"
                    className="w-full text-xs p-2 rounded-xl border border-amber-200 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Position inside shelf */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-700">مكان القالب داخل الرف:</span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cardPos"
                    checked={cardPosition === 'end'}
                    onChange={() => setCardPosition('end')}
                  />
                  <span>في النهاية (يسار الرف)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="cardPos"
                    checked={cardPosition === 'start'}
                    onChange={() => setCardPosition('start')}
                  />
                  <span>في البداية (يمين الرف)</span>
                </label>
              </div>
            </div>

            {/* Publish Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePublishCard}
                disabled={!cardTitle.trim() || !targetShelfId}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-40"
              >
                <Plus size={16} className="stroke-[2.5]" />
                <span>نشر هذا القالب في الرف فوراً</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. MANAGE SHELVES ================= */}
        {activeTab === 'manage_shelves' && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-4 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
            {/* Create Shelf Form */}
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-2">
                <FolderPlus size={16} className="text-[#b8860b]" />
                <span>إنشاء رف جديد</span>
              </h4>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={shelfTitle}
                  onChange={(e) => setShelfTitle(e.target.value)}
                  placeholder="اكتب اسم الرف (مثال: بكالوريا 2026 / دورات المراجعة)..."
                  className="w-full sm:flex-1 text-xs p-2.5 rounded-xl border border-neutral-300 outline-none bg-white font-bold"
                />

                <select
                  value={shelfPosition}
                  onChange={(e) => setShelfPosition(e.target.value as 'end' | 'start')}
                  className="w-full sm:w-auto text-xs p-2.5 rounded-xl border border-neutral-300 bg-white outline-none cursor-pointer"
                >
                  <option value="end">في النهاية (أسفل الرفوف)</option>
                  <option value="start">في البداية (أول رف في الأعلى)</option>
                </select>

                <button
                  type="button"
                  onClick={handleCreateShelf}
                  disabled={!shelfTitle.trim()}
                  className="w-full sm:w-auto py-2.5 px-5 bg-[#b8860b] hover:bg-[#996515] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer disabled:opacity-40"
                >
                  + إضافة الرف
                </button>
              </div>
            </div>

            {/* List of Shelves */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800">
                  قائمة الرفوف الحالية ({localRows.length} رفوف):
                </span>
                {localRows.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setPendingDelete({
                        type: 'all',
                        name: 'كافة الرفوف والقوالب',
                      })
                    }
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Trash2 size={13} />
                    <span>تفريغ وحذف كافة الرفوف</span>
                  </button>
                )}
              </div>

              {localRows.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-xs text-neutral-500">
                  لا توجد رفوف حالياً. اكتب اسم الرف أعلاه واضغط على إضافة الرف للبدء.
                </div>
              ) : (
                <div className="space-y-2">
                  {localRows.map((shelf, idx) => (
                    <div
                      key={shelf.id}
                      className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-5 h-5 rounded-md bg-neutral-900 text-[#d4af37] text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={shelf.title}
                          onChange={(e) => handleUpdateShelfTitle(shelf.id, e.target.value)}
                          className="text-xs font-bold text-neutral-900 bg-transparent border-b border-dashed border-neutral-300 focus:border-[#d4af37] outline-none px-1 flex-1 max-w-sm"
                          title="انقر لتعديل الاسم"
                        />
                        <span className="text-[10px] text-neutral-500">
                          ({shelf.cards.length} قوالب)
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveShelf(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-[#996515] disabled:opacity-30 cursor-pointer"
                          title="تحريك للأعلى"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveShelf(idx, 'down')}
                          disabled={idx === localRows.length - 1}
                          className="p-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-[#996515] disabled:opacity-30 cursor-pointer"
                          title="تحريك للأسفل"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingDelete({
                              type: 'shelf',
                              shelfId: shelf.id,
                              name: shelf.title || `الرف ${idx + 1}`,
                            })
                          }
                          className="p-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="حذف هذا الرف"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. MANAGE & EDIT CARDS ================= */}
        {activeTab === 'manage_cards' && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-4 sm:p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Layers size={17} className="text-[#b8860b]" />
                  <span>إدارة، تعديل وحذف القوالب المنشورة</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  استعراض جميع القوالب مع إمكانية حذف أي قالب أو تعديل بياناته فوراً.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('publish_card')}
                className="py-1.5 px-3 bg-[#b8860b] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + نشر قالب جديد
              </button>
            </div>

            {localRows.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-xs text-neutral-500">
                لا توجد رفوف أو قوالب حتى الآن.
              </div>
            ) : (
              <div className="space-y-4">
                {localRows.map((shelf, shelfIdx) => (
                  <div
                    key={shelf.id}
                    className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-neutral-900 text-[#d4af37] text-[10px] font-bold flex items-center justify-center">
                          {shelfIdx + 1}
                        </span>
                        <strong className="text-xs font-bold text-neutral-900">
                          {shelf.title}
                        </strong>
                        <span className="text-[10px] text-neutral-500">
                          ({shelf.cards.length} قوالب)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetShelfId(shelf.id);
                          setActiveTab('publish_card');
                        }}
                        className="text-[10.5px] text-amber-700 font-bold hover:underline cursor-pointer"
                      >
                        + إضافة قالب لهذا الرف
                      </button>
                    </div>

                    {shelf.cards.length === 0 ? (
                      <div className="p-3 text-center text-xs text-neutral-400 bg-white rounded-xl border border-dashed border-neutral-200">
                        لا توجد قوالب في هذا الرف بعد.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {shelf.cards.map((card, cardIdx) => (
                          <div
                            key={card.id}
                            className="bg-white rounded-xl border border-neutral-200 p-2 flex flex-col justify-between space-y-2 shadow-2xs"
                          >
                            <div className="flex items-start gap-2">
                              <div className="w-11 h-16 rounded-lg overflow-hidden bg-neutral-950 shrink-0 relative">
                                {card.mediaType === 'video' && card.videoUrl ? (
                                  <video
                                    src={card.videoUrl}
                                    className="w-full h-full object-cover pointer-events-none"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                  />
                                ) : (
                                  <img
                                    src={card.imageUrl}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>

                              <div className="flex-1 overflow-hidden">
                                <h5 className="text-[11px] font-bold text-neutral-900 truncate">
                                  {card.title}
                                </h5>
                                {card.subject && (
                                  <span className="text-[10px] text-neutral-500 block truncate">
                                    {card.subject}
                                  </span>
                                )}
                                {card.price && (
                                  <span className="text-[10px] text-[#b8860b] font-bold block truncate">
                                    {card.price}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions & Reordering */}
                            <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveCard(shelf.id, cardIdx, 'right')}
                                  disabled={cardIdx === 0}
                                  className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 disabled:opacity-30 cursor-pointer"
                                  title="تحريك لليمين"
                                >
                                  <ArrowRight size={11} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveCard(shelf.id, cardIdx, 'left')}
                                  disabled={cardIdx === shelf.cards.length - 1}
                                  className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 disabled:opacity-30 cursor-pointer"
                                  title="تحريك لليسار"
                                >
                                  <ArrowLeft size={11} />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingCard({
                                      shelfId: shelf.id,
                                      card: { ...card },
                                    })
                                  }
                                  className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                                  title="تعديل القالب"
                                >
                                  <Edit3 size={11} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPendingDelete({
                                      type: 'card',
                                      shelfId: shelf.id,
                                      cardId: card.id,
                                      name: card.title || 'هذا القالب',
                                    })
                                  }
                                  className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                                  title="حذف القالب"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inline Card Editor Drawer */}
        {editingCard && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl p-5 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-[#d4af37]/60">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Edit3 size={14} className="text-[#b8860b]" />
                  <span>تعديل القالب: "{editingCard.card.title}"</span>
                </span>
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer font-bold"
                >
                  ✕ إغلاق
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">
                    عنوان الباقة
                  </label>
                  <input
                    type="text"
                    value={editingCard.card.title}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        card: { ...editingCard.card, title: e.target.value },
                      })
                    }
                    className="w-full text-xs font-bold p-2 rounded-xl border border-neutral-300 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">
                    السعر
                  </label>
                  <input
                    type="text"
                    value={editingCard.card.price || ''}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        card: { ...editingCard.card, price: e.target.value },
                      })
                    }
                    placeholder="مثال: 3000 دج"
                    className="w-full text-xs p-2 rounded-xl border border-neutral-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">
                  تفاصيل ومنهاج الدورة
                </label>
                <textarea
                  rows={3}
                  value={editingCard.card.details || ''}
                  onChange={(e) =>
                    setEditingCard({
                      ...editingCard,
                      card: { ...editingCard.card, details: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 rounded-xl border border-neutral-300 outline-none resize-y"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">
                  تفاصيل وتعليمات الدفع
                </label>
                <textarea
                  rows={2}
                  value={editingCard.card.paymentDetails || ''}
                  onChange={(e) =>
                    setEditingCard({
                      ...editingCard,
                      card: { ...editingCard.card, paymentDetails: e.target.value },
                    })
                  }
                  className="w-full text-xs p-2 rounded-xl border border-neutral-300 outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[9.5px] font-bold text-neutral-700 block mb-0.5">
                    رقم بريدي موب RIP
                  </label>
                  <input
                    type="text"
                    value={editingCard.card.baridimobRip || ''}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        card: { ...editingCard.card, baridimobRip: e.target.value },
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-neutral-300 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-neutral-700 block mb-0.5">
                    حساب CCP
                  </label>
                  <input
                    type="text"
                    value={editingCard.card.ccpAccount || ''}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        card: { ...editingCard.card, ccpAccount: e.target.value },
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-neutral-300 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9.5px] font-bold text-neutral-700 block mb-0.5">
                    هاتف التأكيد
                  </label>
                  <input
                    type="text"
                    value={editingCard.card.contactPhone || ''}
                    onChange={(e) =>
                      setEditingCard({
                        ...editingCard,
                        card: { ...editingCard.card, contactPhone: e.target.value },
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-neutral-300 outline-none"
                  />
                </div>
              </div>

              {/* Upload media inside edit */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleTriggerImageUpload('edit_card')}
                  className="py-1.5 px-3 bg-neutral-900 text-[#d4af37] text-xs font-bold rounded-xl cursor-pointer"
                >
                  تغيير الصورة
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerVideoUpload('edit_card')}
                  className="py-1.5 px-3 bg-neutral-900 text-[#d4af37] text-xs font-bold rounded-xl cursor-pointer"
                >
                  تغيير الفيديو (MP4)
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="py-2 px-4 text-xs font-bold text-neutral-600 rounded-xl hover:bg-neutral-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedCard}
                  className="py-2 px-5 bg-[#b8860b] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= IN-PAGE CONFIRMATION DIALOG ================= */}
      {/* يحل مشكلة confirm() الممنوعة في الـ iframe بنسبة 100% وبطريقة آمنة وواضحة */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
          onClick={() => setPendingDelete(null)}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-rose-200 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle size={22} />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                تأكيد عملية الحذف
              </h4>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                {pendingDelete.type === 'shelf' &&
                  `هل أنت متأكد من حذف رف "${pendingDelete.name}" وجميع القوالب التابعة له؟`}
                {pendingDelete.type === 'card' &&
                  `هل أنت متأكد من حذف قالب "${pendingDelete.name}" نهائياً؟`}
                {pendingDelete.type === 'all' &&
                  `هل تريد حذف وتفريغ كافة الرفوف والقوالب تماماً؟`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="flex-1 py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmExecuteDelete}
                className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs active:scale-95"
              >
                نعم، تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
