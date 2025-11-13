import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { SupportedLanguages } from 'config';
import { IconButton } from 'components/IconButton';

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
    <IconButton
      onClick={handleToggleLanguage}
      label={t('buttons.changeLanguage', { lang: nextLanguageLabel })}
      icon={<Globe className="h-5 w-5" />}
    />
  );
};
