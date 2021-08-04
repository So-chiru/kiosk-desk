import { ReactNode } from 'react'

type IconKeys = 'check' | 'error' | 'loading' | 'bank' | 'key'

interface StatusIndicatorProps {
  icon: ReactNode | IconKeys
  title: string
  description?: ReactNode
}

import '@/styles/components/statusIndicator.scss'

const IconLists: {
  [key in IconKeys]: ReactNode
} = {
  check: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='48'
      height='48'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z' />
    </svg>
  ),
  error: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='48'
      height='48'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z' />
    </svg>
  ),
  loading: (
    <svg
      className='kiosk-loading-animation'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='48'
      height='48'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z' />
    </svg>
  ),
  bank: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='48'
      height='48'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M2 20h20v2H2v-2zm2-8h2v7H4v-7zm5 0h2v7H9v-7zm4 0h2v7h-2v-7zm5 0h2v7h-2v-7zM2 7l10-5 10 5v4H2V7zm2 1.236V9h16v-.764l-8-4-8 4zM12 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' />
    </svg>
  ),
  key: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='48'
      height='48'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M10.758 11.828l7.849-7.849 1.414 1.414-1.414 1.415 2.474 2.474-1.414 1.415-2.475-2.475-1.414 1.414 2.121 2.121-1.414 1.415-2.121-2.122-2.192 2.192a5.002 5.002 0 0 1-7.708 6.294 5 5 0 0 1 6.294-7.708zm-.637 6.293A3 3 0 1 0 5.88 13.88a3 3 0 0 0 4.242 4.242z' />
    </svg>
  )
}

export const StatusIndicator = ({
  icon,
  title,
  description
}: StatusIndicatorProps) => {
  return (
    <div className='status-indicator'>
      <div className='contents'>
        <div className='icon'>
          {typeof icon === 'string' ? IconLists[icon as IconKeys] : icon}
        </div>
        <h1 className='title'>{title}</h1>
        <h3 className='description'>{description}</h3>
      </div>
    </div>
  )
}

export default StatusIndicator
