import { useEffect, useState } from 'react'

const smSize = 320
const mdSize = 768

export default function () {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function resizer() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', resizer)
    return () => {
      window.removeEventListener('resize', resizer)
    }
  }, [])

  return {
    xs: width < smSize,
    sm: width > smSize,
    md: width > mdSize,
  }
}
