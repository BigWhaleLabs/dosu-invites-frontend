import arrayToHashMap from 'helpers/arrayToHashMap'
import fetch from 'unfetch'

export default async function getFramesToEthMap() {
  const ethAddresses: string[] = await (
    await fetch('http://localhost:1337/video/invites')
  ).json()
  const framesToEthMap: { [frame: number]: string } = arrayToHashMap(
    ethAddresses,
    1
  )
  return framesToEthMap
}
