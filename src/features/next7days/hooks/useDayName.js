import { useTranslation } from 'react-i18next';

export const useDayName = () => {
  const { t } = useTranslation();

  const getDayNameByNumber = (dayOfWeek) => {
    const dayNames = {
      0: t('next7Days.sunday') || 'Domingo',
      1: t('next7Days.monday') || 'Lunes',
      2: t('next7Days.tuesday') || 'Martes',
      3: t('next7Days.wednesday') || 'Miércoles',
      4: t('next7Days.thursday') || 'Jueves',
      5: t('next7Days.friday') || 'Viernes',
      6: t('next7Days.saturday') || 'Sábado',
    };
    return dayNames[dayOfWeek] || '';
  };

  return { getDayNameByNumber };
};
