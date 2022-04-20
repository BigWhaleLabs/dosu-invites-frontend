import { LocalizationProvider as BaseLocalizationProvider } from '@borodutch-labs/localize-react'
import { FC } from 'preact/compat'
import AppStore from 'stores/AppStore'
import Language from 'models/Language'
import en from 'localization/locales/en.json'
import ru from 'localization/locales/ru.json'

const messages = {
  en,
  ru: { ...en, ...ru },
}

const LocalizationProvider: FC = ({ children }) => {
  return (
    <BaseLocalizationProvider
      locale={AppStore.language}
      defaultLocale={Language.en}
      translations={messages}
      disableCache
    >
      {children}
    </BaseLocalizationProvider>
  )
}

export default LocalizationProvider
