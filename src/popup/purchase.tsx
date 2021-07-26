import Button from '@/components/Button'
import Header from '@/components/Header'
import { DetailedCartList } from '@/components/Cart/List'
import Popup, { PopupState } from '@/components/Popup'
import { RootState } from '@/store'

import '@/styles/components/purchase.scss'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { comma } from '@/utils/number'

interface ViewCartsProps {
  items: CartItem[]
  onClick: () => void
}

const ViewCarts = ({ items, onClick }: ViewCartsProps) => {
  const totalPrice = items
    .map(v => v.amount * v.item.price)
    .reduce((p, c) => p + c, 0)

  return (
    <div className='mini-cart-wrapper'>
      <div className='mini-cart'>
        <div className='item-lists'>
          <p>{items.map(v => `${v.item.name} x ${v.amount}`).join(', ')}</p>
          <p className='total-price'>{comma(totalPrice)}원</p>
        </div>
        <Button onClick={onClick}>선택 완료</Button>
      </div>
    </div>
  )
}

interface VerifyCartsProps {
  items: CartItem[]
  onClose: () => void
}

const VerifyCarts = ({ items, onClose }: VerifyCartsProps) => {
  return (
    <div className='cart-view-wrapper'>
      <div className='cart-view'>
        <div className='header'>
          <Header
            title='주문하실 음식을 확인해주세요.'
            description='선택한 음식이 맞다면 화면 아래의 선택 완료 버튼을 눌러주세요.'
          ></Header>
          <div className='back-button'>
            <Button theme='alt' onClick={onClose}>
              다른 메뉴 고르기
            </Button>
          </div>
        </div>
        <div className='contents'>
          <DetailedCartList items={items}></DetailedCartList>
        </div>
      </div>
    </div>
  )
}

export enum PurchaseStep {
  Selecting,
  Verify,
  Purchase,
  Done
}

export const PurchasePopup = () => {
  const carts = useSelector((state: RootState) => state.cart.items)
  const [step, setStep] = useState<PurchaseStep>(PurchaseStep.Selecting)

  const makeFullCart = () => {
    setStep(PurchaseStep.Verify)
  }

  useEffect(() => {
    if (!carts.length && step > PurchaseStep.Selecting) {
      setStep(PurchaseStep.Selecting)
    }
  }, [carts, step])

  return (
    <>
      <Popup
        state={
          step > PurchaseStep.Selecting
            ? PopupState.Full
            : carts.length
            ? PopupState.Minimize
            : PopupState.Hidden
        }
        minimize={() => setStep(PurchaseStep.Selecting)}
      >
        {step === PurchaseStep.Selecting ? (
          <ViewCarts items={carts} onClick={makeFullCart}></ViewCarts>
        ) : (
          <VerifyCarts
            items={carts}
            onClose={() => setStep(PurchaseStep.Selecting)}
          ></VerifyCarts>
        )}
      </Popup>
    </>
  )
}

export default PurchasePopup
