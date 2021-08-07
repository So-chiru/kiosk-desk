import { StoreOrder, StoreOrderState, StorePaymentMethod } from '@/@types/order'

import '@/styles/components/manage/orderBrief.scss'
import { useState } from 'react'
import Button from '../Button'
import DateComponent from '../Date'
import { CheckIcon, MoreIcon, RefundIcon } from '../Icons'

interface OrderBriefProps {
  order: StoreOrder
  onRefund?: () => Promise<void>
  onAccept?: () => Promise<void>
}

const StatusIndicator = ({ state }: { state: StoreOrderState }) => {
  if (state === StoreOrderState.Done) {
    return <span className='done'>주문 완료</span>
  } else if (state === StoreOrderState.WaitingPayment) {
    return <span className='pending'>결제 대기 중</span>
  } else if (state === StoreOrderState.WaitingAccept) {
    return <span className='pending'>확인 대기 중</span>
  } else if (state === StoreOrderState.Expired) {
    return <span className='error'>주문 만료</span>
  } else if (
    state === StoreOrderState.Canceled ||
    state === StoreOrderState.Aborted
  ) {
    return <span className='error'>주문 취소</span>
  } else if (state === StoreOrderState.Failed) {
    return <span className='error'>주문 오류</span>
  }

  return <span className='error'>알 수 없는 코드</span>
}

const PaidWithText: { [K in StorePaymentMethod]: string } = {
  100: '카드 결제',
  150: '토스 결제',
  200: '휴대폰 결제',
  300: '계좌 이체',
  1000: '직접 결제'
}

export const OrderBrief = ({ order, onRefund, onAccept }: OrderBriefProps) => {
  const [temporaryDisabled, setTemporaryDisabled] = useState<boolean>(false)

  return (
    <div className='order-brief'>
      <div className='metadata'>
        <div className='order-meta'>
          <h3 title={order.id}>{order.id.split('-')[0].toUpperCase()}</h3>
          <span>
            <DateComponent date={new Date(order.date)}></DateComponent>에 생성됨
          </span>
          <span className='order-state'>
            <StatusIndicator state={order.state}></StatusIndicator>
          </span>
          {typeof order.payWith !== 'undefined' && (
            <span>{PaidWithText[order.payWith]}</span>
          )}
        </div>
        <div className='order-items'>
          {order.items.map(v => `${v.name} ${v.amount}개`).join(', ')}
        </div>
      </div>
      <div className='controls'>
        {order.state === StoreOrderState.WaitingAccept && (
          <Button
            disabled={temporaryDisabled}
            roundy
            onClick={async () => {
              if (onAccept) {
                setTemporaryDisabled(true)
                await onAccept()
                setTemporaryDisabled(false)
              }
            }}
          >
            {CheckIcon}
          </Button>
        )}
        {(order.state === StoreOrderState.WaitingAccept ||
          order.state === StoreOrderState.Done) && (
          <Button
            disabled={temporaryDisabled}
            roundy
            theme='warning'
            onClick={async () => {
              if (onRefund) {
                setTemporaryDisabled(true)
                await onRefund()
                setTemporaryDisabled(false)
              }
            }}
          >
            {RefundIcon}
          </Button>
        )}

        <Button disabled={temporaryDisabled} roundy theme='alt'>
          {MoreIcon}
        </Button>
      </div>
    </div>
  )
}

export default OrderBrief
