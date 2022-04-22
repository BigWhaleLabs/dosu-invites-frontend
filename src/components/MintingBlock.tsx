import { Button } from 'components/Button'
import { SubheaderText } from 'components/Text'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import WalletStore from 'stores/WalletStore'
import classnames, {
  alignItems,
  display,
  flexDirection,
  justifyContent,
  margin,
} from 'classnames/tailwind'
import getAllowlist from 'helpers/getAllowlist'

const container = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center')
)
const buttonContainer = classnames(margin('mt-4'))

export default function MintingBlock() {
  const { userAddress, tokenId, loading } = useSnapshot(WalletStore)
  const [allowed, setAllowed] = useState<boolean>()
  const navigate = useNavigate()

  useEffect(() => {
    async function checkData() {
      if (!userAddress) return
      const allowlist = await getAllowlist()
      setAllowed(
        allowlist.findIndex(
          (address) => userAddress.toLowerCase() === address
        ) > -1
      )
    }

    void checkData()
  }, [userAddress])

  return (
    <SubheaderText>
      {allowed ? (
        tokenId !== undefined ? (
          <div className={container}>
            Your Dosu Invite is #{tokenId}!
            <div className={buttonContainer}>
              <Button
                onClick={() => {
                  if (WalletStore.tokenId)
                    navigate(`/${WalletStore.tokenId.toString()}`, {
                      replace: true,
                    })
                }}
              >
                Go check it out
              </Button>
            </div>
          </div>
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
