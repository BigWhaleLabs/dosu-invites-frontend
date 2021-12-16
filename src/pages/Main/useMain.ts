import * as api from 'helpers/api'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import AppStore from 'stores/AppStore'
import Invites from 'models/Invites'

export default function useMain() {
  const { userAddress } = useSnapshot(AppStore)

  const [loading, setLoading] = useState(false)
  const [invited, setInvited] = useState(false)
  const [framesToEth, setFramesToEth] = useState<Invites>({})

  const getMintedAddresses = async () => {
    setLoading(true)
    try {
      setFramesToEth(await api.getMintedAddresses())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void getMintedAddresses()
  }, [])

  useEffect(() => {
    const checkUserInvite = async () => {
      if (AppStore.userAddress) {
        setInvited(await api.checkInvite(AppStore.userAddress))
      }
    }

    void checkUserInvite()
  }, [userAddress])

  return { framesToEth, loading, invited, getMintedAddresses }
}
