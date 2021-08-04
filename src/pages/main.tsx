import Button from '@/components/Button'
import { SettingsIcon } from '@/components/Icons'
import BigLogo from '@/components/Logo/Big'
import Spacer from '@/components/Spacer'
import AuthenticationPopup from '@/popup/authentication'
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
  const [callClerkPopup, showCallClerkPopup] = useState<boolean>(false)
  const [requestAuthPopup, showRequestAuthPopup] = useState<boolean>(false)

  return (
    <div className='page main'>
      <Spacer template='main-contents' flex={true}>
        <div className='page-header'>
          <div className='icons'>
            <div className='icon' onClick={() => showRequestAuthPopup(true)}>
              {SettingsIcon}
            </div>
          </div>
        </div>
        <div className='page-contents'>
          <Spacer
            customStyles={{
              marginBottom: 64
            }}
          >
            <BigLogo></BigLogo>
          </Spacer>
          <NavigateButtons
            onClerkCall={() => showCallClerkPopup(true)}
          ></NavigateButtons>
          <CallClerkPopup
            show={callClerkPopup}
            close={() => showCallClerkPopup(false)}
          ></CallClerkPopup>
          <AuthenticationPopup
            show={requestAuthPopup}
            close={() => showRequestAuthPopup(false)}
          ></AuthenticationPopup>
        </div>
      </Spacer>
    </div>
  )
}

export default MainPage
