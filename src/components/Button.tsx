import { ReactNode } from 'react'

import '@/styles/components/button.scss'
import { concatClass } from '@/utils/components'

interface ButtonComponentProps {
  children: ReactNode
  big?: boolean
  roundy?: boolean
  theme?: string
  disabled?: boolean
  onClick?: () => void
}

export const ButtonComponent = ({
  children,
  big,
  roundy,
  disabled,
  theme,
  onClick
}: ButtonComponentProps) => {
  return (
    <div
      className={concatClass('button', roundy && 'roundy')}
      data-big={big}
      data-theme={theme}
      data-disabled={disabled}
      onClick={() => !disabled && onClick && onClick()}
    >
      {children}
    </div>
  )
}

interface ButtonProps {
  children: ReactNode
  big?: boolean
  theme?: string
  disabled?: boolean
  roundy?: boolean
  onClick?: () => void
}

export const Button = ({
  children,
  big,
  roundy,
  theme,
  onClick,
  disabled
}: ButtonProps) => {
  return (
    <ButtonComponent
      big={big}
      roundy={roundy}
      onClick={onClick}
      disabled={disabled}
      theme={theme}
    >
      {children}
    </ButtonComponent>
  )
}

export default Button
