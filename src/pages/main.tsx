import Button from '@/components/Button'
import BigLogo from '@/components/Logo/Big'
import Spacer from '@/components/Spacer'

import '@/styles/pages/main.scss'
import { useHistory } from 'react-router-dom'

const NavigateButtons = () => {
  const history = useHistory()

  const goto = (link: string) => {
    history.push(link)
  }

  return (
    <div className='button-group'>
      <Button onClick={() => goto('/menu')}>주문 시작하기</Button>
      <Button theme='alt'>점원 호출하기</Button>
    </div>
  )
}

export const MainPage = () => {
  return (
    <div className='page main'>
      <Spacer template='main-contents' flex={true}>
        <div className='page-contents'>
          <Spacer
            customStyles={{
              marginBottom: 64
            }}
          >
            <BigLogo></BigLogo>
          </Spacer>
          <NavigateButtons></NavigateButtons>
        </div>
      </Spacer>
    </div>
  )
}

export default MainPage
