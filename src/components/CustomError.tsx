import { BodyText } from 'components/Text'
import { Button } from 'components/Button'
import {
  classnames,
  display,
  flexDirection,
  justifyContent,
  space,
} from 'classnames/tailwind'
import WalletStore from 'stores/WalletStore'
import env from 'helpers/env'

const errorWrapper = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  space('space-y-2')
)

const CustomError = () => {
  return (
    <div className={errorWrapper}>
      <BodyText>
        Looks like you're using {WalletStore.networkName} network, please,
        switch to {env.VITE_ETH_NETWORK}
      </BodyText>
      <Button
        outlined
        fullWidth
        title="Switch"
        onClick={() => WalletStore.changeNetworkToDefault()}
      />
    </div>
  )
}

export default CustomError
