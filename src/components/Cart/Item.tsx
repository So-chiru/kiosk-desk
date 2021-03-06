interface CartItemProps {
  item: CartItem
  onClick?: (item: CartItem) => void
  updateCount?: (item: CartItem, num: number) => void
}

import '@/styles/components/cart/item.scss'
import { comma } from '@/utils/number'
import AmountSelection from '../Amount'
import LazyImage from '../LazyImage'
import ValueCounter from '../ValueCounter'

export const CartMenuItem = ({ item, onClick, updateCount }: CartItemProps) => {
  return (
    <div className='cart-item' onClick={() => onClick && onClick(item)}>
      <div className='cart-item-contents'>
        <div className='cart-item-brief'>
          {item.item.image && (
            <div className='cart-item-image-wrapper'>
              <LazyImage
                className='cart-item-image'
                width={230}
                src={item.item.image}
              ></LazyImage>
            </div>
          )}
          <div className='cart-item-metadata'>
            <div className='shorten'>
              <h3 className='menu-name'>{item.item.name}</h3>
              <span className='menu-price'>
                <ValueCounter
                  value={comma((item.item.price || 0) * item.amount)}
                  after='원'
                ></ValueCounter>
              </span>
            </div>
            <p className='menu-description'>{item.item.description}</p>
          </div>
        </div>
        <div className='cart-item-amount'>
          <AmountSelection
            value={item.amount}
            update={num => updateCount && updateCount(item, num)}
          ></AmountSelection>
        </div>
      </div>
    </div>
  )
}

export default CartMenuItem
