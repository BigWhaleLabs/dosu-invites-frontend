import arrayToHashMap from 'helpers/arrayToHashMap'
import fetch from 'unfetch'

const backend = (import.meta.env.BACKEND as string) || 'http://localhost:1337'

console.log(backend)

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
