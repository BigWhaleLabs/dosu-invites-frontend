import { Button } from 'components/Button'
import { LinkText, SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import WalletStore from 'stores/WalletStore'
import getAllowlist from 'helpers/getAllowlist'

export default function MintingBlock() {
  const { userAddress, tokenId, loading } = useSnapshot(WalletStore)
  const [allowed, setAllowed] = useState<boolean>()

  useEffect(() => {
    async function checkData() {
      if (!userAddress) return
      const allowlist = await getAllowlist()
      setAllowed(allowlist.includes(userAddress))
    }

    void checkData()
  }, [userAddress])

  return (
    <SubheaderText>
      {allowed ? (
        tokenId !== undefined ? (
          <>
            `Your Dosu Invite is ${tokenId}!`
            <LinkText href={tokenId.toString()}>Go check it out</LinkText>
          </>
        ) : (
          <Button
            title="Mint"
            onClick={() => void WalletStore.mint()}
            loading={loading}
          />
        )
      ) : (
        'You are not allowlisted to mint a Dosu Invite, sorry!'
      )}
    </SubheaderText>
  )
}
