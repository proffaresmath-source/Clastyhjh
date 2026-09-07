import { useState, useEffect } from 'react';
import { User, Language } from './types';
import { currentUser } from './data/mockData';
import WhiteGoldAuth, { SignUpData } from './components/WhiteGoldAuth';
import VerificationScreen from './components/VerificationScreen';
import RegistrationCodeCard from './components/RegistrationCodeCard';
import AppIntro from './components/AppIntro';
import StudentDashboard from './components/StudentDashboard';
import { CheckCircle2 } from 'lucide-react';
import {
  findUserByAccountCode,
  findUserByEmail,
  findUserByIdentifier,
} from './utils/userStore';

type AppScreen = 'auth' | 'verifying' | 'code_display' | 'app_intro' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('auth');
  const [verificationMode, setVerificationMode] = useState<'login' | 'signup'>('login');
  const [pendingUserIdentifier, setPendingUserIdentifier] = useState<string>('');
  const [user, setUser] = useState<User>(currentUser);
  const [lang] = useState<Language>('ar');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Registered student data for code presentation
  const [pendingStudentData, setPendingStudentData] = useState<SignUpData | null>(null);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Step: Initiate Login -> Triggers Verification Screen
  const handleInitiateLogin = (identifierInput: string) => {
    setPendingUserIdentifier(identifierInput);
    setVerificationMode('login');
    setScreen('verifying');
  };

  // Called after Verification Screen finishes for Login
  const handleCompleteLoginVerification = () => {
    const input = pendingUserIdentifier || 'ahmed@clasty.dz';
    const matched =
      findUserByIdentifier(input) ||
      findUserByEmail(input) ||
      findUserByAccountCode(input);

    if (matched) {
      setUser({
        id: matched.id,
        username: matched.email.split('@')[0] || matched.accountCode.toLowerCase(),
        name: `${matched.firstName} ${matched.lastName}`,
        firstName: matched.firstName,
        lastName: matched.lastName,
        email: matched.email,
        phone: matched.phone,
        academicYear: matched.academicYear,
        wilaya: matched.wilaya,
        commune: matched.commune,
        accountCode: matched.accountCode,
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
      });
    } else {
      setUser((prev) => ({
        ...prev,
        email: input,
        username: input.split('@')[0] || 'student',
        name: prev.name && prev.name !== 'John Doe' ? prev.name : 'تلميذ مسجل',
      }));
    }
    setScreen('dashboard');
    showToast('مرحباً بك! تم تسجيل الدخول بنجاح');
  };

  // 2. Step: Initiate Sign Up -> Triggers Verification Screen
  const handleInitiateSignUp = (studentData: SignUpData) => {
    setPendingStudentData(studentData);
    setPendingUserIdentifier(studentData.email);
    setVerificationMode('signup');
    setScreen('verifying');
  };

  // Called after Verification Screen finishes for Sign Up
  const handleCompleteSignUpVerification = () => {
    if (!pendingStudentData) return;

    const newUserObj: User = {
      id: `u_${Date.now()}`,
      username: pendingStudentData.accountCode.toLowerCase(),
      name: `${pendingStudentData.firstName} ${pendingStudentData.lastName}`,
      firstName: pendingStudentData.firstName,
      lastName: pendingStudentData.lastName,
      email: pendingStudentData.email,
      phone: pendingStudentData.phone,
      academicYear: pendingStudentData.academicYear,
      wilaya: pendingStudentData.wilaya,
      commune: pendingStudentData.commune,
      accountCode: pendingStudentData.accountCode,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
    };

    setUser(newUserObj);
    // Enter account directly after the verification loading screen
    setScreen('dashboard');
    showToast(`مرحباً بك يا ${pendingStudentData.firstName}! تم إنشاء حسابك والدخول بنجاح`);
  };

  const handleNextFromCodeDisplay = () => {
    // Transition to Screen: App Introduction
    setScreen('app_intro');
  };

  const handleNextFromAppIntro = () => {
    // Transition to Screen: Main Home Page with Bottom Navigation Bar
    setScreen('dashboard');
    showToast(`أهلاً بك في الصفحة الرئيسية لـ Clasty Zoom!`);
  };

  const handleLogout = () => {
    setScreen('auth');
    setPendingStudentData(null);
    setPendingUserIdentifier('');
    showToast('تم تسجيل الخروج بنجاح.');
  };

  return (
    <div
      className="min-h-screen w-full bg-[#faf9f5] font-arabic text-neutral-800 flex flex-col items-center justify-start select-text"
      id="app-root"
      dir="rtl"
    >
      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1a1a1a] text-white border border-[#d4af37]/40 px-4 py-3 rounded-xl shadow-2xl text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={16} className="text-[#d4af37] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start">
        {screen === 'auth' && (
          <WhiteGoldAuth
            onLoginSubmit={handleInitiateLogin}
            onSignUpSubmit={handleInitiateSignUp}
            lang={lang}
          />
        )}

        {screen === 'verifying' && (
          <VerificationScreen
            mode={verificationMode}
            userIdentifier={pendingUserIdentifier}
            studentName={
              pendingStudentData
                ? `${pendingStudentData.firstName} ${pendingStudentData.lastName}`
                : undefined
            }
            onComplete={
              verificationMode === 'login'
                ? handleCompleteLoginVerification
                : handleCompleteSignUpVerification
            }
          />
        )}

        {screen === 'code_display' && pendingStudentData && (
          <RegistrationCodeCard
            userData={pendingStudentData}
            onNext={handleNextFromCodeDisplay}
          />
        )}

        {screen === 'app_intro' && (
          <AppIntro
            studentName={user.firstName || user.name}
            onNext={handleNextFromAppIntro}
          />
        )}

        {screen === 'dashboard' && (
          <StudentDashboard user={user} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}
