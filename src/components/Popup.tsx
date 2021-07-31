import { ReactNode, useEffect } from 'react'

export enum PopupState {
  Hidden = 0,
  Minimize = 1,
  Full = 2
}

interface PopupProps {
  children: ReactNode
  state: PopupState
  minimize?: () => void
}

import '@/styles/components/popup.scss'

const useBodyScroll = (state: PopupState) => {
  useEffect(() => {
    if (state === PopupState.Full) {
      if (document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden'
      }
    } else {
      if (document.body.style.overflow !== 'auto') {
        document.body.style.overflow = 'auto'
      }
    }
  }, [state])

  return true
}

export const Popup = ({ children, minimize, state }: PopupProps) => {
  useBodyScroll(state)

  return (
    <div className='popup-zone' data-state={state}>
      <div
        className='popup-background'
        onClick={() => minimize && minimize()}
      ></div>
      <div className='popup'>{children}</div>
    </div>
  )
}

export default Popup
