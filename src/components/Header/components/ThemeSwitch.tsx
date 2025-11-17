import { type FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styles';
import { IconButton } from 'components/IconButton';

export const ThemeSwitch: FC = () => {
  const { t } = useTranslation('header');
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <IconButton
      onClick={toggleTheme}
      label={t('buttons.theme')}
      icon={isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    />
  );
};
