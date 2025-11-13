import { useEffect, useState, type FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { THEME } from 'styles';
import { IconButton } from 'components/IconButton';

export const ThemeSwitch: FC = () => {
  const { t } = useTranslation('header');

  const [theme, setTheme] = useState(
    localStorage.getItem(THEME) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  );

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME, theme);
  }, [theme]);

  return (
    <IconButton
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      label={t('buttons.theme')}
      icon={isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    />
  );
};
