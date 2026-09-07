export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  accountCode?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  academicYear?: string;
  wilaya?: string;
  commune?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  commentsCount: number;
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
  location?: string;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnseenStory: boolean;
}

export type AuthMode = 'login' | 'signup' | 'saved_account';

export type Language = 'ar' | 'en';

export interface DynamicRowCard {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  actionText: string;
  actionType?: 'details' | 'subscribe' | 'zoom' | 'link';
  details?: string;
  price?: string;
  teacherName?: string;
  subject?: string;
  paymentDetails?: string;
  baridimobRip?: string;
  ccpAccount?: string;
  contactPhone?: string;
}

export interface DynamicRow {
  id: string;
  title: string;
  subtitle?: string;
  cards: DynamicRowCard[];
}

export interface CountdownConfig {
  id: string;
  enabled: boolean;
  examType: 'bac' | 'bem' | 'custom';
  title: string;
  targetDate: string; // YYYY-MM-DDTHH:mm
  motivationalQuote: string;
}

export interface AverageCalcConfig {
  id: string;
  enabled: boolean;
  title: string;
  availableStreams: string[];
  passMark: number;
}

export interface ReferralConfig {
  id: string;
  enabled: boolean;
  title: string;
  rewardPerFriend: number;
  minWithdrawal: number;
  instructions: string;
}

export interface HistoryQuestion {
  id: string;
  question: string;
  dateOrEvent: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  isUserCreated?: boolean;
}

export interface HistoryDateItem {
  id: string;
  date: string;
  event: string;
  category: 'revolution' | 'cold_war' | 'movement' | 'bem';
  note?: string;
  isUserCreated?: boolean;
}

export interface HistoryGameConfig {
  id: string;
  enabled: boolean;
  title: string;
  timePerQuestionSeconds: number;
  questions: HistoryQuestion[];
  customDates?: HistoryDateItem[];
}

export interface ToolsSpaceConfig {
  countdown: CountdownConfig; // BAC countdown
  countdownBem?: CountdownConfig; // BEM countdown
  activeCountdownMode?: 'bac' | 'bem' | 'both';
  averageCalc: AverageCalcConfig;
  referral: ReferralConfig;
  historyGame: HistoryGameConfig;
  customCovers?: {
    calculator?: string;
    history?: string;
    referral?: string;
  };
  order: Array<'countdown' | 'averageCalc' | 'referral' | 'historyGame'>;
}
