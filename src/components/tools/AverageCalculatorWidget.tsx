import { useState, useMemo, useRef } from 'react';
import { Printer, RotateCcw, Award, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { AverageCalcConfig } from '../../types';

interface SubjectDef {
  id: string;
  name: string;
  nameFr: string;
  coef: number;
}

interface StreamDef {
  key: string;
  name: string;
  shortName: string;
  examType: 'bac' | 'bem';
  subjects: SubjectDef[];
}

const STREAMS_DATA: Record<string, StreamDef> = {
  sciences: {
    key: 'sciences',
    name: 'شعبة علوم تجريبية',
    shortName: 'علوم تجريبية',
    examType: 'bac',
    subjects: [
      { id: 'sciences_nature', name: 'علوم الطبيعة والحياة', nameFr: 'Sciences Naturelles', coef: 6 },
      { id: 'physique', name: 'العلوم الفيزيائية', nameFr: 'Physique-Chimie', coef: 5 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 5 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 3 },
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 2 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 2 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 2 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  math: {
    key: 'math',
    name: 'شعبة رياضيات',
    shortName: 'رياضيات',
    examType: 'bac',
    subjects: [
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 7 },
      { id: 'physique', name: 'العلوم الفيزيائية', nameFr: 'Physique-Chimie', coef: 6 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 3 },
      { id: 'sciences_nature', name: 'علوم الطبيعة والحياة', nameFr: 'Sciences Naturelles', coef: 2 },
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 2 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 2 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 2 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  technique: {
    key: 'technique',
    name: 'شعبة تقني رياضي (هندسة)',
    shortName: 'تقني رياضي',
    examType: 'bac',
    subjects: [
      { id: 'tech', name: 'التكنولوجيا (الهندسة)', nameFr: 'Technologie', coef: 7 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 6 },
      { id: 'physique', name: 'العلوم الفيزيائية', nameFr: 'Physique-Chimie', coef: 6 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 3 },
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 2 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 2 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 2 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  gestion: {
    key: 'gestion',
    name: 'شعبة تسيير واقتصاد',
    shortName: 'تسيير واقتصاد',
    examType: 'bac',
    subjects: [
      { id: 'compta', name: 'التسيير المحاسبي والمالي', nameFr: 'Gestion Comptable', coef: 6 },
      { id: 'eco', name: 'الاقتصاد والمناجمنت', nameFr: 'Economie & Mgmt', coef: 5 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 5 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 4 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 3 },
      { id: 'droit', name: 'القانون', nameFr: 'Droit', coef: 2 },
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 2 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 2 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  lettres: {
    key: 'lettres',
    name: 'شعبة آداب وفلسفة',
    shortName: 'آداب وفلسفة',
    examType: 'bac',
    subjects: [
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 6 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 6 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 4 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 3 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 3 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  langues: {
    key: 'langues',
    name: 'شعبة لغات أجنبية',
    shortName: 'لغات أجنبية',
    examType: 'bac',
    subjects: [
      { id: 'langue3', name: 'اللغة الأجنبية الثالثة (إسبانية/ألمانية/إيطالية)', nameFr: 'Langue 3', coef: 5 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 5 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 5 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 5 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 2 },
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 2 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  arts: {
    key: 'arts',
    name: 'شعبة الفنون',
    shortName: 'شعبة الفنون',
    examType: 'bac',
    subjects: [
      { id: 'art_spec', name: 'مادة التخصص الفني (سمعي بصري/رسم/موسيقى)', nameFr: 'Pratique Artistique', coef: 6 },
      { id: 'arabe', name: 'اللغة العربية وآدابها', nameFr: 'Langue Arabe', coef: 4 },
      { id: 'philo', name: 'الفلسفة', nameFr: 'Philosophie', coef: 3 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 3 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 3 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 2 },
      { id: 'physique', name: 'العلوم الفيزيائية', nameFr: 'Physique', coef: 2 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 2 },
      { id: 'islamique', name: 'العلوم الإسلامية', nameFr: 'Sciences Islamiques', coef: 2 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
  bem: {
    key: 'bem',
    name: 'شهادة التعليم المتوسط (BEM)',
    shortName: 'بيام BEM',
    examType: 'bem',
    subjects: [
      { id: 'arabe', name: 'اللغة العربية', nameFr: 'Langue Arabe', coef: 5 },
      { id: 'math', name: 'الرياضيات', nameFr: 'Mathématiques', coef: 4 },
      { id: 'francais', name: 'اللغة الفرنسية', nameFr: 'Langue Française', coef: 3 },
      { id: 'histoire_geo', name: 'التاريخ والجغرافيا', nameFr: 'Histoire-Géo', coef: 3 },
      { id: 'physique', name: 'العلوم الفيزيائية والتكنولوجيا', nameFr: 'Physique-Techno', coef: 2 },
      { id: 'sciences_nature', name: 'علوم الطبيعة والحياة', nameFr: 'Sciences Naturelles', coef: 2 },
      { id: 'anglais', name: 'اللغة الإنجليزية', nameFr: 'Langue Anglaise', coef: 2 },
      { id: 'islamique', name: 'التربية الإسلامية', nameFr: 'Education Islamique', coef: 2 },
      { id: 'civique', name: 'التربية المدنية', nameFr: 'Education Civique', coef: 1 },
      { id: 'sport', name: 'التربية البدنية والرياضية', nameFr: 'Education Physique', coef: 1 },
    ],
  },
};

interface AverageCalculatorWidgetProps {
  config: AverageCalcConfig;
  onOpenManage?: () => void;
}

export default function AverageCalculatorWidget({ config }: AverageCalculatorWidgetProps) {
  const [selectedStreamKey, setSelectedStreamKey] = useState<string>('sciences');
  const [candidateName, setCandidateName] = useState<string>('أمين بن علي');
  const [regNumber, setRegNumber] = useState<string>('31048291');
  const [grades, setGrades] = useState<Record<string, string>>({});
  const transcriptRef = useRef<HTMLDivElement>(null);

  const currentStream = STREAMS_DATA[selectedStreamKey] || STREAMS_DATA.sciences;

  const handleGradeChange = (subjectId: string, val: string) => {
    // allow empty or numbers between 0 and 20 (up to 2 decimals)
    if (val === '') {
      setGrades((prev) => ({ ...prev, [subjectId]: '' }));
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 20) {
      setGrades((prev) => ({ ...prev, [subjectId]: val }));
    }
  };

  // Compute live totals
  const { totalPoints, totalCoef, average, enteredCount } = useMemo(() => {
    let pointsSum = 0;
    let coefSum = 0;
    let count = 0;

    currentStream.subjects.forEach((sub) => {
      coefSum += sub.coef;
      const gStr = grades[sub.id];
      if (gStr !== undefined && gStr !== '') {
        const val = parseFloat(gStr);
        if (!isNaN(val)) {
          pointsSum += val * sub.coef;
          count += 1;
        }
      }
    });

    const avg = coefSum > 0 && count > 0 ? pointsSum / coefSum : 0;
    return {
      totalPoints: parseFloat(pointsSum.toFixed(2)),
      totalCoef: coefSum,
      average: parseFloat(avg.toFixed(2)),
      enteredCount: count,
    };
  }, [currentStream, grades]);

  const getSubjectAppreciation = (valStr: string) => {
    if (!valStr || valStr === '') return '-';
    const num = parseFloat(valStr);
    if (isNaN(num)) return '-';
    if (num >= 18) return 'ممتاز';
    if (num >= 16) return 'جيد جداً';
    if (num >= 14) return 'جيد';
    if (num >= 12) return 'قريب من الجيد';
    if (num >= 10) return 'مقبول';
    if (num >= 8) return 'متوسط';
    return 'دون المتوسط';
  };

  const finalAppreciation = useMemo(() => {
    if (enteredCount === 0) return null;
    if (average >= 18) return { text: 'ناجح بتقدير ممتاز (تهانينا البالغة!)', isPass: true };
    if (average >= 16) return { text: 'ناجح بتقدير جيد جداً', isPass: true };
    if (average >= 14) return { text: 'ناجح بتقدير جيد', isPass: true };
    if (average >= 12) return { text: 'ناجح بتقدير قريب من الجيد', isPass: true };
    if (average >= 10) return { text: 'ناجح بتقدير مقبول', isPass: true };
    return { text: 'مؤجل / راسب (يمكنك التعويض والتحسين المستمر)', isPass: false };
  }, [average, enteredCount]);

  const handleFillSampleGrades = () => {
    const samples: Record<string, string> = {};
    currentStream.subjects.forEach((sub, idx) => {
      // realistic good grades
      const sampleVals = ['16.5', '15.0', '14.25', '17.0', '13.5', '16.0', '18.0', '15.5', '14.0', '17.5'];
      samples[sub.id] = sampleVals[idx % sampleVals.length];
    });
    setGrades(samples);
  };

  const handleReset = () => {
    setGrades({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 select-none" id="average-calculator-widget" dir="rtl">
      {/* Top Stream Selector and Controls */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-none">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {Object.values(STREAMS_DATA).map((stream) => (
            <button
              key={stream.key}
              type="button"
              onClick={() => {
                setSelectedStreamKey(stream.key);
                setGrades({});
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition cursor-pointer outline-none ${
                selectedStreamKey === stream.key
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {stream.shortName}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleFillSampleGrades}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <Sparkles size={14} />
            <span>نقاط تجريبية</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
          >
            <RotateCcw size={14} />
            <span>تفريغ</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>طباعة الكشف</span>
          </button>
        </div>
      </div>

      {/* ================= OFFICIAL ALGERIAN TRANSCRIPT (كشف النقاط الحقيقي) ================= */}
      <div
        ref={transcriptRef}
        className="bg-[#fafaf8] border-2 border-neutral-900 p-4 sm:p-7 rounded-2xl shadow-none text-neutral-900 relative overflow-hidden"
        id="official-algerian-transcript"
      >
        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Award size={360} className="stroke-[1]" />
        </div>

        {/* 1. Official Header */}
        <div className="text-center border-b-2 border-neutral-900 pb-3 mb-4 space-y-1">
          <p className="text-xs sm:text-sm font-bold tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</p>
          <p className="text-[11px] sm:text-xs font-semibold text-neutral-700">وزارة التربية الوطنية - الديوان الوطني للامتحانات والمسابقات</p>
          <h2 className="text-sm sm:text-base md:text-lg font-black pt-1 tracking-normal text-neutral-950">
            كشف نقاط امتحان شهادة {currentStream.examType === 'bac' ? 'البكالوريا للتعليم الثانوي' : 'التعليم المتوسط (BEM)'}
          </h2>
          <p className="text-[11px] font-bold text-neutral-600">
            دورة: جوان 2026 | SESSION: JUIN 2026
          </p>
        </div>

        {/* 2. Candidate Info Grid (Editable by Student) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 bg-white p-3 rounded-xl border border-neutral-300 text-xs mb-4">
          <div>
            <span className="text-neutral-500 block text-[10px] font-bold">الشعبة / المسار:</span>
            <span className="font-bold text-neutral-900">{currentStream.name}</span>
          </div>

          <div>
            <label className="text-neutral-500 block text-[10px] font-bold">رقم التسجيل (N° Matr.):</label>
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="font-mono font-bold text-neutral-900 bg-transparent outline-none w-full border-b border-dashed border-neutral-300 focus:border-neutral-900 py-0.5"
              placeholder="31000000"
            />
          </div>

          <div>
            <label className="text-neutral-500 block text-[10px] font-bold">اللقب والاسم (Nom & Prénom):</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="font-bold text-neutral-900 bg-transparent outline-none w-full border-b border-dashed border-neutral-300 focus:border-neutral-900 py-0.5"
              placeholder="اسم التلميذ"
            />
          </div>

          <div>
            <span className="text-neutral-500 block text-[10px] font-bold">المؤسسة والولاية:</span>
            <span className="font-bold text-neutral-900">ثانوية الإجراء والتصحيح</span>
          </div>
        </div>

        {/* 3. Official Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-xs bg-white border border-neutral-400">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-400 text-neutral-800 font-bold">
                <th className="py-2.5 px-3 border-l border-neutral-300 w-10 text-center">الرقم</th>
                <th className="py-2.5 px-3 border-l border-neutral-300">المادة (Matière)</th>
                <th className="py-2.5 px-3 border-l border-neutral-300 w-20 text-center">المعامل (Coef)</th>
                <th className="py-2.5 px-3 border-l border-neutral-300 w-28 text-center bg-amber-50/40">
                  العلامة /20 (Note)
                </th>
                <th className="py-2.5 px-3 border-l border-neutral-300 w-28 text-center font-mono">
                  الجداء (Note × Coef)
                </th>
                <th className="py-2.5 px-3 w-28 text-center hidden sm:table-cell">التقدير</th>
              </tr>
            </thead>
            <tbody>
              {currentStream.subjects.map((sub, index) => {
                const valStr = grades[sub.id] || '';
                const valNum = parseFloat(valStr);
                const isEntered = !isNaN(valNum) && valStr !== '';
                const product = isEntered ? (valNum * sub.coef).toFixed(2) : '-';

                return (
                  <tr
                    key={sub.id}
                    className={`border-b border-neutral-200 hover:bg-neutral-50/70 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                    }`}
                  >
                    <td className="py-2 px-3 border-l border-neutral-200 text-center font-mono font-medium text-neutral-500">
                      {index + 1}
                    </td>

                    <td className="py-2 px-3 border-l border-neutral-200 font-bold text-neutral-900">
                      <div>{sub.name}</div>
                      <div className="text-[10px] text-neutral-400 font-normal">{sub.nameFr}</div>
                    </td>

                    <td className="py-2 px-3 border-l border-neutral-200 text-center font-mono font-bold text-neutral-800">
                      {sub.coef}
                    </td>

                    {/* Grade Input Field */}
                    <td className="py-1.5 px-2 border-l border-neutral-200 text-center bg-amber-50/20">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        placeholder="0.00"
                        value={valStr}
                        onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                        className="w-full text-center font-mono font-bold text-sm sm:text-base py-1 px-1 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:bg-neutral-50 outline-none text-neutral-900 transition shadow-none"
                      />
                    </td>

                    {/* Computed Product (علامة × معامل) */}
                    <td className="py-2 px-3 border-l border-neutral-200 text-center font-mono font-bold text-neutral-800">
                      {product}
                    </td>

                    {/* Appreciation */}
                    <td className="py-2 px-3 text-center text-[11px] font-semibold text-neutral-600 hidden sm:table-cell">
                      {getSubjectAppreciation(valStr)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Official Table Footer (المجاميع) */}
            <tfoot>
              <tr className="bg-neutral-100 font-bold border-t-2 border-neutral-400 text-neutral-900">
                <td colSpan={2} className="py-2.5 px-3 border-l border-neutral-300 text-right">
                  المجموع الإجمالي (Total des Points & Coefs)
                </td>
                <td className="py-2.5 px-3 border-l border-neutral-300 text-center font-mono text-sm">
                  {totalCoef}
                </td>
                <td className="py-2.5 px-3 border-l border-neutral-300 text-center text-xs text-neutral-500">
                  {enteredCount} / {currentStream.subjects.length} مواد
                </td>
                <td className="py-2.5 px-3 border-l border-neutral-300 text-center font-mono text-sm font-black text-neutral-950">
                  {totalPoints}
                </td>
                <td className="py-2.5 px-3 text-center hidden sm:table-cell text-xs text-neutral-500">
                  -
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 4. Final Official Result & Official Stamp Block */}
        <div className="mt-5 pt-4 border-t-2 border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-neutral-300">
          {/* Live Calculated Average & Decision */}
          <div className="space-y-1.5 text-right w-full md:w-auto">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-neutral-500">المعدل العام للمترشح:</span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {average.toFixed(2)} <span className="text-sm font-normal text-neutral-500">/ 20</span>
              </div>
            </div>

            {finalAppreciation && (
              <div className="flex items-center gap-2 pt-1">
                {finalAppreciation.isPass ? (
                  <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-red-700 shrink-0" />
                )}
                <span
                  className={`text-xs sm:text-sm font-black ${
                    finalAppreciation.isPass ? 'text-emerald-800' : 'text-red-800'
                  }`}
                >
                  القرار: {finalAppreciation.text}
                </span>
              </div>
            )}
          </div>

          {/* Authentic Circular Stamp and Signature */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Circular Algerian Stamp */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center p-2 text-center select-none text-[8px] font-bold text-neutral-400 rotate-[-8deg] leading-tight">
              <span>الجمهورية الجزائرية</span>
              <span className="text-[7px] my-0.5 font-normal">وزارة التربية الوطنية</span>
              <span className="font-black text-[9px] text-neutral-500">ONEC</span>
              <span>مركز إعلان النتائج</span>
            </div>

            {/* Signature Box */}
            <div className="text-center">
              <span className="text-[10px] font-bold text-neutral-500 block mb-1">توقيع وختم رئيس المركز</span>
              <div className="font-serif italic text-sm text-neutral-700 font-bold border-b border-neutral-300 pb-1 px-4">
                المدير العام للامتحانات
              </div>
            </div>
          </div>
        </div>

        {/* Legal notice */}
        <div className="text-[9px] text-neutral-400 text-center mt-3 font-medium">
          هذا الكشف محاكاة تدريبية تفاعلية دقيقة مطابقة للمعاملات الرسمية للديوان الوطني للامتحانات والمسابقات بالجزائر.
        </div>
      </div>
    </div>
  );
}
