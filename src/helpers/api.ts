import arrayToHashMap from 'helpers/arrayToHashMap'
import fetch from 'unfetch'

const backend =
  (import.meta.env.BACKEND as string) || 'https://backend.invites.dosu.io'

export default async function getFramesToEthMap() {
  const ethAddresses: string[] = await (
    await fetch(`${backend}/video/invites`)
  ).json()
  const framesToEthMap: { [frame: number]: string } = arrayToHashMap(
    ethAddresses,
    0
  )
  return framesToEthMap
}
