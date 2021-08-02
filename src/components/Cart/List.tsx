interface CartListProps {
  items: CartItem[]
}

import { updateCartItemCount } from '@/store/cart/actions'
import '@/styles/components/cart/list.scss'
import { useLayoutEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import CartMenuItem from './Item'

export const DetailedCartList = ({ items }: CartListProps) => {
  const dispatch = useDispatch()

  const updateItemCount = (item: CartItem, num: number) => {
    dispatch(updateCartItemCount(item.item, num))
  }

  const [lastItems, setLastItems] = useState<CartItem[]>(items)

  useLayoutEffect(() => setLastItems(items), [items])

  return (
    <div className='cart-menus'>
      {!items.length && (
        <h1 className='no-menu'>장바구니에 상품이 없습니다.</h1>
      )}
      <TransitionGroup>
        {...items.map((item, index) => (
          <CSSTransition
            key={item.item.id}
            in={
              lastItems &&
              items.length !== lastItems.length &&
              (items[index].amount === items[index].amount ||
                items[index].item.id === lastItems[index].item.id)
            }
            timeout={{ enter: 600, exit: 300 }}
            classNames='kiosk-cart-item'
          >
            {
              <CartMenuItem
                item={item}
                updateCount={updateItemCount}
              ></CartMenuItem>
            }
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  )
}

export default DetailedCartList
