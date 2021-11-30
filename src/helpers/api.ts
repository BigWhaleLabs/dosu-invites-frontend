import arrayToHashMap from 'helpers/arrayToHashMap'
import fetch from 'unfetch'

const backend = import.meta.env.BACKEND || 'https://backend.invites.dosu.io'

export default async function getFramesToEthMap() {
  const ethAddresses: string[] = await (
    await fetch(`${backend}/video/invites`)
  ).json()
  const framesToEthMap: { [frame: number]: string } = arrayToHashMap(
    ethAddresses,
    1
  )
  return framesToEthMap
}
