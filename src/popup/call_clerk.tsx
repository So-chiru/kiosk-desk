import Popup, { PopupState } from '@/components/Popup'
import StatusIndicator from '@/components/StatusIndicator'
import { useEffect, useState } from 'react'

interface CallClerkPopupProps {
  show: boolean
  close: () => void
}

enum CallState {
  StandBy,
  Calling,
  Called,
  Failed
}

import '@/styles/popup/call_clerk.scss'
import { comma } from '@/utils/number'

const READY_TIME = 5000

export const CallClerkPopup = ({ show, close }: CallClerkPopupProps) => {
  const [callState, setCallState] = useState<CallState>(CallState.StandBy)

  useEffect(() => {
    if (!show) {
      return
    }

    setCallState(CallState.Calling)

    fetch(process.env.API_ENDPOINT + '/call_clerk')
      .then(v => {
        if (v.status !== 200) {
          setCallState(CallState.Failed)
        } else {
          setCallState(CallState.Called)
        }

        return v
      })
      .catch(() => {
        setCallState(CallState.Failed)
      })
  }, [show, close])

  useEffect(() => {
    if (!show) {
      return
    }

    if (callState === CallState.Called || callState === CallState.Failed) {
      const timeout = setTimeout(() => {
        close()
        setCallState(CallState.StandBy)
      }, READY_TIME)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [callState, show])

  const minify = () => {
    if (callState === CallState.Called || callState === CallState.Failed) {
      close()
    }
  }

  let STATE_TEXT = '대기 중...'
  let STATE_ICON = 'loading'
  let STATE_DESCRIPTION = <span></span>

  switch (callState) {
    case CallState.Calling:
      STATE_TEXT = '점원 호출 중입니다...'
      STATE_ICON = 'loading'
      STATE_DESCRIPTION = <span></span>
      break
    case CallState.Called:
      STATE_TEXT = '점원을 호출했습니다.'
      STATE_ICON = 'check'
      STATE_DESCRIPTION = <span></span>
      break
    case CallState.Failed:
      STATE_TEXT = '점원을 호출하지 못했습니다.'
      STATE_ICON = 'error'
      STATE_DESCRIPTION = <span>직접 점원을 불러주세요.</span>
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
          {callState === CallState.Called || callState === CallState.Failed ? (
            <h3 className='auto-close-text'>
              이 창은 {comma(Math.floor(READY_TIME / 1000))}초 후에 닫힙니다.
            </h3>
          ) : null}
        </div>
      </Popup>
    </>
  )
}

export default CallClerkPopup
