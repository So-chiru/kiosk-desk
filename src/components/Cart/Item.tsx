interface CartItemProps {
  item: CartItem
  onClick?: (item: CartItem) => void
  updateCount?: (item: CartItem, num: number) => void
}

import '@/styles/components/cart/item.scss'
import { comma } from '@/utils/number'
import AmountSelection from '../Amount'

export const CartMenuItem = ({ item, onClick, updateCount }: CartItemProps) => {
  return (
    <div className='cart-item' onClick={() => onClick && onClick(item)}>
      <div className='cart-item-contents'>
        <div className='cart-item-brief'>
          <img className='cart-item-image' src={item.item.image}></img>
          <div className='cart-item-metadata'>
            <div className='shorten'>
              <h3 className='menu-name'>{item.item.name}</h3>
              <span className='menu-price'>
                {comma((item.item.price || 0) * item.amount)}원
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
