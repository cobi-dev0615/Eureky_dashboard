import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import SEO from '../../shared/components/SEO';
import { Navbar } from '../../shared/components/Navbar';
import Image2 from '../../assets/images/image_2.png';
import Image1 from '../../assets/images/image_1.png';
import Image4 from '../../assets/images/image_4.png';
import Image3 from '../../assets/images/image_3.png';
import Subtitle from '../../assets/images/subtitle.png';
import Subtitle2 from '../../assets/images/subtitle2.png';
import Desktop2 from '../../assets/images/desktop_2.png';
import Desktop2Mobile from '../../assets/images/desktop_2_m.png';
import Chat1 from '../../assets/images/chat_1.png';
import Chat2 from '../../assets/images/chat_2.png';
import Chat3 from '../../assets/images/chat_3.png';
import Chat4 from '../../assets/images/chat_4.png';
import Chat6 from '../../assets/images/chat_6.png';
import Image5 from '../../assets/images/image_5.jpg';
import TestimonialRenee from '../../assets/images/testimonial_renee.jpg';
import Plan1 from '../../assets/images/plan_1.png';
import Plan2 from '../../assets/images/plan_2.png';
import Plan3 from '../../assets/images/plan_3.png';
import Logo from '../../assets/images/logo.png';
import Check from '../../assets/images/check.png';
import Check2 from '../../assets/images/check_2.png';
import X from '../../assets/images/x.png';
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export default function Landing() {
  const { t } = useTranslation();
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const features = [
    { image: Chat1, title: t('features.feature1.title'), text: t('features.feature1.text'), alt: "chat_1" },
    { image: Chat2, title: t('features.feature2.title'), text: t('features.feature2.text'), alt: "chat_2" },
    { image: Chat3, title: t('features.feature3.title'), text: t('features.feature3.text'), alt: "chat_3" },
    { image: Chat4, title: t('features.feature4.title'), text: t('features.feature4.text'), alt: "chat_4" }
  ];

  const howItWorksSteps = [
    {
      number: "1",
      title: t('howWorks.step1.title'),
      description: t('howWorks.step1.description')
    },
    {
      number: "2",
      title: t('howWorks.step2.title'),
      description: t('howWorks.step2.description')
    },
    {
      number: "3",
      title: t('howWorks.step3.title'),
      description: t('howWorks.step3.description')
    }
  ];

  const testimonials = [
    {
      rating: 5,
      title: t('testimonials.items.1.title'),
      text: t('testimonials.items.1.text'),
      author: t('testimonials.items.1.author')
    },
    {
      rating: 5,
      title: t('testimonials.items.2.title'),
      text: t('testimonials.items.2.text'),
      author: t('testimonials.items.2.author')
    },
    {
      rating: 5,
      title: t('testimonials.items.3.title'),
      text: t('testimonials.items.3.text'),
      author: t('testimonials.items.3.author')
    }
  ];

  const faqs = [
    {
      question: t('faq.items.1.question'),
      answer: t('faq.items.1.answer')
    },
    {
      question: t('faq.items.2.question'),
      answer: t('faq.items.2.answer')
    },
    {
      question: t('faq.items.3.question'),
      answer: t('faq.items.3.answer')
    },
    {
      question: t('faq.items.4.question'),
      answer: t('faq.items.4.answer')
    }
  ];

  const dashboardFeatures = [
    {
      borderColor: "border-[#4A9FF5]",
      title: t('dashboard.cardTitle'),
      description: t('dashboard.cardDescription')
    },
    {
      borderColor: "border-[#6B5FCC]",
      title: t('dashboard.cardTitle'),
      description: t('dashboard.cardDescription')
    },
    {
      borderColor: "border-[#9F5FCC]",
      title: t('dashboard.cardTitle'),
      description: t('dashboard.cardDescription')
    }
  ];

  const pricingPlans = [
    {
      name: t('pricing.plans.junior.name'),
      icon: <img src={Plan1} alt="junior" />,
      monthlyPrice: "€2.99",
      annualPrice: "€29.99",
      buttonText: t('pricing.plans.junior.cta'),
      buttonStyle: "bg-[#76FF72] text-black hover:bg-[#9FEE9C]",
      popular: false,
      features: [
        { text: t('pricing.features.whatsapp247'), included: true },
        { text: t('pricing.features.reminders'), included: true },
        { text: t('pricing.features.friendReminders150'), included: true },
        { text: t('pricing.features.lists'), included: true },
        { text: t('pricing.features.voiceCapture'), included: true },
        { text: t('pricing.features.languages'), included: true },
        { text: t('pricing.features.calendarSync'), included: true },
        { text: t('pricing.features.copilot'), included: false },
        { text: t('pricing.features.prioritization'), included: false },
        { text: t('pricing.features.reschedule'), included: false },
        { text: t('pricing.features.dashboard'), included: false },
        { text: t('pricing.features.imageAnalysis'), included: false },
        { text: t('pricing.features.weeklySummary'), included: false },
        { text: t('pricing.features.premiumSupport'), included: false }
      ]
    },
    {
      name: t('pricing.plans.pro.name'),
      icon: <img src={Plan2} alt="pro" />,
      monthlyPrice: "€6.99",
      annualPrice: "€69.99",
      buttonText: t('pricing.plans.pro.cta'),
      buttonStyle: "bg-[#76FF72] text-black hover:bg-[#9FEE9C]",
      popular: true,
      features: [
        { text: t('pricing.features.whatsapp247'), included: true },
        { text: t('pricing.features.reminders'), included: true },
        { text: t('pricing.features.friendRemindersUnlimited'), included: true },
        { text: t('pricing.features.lists'), included: true },
        { text: t('pricing.features.voiceCapture'), included: true },
        { text: t('pricing.features.languages'), included: true },
        { text: t('pricing.features.calendarSync'), included: true },
        { text: t('pricing.features.copilot'), included: true },
        { text: t('pricing.features.prioritization'), included: true },
        { text: t('pricing.features.reschedule'), included: true },
        { text: t('pricing.features.dashboard'), included: true },
        { text: t('pricing.features.imageAnalysis'), included: true },
        { text: t('pricing.features.weeklySummary'), included: true },
        { text: t('pricing.features.premiumSupport'), included: true }
      ]
    },
    {
      name: t('pricing.plans.lifetime.name'),
      icon: <img src={Plan3} alt="lifetime" />,
      monthlyPrice: "€299",
      annualPrice: "€299",
      buttonText: t('pricing.plans.lifetime.cta'),
      buttonStyle: "bg-[#76FF72] text-black hover:bg-[#9FEE9C]",
      popular: false,
      isLifetime: true,
      features: [
        { text: t('pricing.features.allProFeatures'), included: true },
        { text: t('pricing.features.noSubscriptions'), included: true },
        { text: t('pricing.features.prioritySupport'), included: true },
        { text: t('pricing.features.futureFeatures'), included: true }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Eureky - Your All-in-One Productivity Platform"
        description="Boost your productivity with Eureky. Manage tasks, sync calendars, track progress, and achieve your goals with our powerful and intuitive platform."
        keywords="productivity app, task management, calendar sync, time tracking, goal tracking, productivity tools, project management"
      />
      <div className="min-h-screen bg-[#050912] overflow-hidden">
        <Navbar />

        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div className="w-full lg:w-xl">
              <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-[80px] lg:leading-[76px] font-bold">
                {t('hero.title')}
              </h1>
            </div>
            <div className="flex flex-col md:justify-self-end lg:mt-[30px]">
              <p className="text-base sm:text-lg md:text-xl mb-3 max-w-3xl flex items-start items-center">
                <img src={Check} className="w-[24px] mr-4" /> <span>{t('hero.benefit1')}</span>
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-3 max-w-3xl flex items-start items-center">
                <img src={Check} className="w-[24px] mr-4" /> <span>{t('hero.benefit2')}</span>
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-3 max-w-3xl flex items-start items-center">
                <img src={Check} className="w-[24px] mr-4" /> <span>{t('hero.benefit3')}</span>
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-3 max-w-3xl flex items-start items-center">
                <img src={Check} className="w-[24px] mr-4" /> <span>{t('hero.benefit4')}</span>
              </p>

              <div className="mt-6 sm:mt-8">
                <Link
                  to="/register"
                  className="w-full md:w-auto inline-block text-center py-4 sm:py-5 px-6 sm:px-8 rounded-full font-semibold transition-colors bg-[#76FF72] text-black hover:bg-[#9FEE9C]"
                >
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
          </div>
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-12 sm:mt-20 md:mt-30">
            <div className="grid grid-cols-4 gap-4 px-4 w-[110%] sm:-ml-[6%] -ml-[5%]">
              <div className="flex items-stretch">
                <img src={Image2} alt="image2" className="w-full h-auto object-cover rounded-lg" />
              </div>
              <div className="flex items-stretch">
                <img src={Image1} alt="image1" className="w-full h-auto object-cover rounded-lg" />
              </div>
              <div className="flex items-stretch">
                <img src={Image4} alt="image4" className="w-full h-auto object-cover rounded-lg" />
              </div>
              <div className="flex items-stretch">
                <img src={Image3} alt="image3" className="w-full h-auto object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="pt-12 sm:pt-24 pb-20 sm:pb-39 bg-[#ABFFA8] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto justify-items-center">
            <div className="flex justify-center items-center py-24 sm:pb-28">
              <div className="font-bold text-5xl sm:text-[80px]/20 sm:w-3xl w-sm text-center absolute sm:mt-15 -mt-15" />
              <img src={Subtitle} className="hidden sm:block" alt="bg" />
              <img src={Subtitle2} className="block sm:hidden" alt="bg_mobile" />
            </div>

            <div className="grid grid-cols-1">
              <img src={Desktop2} alt="desktop2" className="w-full h-auto hidden sm:block" />
              <img src={Desktop2Mobile} alt="desktop2 mobile" className="w-full h-auto block sm:hidden" />
            </div>

            {features.map((feat, index) => {
              return (
                <div className="flex items-center flex-col w-full max-w-2xl mt-31 sm:mt-20 md:mt-39" key={`feat-${index}`}>
                  <div className="text-center px-4">
                    <p className="text-[40px]/10 sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{feat.title}</p>
                    <p className="text-xl sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10">{feat.text}</p>
                  </div>
                  <div className="w-full flex justify-center">
                    <img src={feat.image} alt={feat.alt} className="h-auto" />
                  </div>
                </div>
              )
            })}


          </div>
        </section>

        <section className="py-12 sm:py-20 md:py-28 bg-[#6A52CC] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-14 sm:mb-12 md:mb-14" dangerouslySetInnerHTML={{ __html: t('dashboard.title') }} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {dashboardFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col mb-18">
                  <div className={`rounded-3xl ${feature.borderColor} mb-6 sm:mb-8 overflow-hidden`}>
                    <img
                      src={Chat6}
                      alt="Dashboard preview"
                      className="w-full h-auto rounded-2xl"
                    />
                  </div>

                  <div className="text-center px-2 sm:px-4">
                    <h3 className="text-2xl leading-[28px] sm:text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-[24px] text-white sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-12 sm:py-20 bg-[#050912] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4">
                {t('pricing.title')}
              </h2>
              <p className="text-[32px] leading-[40px] sm:text-2xl md:text-3xl lg:text-4xl italic text-[#ABFFA8] mb-6 sm:mb-8">
                {t('pricing.trial')}
              </p>

              <div className="inline-flex items-center bg-[#0f1521] rounded-full p-1 gap-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${billingPeriod === 'monthly'
                    ? 'bg-white text-black'
                    : 'text-white hover:text-gray-300'
                    }`}
                >
                  {t('pricing.monthly')}
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${billingPeriod === 'annual'
                    ? 'bg-white text-black'
                    : 'text-white hover:text-gray-300'
                    }`}
                >
                  {t('pricing.annual')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-3xl px-4 sm:px-6 md:px-8 bg-[#050912] ${plan.popular
                    ? 'border-1 border-[#8465FF] md:-mt-6 py-10 sm:py-12 md:py-14'
                    : 'border-1 border-[#CDCEDF] py-6 sm:py-8'
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#7B5FCC] text-white px-4 sm:px-6 py-1 rounded-full text-xs sm:text-sm font-bold uppercase whitespace-nowrap">
                      {t('pricing.mostPopular')}
                    </div>
                  )}

                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${plan.popular ? 'bg-[#7B5FCC] text-white' : 'bg-white text-black'
                      }`}>
                      {plan.icon}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-xl text-white text-center mb-2">
                    {plan.name}
                  </h3>

                  <div className="text-center mb-4 sm:mb-6">
                    <span className="text-[32px] sm:text-3xl font-bold text-white">
                      {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </span>
                    {!plan.isLifetime && (
                      <span className="text-[32px] sm:text-2xl md:text-3xl font-bold text-white"> {t('pricing.perMonth')}</span>
                    )}
                    {plan.isLifetime && (
                      <span className="text-[32px] sm:text-xl md:text-2xl font-bold text-white"> {t('pricing.oneTime')}</span>
                    )}
                  </div>

                  <Link
                    to="/register"
                    className={`w-full block text-center py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold mb-4 sm:mb-6 transition-colors ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </Link>

                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="mt-3 flex items-center gap-2 sm:gap-3 text-white">
                        <span className={`flex-shrink-0 ${feature.included ? 'text-[#ABFFA8]' : 'text-gray-500'}`}>
                          {feature.included ? <img src={Check2} alt="check" className="w-[20px]" /> : <img src={X} alt="x" className="w-[20px]" />}
                        </span>
                        <span className={`text-xs sm:text-sm leading-relaxed ${!feature.included ? 'text-gray-500' : ''}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-works" className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#2a3f5f] to-[#5a4a8a] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <div className="flex justify-center order-2 md:order-1">
                <img src={Image5} alt="WhatsApp conversation" className="w-full max-w-md rounded-2xl" />
              </div>

              <div className="order-1 md:order-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 sm:mb-10 md:mb-12">
                  {t('howWorks.title')}
                </h2>

                <div className="space-y-6 sm:space-y-8">
                  {howItWorksSteps.map((step, index) => (
                    <div key={index} className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-lg sm:text-xl font-bold">{step.number}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] mb-1 sm:mb-2">
                          {step.title}
                        </h3>
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#050912] py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-0 rounded-3xl overflow-hidden">
              <div
                className="bg-[#ABFFA8] p-8 sm:p-12 lg:p-16 flex flex-col justify-center gap-10"
                style={{
                  paddingTop: '6%',
                  paddingRight: '12.7%',
                  paddingBottom: '5.3%',
                  paddingLeft: '12.7%'
                }}
              >
                <div className="flex gap-2 mt-6 mb-0">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="40" height="40" viewBox="0 0 24 24" fill="#6FE36B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p
                  style={{
                    fontFamily: 'Figtree',
                    fontWeight: 500,
                    fontSize: '36px',
                    lineHeight: '44px',
                    letterSpacing: '-0.02em',
                    color: '#050912'
                  }}
                >
                  Tenía un desorden total con mis calendarios y correos. Eureky.ai lo organiza todo por mí, es como tener un cerebro extra que te ayuda a ser imparable
                </p>
                <div>
                  <p
                    style={{
                      fontFamily: 'Figtree',
                      fontWeight: 700,
                      fontSize: '18px',
                      lineHeight: '28px',
                      letterSpacing: '0',
                      color: '#050912'
                    }}
                  >
                    — Renee Wells
                  </p>
                  <p
                    style={{
                      fontFamily: 'Figtree',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '0',
                      color: '#050912'
                    }}
                  >
                    Product Designer, Quotient
                  </p>
                </div>
              </div>

              <div className="relative w-full" style={{ paddingBottom: '63.8%' }}>
                <img
                  src={TestimonialRenee}
                  alt="Renee Wells"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/40 transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="reviews" className="bg-[#050912] text-gray-300 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-8 sm:mb-12">
              <Trans i18nKey="testimonials.title">
                Ellos también aman <span className="text-[#9999FE]">eureky.ai</span>
              </Trans>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="rounded-3xl bg-[#0f1521] p-6 sm:p-8">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#ABFFA8] text-lg sm:text-xl">★</span>
                    ))}
                  </div>

                  <h3 className="text-white font-bold text-lg sm:text-xl mb-3">
                    {testimonial.title}
                  </h3>

                  <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed">
                    {testimonial.text}
                  </p>

                  <p className="text-white text-xs sm:text-sm mt-6 sm:mt-10">
                    {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
            <div className="rounded-3xl sm:rounded-[40px] bg-[#4E36AF] p-6 sm:p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="md:col-span-1">
                  <h2 className="text-5xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {t('faq.title')}
                  </h2>
                </div>

                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-white/20 pb-3 sm:pb-4">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between text-left text-white hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        <span className="text-[22px] sm:text-base md:text-lg font-medium pr-4">
                          {faq.question}
                        </span>
                        <PlusCircleIcon
                          className={`w-8 h-5 sm:w-6 sm:h-6 flex-shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-45' : ''
                            }`}
                        />
                      </button>
                      {openFaqIndex === index && (
                        <p className="mt-2 sm:mt-3 text-white/90 text-xs sm:text-sm md:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-6 sm:pt-8 border-gray-800">
            <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6">
              <div className="md:text-left">
                <img src={Logo} alt="logo_footer" className="w-[220px] mb-12" />
                <a
                  href="https://eureky.ai/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xl sm:text-sm text-gray-400 hover:text-white mb-2"
                >
                  Blog
                </a>
                <a href={`mailto:${t('footer.contact')}`} className="text-xl sm:text-sm text-gray-400 hover:text-white underline">
                  {t('footer.contact')}
                </a>
                <div className="hidden sm:block sm:mt-10">
                  <div className="flex">
                    <a href={t('footer.facebook')} className="text-gray-400 hover:text-white mr-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href={t('footer.instagram')} className="text-gray-400 hover:text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex gap-4 block sm:hidden">
                  <a href={t('footer.facebook')} className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href={t('footer.instagram')} className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                </div>
                <div className="mt-20 text-sm sm:text-sm text-gray-400 flex justify-between sm:flex-row items-between gap-2 sm:gap-4 sm:items-center">
                  <span className="sm:mr-[66px]">{t('footer.copyright', { year: new Date().getFullYear() })}</span>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Link to="/privacy-policy" className="hover:text-white underline">{t('footer.privacy')}</Link>
                    <Link to="/terms-and-conditions" className="hover:text-white underline">{t('footer.terms')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
