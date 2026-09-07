import { useState, FormEvent } from 'react';
import {
  Home,
  BookOpen,
  FileCheck,
  MessageSquare,
  User,
  Video,
  Clock,
  Calendar,
  Sparkles,
  Download,
  Copy,
  Check,
  Camera,
  LogOut,
  Bell,
  Search,
  ExternalLink,
  HelpCircle,
  Send,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  FileText,
  Plus,
} from 'lucide-react';
import { User as UserType, DynamicRow, DynamicRowCard, ToolsSpaceConfig } from '../types';
import InstagramProfile from './InstagramProfile';
import DynamicRowsHome from './DynamicRowsHome';
import AdminDynamicRowsPage from './AdminDynamicRowsPage';
import CardActionModal from './CardActionModal';
import ToolsSpaceHome from './tools/ToolsSpaceHome';
import ToolsManagementPage from './tools/ToolsManagementPage';
import { loadDynamicRows, saveDynamicRows } from '../data/dynamicRowsData';
import { loadToolsConfig, saveToolsConfig } from '../data/toolsData';

interface StudentDashboardProps {
  user: UserType;
  onLogout: () => void;
}

type TabType = 'home' | 'tools' | 'lessons' | 'exams' | 'forum' | 'profile' | 'admin' | 'tools_admin';

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [dynamicRows, setDynamicRows] = useState<DynamicRow[]>(() => loadDynamicRows());
  const [toolsConfig, setToolsConfig] = useState<ToolsSpaceConfig>(() => loadToolsConfig());
  const [selectedCardForAction, setSelectedCardForAction] = useState<DynamicRowCard | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [forumQuestion, setForumQuestion] = useState('');
  const [forumPosts, setForumPosts] = useState([
    {
      id: 'f1',
      studentName: 'ياسين م.',
      time: 'منذ 25 دقيقة',
      subject: 'الرياضيات',
      question: 'هل يمكن للأستاذ شرح طريقة إزالة حالة عدم التعيين في الدوال الأسية بحساب التزايد المقارن؟',
      replies: 2,
      teacherAnswer: 'نعم يا ياسين، راجع الدقيقة 42 من تسجيل حصة الأمس، وستجد تطبيقاً مباشراً لقاعدة التزايد المقارن.',
    },
    {
      id: 'f2',
      studentName: 'أميرة ب.',
      time: 'منذ ساعتين',
      subject: 'العلوم الفيزيائية',
      question: 'في المعايرة اللونية، كيف نحدد نقطة التكافؤ بدقة عند تغير لون الكاشف الملون؟',
      replies: 3,
      teacherAnswer: 'نقطة التكافؤ توافق القطرة التي يتغير عندها اللون ويثبت لمدة 30 ثانية على الأقل.',
    },
  ]);
  const [selectedSubject, setSelectedSubject] = useState<string>('الكل');

  const handleCopyCode = async () => {
    const code = user.accountCode || 'CZ-111111';
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 600;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Clasty Zoom - بطاقة التلميذ الرسمية', canvas.width / 2, 80);

    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(80, 140, canvas.width - 160, 140);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('رمز تسجيل الدخول', canvas.width / 2, 185);

    ctx.font = 'bold 48px monospace';
    ctx.fillText(user.accountCode || 'CZ-111111', canvas.width / 2, 245);

    ctx.textAlign = 'right';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#333333';
    const rx = canvas.width - 100;
    ctx.fillText(`• الاسم: ${user.name}`, rx, 350);
    ctx.fillText(`• الشعبة والمستوى: ${user.academicYear || 'مسجل'}`, rx, 400);
    ctx.fillText(`• الولاية: ${user.wilaya || 'الجزائر'}`, rx, 450);

    const link = document.createElement('a');
    link.download = `ClastyZoom-Card-${user.accountCode || 'code'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePostQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!forumQuestion.trim()) return;

    setForumPosts([
      {
        id: `f_${Date.now()}`,
        studentName: user.name || 'طالب',
        time: 'الآن',
        subject: 'استفسار عام',
        question: forumQuestion.trim(),
        replies: 0,
        teacherAnswer: '',
      },
      ...forumPosts,
    ]);
    setForumQuestion('');
  };

  const subjects = [
    'الكل',
    'الرياضيات',
    'العلوم الفيزيائية',
    'علوم الطبيعة والحياة',
    'اللغة العربية',
    'الفلسفة',
    'اللغة الفرنسية',
    'اللغة الإنجليزية',
    'التاريخ والجغرافيا',
  ];

  const handleSaveDynamicRows = (updated: DynamicRow[]) => {
    setDynamicRows(updated);
    saveDynamicRows(updated);
  };

  const handleSaveToolsConfig = (updated: ToolsSpaceConfig) => {
    setToolsConfig(updated);
    saveToolsConfig(updated);
  };

  // When clicking (+) the control panel opens as a dedicated full new page
  if (activeTab === 'admin') {
    return (
      <AdminDynamicRowsPage
        rows={dynamicRows}
        onSaveRows={handleSaveDynamicRows}
        onBackToHome={() => setActiveTab('home')}
      />
    );
  }

  // When on tools tab and clicking (+), open dedicated full page for tools & countdown
  if (activeTab === 'tools_admin') {
    return (
      <ToolsManagementPage
        initialConfig={toolsConfig}
        onSaveConfig={handleSaveToolsConfig}
        onBack={() => setActiveTab('tools')}
      />
    );
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto min-h-screen bg-[#faf9f5] flex flex-col justify-between pb-24 select-text"
      id="student-dashboard"
      dir="rtl"
    >
      {/* Top Clean App Bar - clasty zoom on the right and prominent (+) control button on the left */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#f0ebd9] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-none select-none" dir="rtl">
        <h1
          className="inline-flex items-baseline font-vintage-insta text-2xl sm:text-3xl text-[#1a1a1a] tracking-wide leading-none select-none"
          dir="ltr"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          <span>clasty</span>
          <span className="ml-1.5">zoom</span>
        </h1>

        {/* Clear & Sleek (+) Button: opens tools admin when on tools tab, or dynamic rows admin when elsewhere */}
        <button
          type="button"
          onClick={() => {
            if (activeTab === 'tools' || activeTab === 'lessons') {
              setActiveTab('tools_admin');
            } else {
              setActiveTab('admin');
            }
          }}
          className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-700 hover:text-[#b8860b] flex items-center justify-center transition-all cursor-pointer active:scale-90 outline-none focus:outline-none focus:ring-0 active:outline-none shadow-none"
          title={
            activeTab === 'tools' || activeTab === 'lessons'
              ? 'إدارة وتخصيص الأدوات والمؤقت (+)'
              : 'لوحة تحكم ونشر الباقات والرفوف (+)'
          }
          aria-label="لوحة التحكم"
          id="header-plus-button"
        >
          <Plus size={18} className="stroke-[2.2]" />
        </button>
      </header>

      {/* Main Body per Tab */}
      <main className={`flex-1 ${activeTab === 'profile' ? 'p-0 bg-white' : 'p-4 sm:p-6'}`}>
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <DynamicRowsHome
            user={user}
            rows={dynamicRows}
            onOpenAdmin={() => setActiveTab('admin')}
            onCardClick={(card) => setSelectedCardForAction(card)}
            onNavigateToLessons={() => setActiveTab('tools')}
            onNavigateToExams={() => setActiveTab('exams')}
          />
        )}

        {/* ================= TAB 2: TOOLS & COUNTDOWN (EMPTY INITIALLY, CONFIGURED WITH (+)) ================= */}
        {(activeTab === 'tools' || activeTab === 'lessons') && (
          <ToolsSpaceHome
            config={toolsConfig}
            user={user}
            onOpenManage={() => setActiveTab('tools_admin')}
          />
        )}

        {/* ================= TAB 3: EXAMS & BANK ================= */}
        {activeTab === 'exams' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-neutral-900">بنك التمارين والحوليات</h2>
              <p className="text-xs text-neutral-500">تمارين نموذجية ومواضيع الامتحانات الرسمية مع الحلول</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#e8dfc8] shadow-xs">
                <span className="text-lg font-black text-[#d4af37] block">+1500</span>
                <span className="text-[11px] text-neutral-600 font-semibold">تمرين محلول</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#e8dfc8] shadow-xs">
                <span className="text-lg font-black text-neutral-900 block">100%</span>
                <span className="text-[11px] text-neutral-600 font-semibold">حلول نموذجية معتمدة</span>
              </div>
            </div>

            {/* Exam Categories */}
            <div className="space-y-2.5">
              {[
                {
                  title: 'حوليات البكالوريا الرسمية (2018 - 2025)',
                  desc: 'جميع الشعب مع التصحيح الوزاري وسلم التنقيط',
                  count: '48 موضوع',
                },
                {
                  title: 'سلاسل التمارين التدريبية للوحدة الأولى',
                  desc: 'تمارين متدرجة من البسيط إلى المعقد لترسيخ المفاهيم',
                  count: '15 سلسلة',
                },
                {
                  title: 'نماذج فروض واختبارات الفصل الأول',
                  desc: 'مقترحة من ثانويات النخبة عبر الوطن',
                  count: '24 نموذج',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-3.5 border border-[#e8dfc8] shadow-xs flex items-center justify-between"
                >
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-neutral-900 mb-0.5">{item.title}</h3>
                    <p className="text-[11px] text-neutral-500">{item.desc}</p>
                    <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5 font-bold border border-emerald-200">
                      {item.count}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`فتح ملفات: ${item.title}`)}
                    className="p-2 bg-amber-50 hover:bg-amber-100 text-[#b8860b] rounded-xl transition cursor-pointer shrink-0 mr-2"
                  >
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: FORUM / Q&A ================= */}
        {activeTab === 'forum' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-neutral-900">فضاء الاستفسارات والأسئلة</h2>
              <p className="text-xs text-neutral-500">اطرح سؤالك وسيجيبك الأساتذة المتخصصون والزملاء</p>
            </div>

            {/* Post a Question form */}
            <form onSubmit={handlePostQuestion} className="bg-white rounded-2xl p-3.5 border border-[#e8dfc8] shadow-xs">
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                طرح سؤال جديد
              </label>
              <textarea
                value={forumQuestion}
                onChange={(e) => setForumQuestion(e.target.value)}
                placeholder="اكتب سؤالك بوضوح (مثلاً: في تمرين الفيزياء رقم 4 الصفحة 22...)"
                rows={3}
                className="w-full bg-[#faf9f5] border border-[#e8dfc8] focus:border-[#d4af37] rounded-xl p-3 text-xs text-neutral-900 outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!forumQuestion.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={13} className="rotate-180" />
                  <span>إرسال السؤال</span>
                </button>
              </div>
            </form>

            {/* Questions Stream */}
            <div className="space-y-3">
              {forumPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#e8dfc8] shadow-xs text-right"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-neutral-900">{post.studentName}</span>
                    <span className="text-[10px] text-neutral-400">{post.time}</span>
                  </div>
                  <p className="text-xs text-neutral-800 leading-relaxed mb-2.5">
                    {post.question}
                  </p>

                  {post.teacherAnswer && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 mt-2">
                      <div className="flex items-center gap-1.5 text-[#b8860b] text-[11px] font-bold mb-1">
                        <ShieldCheck size={14} />
                        <span>إجابة الأستاذ المشرف</span>
                      </div>
                      <p className="text-[11px] text-neutral-700 leading-relaxed">
                        {post.teacherAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: PROFILE (منظم مثل انستغرام) ================= */}
        {activeTab === 'profile' && (
          <InstagramProfile
            user={user}
            onLogout={onLogout}
            onCopyCode={handleCopyCode}
            copiedCode={copiedCode}
            onDownloadCard={handleDownloadCard}
          />
        )}
      </main>

      {/* ================= BOTTOM NAVIGATION BAR (أيقونات نظيفة فقط بدون نصوص وبدون أي ظل) ================= */}
      <nav
        className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#e8dfc8] shadow-none z-40 max-w-lg sm:max-w-xl mx-auto rounded-t-2xl"
        id="bottom-navigation-bar"
        dir="rtl"
      >
        <div className="grid grid-cols-5 h-14 items-center px-2">
          {/* Tab 1: Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center justify-center h-full transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none shadow-none ${
              activeTab === 'home'
                ? 'text-[#b8860b] scale-105'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
            id="nav-tab-home"
            title="الرئيسية"
            aria-label="الرئيسية"
          >
            <div className={`p-2 rounded-2xl transition shadow-none ${activeTab === 'home' ? 'bg-amber-50/80 text-[#b8860b]' : ''}`}>
              <Home size={22} className={activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
          </button>

          {/* Tab 2: Clock / Timer / Tools */}
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`flex items-center justify-center h-full transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none shadow-none ${
              activeTab === 'tools' || activeTab === 'lessons'
                ? 'text-[#b8860b] scale-105'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
            id="nav-tab-tools"
            title="المؤقت والخدمات"
            aria-label="المؤقت والخدمات"
          >
            <div className={`p-2 rounded-2xl transition shadow-none ${activeTab === 'tools' || activeTab === 'lessons' ? 'bg-amber-50/80 text-[#b8860b]' : ''}`}>
              <Clock size={22} className={activeTab === 'tools' || activeTab === 'lessons' ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
          </button>

          {/* Tab 3: Exams */}
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`flex items-center justify-center h-full transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none shadow-none ${
              activeTab === 'exams'
                ? 'text-[#b8860b] scale-105'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
            id="nav-tab-exams"
            title="التمارين"
            aria-label="التمارين"
          >
            <div className={`p-2 rounded-2xl transition shadow-none ${activeTab === 'exams' ? 'bg-amber-50/80 text-[#b8860b]' : ''}`}>
              <FileCheck size={22} className={activeTab === 'exams' ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
          </button>

          {/* Tab 4: Forum */}
          <button
            type="button"
            onClick={() => setActiveTab('forum')}
            className={`flex items-center justify-center h-full transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none shadow-none ${
              activeTab === 'forum'
                ? 'text-[#b8860b] scale-105'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
            id="nav-tab-forum"
            title="المنتدى"
            aria-label="المنتدى"
          >
            <div className={`p-2 rounded-2xl transition shadow-none ${activeTab === 'forum' ? 'bg-amber-50/80 text-[#b8860b]' : ''}`}>
              <MessageSquare size={22} className={activeTab === 'forum' ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
          </button>

          {/* Tab 5: Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center h-full transition-all cursor-pointer select-none outline-none focus:outline-none focus:ring-0 active:outline-none shadow-none ${
              activeTab === 'profile'
                ? 'text-[#b8860b] scale-105'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
            id="nav-tab-profile"
            title="حسابي"
            aria-label="حسابي"
          >
            <div className={`p-2 rounded-2xl transition shadow-none ${activeTab === 'profile' ? 'bg-amber-50/80 text-[#b8860b]' : ''}`}>
              <User size={22} className={activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
          </button>
        </div>
      </nav>

      {/* Student Card Interactive Details & Subscription Modal */}
      <CardActionModal
        card={selectedCardForAction}
        onClose={() => setSelectedCardForAction(null)}
        user={user}
      />
    </div>
  );
}
