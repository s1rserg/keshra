import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  date: string;
}

export const DateSeparator: FC<Props> = ({ date }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const formattedDate = new Intl.DateTimeFormat(lang, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(date));

  return (
    <div className="flex justify-center my-4">
      <span className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-full shadow-sm">
        {formattedDate}
      </span>
    </div>
  );
};
