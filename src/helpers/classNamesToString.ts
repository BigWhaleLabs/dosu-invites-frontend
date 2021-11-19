export default function classNamesToString(
  list: (string | undefined | null)[]
): string {
  return list.filter((s) => !!s).join(' ')
}
