import { AxiosResponse } from 'axios'
import Api from 'helpers/axios'

export default async function getAllowlist() {
  const { data }: AxiosResponse<string[]> = await Api.get('/invites')
  return data
}
