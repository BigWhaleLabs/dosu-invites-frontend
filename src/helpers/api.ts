import { AxiosResponse } from 'axios'
import Api from 'helpers/axios'
import Invites from 'models/Invites'

export async function getMintedAddresses() {
  const { data }: AxiosResponse<Invites> = await Api.get('/video/invites')
  return data
}

export async function mintNFT(ethAddress: string) {
  const { data }: AxiosResponse<boolean> = await Api.post('/nft', {
    ethAddress,
  })
  return data
}

export async function checkInvite(ethAddress: string) {
  const { data }: AxiosResponse<boolean> = await Api.post('/video/invite', {
    ethAddress,
  })
  return data
}
