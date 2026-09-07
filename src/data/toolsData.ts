import { ToolsSpaceConfig, HistoryQuestion } from '../types';

export const INITIAL_HISTORY_QUESTIONS: HistoryQuestion[] = [
  {
    id: 'q_1',
    question: 'في أي تاريخ انعقد مؤتمر الصومام التاريخي في الولاية الثالثة؟',
    dateOrEvent: 'مؤتمر الصومام',
    options: ['20 أوت 1956', '1 نوفمبر 1954', '20 أوت 1955', '19 مارس 1962'],
    correctAnswerIndex: 0,
    explanation: 'انعقد مؤتمر الصومام في 20 أوت 1956 بقرية إيفري أوزلاقن بوادي الصومام لإعادة تنظيم وهيكلة الثورة التحريرية.',
  },
  {
    id: 'q_2',
    question: 'متى اندلعت الثورة التحريرية الجزائرية المباركة؟',
    dateOrEvent: 'اندلاع الثورة التحريرية',
    options: ['8 ماي 1945', '1 نوفمبر 1954', '20 أوت 1955', '5 جويلية 1962'],
    correctAnswerIndex: 1,
    explanation: 'انطلقت الرصاصة الأولى ليلة أول نوفمبر 1954 بإعلان بيان أول نوفمبر التاريخي.',
  },
  {
    id: 'q_3',
    question: 'في أي تاريخ قاد البطل زيغود يوسف هجومات الشمال القسنطيني؟',
    dateOrEvent: 'هجومات الشمال القسنطيني',
    options: ['20 أوت 1955', '20 أوت 1956', '1 نوفمبر 1954', '19 مارس 1962'],
    correctAnswerIndex: 0,
    explanation: 'وقعت هجومات الشمال القسنطيني في 20 أوت 1955 لفك الحصار عن الأوراس وتأكيد شعبية الثورة.',
  },
  {
    id: 'q_4',
    question: 'ما هو التاريخ المحدد ليوم النصر وإعلان وقف إطلاق النار بموجب اتفاقيات إيفيان؟',
    dateOrEvent: 'وقف إطلاق النار (عيد النصر)',
    options: ['19 مارس 1962', '5 جويلية 1962', '11 ديسمبر 1960', '17 أكتوبر 1961'],
    correctAnswerIndex: 0,
    explanation: 'دخل وقف إطلاق النار حيز التنفيذ يوم 19 مارس 1962 بعد توقيع اتفاقيات إيفيان الثانية.',
  },
  {
    id: 'q_5',
    question: 'متى تأسست الحكومة المؤقتة للجمهورية الجزائرية (GPRA) برئاسة فرحات عباس؟',
    dateOrEvent: 'تأسيس الحكومة المؤقتة',
    options: ['19 سبتمبر 1958', '20 أوت 1956', '1 نوفمبر 1954', '19 مارس 1962'],
    correctAnswerIndex: 0,
    explanation: 'أُعلنت الحكومة المؤقتة في القاهرة بتاريخ 19 سبتمبر 1958 لتمثيل الشعب الجزائري دولياً.',
  },
  {
    id: 'q_6',
    question: 'في أي تاريخ جرت مظاهرات 11 ديسمبر التاريخية المؤيدة لجبهة التحرير الوطني؟',
    dateOrEvent: 'مظاهرات 11 ديسمبر',
    options: ['11 ديسمبر 1960', '17 أكتوبر 1961', '8 ماي 1945', '19 سبتمبر 1958'],
    correctAnswerIndex: 0,
    explanation: 'خرج الشعب الجزائري يوم 11 ديسمبر 1960 رافعاً الراية الوطنية لتأكيد حق تقرير المصير أمام هيئة الأمم المتحدة.',
  },
  {
    id: 'q_7',
    question: 'متى تأسست المنظمة الخاصة (OS) الجناح العسكري لحركة انتصار الحريات الديمقراطية؟',
    dateOrEvent: 'تأسيس المنظمة الخاصة (OS)',
    options: ['15 فيفري 1947', '8 ماي 1945', '1 نوفمبر 1954', '20 أوت 1955'],
    correctAnswerIndex: 0,
    explanation: 'تأسست المنظمة الخاصة في 15 فيفري 1947 بمؤتمر الحركة للتحضير للعمل المسلح بقيادة محمد بلوزداد.',
  },
  {
    id: 'q_8',
    question: 'في أي تاريخ انعقد مؤتمر باندونغ الذي ساهم في تدويل القضية الجزائرية؟',
    dateOrEvent: 'مؤتمر باندونغ',
    options: ['18 - 24 أفريل 1955', '20 أوت 1956', '1 - 6 سبتمبر 1961', '12 مارس 1947'],
    correctAnswerIndex: 0,
    explanation: 'انعقد مؤتمر التضامن الأفروآسيوي في باندونغ بإندونيسيا من 18 إلى 24 أفريل 1955 ودعم حق الجزائر في الاستقلال.',
  },
];

