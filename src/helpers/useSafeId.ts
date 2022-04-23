import { useParams } from 'react-router-dom'

export default function useSafeId() {
  const { id } = useParams()
  const safeId = Number(id || 1)

  return safeId
}
