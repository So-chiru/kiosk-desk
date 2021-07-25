import { RootState } from '@/store'
import { useSelector } from 'react-redux'

import '@/styles/components/logo.scss'

export const SmallLogo = () => {
  const storeName = useSelector((state: RootState) => state.main.storeName)

  return (
    <div className='logo-landmark small'>
      <img className='logo-image'></img>
      <h3 className='logo-text'>{storeName}</h3>
    </div>
  )
}

export default SmallLogo
