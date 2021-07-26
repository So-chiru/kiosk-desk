import { ReactNode } from 'react'

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

export const Popup = ({ children, minimize, state }: PopupProps) => {
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
