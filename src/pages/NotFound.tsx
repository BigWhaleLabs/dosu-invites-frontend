import { DimmedSubheaderText, HeaderText } from 'components/Text'
import { classnames, display, flexDirection, height } from 'classnames/tailwind'
import Footer from 'components/Footer'

const container = classnames(
  display('flex'),
  flexDirection('flex-col'),
  height('h-full')
)

export default function () {
  return (
    <div className={container}>
      <HeaderText>404</HeaderText>
      <DimmedSubheaderText>Not found</DimmedSubheaderText>
      <Footer />
    </div>
  )
}
