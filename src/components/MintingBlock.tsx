import { SubheaderText } from 'components/Text'
import { Suspense } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { useEffect, useState } from 'preact/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import Button from 'components/Button'
import IpfsStore from 'stores/IpfsStore'
import WalletStore from 'stores/WalletStore'
import classnames, {
  alignItems,
  display,
  flexDirection,
  justifyContent,
  margin,
} from 'classnames/tailwind'
import copy from 'copy-to-clipboard'

const container = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center')
)
const buttonContainer = classnames(margin('mt-4'))

function AllowChecker() {
  const { allowlist } = useSnapshot(IpfsStore)
  const userAddress = WalletStore.userAddress
  const { tokenId, loading } = useSnapshot(WalletStore)
  const { id } = useParams()
  const [allowed, setAllowed] = useState<boolean>()
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const listOfAddresses = proxy(allowlist)

  useEffect(() => {
    function checkData(userAddress: string) {
      const invitedAddress = userAddress.toLowerCase()
      setAllowed(
        listOfAddresses.findIndex(
          (address) => invitedAddress === address.toLowerCase()
        ) > -1
      )
    }

    if (userAddress) void checkData(userAddress)
  }, [userAddress, listOfAddresses])

  return (
    <SubheaderText>
      {allowed ? (
        tokenId !== undefined ? (
          <div className={container}>
            Your Dosu Invite is #{tokenId}!
            <div className={buttonContainer}>
              {Number(id) === tokenId ? (
                <Button
                  disabled={copied}
                  title={
                    copied
                      ? 'Copied!'
                      : "Here's your NFT! Share this link with frens!"
                  }
                  onClick={() => {
                    copy(window.location.href)
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
        <Button disabled>
          You are not allowlisted to mint a Dosu Invite, sorry!
        </Button>
      )}
    </SubheaderText>
  )
}

export default function () {
  return (
    <Suspense
      fallback={
        <Button disabled loading>
          Checking if you have an invitation
        </Button>
      }
    >
      <AllowChecker />
    </Suspense>
  )
}
