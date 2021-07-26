interface MenuItemProps {
  item: StoreItem
  onClick?: (item: StoreItem) => void
}

import '@/styles/components/menu/item.scss'
import { comma } from '@/utils/number'

export const MenuItem = ({ item, onClick }: MenuItemProps) => {
  return (
    <div className='menu-item' onClick={() => onClick && onClick(item)}>
      <div className='menu-item-contents'>
        <img className='menu-item-image' src={item.image}></img>
        <div className='menu-item-metadata'>
          <div className='shorten'>
            <h3 className='menu-name'>{item.name}</h3>
            <span className='menu-price'>{comma(item.price)}원</span>
          </div>
          <p className='menu-description'>{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export default MenuItem
