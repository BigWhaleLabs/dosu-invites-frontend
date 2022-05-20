import {
  animation,
  classnames,
  height,
  opacity,
  textColor,
  width,
} from 'classnames/tailwind'

const loader = classnames(animation('animate-spin'), textColor('text-accent'))
const icon = (big?: boolean) =>
  classnames(loader, width(big ? 'w-7' : 'w-5'), height(big ? 'h-7' : 'h-5'))
export default function ({ big }: { big?: boolean }) {
  return (
    <svg className={icon(big)} viewBox="0 0 24 24">
      <circle
        className={classnames(opacity('opacity-25'))}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      ></circle>
      <path
        className={classnames(opacity('opacity-75'))}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
