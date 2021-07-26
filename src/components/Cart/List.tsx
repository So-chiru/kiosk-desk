interface CartListProps {
  items: CartItem[]
}

import { updateCartItemCount } from '@/store/cart/actions'
import '@/styles/components/cart/list.scss'
import { useDispatch } from 'react-redux'

import CartMenuItem from './Item'

export const DetailedCartList = ({ items }: CartListProps) => {
  const dispatch = useDispatch()

  const updateItemCount = (item: CartItem, num: number) => {
    dispatch(updateCartItemCount(item.item, num))
  }

  return (
    <div className='cart-menus'>
      {!items.length && (
        <h1 className='no-menu'>장바구니에 상품이 없습니다.</h1>
      )}
      {...items.map(item => (
        <CartMenuItem
          key={item.item.id}
          item={item}
          updateCount={updateItemCount}
        ></CartMenuItem>
      ))}
    </div>
  )
}

export default DetailedCartList
