export default function arrayToHashMap(array: string[], shift: number) {
  const hashMap: { [x: number]: string } = {}
  for (let i = 0; i < array.length; i++) {
    hashMap[i + shift] = array[i]
  }
  return hashMap
}
