import { useEffect, useState, type FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'components/ui';
import { useTranslation } from 'react-i18next';
import { THEME } from 'styles';

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('buttons.theme')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
