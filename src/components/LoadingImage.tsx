import Loader from 'components/Loader'
import classnames, {
  borderRadius,
  display,
  height,
  inset,
  position,
  width,
} from 'classnames/tailwind'

const wrapper = classnames(
  height('h-fit'),
  width('w-fit'),
  position('relative'),
  display('flex')
)
const image = classnames(height('h-fit'), borderRadius('rounded-3xl'))

const LoadingImage = () => {
  return (
    <div className={wrapper}>
      <img src="img/blurInvite.png" className={image} />
      <Loader
        className={classnames(
          position('absolute'),
          inset('left-0', 'top-0', 'right-0', 'bottom-0')
        )}
      />
    </div>
  )
}

export default LoadingImage
