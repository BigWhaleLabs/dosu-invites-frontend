import { Theme } from 'models/Theme'

export default function usePreferredTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Theme.dark
    : Theme.light
}
