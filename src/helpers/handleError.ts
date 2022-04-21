import { serializeError } from 'eth-rpc-errors'
import { toast } from 'react-toastify'
import CustomError from 'components/CustomError'

export const ProofGenerationErrors = {}

export const ErrorList = {
  wrongNetwork: 'Wrong network',
  invalidProof: 'Merkle Tree Proof is not valid',
  unknown: 'An unknown error occurred, please, contact us',
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

  toast.error(
    errorMessageToDisplay.includes('Wrong network')
      ? CustomError
      : errorMessageToDisplay
  )
}
