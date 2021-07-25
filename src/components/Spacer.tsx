import { CSSProperties, ReactNode } from 'react'

import '@/styles/components/spacer.scss'

interface SpacerProps {
  children: ReactNode
  template?: string
  flex?: boolean
  custom?: {
    h?: number
  }
  customStyles?: CSSProperties
}

export const Spacer = ({
  children,
  template,
  flex,
  custom,
  customStyles
}: SpacerProps) => {
  return (
    <div
      className='kiosk-spacer'
      style={{
        ['--h' as string]: custom && custom.h,
        ...customStyles
      }}
      data-template={template}
      data-flex={flex}
    >
      {children}
    </div>
  )
}

export default Spacer
