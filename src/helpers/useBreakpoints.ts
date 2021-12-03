import { observable } from 'mobx'
import { useEffect, useState } from 'react'

const mdSize = 768

export default function useBreakpoints() {
  const [size] = useState(observable({ md: false }))
  const [width, setWidth] = useState(window.innerWidth)
  window.addEventListener('resize', () => setWidth(window.innerWidth))

  useEffect(() => {
    size.md = width > mdSize
  }, [size, width])

  return size
}
