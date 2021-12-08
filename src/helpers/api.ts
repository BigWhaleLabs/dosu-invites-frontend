import { AxiosResponse } from 'axios'
import Api from 'helpers/axios'
import arrayToHashMap from 'helpers/arrayToHashMap'

export async function getFramesToEthMap() {
  const { data }: AxiosResponse<string[]> = await Api.get('/video/invites')
  const framesToEthMap: { [frame: number]: string } = arrayToHashMap(data, 0)
  return framesToEthMap
}

export async function checkInvite(ethAddress: string) {
  const { data }: AxiosResponse<boolean> = await Api.post('/video/invite', {
    ethAddress,
  })
  return data
}
