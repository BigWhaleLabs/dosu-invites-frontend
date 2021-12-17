import { useEffect, useState } from 'react'

const mdSize = 768

export default function useBreakpoints() {
  const [size, setSize] = useState({ md: false })
  const [width, setWidth] = useState(window.innerWidth)
  window.addEventListener('resize', () => setWidth(window.innerWidth))

  useEffect(() => {
    setSize({ md: width > mdSize })
  }, [size, width])

  return size
}
