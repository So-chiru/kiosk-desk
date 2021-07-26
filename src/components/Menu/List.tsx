import MenuItemsGroup from './Group'

interface MenuListProps {
  items: StoreCategory[]
}

import '@/styles/components/menu/list.scss'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '@/store/cart/actions'

export const MenuList = ({ items }: MenuListProps) => {
  const dispatch = useDispatch()

  const itemClick = (item: StoreItem) => {
    dispatch(addItemToCart(item))
  }

  return (
    <div className='menus'>
      {!items.length && (
        <h1 className='no-menu'>
          이 가게는 등록된 상품이 없습니다. 카운터에 문의해주세요.
        </h1>
      )}
      {...items.map(item => (
        <MenuItemsGroup
          key={item.id}
          item={item}
          onClick={itemClick}
        ></MenuItemsGroup>
      ))}
    </div>
  )
}

export default MenuList
