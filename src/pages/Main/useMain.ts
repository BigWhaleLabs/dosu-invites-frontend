import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useState } from 'react'
import AppStore from 'stores/AppStore'

export default function useMain() {
  const [loading, setLoading] = useState(false)
  const [invited, setInvited] = useState(false)
  const [framesToEthMap, setFramesToEthMap] = useState<{
    [frame: number]: string
  }>({})

  const getFramesToEthMap = async () => {
    setLoading(true)
    try {
      setFramesToEthMap(await api.getFramesToEthMap())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void getFramesToEthMap()

    const checkUserInvite = async () => {
      if (AppStore.userAddress) {
        setInvited(await api.checkInvite(AppStore.userAddress))
      }
    }

    void checkUserInvite()
  }, [])

  return { framesToEthMap, loading, invited }
}
