export default function (data: string) {
  return `${data.substring(0, 7)}...${data.slice(-3)}`
}
