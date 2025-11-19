import { type FC } from 'react';
import { cn } from 'lib/utils';
import type { TabOption } from './types';
import { useTranslation } from 'react-i18next';

interface Props {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const SearchTabs: FC<Props> = ({ tabs, activeTab, onTabChange, className }) => {
  const { t } = useTranslation('chatsPage');

  return (
    <div className={cn('flex border-b border-gray-200', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-1 py-2 text-sm font-medium transition-colors relative',
            activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          {t(tab.label)}

          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
};
