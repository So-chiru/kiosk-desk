import { ReactNode } from 'react'

import '@/styles/components/button.scss'

interface ButtonComponentProps {
  children: ReactNode
  big?: boolean
  theme?: string
  disabled?: boolean
  onClick?: () => void
}

export const ButtonComponent = ({
  children,
  big,
  disabled,
  theme,
  onClick
}: ButtonComponentProps) => {
  return (
    <div
      className='button'
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
  onClick?: () => void
}

export const Button = ({
  children,
  big,
  theme,
  onClick,
  disabled
}: ButtonProps) => {
  return (
    <ButtonComponent
      big={big}
      onClick={onClick}
      disabled={disabled}
      theme={theme}
    >
      {children}
    </ButtonComponent>
  )
}

export default Button
