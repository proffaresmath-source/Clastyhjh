import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Footer({ lang, onLanguageChange }: FooterProps) {
  const isArabic = lang === 'ar';

  const links = isArabic
    ? [
        'معلومات',
        'مدونة',
        'الوظائف',
        'المساعدة',
        'واجهة برمجة التطبيقات (API)',
        'الخصوصية',
        'الشروط',
        'الحسابات الأبرز',
        'المواقع',
        'Clasty Zoom Lite',
        'تحميل جهات الاتصال وغير المستخدمين',
        'Meta Verified',
      ]
    : [
        'Meta',
        'About',
        'Blog',
        'Jobs',
        'Help',
        'API',
        'Privacy',
        'Terms',
        'Locations',
        'Clasty Zoom Lite',
        'Contact Uploading & Non-Users',
        'Meta Verified',
      ];

  return (
    <footer
      className="w-full max-w-5xl mx-auto pt-8 pb-10 px-4 text-center select-none"
      dir={isArabic ? 'rtl' : 'ltr'}
      id="app-footer"
    >
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-[#737373] mb-4">
        {links.map((link) => (
          <a
            key={link}
            href="#footer-link"
            onClick={(e) => e.preventDefault()}
            className="hover:underline transition text-[#737373] hover:text-[#262626]"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-[12px] text-[#737373]">
        <div className="relative inline-flex items-center">
          <select
            value={lang}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="bg-transparent text-[#737373] text-[12px] cursor-pointer focus:outline-none pr-4 rtl:pr-0 rtl:pl-4 py-1"
            id="select-language"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <span>© 2026 Clasty Zoom from Meta</span>
      </div>
    </footer>
  );
}
