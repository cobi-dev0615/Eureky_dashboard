import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../shared/components/Navbar';
import { Footer } from '../../shared/components/Footer';

export const TermsAndConditions = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050912]">
            <Navbar />

            {/* Content */}
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-white mb-8">
                            {t('terms.title')}
                        </h1>

                        <div className="prose prose-sm md:prose-base max-w-none text-gray-300 space-y-6">
                            <p>{t('terms.intro')}</p>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('terms.section1.title')}</h2>
                                <p>{t('terms.section1.content')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('terms.section2.title')}</h2>
                                <p>{t('terms.section2.content')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('terms.contactPrompt')}</h2>
                                <p className="mt-4">
                                    <a
                                        href={`mailto:${t('terms.contactEmail')}`}
                                        className="text-primary hover:underline text-lg font-medium"
                                    >
                                        {t('terms.contactEmail')}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
