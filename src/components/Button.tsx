import { ReactNode } from 'react'

import '@/styles/components/button.scss'

interface ButtonComponentProps {
  children: ReactNode
  theme?: string
  disabled?: boolean
  onClick?: () => void
}

export const ButtonComponent = ({
  children,
  disabled,
  theme,
  onClick
}: ButtonComponentProps) => {
  return (
    <div
      className='button'
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
  theme?: string
  disabled?: boolean
  onClick?: () => void
}

export const Button = ({ children, theme, onClick, disabled }: ButtonProps) => {
  return (
    <ButtonComponent onClick={onClick} {...disabled} theme={theme}>
      {children}
    </ButtonComponent>
  )
}

export default Button
