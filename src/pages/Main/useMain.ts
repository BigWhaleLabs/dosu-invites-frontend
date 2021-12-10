import * as api from 'helpers/api'
import { Invites } from 'models/Invites'
import { useEffect } from 'preact/hooks'
import { useState } from 'react'
import AppStore from 'stores/AppStore'

export default function useMain() {
  const [loading, setLoading] = useState(false)
  const [invited, setInvited] = useState(false)
  const [framesToEth, setFramesToEth] = useState<Invites>([])

  const getFramesToEth = async () => {
    setLoading(true)
    try {
      setFramesToEth(await api.getFramesToEth())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void getFramesToEth()
  }, [])

  useEffect(() => {
    const checkUserInvite = async () => {
      if (AppStore.userAddress) {
        setInvited(await api.checkInvite(AppStore.userAddress))
      }
    }

    void checkUserInvite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AppStore.userAddress])

  return { framesToEth, loading, invited }
}
