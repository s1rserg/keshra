import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { SupportedLanguages } from 'config';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Button } from 'components/ui';

export const LanguageSwitch: FC = () => {
  const { i18n, t } = useTranslation('header');

  const currentLanguage = i18n.language;
  const nextLanguage =
    currentLanguage === SupportedLanguages.UKRAINIAN
      ? SupportedLanguages.ENGLISH
      : SupportedLanguages.UKRAINIAN;

  const nextLanguageLabel =
    nextLanguage === SupportedLanguages.UKRAINIAN ? 'Українська' : 'English';

  const handleToggleLanguage = () => {
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleToggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('buttons.changeLanguage', { lang: nextLanguageLabel })}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
