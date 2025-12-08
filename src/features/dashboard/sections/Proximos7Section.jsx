import { useTranslation } from 'react-i18next';
import { useNext7DaysItems } from '../../lists/hooks/useNext7DaysItems';
import { useDayName } from '../../next7days/hooks/useDayName';
import DayColumn from '../../next7days/components/DayColumn';
import { LoadingSpinner } from '../../next7days/components/LoadingSpinner';
import { TITLE_STYLES } from '../../next7days/constants/styles';

const SectionTitle = () => {
  const { t } = useTranslation();
  return (
    <h1 className="px-4 lg:px-6 mb-4" style={TITLE_STYLES}>
      {t('next7Days.title')}
    </h1>
  );
};

const DayColumnWrapper = ({ dayData, index, getDayNameByNumber, isMobile }) => {
  const isToday = index === 0;

  return (
    <div className={isMobile ? "w-full" : "flex-shrink-0 w-[280px]"}>
      <DayColumn
        dayName={getDayNameByNumber(dayData.dayOfWeek)}
        date={dayData.date}
        items={dayData.items || []}
        isToday={isToday}
      />
    </div>
  );
};

export const Proximos7Section = () => {
  const { data: weekData, isLoading } = useNext7DaysItems();
  const { getDayNameByNumber } = useDayName();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const days = weekData?.days || [];

  return (
    <div className="flex flex-col">
      <SectionTitle />

      <div className="lg:hidden flex flex-col gap-4 px-4 pb-4">
        {days.map((dayData, index) => (
          <DayColumnWrapper
            key={`mobile-${index}`}
            dayData={dayData}
            index={index}
            getDayNameByNumber={getDayNameByNumber}
            isMobile
          />
        ))}
      </div>

      <div className="hidden lg:block flex-1 overflow-y-visible pb-4">
        <div className="flex gap-1 px-6">
          {days.map((dayData, index) => (
            <DayColumnWrapper
              key={`desktop-${index}`}
              dayData={dayData}
              index={index}
              getDayNameByNumber={getDayNameByNumber}
              isMobile={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