export const INITIAL_HISTORY_DATES = [
  {
    id: 'd_1',
    date: '1 نوفمبر 1954',
    event: 'اندلاع الثورة التحريرية الجزائرية المباركة وصدور بيان أول نوفمبر',
    category: 'revolution' as const,
    note: 'بداية الكفاح المسلح المنظم واسترجاع السيادة الوطنية',
  },
  {
    id: 'd_2',
    date: '20 أوت 1955',
    event: 'هجومات الشمال القسنطيني بقيادة البطل زيغود يوسف',
    category: 'revolution' as const,
    note: 'فك الحصار عن منطقة الأوراس وتأكيد الطابع الشعبي للثورة',
  },
  {
    id: 'd_3',
    date: '20 أوت 1956',
    event: 'انعقاد مؤتمر الصومام التاريخي بإيفري أوزلاقن',
    category: 'revolution' as const,
    note: 'إعادة هيكلة الثورة وتأسيس المجلس الوطني للثورة الجزائرية ولجنة التنسيق والتنفيذ',
  },
  {
    id: 'd_4',
    date: '19 سبتمبر 1958',
    event: 'تأسيس الحكومة المؤقتة للجمهورية الجزائرية (GPRA) بالقاهرة',
    category: 'revolution' as const,
    note: 'برئاسة فرحات عباس لتمثيل الجزائر في المحافل الدولية',
  },
  {
    id: 'd_5',
    date: '11 ديسمبر 1960',
    event: 'مظاهرات 11 ديسمبر الشعبية العارمة بالمدن الجزائرية',
    category: 'revolution' as const,
    note: 'تأكيد التفاف الشعب حول جبهة وجيش التحرير الوطني وإسقاط خرافة الجزائر فرنسية',
  },
  {
    id: 'd_6',
    date: '17 أكتوبر 1961',
    event: 'مظاهرات المهاجرين الجزائريين بباريس ومجازر نهر السين',
    category: 'revolution' as const,
    note: 'نقل الثورة إلى عقر دار المستعمر والتنديد بحظر التجوال العنصري',
  },
  {
    id: 'd_7',
    date: '19 مارس 1962',
    event: 'إعلان وقف إطلاق النار (عيد النصر) بموجب اتفاقيات إيفيان',
    category: 'revolution' as const,
    note: 'نهاية العمليات العسكرية الفرنسية وانتصار إرادة الشعب الجزائري',
  },
  {
    id: 'd_8',
    date: '5 جويلية 1962',
    event: 'إعلان الاستقلال الوطني الرسمي للجمهورية الجزائرية',
    category: 'revolution' as const,
    note: 'تتويج تضحيات مليون ونصف مليون شهيد بعد 132 سنة من الاحتلال',
  },
  {
    id: 'd_9',
    date: '12 مارس 1947',
    event: 'إعلان مبدأ ترومان الأمريكي (بداية سياسة الاحتواء)',
    category: 'cold_war' as const,
    note: 'تقديم مساعدات عسكرية واقتصادية لليونان وتركيا للتصدي للمد الشيوعي',
  },
  {
    id: 'd_10',
    date: '5 جوان 1947',
    event: 'مشروع مارشال الاقتصادي الأمريكي لإعادة إعمار أوروبا',
    category: 'cold_war' as const,
    note: 'مساعدة دول أوروبا الغربية وربط اقتصادها بالولايات المتحدة الأمريكية',
  },
  {
    id: 'd_11',
    date: '18 - 24 أفريل 1955',
    event: 'انعقاد مؤتمر باندونغ للتضامن الأفروآسيوي',
    category: 'movement' as const,
    note: 'النواة الأولى لظهور حركة عدم الانحياز ودعم القضية الجزائرية دولياً',
  },
  {
    id: 'd_12',
    date: '1 - 6 سبتمبر 1961',
    event: 'مؤتمر بلغراد والتأسيس الرسمي لحركة عدم الانحياز',
    category: 'movement' as const,
    note: 'إقرار مبادئ الحياد الإيجابي والتعايش السلمي بحضور وفد جزائري رسمي',
  },
];

