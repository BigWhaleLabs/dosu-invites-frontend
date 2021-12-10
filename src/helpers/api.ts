import { AxiosResponse } from 'axios'
import { Invites } from 'models/Invites'
import Api from 'helpers/axios'

export async function getFramesToEth() {
  const { data }: AxiosResponse<Invites> = await Api.get('/video/invites')
  return data
}

export async function checkInvite(ethAddress: string) {
  const { data }: AxiosResponse<boolean> = await Api.post('/video/invite', {
    ethAddress,
  })
  return data
}
