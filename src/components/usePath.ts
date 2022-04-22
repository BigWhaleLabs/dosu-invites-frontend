import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

export default function usePath() {
  const [pathId, setPathId] = useState<number>()
  const { id } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (!id) return

    setPathId(Number(id))
  }, [id])

  return { pathId, path: location.pathname }
}
