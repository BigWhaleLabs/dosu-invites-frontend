export default function truncateMiddle(data: string) {
  return `${data.substring(0, 7)}...${data.slice(-3)}`
}
