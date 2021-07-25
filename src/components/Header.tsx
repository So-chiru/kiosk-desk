interface HeaderProps {
  title: string
  description?: string
}

import '@/styles/components/header.scss'

export const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className='page-header'>
      <h1 className='title'>{title}</h1>
      <p className='description'>{description}</p>
    </div>
  )
}

export default Header
