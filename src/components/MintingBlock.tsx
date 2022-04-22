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
import copy from 'copy-to-clipboard'
import getAllowlist from 'helpers/getAllowlist'
import useLocation from 'components/useLocation'

const container = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center')
)
const buttonContainer = classnames(margin('mt-4'))

export default function MintingBlock() {
  const { tokenId, loading } = useSnapshot(WalletStore)
  const { id, path } = useLocation()
  const userAddress = WalletStore.userAddress
  const [allowed, setAllowed] = useState<boolean>()
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkData(userAddress: string) {
      const allowlist = await getAllowlist()
      const invitedAddress = userAddress.toLowerCase()
      setAllowed(
        allowlist.findIndex((address) => invitedAddress === address) > -1
      )
    }

    if (userAddress) void checkData(userAddress)
  }, [userAddress])

  return (
    <SubheaderText>
      {allowed ? (
        tokenId !== undefined ? (
          <div className={container}>
            Your Dosu Invite is #{tokenId}!
            <div className={buttonContainer}>
              {id === tokenId ? (
                <Button
                  disabled={copied}
                  title={
                    copied
                      ? 'Copied!'
                      : "Here's your NFT! Share this link with friends!"
                  }
                  onClick={() => {
                    copy(path)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1000)
                  }}
                />
              ) : (
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
              )}
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
