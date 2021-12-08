import { classnames } from 'classnames/tailwind'

const icon = classnames('fill-current')

const Cross = () => {
  return (
    <svg
      width="56"
      height="48"
      viewBox="0 0 58 48"
      fill="current"
      className={icon}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.2391 22.3291L29.6641 16.9041C30.2028 16.3653 31.0778 16.3653 31.6166 16.9041C32.1553 17.4428 32.1553 18.3178 31.6166 18.8566L26.1916 24.2816L31.6166 29.7066C32.1441 30.2328 32.1441 31.0891 31.6166 31.6166C31.0891 32.1441 30.2328 32.1441 29.7066 31.6166L24.2816 26.1916L18.8566 31.6166C18.3178 32.1553 17.4428 32.1553 16.9041 31.6166C16.3653 31.0778 16.3653 30.2028 16.9041 29.6641L22.3291 24.2391L16.9041 18.8141C16.3766 18.2878 16.3766 17.4316 16.9041 16.9041C17.4316 16.3766 18.2878 16.3766 18.8141 16.9041L24.2391 22.3291Z"
        fill="current"
      />
    </svg>
  )
}

export default Cross
