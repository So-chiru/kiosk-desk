import MenuItemsGroup from './Group'

interface MenuListProps {
  items: StoreCategory[]
}

import '@/styles/components/menu/list.scss'

export const MenuList = ({ items }: MenuListProps) => {
  return (
    <div className='menus'>
      {!items.length && (
        <h1 className='no-menu'>
          이 가게는 등록된 상품이 없습니다. 카운터에 문의해주세요.
        </h1>
      )}
      {...items.map(item => (
        <MenuItemsGroup key={item.id} item={item}></MenuItemsGroup>
      ))}
    </div>
  )
}

export default MenuList
