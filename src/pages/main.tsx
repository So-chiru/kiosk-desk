import Button from '@/components/Button'
import BigLogo from '@/components/Logo/Big'
import Spacer from '@/components/Spacer'
import CallClerkPopup from '@/popup/call_clerk'

import '@/styles/pages/main.scss'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

interface NavigateButtonsProps {
  onClerkCall: () => void
}

const NavigateButtons = ({ onClerkCall }: NavigateButtonsProps) => {
  const history = useHistory()

  const goto = (link: string) => {
    history.push(link)
  }

  return (
    <div className='button-group'>
      <Button onClick={() => goto('/menu')}>주문 시작하기</Button>
      <Button theme='alt' onClick={() => onClerkCall()}>
        점원 호출하기
      </Button>
    </div>
  )
}

export const MainPage = () => {
  const [callClerk, setCallClerk] = useState<boolean>(false)

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
          <NavigateButtons
            onClerkCall={() => setCallClerk(true)}
          ></NavigateButtons>
          <CallClerkPopup
            show={callClerk}
            close={() => setCallClerk(false)}
          ></CallClerkPopup>
        </div>
      </Spacer>
    </div>
  )
}

export default MainPage
