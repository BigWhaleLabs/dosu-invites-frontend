import { Component } from 'react'
import { ErrorText } from 'components/Text'
import { margin } from 'classnames/tailwind'

const errorContainer = margin('my-4')

export default class extends Component<{
  fallbackText: string
}> {
  state: {
    hasError: boolean
    error?: Error
  } = { hasError: false }
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }
  render() {
    if (this.state.hasError) {
      console.error('Boundary error: ', this.state.error)
      return (
        <div className={errorContainer}>
          <ErrorText>{this.props.fallbackText}</ErrorText>
        </div>
      )
    }
    return this.props.children
  }
}
