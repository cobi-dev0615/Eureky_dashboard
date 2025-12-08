import { useTranslation } from 'react-i18next';
import { useNext7DaysItems } from '../lists/hooks/useNext7DaysItems';
import DayColumn from './components/DayColumn';

const Next7Days = () => {
  const { t } = useTranslation();
  const { data: weekData, isLoading } = useNext7DaysItems();

  const getDayNameByNumber = (dayOfWeek) => {
    const dayNames = {
      0: t('next7Days.sunday'),
      1: t('next7Days.monday'),
      2: t('next7Days.tuesday'),
      3: t('next7Days.wednesday'),
      4: t('next7Days.thursday'),
      5: t('next7Days.friday'),
      6: t('next7Days.saturday'),
    };
    return dayNames[dayOfWeek] || '';
  };

  const days = weekData?.days || [];

  return (
    <div className="h-full flex flex-col">
      <h1
        className="lg:text-[48px] lg:font-bold mb-3 px-4 lg:px-6 flex-shrink-0"
        style={{
          fontFamily: 'DM Sans',
          fontWeight: '400',
          fontSize: '20px',
          lineHeight: '150%',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'lining-nums tabular-nums'
        }}
      >{t('next7Days.title')}</h1>

      <div className="flex-1 overflow-x-auto overflow-y-visible pb-6 custom-scrollbar">
        <div className="flex gap-4 px-4 lg:px-6 min-w-max">
          {days.map((dayData, index) => {
            const isToday = index === 0;
            return (
              <div key={`day-${index}`} className="flex-shrink-0 w-[280px]">
                <DayColumn
                  dayName={getDayNameByNumber(dayData.dayOfWeek)}
                  items={dayData.items || []}
                  date={dayData.date}
                  isLoading={isLoading}
                  isToday={isToday}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Next7Days;
