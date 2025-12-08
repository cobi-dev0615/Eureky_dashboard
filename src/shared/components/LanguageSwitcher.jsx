import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
      title={i18n.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <GlobeAltIcon className="w-5 h-5" />
      <span className="text-sm font-medium uppercase">
        {i18n.language === 'es' ? 'EN' : 'ES'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
