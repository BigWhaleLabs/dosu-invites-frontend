import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function useLocation() {
  const [pathId, setPathId] = useState<number>()
  const { id } = useParams()
  const path = location.href

  useEffect(() => {
    if (!id) return

    setPathId(Number(id))
  }, [id])

  return { pathId, path }
}
