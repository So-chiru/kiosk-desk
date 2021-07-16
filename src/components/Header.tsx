import { RootState } from '@/store'
import { useSelector } from 'react-redux'

import '@/styles/components/header.scss'

interface HeaderComponentProps {
  title: string
}

export const HeaderComponent = ({ title }: HeaderComponentProps) => {
  return (
    <div className='page-header'>
      <div className='contents'>
        <h1 className='page-title'>
          <span className='store-name'>{title}입니다.</span>
          <br></br>주문하실 음식을 눌러주세요.
        </h1>
        <p className='page-help'>
          다른 음식들을 보려면 화면을 누른 채로 위 아래로 움직여보세요.
        </p>
      </div>
    </div>
  )
}

export const Header = () => {
  const store = useSelector((state: RootState) => state.main.store)

  return <HeaderComponent title={store}></HeaderComponent>
}

export default Header
