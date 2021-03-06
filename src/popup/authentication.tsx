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
import { useHistory } from 'react-router-dom'

const READY_TIME = 5000

export const AuthenticationPopup = ({
  show,
  close
}: AuthenticationPopupProps) => {
  const [authRequestState, setAuthRequestState] = useState<AuthRequestState>(
    AuthRequestState.StandBy
  )

  const history = useHistory()

  useEffect(() => {
    if (!show) {
      return
    }

    setAuthRequestState(AuthRequestState.Authing)

    const abortControl = new AbortController()

    fetch(process.env.API_ENDPOINT + '/auth', {
      signal: abortControl.signal
    })
      .then(async v => {
        if (v.status !== 200) {
          setAuthRequestState(AuthRequestState.Failed)
        } else {
          try {
            const data = await v.json()

            if (data.status !== 'success') throw new Error('Auth failed.')
            if (typeof data.data !== 'object')
              throw new Error('Data field is not typeof an object.')

            if (data.data.state === 'DONE') {
              setAuthRequestState(AuthRequestState.Authed)
            } else if (data.data.state === 'WAITING_KEY') {
              setAuthRequestState(AuthRequestState.WaitingKey)
            } else throw new Error('Unknown auth state.')
          } catch (e) {
            setAuthRequestState(AuthRequestState.Failed)
          }
        }
      })
      .catch(() => {
        setAuthRequestState(AuthRequestState.Failed)
      })

    return () => {
      abortControl.abort()
    }
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

  useEffect(() => {
    if (authRequestState === AuthRequestState.Authed) {
      history.push('/manage')
    }
  }, [authRequestState])

  const minify = () => {
    if (
      authRequestState === AuthRequestState.Authed ||
      authRequestState === AuthRequestState.WaitingKey ||
      authRequestState === AuthRequestState.Failed
    ) {
      close()
    }
  }

  let STATE_TEXT = '?????? ???...'
  let STATE_ICON = 'loading'
  let STATE_DESCRIPTION = <span></span>

  switch (authRequestState) {
    case AuthRequestState.WaitingKey:
      STATE_TEXT = '?????? ?????? ???????????????.'
      STATE_ICON = 'key'
      STATE_DESCRIPTION = <span>?????? ??????????????? ?????? ?????? ???????????????.</span>
      break
    case AuthRequestState.Authing:
      STATE_TEXT = '?????? ????????????...'
      STATE_ICON = 'loading'
      STATE_DESCRIPTION = <span></span>
      break
    case AuthRequestState.Authed:
      STATE_TEXT = '?????????????????????.'
      STATE_ICON = 'check'
      STATE_DESCRIPTION = <span></span>
      break
    case AuthRequestState.Failed:
      STATE_TEXT = '???????????? ???????????????.'
      STATE_ICON = 'error'
      STATE_DESCRIPTION = <span>????????? ??????????????? ???????????? ???????????????.</span>
      break
    default:
      STATE_TEXT = '?????? ???...'
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
              ??? ?????? {comma(Math.floor(READY_TIME / 1000))}??? ?????? ????????????.
            </h3>
          ) : null}
        </div>
      </Popup>
    </>
  )
}

export default AuthenticationPopup
