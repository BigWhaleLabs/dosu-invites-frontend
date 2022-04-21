import { Button } from 'components/Button'
import { SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import WalletStore from 'stores/WalletStore'
import getAllowlist from 'helpers/getAllowlist'

// TODO:
// Should fetch the allowlist from https://allowlist.dosu.io/allowlist (url should come from .env)
// Should check if the WalletStore.userAddress is in the allowlist
// If not, show the "You are not allowlisted to mint a Dosu Invite, sorry!" message
// If yes, check if WalletStore.tokenId is there
// If not, show the mint button
// If yes, show the "Your Dosu Invite is #5!" message + a button on the bottom to go to this url (/5) if not there yet
// When the mint button is clicked, run WalletStore.mint

export default function MintingBlock() {
  const [allowed, setAllowed] = useState<boolean>()

  useEffect(() => {
    async function checkData() {
      if (!WalletStore.userAddress) return
      const allowlist = await getAllowlist()
      setAllowed(allowlist.includes(WalletStore.userAddress))
    }

    void checkData()
  })

  return (
    <SubheaderText>
      {allowed ? (
        <Button />
      ) : (
        'You are not allowlisted to mint a Dosu Invite, sorry!'
      )}
    </SubheaderText>
  )
}
