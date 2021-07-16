import { ReactNode } from 'react'

import '@/styles/components/button.scss'

interface ButtonComponentProps {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}

export const ButtonComponent = ({
  children,
  disabled,
  onClick
}: ButtonComponentProps) => {
  return (
    <div
      className='button'
      data-disabled={disabled}
      onClick={() => !disabled && onClick && onClick()}
    >
      {children}
    </div>
  )
}

interface ButtonProps {
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}

export const Button = ({ children, onClick, disabled }: ButtonProps) => {
  return (
    <ButtonComponent onClick={onClick} {...disabled}>
      {children}
    </ButtonComponent>
  )
}

export default Button
