import { DimmedSubheaderText, HeaderText } from 'components/Text'
import { classnames } from 'classnames/tailwind'
import Footer from 'components/Footer'

const container = classnames('flex', 'flex-col', 'h-full')

export default function NotFound() {
  return (
    <div className={container}>
      <HeaderText>404</HeaderText>
      <DimmedSubheaderText>Not found</DimmedSubheaderText>

      <Footer />
    </div>
  )
}
