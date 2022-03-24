import Theme from 'models/Theme'

export default interface ISVGIcon extends React.SVGAttributes<SVGElement> {
  theme?: Theme
  title?: string
  height?: number
  width?: number
}
