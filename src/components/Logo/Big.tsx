import { RootState } from '@/store'
import { useSelector } from 'react-redux'

import '@/styles/components/logo.scss'

export const BigLogo = () => {
  const storeName = useSelector((state: RootState) => state.main.storeName)

  return (
    <div className='logo-landmark big'>
      <img className='logo-image'></img>
      <h1 className='logo-text'>{storeName}</h1>
    </div>
  )
}

export default BigLogo
