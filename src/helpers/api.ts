import fetch from 'unfetch'

export default async function getFramesToEthMap() {
  const framesToEthMap: { [frame: number]: string } = await (
    await fetch('http://localhost:1337/video/data')
  ).json()
  return framesToEthMap
}
