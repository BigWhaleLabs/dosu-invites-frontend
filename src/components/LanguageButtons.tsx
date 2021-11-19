import { Button } from 'components/Button'
import AppStore from 'stores/AppStore'
import Language from 'models/Language'

export default function LanguageButtons() {
  return (
    <div>
      {Object.values(Language).map((k) => (
        <Button
          key={k}
          onClick={() => {
            AppStore.language = k
          }}
          title={k}
        />
      ))}
    </div>
  )
}
