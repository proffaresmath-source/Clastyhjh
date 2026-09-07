import { useState, FormEvent } from 'react';
import {
  ArrowRight,
  Save,
  Clock,
  Calculator,
  Gift,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { ToolsSpaceConfig, HistoryQuestion } from '../../types';

interface ToolsManagementPageProps {
  initialConfig: ToolsSpaceConfig;
  onSaveConfig: (updated: ToolsSpaceConfig) => void;
  onBack: () => void;
}

export default function ToolsManagementPage({
  initialConfig,
  onSaveConfig,
  onBack,
}: ToolsManagementPageProps) {
  const [config, setConfig] = useState<ToolsSpaceConfig>(initialConfig);
  const [saveToast, setSaveToast] = useState(false);

  // New Question Form state
  const [newQText, setNewQText] = useState('');
  const [newQEvent, setNewQEvent] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);
  const [newQExplanation, setNewQExplanation] = useState('');

  const handleSave = () => {
    onSaveConfig(config);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onBack();
    }, 900);
  };

  // Add new history question
  const handleAddQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !opt0.trim() || !opt1.trim()) {
      alert('يرجى كتابة نص السؤال وخيارين على الأقل.');
      return;
    }

    const options = [
      opt0.trim(),
      opt1.trim(),
      opt2.trim() || 'خيار إضافي',
      opt3.trim() || 'خيار إضافي',
    ];

    const newQuestion: HistoryQuestion = {
      id: `q_${Date.now()}`,
      question: newQText.trim(),
      dateOrEvent: newQEvent.trim() || 'تاريخ تاريخي',
      options,
      correctAnswerIndex: correctIdx,
      explanation: newQExplanation.trim(),
    };

    setConfig((prev) => ({
      ...prev,
      historyGame: {
        ...prev.historyGame,
        questions: [...prev.historyGame.questions, newQuestion],
      },
    }));

    // Reset inputs
    setNewQText('');
    setNewQEvent('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectIdx(0);
    setNewQExplanation('');
  };

  const handleDeleteQuestion = (qId: string) => {
    setConfig((prev) => ({
      ...prev,
      historyGame: {
        ...prev.historyGame,
        questions: prev.historyGame.questions.filter((q) => q.id !== qId),
      },
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen bg-[#faf9f5] pb-24 text-right" dir="rtl">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e8dfc8] px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-600 transition cursor-pointer"
            title="العودة"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-neutral-900 leading-tight">
              إدارة وتخصيص الخدمات والأدوات (+)
            </h1>
            <p className="text-[11px] text-neutral-500">
              تحكم كامل بالمؤقت التنازلي، الحاسبة، ربح المال، ولعبة التاريخ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Save size={15} />
            <span>حفظ وتطبيق</span>
          </button>
        </div>
      </header>

      {/* Toast */}
      {saveToast && (
        <div className="p-3 mx-4 mt-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>تم حفظ الإعدادات وتحديث الواجهة بنجاح!</span>
        </div>
      )}

      {/* Sections Container */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* ================= SECTION 1: COUNTDOWN TIMER ================= */}
        <div className="bg-white rounded-3xl p-5 border border-[#e8dfc8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center border border-amber-200">
                <Clock size={19} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900">1. مؤقت العد التنازلي للشهادة</h2>
                <p className="text-[11px] text-neutral-500">
                  عرض عد تنازلي مباشر بالأيام والساعات والدقائق لبكالوريا أو بيام 2026
                </p>
              </div>
            </div>

            {/* Toggle Active */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-neutral-700">
                {config.countdown.enabled ? 'مفعّل في الواجهة' : 'غير مفعّل'}
              </span>
              <input
                type="checkbox"
                checked={config.countdown.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    countdown: { ...prev.countdown, enabled: e.target.checked },
                  }))
                }
                className="w-5 h-5 accent-[#d4af37] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Exam Preset Type */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                نوع الامتحان أو الشهادة
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      countdown: {
                        ...prev.countdown,
                        examType: 'bac',
                        title: 'العد التنازلي لبكالوريا 2026',
                        targetDate: '2026-06-07T08:00',
                      },
                    }))
                  }
                  className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                    config.countdown.examType === 'bac'
                      ? 'bg-[#faf0d0] border-[#d4af37] text-[#996515]'
                      : 'bg-white border-neutral-200 text-neutral-600'
                  }`}
                >
                  بكالوريا 2026
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      countdown: {
                        ...prev.countdown,
                        examType: 'bem',
                        title: 'العد التنازلي لشهادة التعليم المتوسط (BEM) 2026',
                        targetDate: '2026-06-01T08:00',
                      },
                    }))
                  }
                  className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                    config.countdown.examType === 'bem'
                      ? 'bg-[#faf0d0] border-[#d4af37] text-[#996515]'
                      : 'bg-white border-neutral-200 text-neutral-600'
                  }`}
                >
                  بيام BEM 2026
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      countdown: {
                        ...prev.countdown,
                        examType: 'custom',
                      },
                    }))
                  }
                  className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${
                    config.countdown.examType === 'custom'
                      ? 'bg-[#faf0d0] border-[#d4af37] text-[#996515]'
                      : 'bg-white border-neutral-200 text-neutral-600'
                  }`}
                >
                  تاريخ مخصص
                </button>
              </div>
            </div>

            {/* Target Date & Time */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                تاريخ وتوقيت الامتحان (سنة-شهر-يوم وساعة)
              </label>
              <input
                type="datetime-local"
                value={config.countdown.targetDate}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    countdown: { ...prev.countdown, targetDate: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37] bg-neutral-50"
                dir="ltr"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                عنوان بطاقة المؤقت
              </label>
              <input
                type="text"
                value={config.countdown.title}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    countdown: { ...prev.countdown, title: e.target.value },
                  }))
                }
                placeholder="مثال: العد التنازلي لبكالوريا 2026"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Motivational Quote */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                عبارة تحفيزية للطلبة
              </label>
              <input
                type="text"
                value={config.countdown.motivationalQuote}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    countdown: { ...prev.countdown, motivationalQuote: e.target.value },
                  }))
                }
                placeholder="مثال: من جدّ وجد والشهادة بيدك بإذن الله!"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: AVERAGE CALCULATOR ================= */}
        <div className="bg-white rounded-3xl p-5 border border-[#e8dfc8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center border border-amber-200">
                <Calculator size={19} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900">2. خدمة حاسبة المعدل حسب كل شعبة</h2>
                <p className="text-[11px] text-neutral-500">
                  حساب دقيق لمعدل شهادة البكالوريا والبيام وفق المعاملات الرسمية لجميع الشعب
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-neutral-700">
                {config.averageCalc.enabled ? 'مفعّل في الواجهة' : 'غير مفعّل'}
              </span>
              <input
                type="checkbox"
                checked={config.averageCalc.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    averageCalc: { ...prev.averageCalc, enabled: e.target.checked },
                  }))
                }
                className="w-5 h-5 accent-[#d4af37] rounded cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              عنوان خدمة الحاسبة
            </label>
            <input
              type="text"
              value={config.averageCalc.title}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  averageCalc: { ...prev.averageCalc, title: e.target.value },
                }))
              }
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 space-y-1">
            <p className="font-bold text-neutral-800">الشعب المدعومة تلقائياً بالحساب الرسمي:</p>
            <p className="text-[11px] text-neutral-500">
              علوم تجريبية • رياضيات • تقني رياضي • تسيير واقتصاد • آداب وفلسفة • لغات أجنبية • شهادة التعليم المتوسط (BEM)
            </p>
          </div>
        </div>

        {/* ================= SECTION 3: REFERRAL & EARN MONEY ================= */}
        <div className="bg-white rounded-3xl p-5 border border-[#e8dfc8] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center border border-amber-200">
                <Gift size={19} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900">3. خانة ربح المال من دعوة الأصدقاء</h2>
                <p className="text-[11px] text-neutral-500">
                  مكافآت مالية للتلاميذ عند مشاركة كود الدعوة مع إمكانية سحب الأرباح عبر بريدي موب
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-neutral-700">
                {config.referral.enabled ? 'مفعّل في الواجهة' : 'غير مفعّل'}
              </span>
              <input
                type="checkbox"
                checked={config.referral.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    referral: { ...prev.referral, enabled: e.target.checked },
                  }))
                }
                className="w-5 h-5 accent-[#d4af37] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                المكافأة عن كل تلميذ ينضم (دج)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={config.referral.rewardPerFriend}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    referral: {
                      ...prev.referral,
                      rewardPerFriend: parseInt(e.target.value, 10) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                الحد الأدنى لطلب سحب الأرباح (دج)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={config.referral.minWithdrawal}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    referral: {
                      ...prev.referral,
                      minWithdrawal: parseInt(e.target.value, 10) || 0,
                    },
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
                dir="ltr"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                نص التعليمات والشروط للتلاميذ
              </label>
              <textarea
                rows={2}
                value={config.referral.instructions}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    referral: { ...prev.referral, instructions: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 4: HISTORY TRIVIA GAME ================= */}
        <div className="bg-white rounded-3xl p-5 border border-[#e8dfc8] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#b8860b] flex items-center justify-center border border-amber-200">
                <HelpCircle size={19} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-neutral-900">
                  4. لعبة وتحدي أسئلة وتواريخ مادة التاريخ
                </h2>
                <p className="text-[11px] text-neutral-500">
                  اختبارات تفاعلية وسريعة لترسيخ تواريخ البكالوريا مع التحكم الكامل بالأسئلة والوقت
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-neutral-700">
                {config.historyGame.enabled ? 'مفعّل في الواجهة' : 'غير مفعّل'}
              </span>
              <input
                type="checkbox"
                checked={config.historyGame.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    historyGame: { ...prev.historyGame, enabled: e.target.checked },
                  }))
                }
                className="w-5 h-5 accent-[#d4af37] rounded cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                عنوان لعبة وتحدي التاريخ
              </label>
              <input
                type="text"
                value={config.historyGame.title}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    historyGame: { ...prev.historyGame, title: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                المهلة الزمنية لكل سؤال (بالثواني)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={config.historyGame.timePerQuestionSeconds}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    historyGame: {
                      ...prev.historyGame,
                      timePerQuestionSeconds: parseInt(e.target.value, 10) || 15,
                    },
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37]"
                dir="ltr"
              />
            </div>
          </div>

          {/* Existing Questions List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-800">
                قائمة الأسئلة الحالية ({config.historyGame.questions.length})
              </h3>
              <span className="text-[10px] text-neutral-400">يمكنك حذف أي سؤال أو إضافة المزيد أدناه</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {config.historyGame.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-[#b8860b] text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-neutral-900">{q.question}</span>
                    </div>
                    <div className="text-[11px] text-neutral-500 pr-7">
                      الحدث: <b className="text-[#b8860b]">{q.dateOrEvent}</b> • الإجابة الصحيحة:{' '}
                      <b className="text-emerald-700">{q.options[q.correctAnswerIndex]}</b>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg transition cursor-pointer shrink-0"
                    title="حذف السؤال"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New History Question Form */}
          <form onSubmit={handleAddQuestion} className="bg-[#faf8f0] p-4 rounded-2xl border border-[#ecdba8] space-y-3">
            <h4 className="text-xs font-bold text-[#7a5808] flex items-center gap-1.5">
              <Plus size={15} className="text-[#b8860b]" />
              <span>إضافة سؤال أو تاريخ جديد للتحدي</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  نص السؤال
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: في أي تاريخ وقعت هجومات الشمال القسنطيني؟"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37] bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  اسم الحدث أو المحطة
                </label>
                <input
                  type="text"
                  placeholder="مثال: هجومات الشمال القسنطيني"
                  value={newQEvent}
                  onChange={(e) => setNewQEvent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37] bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  توضيح أو تعليق يظهر بعد الإجابة
                </label>
                <input
                  type="text"
                  placeholder="مثال: قادها زيغود يوسف لفك الحصار عن الأوراس"
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-[#d4af37] bg-white"
                />
              </div>

              {/* 4 Options */}
              <div className="sm:col-span-2 space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-neutral-700">
                  الخيارات الأربعة (حدد الدائرة أمام الخيار الصحيح):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === 0}
                      onChange={() => setCorrectIdx(0)}
                      className="accent-[#d4af37] cursor-pointer"
                    />
                    <input
                      type="text"
                      required
                      placeholder="الخيار الأول (مثال: 20 أوت 1955)"
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === 1}
                      onChange={() => setCorrectIdx(1)}
                      className="accent-[#d4af37] cursor-pointer"
                    />
                    <input
                      type="text"
                      required
                      placeholder="الخيار الثاني (مثال: 1 نوفمبر 1954)"
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === 2}
                      onChange={() => setCorrectIdx(2)}
                      className="accent-[#d4af37] cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="الخيار الثالث (مثال: 20 أوت 1956)"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === 3}
                      onChange={() => setCorrectIdx(3)}
                      className="accent-[#d4af37] cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="الخيار الرابع (مثال: 19 مارس 1962)"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-left">
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                + إضافة هذا السؤال للتحدي
              </button>
            </div>
          </form>
        </div>

        {/* Floating Save Button at Bottom */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 bg-[#d4af37] hover:bg-[#b8860b] text-white rounded-2xl text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Save size={17} />
            <span>حفظ جميع التغييرات وتطبيقها الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
