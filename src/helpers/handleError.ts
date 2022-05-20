import { serializeError } from 'eth-rpc-errors'
import { toast } from 'react-toastify'

export const ProofGenerationErrors = {}

export const ErrorList = {
  wrongNetwork: (userNetwork: string, contractNetwork: string) =>
    `Looks like you're using ${userNetwork} network, please, switch to ${contractNetwork}`,
  invalidProof: 'Merkle Tree Proof is not valid',
  unknown: 'An unknown error occurred, please, try again later',
  ipfsImageBeingLoaded:
    'NFT is being uploaded to IPFS, please, try again in a few minutes',
  notExistIpfsImage: (imageId: number) =>
    `There is no image with ID ${imageId}`,
  pleaseReconnect: 'Lost connection with your wallet, please, reconnect',
  clear: '',
}

export default function (error: unknown) {
  console.error(error)
  toast.error(getMessageFromError(error))
}

function getMessageFromError(error: unknown) {
  if (typeof error === 'string') return error
  const message = serializeError(error).message
  if (message) {
    if (/cannot estimate gas/.test(message)) {
      return ErrorList.invalidProof
    } else {
      return message
    }
  }
  return ErrorList.unknown
}
