import MenuItem from './Item'

interface MenuItemsGroupProps {
  item: StoreCategory
  onClick?: (item: StoreItem) => void
}

import '@/styles/components/menu/group.scss'

export const MenuItemsGroup = ({ item, onClick }: MenuItemsGroupProps) => {
  return (
    <div className='menu-item-category'>
      <p className='category-name'>{item.name}</p>
      <div className='menu-item-group'>
        {...item.items.map(v => (
          <MenuItem key={v.id} item={v} onClick={onClick}></MenuItem>
        ))}
      </div>
    </div>
  )
}

export default MenuItemsGroup
