import { AxiosResponse } from 'axios'
import { IAssetData, IGasPrices, IParsedTx } from 'models/Blockchain'
import Api from 'helpers/axios'
import Invites from 'models/Invites'
import axios, { AxiosInstance } from 'axios'

export async function getMintedAddresses() {
  const { data }: AxiosResponse<Invites> = await Api.get('/invites')
  return data
}

export async function checkInvite(ethAddress: string) {
  const { data }: AxiosResponse<boolean> = await Api.post('/invites/invite', {
    ethAddress,
  })
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

const api: AxiosInstance = axios.create({
  baseURL: 'https://ethereum-api.xyz',
  timeout: 30000, // 30 secs
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export async function apiGetAccountAssets(
  address: string,
  chainId: number
): Promise<IAssetData[]> {
  const response = await api.get(
    `/account-assets?address=${address}&chainId=${chainId}`
  )
  const { result } = response.data
  return result
}

export async function apiGetAccountTransactions(
  address: string,
  chainId: number
): Promise<IParsedTx[]> {
  const response = await api.get(
    `/account-transactions?address=${address}&chainId=${chainId}`
  )
  const { result } = response.data
  return result
}

export const apiGetAccountNonce = async (
  address: string,
  chainId: number
): Promise<string> => {
  const response = await api.get(
    `/account-nonce?address=${address}&chainId=${chainId}`
  )
  const { result } = response.data
  return result
}

export const apiGetGasPrices = async (): Promise<IGasPrices> => {
  const response = await api.get(`/gas-prices`)
  const { result } = response.data
  return result
}
