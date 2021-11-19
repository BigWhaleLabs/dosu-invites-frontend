import { HeaderText } from 'components/Text'
import { observer } from 'mobx-react-lite'
import Whale from 'components/Whale'

function Main() {
  return (
    <>
      <HeaderText>Hello</HeaderText>
      <Whale />
    </>
  )
}

export default observer(Main)
