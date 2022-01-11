import { FooterText } from 'components/Text'
import {
  alignItems,
  classnames,
  display,
  justifyContent,
  margin,
  padding,
  textAlign,
  verticalAlign,
} from 'classnames/tailwind'

const footerContainer = classnames(
  display('flex'),
  justifyContent('justify-center'),
  alignItems('items-center'),
  margin('mt-auto'),
  padding('py-3'),
  verticalAlign('align-middle'),
  textAlign('text-center')
)
const dotPadding = classnames(padding('px-3'))

const Footer = () => {
  return (
    <div className={footerContainer}>
      <FooterText>
        <a rel="noopener noreferrer" href="https://dosu.io/privacy">
          Privacy
        </a>
        <span className={dotPadding}>{'•'}</span>
        <a rel="noopener noreferrer" href="https://dosu.io/terms">
          Terms
        </a>
      </FooterText>
    </div>
  )
}

export default Footer