export const DEFAULT_TOOLS_CONFIG: ToolsSpaceConfig = {
  countdown: {
    id: 'countdown_widget_bac',
    enabled: true,
    examType: 'bac',
    title: 'العد التنازلي لبكالوريا 2026',
    targetDate: '2026-06-07T08:00',
    motivationalQuote: 'من جدّ وجد ومن سار على الدرب وصل.. الشهادة في متناولك!',
  },
  countdownBem: {
    id: 'countdown_widget_bem',
    enabled: true,
    examType: 'bem',
    title: 'العد التنازلي لشهادة التعليم المتوسط (BEM 2026)',
    targetDate: '2026-06-01T08:00',
    motivationalQuote: 'خطوتك الواثقة نحو مرحلة الثانوية.. بالتوفيق والامتياز!',
  },
  activeCountdownMode: 'both',
  averageCalc: {
    id: 'average_calc_widget',
    enabled: true,
    title: 'حاسبة معدل البكالوريا والبيام حسب الشعبة',
    availableStreams: [
      'sciences',
      'math',
      'technique',
      'gestion',
      'lettres',
      'langues',
      'arts',
      'bem',
    ],
    passMark: 10,
  },
  referral: {
    id: 'referral_widget',
    enabled: true,
    title: 'اربح المال من دعوة أصدقائك للدراسة',
    rewardPerFriend: 200,
    minWithdrawal: 1000,
    instructions:
      'شارك كود دعوتك مع زملائك، وعند تسجيل أي تلميذ في المنصة ستحصل فوراً على 200 دج في رصيدك يمكنك سحبها عبر بريدي موب أو CCP.',
  },
  historyGame: {
    id: 'history_game_widget',
    enabled: true,
    title: 'تدريب واختبار تواريخ وأسئلة التاريخ',
    timePerQuestionSeconds: 15,
    questions: INITIAL_HISTORY_QUESTIONS,
    customDates: INITIAL_HISTORY_DATES,
  },
  customCovers: {
    calculator: '',
    history: '',
    referral: '',
  },
  order: [],
};

const STORAGE_KEY = 'bac_tools_space_config_v4';

export function loadToolsConfig(): ToolsSpaceConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_TOOLS_CONFIG;
    const parsed = JSON.parse(saved);
    return {
      countdown: { ...DEFAULT_TOOLS_CONFIG.countdown, ...parsed.countdown },
      countdownBem: { ...DEFAULT_TOOLS_CONFIG.countdownBem, ...parsed.countdownBem },
      activeCountdownMode: parsed.activeCountdownMode || 'both',
      averageCalc: { ...DEFAULT_TOOLS_CONFIG.averageCalc, ...parsed.averageCalc },
      referral: { ...DEFAULT_TOOLS_CONFIG.referral, ...parsed.referral },
      historyGame: {
        ...DEFAULT_TOOLS_CONFIG.historyGame,
        ...parsed.historyGame,
        questions:
          parsed.historyGame?.questions && parsed.historyGame.questions.length > 0
            ? parsed.historyGame.questions
            : INITIAL_HISTORY_QUESTIONS,
        customDates:
          parsed.historyGame?.customDates && parsed.historyGame.customDates.length > 0
            ? parsed.historyGame.customDates
            : INITIAL_HISTORY_DATES,
      },
      customCovers: {
        ...DEFAULT_TOOLS_CONFIG.customCovers,
        ...(parsed.customCovers || {}),
      },
      order: parsed.order || [],
    };
  } catch (err) {
    console.error('Error loading tools config:', err);
    return DEFAULT_TOOLS_CONFIG;
  }
}

export function saveToolsConfig(config: ToolsSpaceConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving tools config:', err);
  }
}
