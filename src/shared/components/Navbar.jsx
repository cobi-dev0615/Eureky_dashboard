import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from '../../assets/images/logo.png';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export const Navbar = () => {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full backdrop-blur-md z-50 bg-[#050912]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/">
                            <img src={Logo} alt="logo" className="w-[160px]" />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-white">
                        <a href="/#how-works" className="hover:text-gray-300">
                            {t('nav.howWorks')}
                        </a>
                        <a href="/#features" className="hover:text-gray-300">
                            {t('nav.features')}
                        </a>
                        <a href="/#reviews" className="hover:text-gray-300">
                            {t('nav.reviews')}
                        </a>
                        <a href="/#pricing" className="hover:text-gray-300">
                            {t('nav.pricing')}
                        </a>
                        <Link to="/login" className="bg-[#8465FF] hover:bg-[#6A52CC] text-white px-6 py-2 rounded-lg transition-colors">
                            {t('nav.login')}
                        </Link>
                        <LanguageSwitcher />
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col gap-4 text-white">
                            <a
                                href="/#how-works"
                                className="hover:text-gray-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.howWorks')}
                            </a>
                            <a
                                href="/#features"
                                className="hover:text-gray-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.features')}
                            </a>
                            <a
                                href="/#reviews"
                                className="hover:text-gray-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.reviews')}
                            </a>
                            <a
                                href="/#pricing"
                                className="hover:text-gray-300"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.pricing')}
                            </a>
                            <Link
                                to="/login"
                                className="bg-[#8465FF] hover:bg-[#6A52CC] text-white px-6 py-2 rounded-lg transition-colors text-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t('nav.login')}
                            </Link>
                            <LanguageSwitcher />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
