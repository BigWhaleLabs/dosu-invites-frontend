import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useState } from 'react'

export default function useMain() {
  const [loading, setLoading] = useState(false)
  const [framesToEthMap, setFramesToEthMap] = useState<{
    [frame: number]: string
  }>({})

  const getFramesToEthMap = async () => {
    setLoading(true)
    try {
      setFramesToEthMap(await api.default())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void getFramesToEthMap()
  }, [])

  return { framesToEthMap, loading }
}
