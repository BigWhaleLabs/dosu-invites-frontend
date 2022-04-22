import { useEffect, useState } from 'react'

export default function useLocation() {
  const [id, setId] = useState<number>()
  const frame = +location.pathname.split('/')[1]
  const path = location.href

  useEffect(() => {
    if (isNaN(frame)) return

    setId(frame)
  }, [frame, setId])

  return { id, path }
}
