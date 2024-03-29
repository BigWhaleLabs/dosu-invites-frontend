import { AxiosResponse } from 'axios'
import Api from 'helpers/axios'

export default async function () {
  const { data }: AxiosResponse<string[]> = await Api.get('/')
  return data
}
