import { AxiosResponse } from 'axios'
import Api from 'helpers/axios'
import Invites from 'models/Invites'

export async function getMintedAddresses() {
  const { data }: AxiosResponse<Invites> = await Api.get('/invites')
  return data
}

export async function getIpfsLink(tokenId: number) {
  const { data }: AxiosResponse<string | undefined> = await Api.post(
    '/invites/ipfs',
    {
      tokenId,
    }
  )
  return data
}
