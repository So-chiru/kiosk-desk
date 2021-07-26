import { ReactNode } from 'react'

type IconKeys = 'check' | 'error' | 'loading'

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
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='48'
      height='48'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z' />
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
