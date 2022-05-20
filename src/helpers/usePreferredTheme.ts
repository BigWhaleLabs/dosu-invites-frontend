import Theme from 'models/Theme'

export default function () {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Theme.dark
    : Theme.light
}
