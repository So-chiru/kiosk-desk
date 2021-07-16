import { RootState } from '@/store'
import '@/styles/components/cartview.scss'
import { cartTotal, comma } from '@/utils/number'
import { useSelector } from 'react-redux'
import { Button } from './Button'

interface CartViewComponentProps {
  cart: CartItem[]
}

export const CartViewComponent = ({ cart }: CartViewComponentProps) => {
  return (
    <div className='cart-view' data-show={cart.length > 0}>
      <div className='info'>
        <h3>
          음식 {cart.length}개, {cart.length && comma(cartTotal(cart))}원
        </h3>
      </div>
      <div className='done'>
        <Button onClick={() => alert('TODO : 메뉴 확인 창, 결제 창 구현하기')}>
          주문 완료
        </Button>
      </div>
    </div>
  )
}

export const CartView = () => {
  const cart = useSelector((state: RootState) => state.cart.items)

  return <CartViewComponent cart={cart}></CartViewComponent>
}

export default CartView
