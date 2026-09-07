import { useState, useEffect, FormEvent } from 'react';
import {
  HelpCircle,
  Timer,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Flame,
  ChevronLeft,
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { HistoryGameConfig, HistoryQuestion, HistoryDateItem } from '../../types';
import { INITIAL_HISTORY_DATES, INITIAL_HISTORY_QUESTIONS } from '../../data/toolsData';

interface HistoryGameWidgetProps {
  config: HistoryGameConfig;
  onOpenManage?: () => void;
}

type TabType = 'quiz' | 'dates_bank' | 'trainer_add';

export default function HistoryGameWidget({ config }: HistoryGameWidgetProps) {
  const [activeTab, setActiveTab] = useState<TabType>('quiz');

  // Stored questions and dates
  const [questions, setQuestions] = useState<HistoryQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('bac_custom_history_questions_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return config.questions && config.questions.length > 0 ? config.questions : INITIAL_HISTORY_QUESTIONS;
  });

  const [datesBank, setDatesBank] = useState<HistoryDateItem[]>(() => {
    try {
      const saved = localStorage.getItem('bac_custom_history_dates_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return config.customDates && config.customDates.length > 0 ? config.customDates : INITIAL_HISTORY_DATES;
  });

  // Save to local storage on change
  const saveQuestions = (newQuestions: HistoryQuestion[]) => {
    setQuestions(newQuestions);
    try {
      localStorage.setItem('bac_custom_history_questions_v1', JSON.stringify(newQuestions));
    } catch (e) {
      console.error(e);
    }
  };

  const saveDates = (newDates: HistoryDateItem[]) => {
    setDatesBank(newDates);
    try {
      localStorage.setItem('bac_custom_history_dates_v1', JSON.stringify(newDates));
    } catch (e) {
      console.error(e);
    }
  };

  // ================= QUIZ GAME STATE =================
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestionSeconds || 15);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!isPlaying || isAnswered || isGameOver || !currentQ) return;

    if (timeLeft <= 0) {
      setIsAnswered(true);
      setStreak(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isAnswered, isGameOver, timeLeft, currentQ]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(config.timePerQuestionSeconds || 15);
    setIsGameOver(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(config.timePerQuestionSeconds || 15);
    } else {
      setIsGameOver(true);
    }
  };

  // ================= DATES FLASHCARDS STATE =================
  const [revealedDateIds, setRevealedDateIds] = useState<Record<string, boolean>>({});
  const [selectedDateCategory, setSelectedDateCategory] = useState<string>('all');

  const filteredDates = datesBank.filter((d) => {
    if (selectedDateCategory === 'all') return true;
    return d.category === selectedDateCategory;
  });

  const toggleRevealDate = (id: string) => {
    setRevealedDateIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ================= TRAINER INPUT FORM STATE =================
  const [trainerMode, setTrainerMode] = useState<'add_date' | 'add_question'>('add_date');

  // Form: Add Date
  const [newDateVal, setNewDateVal] = useState('');
  const [newEventVal, setNewEventVal] = useState('');
  const [newDateCategory, setNewDateCategory] = useState<'revolution' | 'cold_war' | 'movement' | 'bem'>('revolution');
  const [newDateNote, setNewDateNote] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Form: Add Question
  const [newQText, setNewQText] = useState('');
  const [newQDate, setNewQDate] = useState('');
  const [newCorrectAns, setNewCorrectAns] = useState('');
  const [newWrong1, setNewWrong1] = useState('');
  const [newWrong2, setNewWrong2] = useState('');
  const [newWrong3, setNewWrong3] = useState('');
  const [newQExplanation, setNewQExplanation] = useState('');

  const handleAddDateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newDateVal.trim() || !newEventVal.trim()) return;

    const newDateItem: HistoryDateItem = {
      id: `custom_d_${Date.now()}`,
      date: newDateVal.trim(),
      event: newEventVal.trim(),
      category: newDateCategory,
      note: newDateNote.trim() || undefined,
      isUserCreated: true,
    };

    const updated = [newDateItem, ...datesBank];
    saveDates(updated);

    // Also automatically create a quiz question from this date!
    const autoQuestion: HistoryQuestion = {
      id: `auto_q_${Date.now()}`,
      question: `في أي تاريخ حدث: "${newEventVal.trim()}"؟`,
      dateOrEvent: newDateVal.trim(),
      options: [newDateVal.trim(), '1 نوفمبر 1954', '20 أوت 1956', '19 مارس 1962'],
      correctAnswerIndex: 0,
      explanation: newDateNote.trim() || `تاريخ الحدث: ${newDateVal.trim()}`,
      isUserCreated: true,
    };
    saveQuestions([autoQuestion, ...questions]);

    setNewDateVal('');
    setNewEventVal('');
    setNewDateNote('');
    setFormSuccessMessage('تم تدريب المنصة بنجاح وإضافة التاريخ مع توليد سؤال تدريبي آلياً!');
    setTimeout(() => setFormSuccessMessage(null), 3500);
  };

  const handleAddQuestionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newCorrectAns.trim() || !newWrong1.trim()) return;

    const opts = [
      newCorrectAns.trim(),
      newWrong1.trim(),
      newWrong2.trim() || '19 مارس 1962',
      newWrong3.trim() || '5 جويلية 1962',
    ];

    const newQ: HistoryQuestion = {
      id: `custom_q_${Date.now()}`,
      question: newQText.trim(),
      dateOrEvent: newQDate.trim() || 'سؤال مخصص',
      options: opts,
      correctAnswerIndex: 0,
      explanation: newQExplanation.trim() || undefined,
      isUserCreated: true,
    };

    const updated = [newQ, ...questions];
    saveQuestions(updated);

    setNewQText('');
    setNewQDate('');
    setNewCorrectAns('');
    setNewWrong1('');
    setNewWrong2('');
    setNewWrong3('');
    setNewQExplanation('');

    setFormSuccessMessage('تمت إضافة السؤال بنجاح إلى بنك التحديات والتدريب!');
    setTimeout(() => setFormSuccessMessage(null), 3500);
  };

  const handleDeleteCustomDate = (id: string) => {
    const updated = datesBank.filter((d) => d.id !== id);
    saveDates(updated);
  };

  const handleDeleteCustomQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    saveQuestions(updated);
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-none text-right space-y-4 select-none"
      id="history-trainer-widget"
      dir="rtl"
    >
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 gap-2 flex-wrap">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 leading-tight">
            تدريب واختبار مادة التاريخ
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            تحدي الأسئلة، قاموس التواريخ، وتدريب المنصة بإضافة تواريخ وأسئلة جديدة
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200/70">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer outline-none flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <HelpCircle size={14} />
            <span>الاختبار والتحدي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dates_bank')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer outline-none flex items-center gap-1.5 ${
              activeTab === 'dates_bank'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <BookOpen size={14} />
            <span>حفظ التواريخ ({datesBank.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trainer_add')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer outline-none flex items-center gap-1.5 ${
              activeTab === 'trainer_add'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Plus size={14} />
            <span>تدريب وإضافة (+)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: QUIZ CHALLENGE ================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {!isPlaying && !isGameOver ? (
            <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-300 text-neutral-800 flex items-center justify-center mx-auto shadow-none">
                <Timer size={24} />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                جاهز لاختبار حفظك لتواريخ البكالوريا والبيام؟
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                يحتوي بنك الأسئلة الحالي على <strong>{questions.length}</strong> سؤالاً تاريخياً. أمامك 15 ثانية لكل سؤال، والإجابات الصحيحة تمنحك نقاطاً وتسلسلاً إيجابياً.
              </p>
              <button
                type="button"
                onClick={handleStartGame}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-none active:scale-95 outline-none"
              >
                بدء التحدي الآن
              </button>
            </div>
          ) : isGameOver ? (
            <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-200/80 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-300 text-neutral-800 flex items-center justify-center mx-auto shadow-none">
                <Award size={30} />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-1">
                  اكتمل الاختبار! نتيجتك: {score} من {questions.length}
                </h4>
                <p className="text-xs text-neutral-500">
                  {score >= questions.length * 0.8
                    ? 'أداء ممتاز جداً! حفظك لتواريخ المنهاج قوي وثابت.'
                    : 'محاولة جيدة! استمر في التدريب ومراجعة قاموس التواريخ لتحقيق العلامة الكاملة.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-none outline-none"
                >
                  <RotateCcw size={14} />
                  <span>إعادة التحدي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('trainer_add')}
                  className="px-5 py-2.5 bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-100 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-none outline-none"
                >
                  <Plus size={14} />
                  <span>إضافة أسئلة جديدة للتدريب</span>
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="space-y-4">
              {/* Top Progress & Stats */}
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2">
                  <span>السؤال {currentIndex + 1} من {questions.length}</span>
                  {currentQ.isUserCreated && (
                    <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-md">
                      سؤال مخصص
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-mono text-neutral-800">
                    <Timer size={14} />
                    <span>{timeLeft} ثانية</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-700">
                    <Flame size={14} />
                    <span>سلسلة: {streak}</span>
                  </div>

                  <div className="font-mono text-neutral-900">
                    النقاط: {score}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-white rounded-2xl border-2 border-neutral-800 text-right">
                <span className="text-[10px] font-bold text-neutral-400 block mb-1">
                  المحطة أو التاريخ المعني: {currentQ.dateOrEvent}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800';

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-red-50 border-red-500 text-red-900 font-bold';
                    } else {
                      btnStyle = 'bg-neutral-50 border-neutral-200 text-neutral-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3 rounded-xl border text-right text-xs font-semibold transition-all cursor-pointer flex items-center justify-between outline-none ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === currentQ.correctAnswerIndex && (
                        <CheckCircle size={16} className="text-emerald-700 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswerIndex && (
                        <XCircle size={16} className="text-red-700 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {isAnswered && (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  {currentQ.explanation && (
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      💡 <strong>الشرح التوضيحي:</strong> {currentQ.explanation}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer outline-none"
                    >
                      <span>{currentIndex + 1 < questions.length ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* ================= TAB 2: DATES BANK (قاموس وحفظ التواريخ) ================= */}
      {activeTab === 'dates_bank' && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDateCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedDateCategory === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              الكل ({datesBank.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateCategory('revolution')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedDateCategory === 'revolution'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              الثورة التحريرية
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateCategory('cold_war')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedDateCategory === 'cold_war'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              العلاقات الدولية / الحرب الباردة
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateCategory('movement')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedDateCategory === 'movement'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              حركة عدم الانحياز
            </button>
          </div>

          <p className="text-[11px] text-neutral-500">
            انقر على زر العين لإخفاء/إظهار التاريخ أو الحدث لاختبار قوة حفظك واسترجاعك للمعلومة:
          </p>

          {/* Dates List */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto no-scrollbar">
            {filteredDates.map((item) => {
              const isRevealed = revealedDateIds[item.id] ?? true;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 flex items-start justify-between gap-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs sm:text-sm text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {item.date}
                      </span>
                      {item.isUserCreated && (
                        <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-md">
                          مضاف من قِبلك
                        </span>
                      )}
                    </div>

                    {isRevealed ? (
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-neutral-800 leading-snug">
                          {item.event}
                        </h5>
                        {item.note && (
                          <p className="text-[11px] text-neutral-500 mt-0.5">{item.note}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-neutral-400 italic">
                        [الحدث مخفي لاختبار حفظك.. اضغط على الأيقونة لكشفه]
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRevealDate(item.id)}
                      title="إظهار / إخفاء للاختبار"
                      className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 transition cursor-pointer"
                    >
                      {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>

                    {item.isUserCreated && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomDate(item.id)}
                        title="حذف هذا التاريخ"
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRAINER (إضافة وتدريب تواريخ وأسئلة) ================= */}
      {activeTab === 'trainer_add' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-2.5">
            <button
              type="button"
              onClick={() => setTrainerMode('add_date')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                trainerMode === 'add_date'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              تدريب تاريخ وحدث جديد
            </button>
            <button
              type="button"
              onClick={() => setTrainerMode('add_question')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                trainerMode === 'add_question'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              تدريب سؤال اختياري جديد
            </button>
          </div>

          {formSuccessMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          {/* Form 1: Add Date */}
          {trainerMode === 'add_date' && (
            <form onSubmit={handleAddDateSubmit} className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    التاريخ (اليوم، الشهر، السنة):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 19 مارس 1962 أو 8 ماي 1945"
                    value={newDateVal}
                    onChange={(e) => setNewDateVal(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    التصنيف:
                  </label>
                  <select
                    value={newDateCategory}
                    onChange={(e) => setNewDateCategory(e.target.value as any)}
                    className="w-full text-xs font-bold py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900 cursor-pointer"
                  >
                    <option value="revolution">الثورة التحريرية الجزائرية</option>
                    <option value="cold_war">العلاقات الدولية / الحرب الباردة</option>
                    <option value="movement">حركة عدم الانحياز</option>
                    <option value="bem">شهادة التعليم المتوسط (BEM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  الحدث التاريخي المقابل:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إعلان وقف إطلاق النار (عيد النصر)"
                  value={newEventVal}
                  onChange={(e) => setNewEventVal(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ملاحظة أو تفاصيل شارحة (اختياري):
                </label>
                <input
                  type="text"
                  placeholder="مثال: نتج عن مفاوضات إيفيان الثانية وأقر وقف العمليات العسكرية"
                  value={newDateNote}
                  onChange={(e) => setNewDateNote(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>حفظ في قاموس التواريخ وتوليد سؤال تدريبي له</span>
              </button>
            </form>
          )}

          {/* Form 2: Add Question */}
          {trainerMode === 'add_question' && (
            <form onSubmit={handleAddQuestionSubmit} className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  نص السؤال:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: متى أُعلن عن مشروع قسنطينة الإغرائي؟"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">
                    الإجابة الصحيحة:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 3 أكتوبر 1958"
                    value={newCorrectAns}
                    onChange={(e) => setNewCorrectAns(e.target.value)}
                    className="w-full text-xs font-bold py-2 px-3 bg-emerald-50/50 border border-emerald-300 rounded-xl outline-none focus:border-emerald-700 text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-800 mb-1">
                    خيار خاطئ (1):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 19 سبتمبر 1958"
                    value={newWrong1}
                    onChange={(e) => setNewWrong1(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    خيار خاطئ (2):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 20 أوت 1956"
                    value={newWrong2}
                    onChange={(e) => setNewWrong2(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    خيار خاطئ (3):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 1 نوفمبر 1954"
                    value={newWrong3}
                    onChange={(e) => setNewWrong3(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  شرح أو معلومة إضافية (يظهر بعد الإجابة):
                </label>
                <input
                  type="text"
                  placeholder="مثال: مشروع اقتصادي إغرائي أطلقه ديغول في زيارته لقسنطينة لفصل الشعب عن الثورة"
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 bg-white border border-neutral-300 rounded-xl outline-none focus:border-neutral-900 text-neutral-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>إضافة السؤال إلى بنك الاختبارات</span>
              </button>
            </form>
          )}

          {/* List of custom questions added */}
          <div className="pt-2">
            <h5 className="text-xs font-bold text-neutral-800 mb-2">
              الأسئلة والتواريخ المضافة من قبلك ({questions.filter((q) => q.isUserCreated).length})
            </h5>
            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
              {questions.filter((q) => q.isUserCreated).length === 0 ? (
                <p className="text-[11px] text-neutral-400 italic">لم تقم بإضافة أسئلة مخصصة بعد. قم بإضافة أسئلتك وتواريخك أعلاه لتدريب التطبيق عليها!</p>
              ) : (
                questions
                  .filter((q) => q.isUserCreated)
                  .map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-2 bg-white rounded-xl border border-neutral-200 text-xs"
                    >
                      <span className="font-semibold text-neutral-800 truncate max-w-[80%]">
                        {q.question}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
