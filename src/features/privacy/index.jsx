import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../shared/components/Navbar';
import { Footer } from '../../shared/components/Footer';

export const PrivacyPolicy = () => {
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
                            {t('privacy.title')}
                        </h1>

                        <div className="prose prose-sm md:prose-base max-w-none text-gray-300 space-y-6">
                            <p>{t('privacy.intro', { defaultValue: 'Our web address is:' })} <a href="https://eureky.ai" className="text-primary hover:underline">https://eureky.ai</a></p>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.comments.title')}</h2>
                                <p>{t('privacy.comments.p1')}</p>
                                <p>{t('privacy.comments.p2')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.media.title')}</h2>
                                <p>{t('privacy.media.p1')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.cookies.title')}</h2>
                                <p>{t('privacy.cookies.p1')}</p>
                                <p>{t('privacy.cookies.p2')}</p>
                                <p>{t('privacy.cookies.p3')}</p>
                                <p>{t('privacy.cookies.p4')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.embeddedContent.title')}</h2>
                                <p>{t('privacy.embeddedContent.p1')}</p>
                                <p>{t('privacy.embeddedContent.p2')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.sharing.title')}</h2>
                                <p>{t('privacy.sharing.p1')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.retention.title')}</h2>
                                <p>{t('privacy.retention.p1')}</p>
                                <p>{t('privacy.retention.p2')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.rights.title')}</h2>
                                <p>{t('privacy.rights.p1')}</p>
                            </div>

                            <div className="pt-6">
                                <h2 className="text-2xl font-bold text-white mb-3">{t('privacy.dataSent.title')}</h2>
                                <p>{t('privacy.dataSent.p1')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
