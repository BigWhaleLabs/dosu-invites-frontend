import { useEffect, useState } from 'react'

const mdSize = 768

export default function useBreakpoints() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return {
    md: width > mdSize,
  }
}
