import {
  classnames,
  container,
  display,
  flexDirection,
  height,
  margin,
  maxWidth,
  minHeight,
  padding,
} from 'classnames/tailwind'
import ChildrenProp from 'models/ChildrenProp'

const root = classnames(
  display('flex'),
  flexDirection('flex-col'),
  container('container'),
  margin('mx-auto'),
  padding('pb-10', 'pt-4', 'px-4'),
  maxWidth('max-w-4xl'),
  height('h-full'),
  minHeight('min-h-screen')
)
export default function ({ children }: ChildrenProp) {
  return <div className={root}>{children}</div>
}
