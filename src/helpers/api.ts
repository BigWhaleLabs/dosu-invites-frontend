import { AxiosResponse } from 'axios'
import { Invites } from 'models/Invites'
import Api from 'helpers/axios'

export async function getMintedAddresses() {
  const { data }: AxiosResponse<Invites> = await Api.get('/video/invites')
  return data
}

export async function mintNFT(ethAddress: string) {
  const { data }: AxiosResponse<Invites> = await Api.post('/nft', {
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
