import { FC } from 'react'
import {
  classnames,
  container,
  display,
  flexDirection,
  height,
  margin,
  maxWidth,
  padding,
} from 'classnames/tailwind'
import SafariWarning from 'components/SafariWarning'
import isSafari from 'helpers/isSafari'

const root = classnames(
  display('flex'),
  flexDirection('flex-col'),
  container('container'),
  margin('mx-auto'),
  padding('pb-10', 'pt-4', 'px-4'),
  maxWidth('max-w-4xl'),
  height('h-screen')
)
const Root: FC = ({ children }) => {
  return (
    <div className={root}>
      {children}
      {isSafari && <SafariWarning />}
    </div>
  )
}

export default Root
