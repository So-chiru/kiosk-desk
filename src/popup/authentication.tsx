import Popup, { PopupState } from '@/components/Popup'
import StatusIndicator from '@/components/StatusIndicator'
import { useEffect, useState } from 'react'

interface AuthenticationPopupProps {
  show: boolean
  close: () => void
}

enum AuthRequestState {
  StandBy,
  WaitingKey,
  Authing,
  Authed,
  Failed
}

import '@/styles/popup/basic-popup.scss'
import { comma } from '@/utils/number'

const READY_TIME = 5000

export const AuthenticationPopup = ({
  show,
  close
}: AuthenticationPopupProps) => {
  const [authRequestState, setAuthRequestState] = useState<AuthRequestState>(
    AuthRequestState.StandBy
  )

  useEffect(() => {
    if (!show) {
      return
    }

    setAuthRequestState(AuthRequestState.Authing)

    fetch(process.env.API_ENDPOINT + '/auth')
      .then(v => {
        if (v.status !== 200) {
          setAuthRequestState(AuthRequestState.Failed)
        } else {
          // setAuthRequestState(AuthRequestState.Authed)

          // TODO : 응답에 따라 변경

          setAuthRequestState(AuthRequestState.WaitingKey)
        }

        // TODO : 관리자 페이지로 이동

        return v
      })
      .catch(() => {
        setAuthRequestState(AuthRequestState.Failed)
      })
  }, [show, close])

  useEffect(() => {
    if (!show) {
      return
    }

    if (
      authRequestState === AuthRequestState.Authed ||
      authRequestState === AuthRequestState.Failed
    ) {
      const timeout = setTimeout(
        () => {
          close()
          setAuthRequestState(AuthRequestState.StandBy)
        },
        authRequestState === AuthRequestState.Authed ? 0 : READY_TIME
      )

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [authRequestState, show])

  const minify = () => {
    if (
      authRequestState === AuthRequestState.Authed ||
      authRequestState === AuthRequestState.WaitingKey ||
      authRequestState === AuthRequestState.Failed
    ) {
      close()
    }
  }

  let STATE_TEXT = '대기 중...'
  let STATE_ICON = 'loading'
  let STATE_DESCRIPTION = <span></span>

  switch (authRequestState) {
    case AuthRequestState.WaitingKey:
      STATE_TEXT = '인증 키를 삽입하세요.'
      STATE_ICON = 'key'
      STATE_DESCRIPTION = <span>잘못 누르셨다면 팝업 밖을 눌러주세요.</span>
      break
    case AuthRequestState.Authing:
      STATE_TEXT = '인증 중입니다...'
      STATE_ICON = 'loading'
      STATE_DESCRIPTION = <span></span>
      break
    case AuthRequestState.Authed:
      STATE_TEXT = '인증되었습니다.'
      STATE_ICON = 'check'
      STATE_DESCRIPTION = <span></span>
      break
    case AuthRequestState.Failed:
      STATE_TEXT = '인증하지 못했습니다.'
      STATE_ICON = 'error'
      STATE_DESCRIPTION = <span>상태가 계속된다면 개발팀을 불러주세요.</span>
      break
    default:
      STATE_TEXT = '대기 중...'
  }

  return (
    <>
      <Popup
        state={show ? PopupState.Full : PopupState.Hidden}
        minimize={minify}
      >
        <div className='clerk-contents'>
          <StatusIndicator
            icon={STATE_ICON}
            title={STATE_TEXT}
            description={STATE_DESCRIPTION}
          ></StatusIndicator>
          {authRequestState === AuthRequestState.Authed ||
          authRequestState === AuthRequestState.Failed ? (
            <h3 className='auto-close-text'>
              이 창은 {comma(Math.floor(READY_TIME / 1000))}초 후에 닫힙니다.
            </h3>
          ) : null}
        </div>
      </Popup>
    </>
  )
}

export default AuthenticationPopup
