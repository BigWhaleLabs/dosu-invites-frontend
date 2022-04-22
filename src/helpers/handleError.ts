import { serializeError } from 'eth-rpc-errors'
import { toast } from 'react-toastify'

export const ProofGenerationErrors = {}

export const ErrorList = {
  wrongNetwork: (userNetwork: string, contractNetwork: string) =>
    `Looks like you're using ${userNetwork} network, please, switch to ${contractNetwork}`,
  invalidProof: 'Merkle Tree Proof is not valid',
  unknown: 'An unknown error occurred, please, try again later',
  ipfsImage: "Can't fetch the image from IPFS, please, try again later",
  pleaseReconnect: 'Lost connection with your wallet, please, reconnect',
  clear: '',
}

export function handleError(error: unknown) {
  console.error(error)

  let errorMessageToDisplay: string | undefined

  if (typeof error === 'string') errorMessageToDisplay = error

  if (error instanceof Error) errorMessageToDisplay = error.message

  if (!errorMessageToDisplay) {
    const message = serializeError(error).message
    if (message)
      if (/cannot estimate gas/.test(message)) {
        errorMessageToDisplay = ErrorList.invalidProof
      } else {
        errorMessageToDisplay = message
      }
  }
  if (!errorMessageToDisplay) errorMessageToDisplay = ErrorList.unknown

  toast.error(errorMessageToDisplay)
}
