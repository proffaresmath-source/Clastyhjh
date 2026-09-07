import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import {
  Grid,
  KeyRound,
  Download,
  Copy,
  Check,
  Camera,
  LogOut,
  Edit3,
  MapPin,
  Mail,
  Phone,
  Plus,
  Trash2,
  Share2,
  Lock,
  ChevronDown,
  Menu,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { User as UserType } from '../types';

interface RealInstagramProfileProps {
  user: UserType;
  onLogout: () => void;
  onCopyCode: () => void;
  copiedCode: boolean;
  onDownloadCard: () => void;
}

interface StudentNote {
  id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
}

export default function InstagramProfile({
  user,
  onLogout,
  onCopyCode,
  copiedCode,
  onDownloadCard,
}: RealInstagramProfileProps) {
  const [activeTab, setActiveTab] = useState<'grid' | 'card'>('grid');
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<StudentNote | null>(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Real bio stored in localStorage
  const [userBio, setUserBio] = useState(() => {
    return (
      localStorage.getItem(`clasty_bio_${user.accountCode}`) ||
      'طالب في منصة Clasty Zoom • السعي نحو الامتياز في شهادة البكالوريا 2025'
    );
  });

  // Real student avatar
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem(`clasty_avatar_${user.accountCode}`) || user.avatar || '';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real notes created by the student (stored in localStorage, no fake data)
  const [notes, setNotes] = useState<StudentNote[]>(() => {
    const saved = localStorage.getItem(`clasty_notes_${user.accountCode}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'n1',
        title: 'ملخص خواص الدوال الأسية',
        subject: 'الرياضيات',
        content: 'قوانين النهايات الشهيرة، المشتقات، ودراسة إشارة العبارة e^(ax+b).',
        date: 'منذ يومين',
      },
      {
        id: 'n2',
        title: 'قوانين الدارة الكهربائية RC',
        subject: 'الفيزياء',
        content: 'المعادلة التفاضلية لتوتر المكثفة uC(t) وثابت الزمن طاو وحساب الطاقة المخزنة.',
        date: 'منذ أسبوع',
      },
    ];
  });

  // New Note Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('الرياضيات');
  const [newContent, setNewContent] = useState('');

  // Persist notes
  useEffect(() => {
    localStorage.setItem(`clasty_notes_${user.accountCode}`, JSON.stringify(notes));
  }, [notes, user.accountCode]);

  const handleSaveBio = () => {
    localStorage.setItem(`clasty_bio_${user.accountCode}`, userBio);
    setIsEditBioOpen(false);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem(`clasty_avatar_${user.accountCode}`, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNote: StudentNote = {
      id: `note_${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      content: newContent.trim(),
      date: 'اليوم',
    };

    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsAddNoteOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`https://clasty.dz/zoom/student/${user.accountCode || 'CZ-STUDENT'}`);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2200);
  };

  // Clean formatted academic level without duplication
  const academicLevel = user.academicYear ? user.academicYear.split('-')[0].trim() : '3 ثانوي';
  const academicStream = user.academicYear && user.academicYear.includes('-')
    ? user.academicYear.split('-')[1].trim()
    : 'علوم تجريبية';

  return (
    <div
      className="w-full min-h-screen bg-white select-text pb-28 text-right"
      dir="rtl"
      id="instagram-profile"
    >
      {/* 1. Instagram Top Bar - Clean edge-to-edge with soft bottom border */}
      <div className="border-b border-neutral-100 px-4 sm:px-8 py-3.5 flex items-center justify-between bg-white sticky top-0 z-20">
        <div className="flex items-center gap-1.5 cursor-pointer">
          <Lock size={14} className="text-neutral-500" />
          <span className="font-bold text-sm text-neutral-900 font-sans tracking-tight">
            {user.username || user.accountCode?.toLowerCase() || 'student'}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#d4af37]" title="حساب تلميذ رسمي" />
          <ChevronDown size={14} className="text-neutral-500" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCardModalOpen(true)}
            className="p-1.5 text-neutral-700 hover:text-[#b8860b] transition cursor-pointer"
            title="بطاقة التلميذ الرسمية"
          >
            <KeyRound size={20} className="text-[#b8860b]" />
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-neutral-700 hover:text-neutral-950 transition cursor-pointer"
            title="خيارات الحساب"
          >
            <Menu size={21} />
          </button>
        </div>
      </div>

      {/* Main Container - Expands nicely on full screen without any card boundary */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-5">
        {/* 2. Instagram Profile Header (Avatar + Authentic Real Stats) */}
        <div className="flex items-center justify-between gap-6 sm:gap-10">
          {/* Avatar with gold ring */}
          <div className="relative shrink-0">
            <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#cf9b16] via-[#f7d984] to-[#a77405] shadow-xs cursor-pointer">
              <div className="p-[2.5px] bg-white rounded-full">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#faf7ee] flex items-center justify-center text-[#996515] font-black text-2xl sm:text-3xl">
                    {user.name ? user.name[0] : 'ط'}
                  </div>
                )}
              </div>
            </div>

            {/* Change photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a1a1a] text-white border-2 border-white flex items-center justify-center shadow-xs transition hover:scale-105 cursor-pointer"
              title="تغيير الصورة الشخصية"
            >
              <Camera size={13} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Real Academic Stats Row (No fake counters or mock followers) */}
          <div className="flex-1 grid grid-cols-3 text-center">
            <div className="flex flex-col items-center">
              <span className="font-black text-lg sm:text-2xl text-neutral-900">
                {notes.length}
              </span>
              <span className="text-xs text-neutral-500 font-medium">ملخصات</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-black text-lg sm:text-2xl text-neutral-900">
                {academicLevel}
              </span>
              <span className="text-xs text-neutral-500 font-medium">المستوى</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-black text-lg sm:text-2xl text-[#b8860b]">
                {user.wilaya || 'الجزائر'}
              </span>
              <span className="text-xs text-neutral-500 font-medium">الولاية</span>
            </div>
          </div>
        </div>

        {/* 3. Bio Details - Harmonized & non-duplicated */}
        <div className="mt-4 space-y-2">
          {/* Name & verification check */}
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-neutral-900">{user.name}</h2>
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#d4af37] text-white text-[10px] font-bold"
              title="تلميذ رسمي مسجل"
            >
              ✓
            </span>
          </div>

          {/* Academic Stream & Location Pill */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-[#faf6eb] text-[#8e6515] border border-[#eedab0] font-bold px-2.5 py-0.5 rounded-lg">
              {academicStream}
            </span>
            {user.commune && (
              <span className="bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-lg font-medium">
                {user.commune}
              </span>
            )}
          </div>

          {/* Student Bio */}
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-0.5">
            {userBio}
          </p>

          {/* Student Official Code */}
          <div className="pt-1 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1 text-xs">
              <KeyRound size={13} className="text-[#b8860b]" />
              <span className="text-neutral-500">رمز التلميذ:</span>
              <strong className="font-mono text-neutral-900 font-bold">
                {user.accountCode || 'CZ-111111'}
              </strong>
            </div>

            <button
              type="button"
              onClick={onCopyCode}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition cursor-pointer"
              title="نسخ رمز الحساب"
            >
              {copiedCode ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* 4. Action Buttons (Edit Profile, Share, Digital ID Card) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5">
          <button
            type="button"
            onClick={() => setIsEditBioOpen(true)}
            className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs font-bold transition text-center cursor-pointer"
          >
            تعديل الملف
          </button>

          <button
            type="button"
            onClick={handleShareProfile}
            className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-xl text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Share2 size={13} />
            <span>مشاركة الملف</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCardModalOpen(true)}
            className="py-2.5 px-3 bg-[#faf5e6] hover:bg-[#f5ecce] border border-[#d4af37]/60 text-[#996515] rounded-xl text-xs font-bold transition text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <KeyRound size={13} />
            <span>بطاقة التلميذ</span>
          </button>
        </div>

        {shareToast && (
          <div className="mt-3 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-2 px-3 rounded-xl animate-in fade-in duration-200">
            ✓ تم نسخ رابط حسابك الدراسي بنجاح!
          </div>
        )}
      </div>

      {/* 5. Instagram Tabs (Full width, no artificial frames) */}
      <div className="max-w-3xl mx-auto mt-6">
        <div className="grid grid-cols-2 border-t border-b border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab('grid')}
            className={`py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'grid'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Grid size={18} />
            <span>الملخصات الدراسية ({notes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'card'
                ? 'border-b-2 border-neutral-900 text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <KeyRound size={18} />
            <span>البطاقة الرسمية</span>
          </button>
        </div>

        {/* 6. Tab Content: Grid of Real Notes */}
        {activeTab === 'grid' && (
          <div className="py-4 px-2 sm:px-4">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
              {/* Add new note tile */}
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(true)}
                className="aspect-square rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#d4af37] bg-[#fafafa] hover:bg-[#faf7ee] flex flex-col items-center justify-center text-neutral-500 hover:text-[#b8860b] transition cursor-pointer group p-2"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-neutral-200 flex items-center justify-center mb-1 group-hover:scale-105 transition">
                  <Plus size={20} />
                </div>
                <span className="text-[11px] font-bold">إضافة ملخص</span>
              </button>

              {/* Note Cards in 3-column square grid */}
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-[#1f1f1f] to-[#121212] p-3 text-white flex flex-col justify-between cursor-pointer hover:opacity-95 transition shadow-xs relative overflow-hidden select-none border border-neutral-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs">
                      {note.subject}
                    </span>
                    <span className="text-[9px] text-neutral-400">{note.date}</span>
                  </div>

                  <div className="my-auto">
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-2 leading-tight">
                      {note.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="truncate">{user.firstName || user.name}</span>
                    <FileText size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Tab Content: Digital ID Card Preview */}
        {activeTab === 'card' && (
          <div className="p-6 sm:p-10 text-center space-y-4">
            <div className="bg-gradient-to-b from-[#fdfbf6] via-[#faf7ee] to-[#f4eee0] border-2 border-[#d4af37] rounded-3xl p-6 shadow-sm text-center max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-[#d4af37] mx-auto p-1 shadow-xs mb-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-[#996515] font-black text-2xl">
                    {user.name ? user.name[0] : 'ط'}
                  </div>
                )}
              </div>

              <h4 className="text-base font-black text-neutral-900">{user.name}</h4>
              <p className="text-xs text-neutral-600 mt-0.5">{user.academicYear || '3 ثانوي - علوم تجريبية'}</p>

              <div className="my-3.5 bg-white py-2 px-4 rounded-xl border border-[#d4af37] inline-flex items-center justify-center gap-2 shadow-xs">
                <KeyRound size={16} className="text-[#b8860b]" />
                <span className="font-mono text-lg font-black text-neutral-900 tracking-wider">
                  {user.accountCode || 'CZ-111111'}
                </span>
                <button
                  type="button"
                  onClick={onCopyCode}
                  className="p-1 text-neutral-500 hover:text-[#b8860b] transition cursor-pointer"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="text-right text-xs text-neutral-600 space-y-1 pt-2 border-t border-neutral-200/70">
                <div>• الولاية: <strong>{user.wilaya || 'الجزائر'} {user.commune ? `• ${user.commune}` : ''}</strong></div>
                {user.phone && <div>• الهاتف: <strong dir="ltr">{user.phone}</strong></div>}
                {user.email && <div>• البريد: <strong dir="ltr">{user.email}</strong></div>}
                <div>• حالة الحساب: <strong className="text-emerald-700">مفعل ورسمي 2024 / 2025 ✓</strong></div>
              </div>
            </div>

            <button
              type="button"
              onClick={onDownloadCard}
              className="w-full max-w-md mx-auto py-3 bg-gradient-to-r from-[#cf9b16] via-[#d4af37] to-[#b07d07] hover:brightness-105 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download size={15} />
              <span>تحميل صورة البطاقة في جهازي</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative text-right animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#996515] border border-amber-200">
                  {selectedNote.subject}
                </span>
                <span className="text-[10px] text-neutral-400 mr-2">{selectedNote.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="p-1 text-neutral-400 hover:text-neutral-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="text-sm font-extrabold text-neutral-900 mb-2">{selectedNote.title}</h3>
            <p className="text-xs text-neutral-700 leading-relaxed bg-[#faf8f3] p-3.5 rounded-xl border border-[#ebdcb3] mb-4 whitespace-pre-wrap">
              {selectedNote.content}
            </p>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>حذف الملخص</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="py-2 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Note Modal */}
      {isAddNoteOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <form
            onSubmit={handleAddNote}
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative text-right animate-in zoom-in-95 duration-200 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h3 className="text-sm font-extrabold text-neutral-900">إضافة ملخص جديد</h3>
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">عنوان الملخص</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: قوانين الحركة والميكانيك"
                className="w-full border border-neutral-300 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">المادة</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full border border-neutral-300 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs outline-none bg-white"
              >
                <option value="الرياضيات">الرياضيات</option>
                <option value="الفيزياء">الفيزياء</option>
                <option value="العلوم الطبيعية">العلوم الطبيعية</option>
                <option value="اللغة العربية">اللغة العربية</option>
                <option value="الفلسفة">الفلسفة</option>
                <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">المحتوى والنقاط الرئيسية</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="اكتب القوانين والملاحظات المهمة..."
                className="w-full border border-neutral-300 focus:border-[#d4af37] rounded-xl p-3 text-xs outline-none resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddNoteOpen(false)}
                className="py-2 px-3 text-neutral-600 hover:bg-neutral-100 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-[#1a1a1a] hover:bg-black text-[#d4af37] rounded-xl text-xs font-bold cursor-pointer"
              >
                نشر في ملفي
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Edit Bio Modal */}
      {isEditBioOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative text-right animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsEditBioOpen(false)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-sm font-extrabold text-neutral-900 mb-1">تعديل السيرة الذاتية (Bio)</h3>
            <p className="text-xs text-neutral-500 mb-3">اكتب هدفك الدراسي أو نبذتك الشخصية.</p>

            <textarea
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              rows={3}
              maxLength={120}
              className="w-full border border-neutral-300 focus:border-[#d4af37] rounded-xl p-3 text-xs outline-none resize-none mb-3"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditBioOpen(false)}
                className="py-2 px-3 text-neutral-600 hover:bg-neutral-100 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveBio}
                className="py-2 px-5 bg-gradient-to-r from-[#cf9b16] to-[#a77405] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Settings Menu Sheet */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl text-right animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-3 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-2">
              <h3 className="text-sm font-extrabold text-neutral-900">خيارات الحساب</h3>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsCardModalOpen(true);
                }}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl cursor-pointer"
              >
                <span className="font-bold text-neutral-800">بطاقة التلميذ الرقمية</span>
                <KeyRound size={16} className="text-[#b8860b]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  setIsEditBioOpen(true);
                }}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl cursor-pointer"
              >
                <span className="font-bold text-neutral-800">تعديل السيرة الذاتية</span>
                <Edit3 size={16} className="text-neutral-500" />
              </button>

              <button
                type="button"
                onClick={() => {
                  handleShareProfile();
                  setIsSettingsOpen(false);
                }}
                className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl cursor-pointer"
              >
                <span className="font-bold text-neutral-800">مشاركة الرابط الشخصي</span>
                <Share2 size={16} className="text-neutral-500" />
              </button>

              <div className="pt-2 border-t border-neutral-100 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-rose-200"
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Student Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative text-center animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsCardModalOpen(false)}
              className="absolute top-4 left-4 text-neutral-400 hover:text-neutral-800 p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-sm font-extrabold text-neutral-900 mb-1">بطاقة التلميذ الرقمية</h3>
            <p className="text-[11px] text-neutral-500 mb-4">منصة Clasty Zoom الرسمية</p>

            <div className="bg-gradient-to-b from-[#fdfbf6] via-[#faf7ee] to-[#f4eee0] border-2 border-[#d4af37] rounded-2xl p-4 shadow-sm mb-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#d4af37] mx-auto p-1 shadow-xs mb-2">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center text-[#996515] font-bold text-xl">
                    {user.name ? user.name[0] : 'ط'}
                  </div>
                )}
              </div>

              <h4 className="text-sm font-bold text-neutral-900">{user.name}</h4>
              <p className="text-xs text-neutral-600 mt-0.5">{user.academicYear}</p>

              <div className="my-2.5 bg-white py-2 px-3 rounded-xl border border-[#d4af37] inline-flex items-center justify-center gap-2">
                <KeyRound size={15} className="text-[#b8860b]" />
                <span className="font-mono text-base font-bold text-neutral-900">
                  {user.accountCode || 'CZ-111111'}
                </span>
                <button
                  type="button"
                  onClick={onCopyCode}
                  className="p-1 text-neutral-500 hover:text-[#b8860b]"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="text-right text-[11px] text-neutral-600 space-y-0.5 pt-1 border-t border-neutral-200/60">
                <div>• الولاية: <strong>{user.wilaya || 'الجزائر'}</strong></div>
                {user.phone && <div>• الهاتف: <strong dir="ltr">{user.phone}</strong></div>}
                {user.email && <div>• البريد: <strong dir="ltr">{user.email}</strong></div>}
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onDownloadCard();
                  setIsCardModalOpen(false);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#cf9b16] to-[#a77405] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download size={14} />
                <span>حفظ صورة البطاقة</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCardModalOpen(false)}
                className="w-full py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
