import arrayToHashMap from 'helpers/arrayToHashMap'
import fetch from 'unfetch'

const backend = process.env.REACT_APP_BACKEND || 'http://localhost:1337'

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
