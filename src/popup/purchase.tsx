import Button from '@/components/Button'
import Header from '@/components/Header'
import { DetailedCartList } from '@/components/Cart/List'
import Popup, { PopupState } from '@/components/Popup'
import { RootState } from '@/store'

import '@/styles/popup/purchase.scss'
import React, { ReactNode, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cartTotal, comma } from '@/utils/number'

import { loadTossPayments, TossPaymentsInstance } from '@tosspayments/sdk'
import { initializeTossPayments } from '@/store/payment/actions'
import { useHistory, useParams } from 'react-router-dom'
import StatusIndicator from '@/components/StatusIndicator'
import {
  StoreOrderState,
  StorePaymentMethod,
  StorePaymentRequestState
} from '@/@types/order'
import {
  CSSTransition,
  Transition,
  TransitionGroup
} from 'react-transition-group'

const READY_TIME = 15000
interface ViewCartsProps {
  items: CartItem[]
  onClick: () => void
}

const ViewCarts = ({ items, onClick }: ViewCartsProps) => {
  return (
    <div className='mini-cart-wrapper'>
      <div className='mini-cart'>
        <div className='item-lists'>
          <p>{items.map(v => `${v.item.name} x ${v.amount}`).join(', ')}</p>
          <p className='total-price'>{comma(cartTotal(items))}원</p>
        </div>
        <Button onClick={onClick}>선택 완료</Button>
      </div>
    </div>
  )
}

interface PopupContentsProps {
  items: CartItem[]
  orderState: StorePaymentRequestState
  prev: () => void
  next: () => void
}

const VerifyCarts = ({ items, prev, next }: PopupContentsProps) => {
  return (
    <div className='cart-view-wrapper'>
      <div className='cart-view'>
        <div className='header'>
          <Header
            title='주문하실 음식을 확인해주세요.'
            description='선택한 음식이 맞다면 화면 아래의 결제하기 버튼을 눌러주세요.'
          ></Header>
          <div className='back-button'>
            <Button theme='alt' onClick={prev}>
              다른 메뉴 고르기
            </Button>
          </div>
        </div>
        <div className='contents'>
          <DetailedCartList items={items}></DetailedCartList>
          <div className='next-button'>
            <Button big onClick={next}>
              결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const useInitToss = () => {
  const toss = useSelector((state: RootState) => state.payments.toss)
  const dispatch = useDispatch()

  useEffect(() => {
    if (toss) {
      return
    }

    initializeTossPayments(
      loadTossPayments(process.env.TOSS_PAYMENTS_CLIENT_KEY!)
    ).then(dispatch)
  }, [toss])

  return toss
}

const PurchaseIcons = {
  toss: (
    <svg
      width='69'
      height='61'
      viewBox='0 0 69 61'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M68.6431 26.6965C66.8705 11.4225 54.0461 0.143529 39.1397 0H38.8066C37.6526 0 36.4986 0.0717642 35.3328 0.203333C31.0976 0.693725 27.1836 2.05725 23.7217 4.07863C23.6504 4.12647 23.5671 4.17431 23.4957 4.2102C23.4243 4.24608 23.3648 4.29392 23.2935 4.3298C6.12673 14.6161 0 38.3582 0 52.8188L13.8357 44.7931C18.7133 54.1345 28.064 60.2823 38.4854 60.4019H38.8185C39.9724 60.4019 41.1264 60.3302 42.2923 60.1986C58.769 58.261 70.5704 43.2621 68.6431 26.6965Z'
        fill='white'
      />
    </svg>
  ),
  card: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='64'
      height='64'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 8H4v8h16v-8zm0-2V5H4v4h16zm-6 6h4v2h-4v-2z' />
    </svg>
  ),
  bank: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='64'
      height='64'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M2 20h20v2H2v-2zm2-8h2v7H4v-7zm5 0h2v7H9v-7zm4 0h2v7h-2v-7zm5 0h2v7h-2v-7zM2 7l10-5 10 5v4H2V7zm2 1.236V9h16v-.764l-8-4-8 4zM12 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' />
    </svg>
  ),
  direct: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='64'
      height='64'
    >
      <path fill='none' d='M0 0h24v24H0z' />
      <path d='M7.39 16.539a8 8 0 1 1 9.221 0l2.083 4.76a.5.5 0 0 1-.459.701H5.765a.5.5 0 0 1-.459-.7l2.083-4.761zm6.735-.693l1.332-.941a6 6 0 1 0-6.913 0l1.331.941L8.058 20h7.884l-1.817-4.154zM8.119 10.97l1.94-.485a2 2 0 0 0 3.882 0l1.94.485a4.002 4.002 0 0 1-7.762 0z' />
    </svg>
  )
}

const SelectPayments = ({
  prev,
  orderState,
  items,
  next
}: PopupContentsProps) => {
  const toss = useInitToss()
  const history = useHistory()

  const [fetching, setFetching] = useState<boolean>(false)

  const cancelPayment = async (orderId: string, cancelReason?: string) => {
    setFetching(true)

    fetch(process.env.API_ENDPOINT! + `/order/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        reason: cancelReason
      })
    })
      .then(v => v.json())
      .then(v => {
        if (v.status === 'success') {
          // success

          prev()
        }
      })
      .finally(() => setFetching(false))
  }

  const goPayment = async (payWith: StorePaymentMethod) => {
    if (!toss) {
      // toss 서비스가 안되는 경우 에러 표시하기
      return false
    }

    setFetching(true)

    fetch(process.env.API_ENDPOINT! + '/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        items: items.map(v => [v.amount, v.item.id]),
        payWith: payWith
      })
    })
      .then(v => v.json())
      .then(v => {
        if (v.status !== 'success') {
          return
        }

        if (!v.data.order) {
          return
        }

        // TODO : error handling

        if (v.data && v.data.toss) {
          const orderData = {
            amount: v.data.toss.amount,
            orderId: v.data.toss.orderId,
            orderName: v.data.toss.orderName,
            customerName: v.data.toss.customerName,
            successUrl: window.location.origin + '/menu/order_success',
            failUrl: window.location.origin + '/menu/order_failed'
          }

          if (payWith === StorePaymentMethod.Toss) {
            toss
              .requestPayment('카드', {
                ...orderData,
                flowMode: 'DIRECT',
                easyPay: 'TOSSPAY'
              })
              .catch(e => cancelPayment(v.data.order.id, e.message))
          } else if (payWith === StorePaymentMethod.Card) {
            toss
              .requestPayment('카드', orderData)
              .catch(e => cancelPayment(v.data.order.id, e.message))
          } else if (payWith === StorePaymentMethod.VirtualAccount) {
            toss
              .requestPayment('가상계좌', { ...orderData, validHours: 3 })
              .catch(e => cancelPayment(v.data.order.id, e.message))
          } else if (payWith === StorePaymentMethod.Mobile) {
            toss
              .requestPayment('휴대폰', orderData)
              .catch(e => cancelPayment(v.data.order.id, e.message))
          }
        }

        if (payWith === StorePaymentMethod.Direct) {
          history.replace('/menu/order_success/?orderId=' + v.data.order.id)
        }
      })
      .finally(() => {
        setFetching(false)
      })
  }

  return (
    <div className='purchase-view-wrapper'>
      <div className='purchase-view'>
        <div className='header'>
          <Header title='결제는 어떻게 도와드릴까요?'></Header>
          <div className='back-button'>
            <Button theme='alt' onClick={prev}>
              이전 화면으로 가기
            </Button>
          </div>
        </div>
        <div className='contents'>
          <h1 className='purchase-total'>
            총 {comma(cartTotal(items))}원을 결제합니다.
          </h1>
          <div className='purchase-buttons'>
            <Button
              big
              disabled={fetching}
              onClick={() => goPayment(StorePaymentMethod.Toss)}
            >
              {PurchaseIcons['toss']}
              <span>토스로 결제하기</span>
            </Button>
            <Button
              big
              theme='alt'
              disabled={fetching}
              onClick={() => goPayment(StorePaymentMethod.Card)}
            >
              {PurchaseIcons['card']}
              <span>카드로 결제하기</span>
            </Button>
            <Button
              big
              theme='alt'
              disabled={fetching}
              onClick={() => goPayment(StorePaymentMethod.VirtualAccount)}
            >
              {PurchaseIcons['bank']}
              <span>계좌 이체로 결제하기</span>
            </Button>
            <Button
              big
              theme='alt'
              disabled={fetching}
              onClick={() => goPayment(StorePaymentMethod.Direct)}
            >
              {PurchaseIcons['card']}
              <span>직접 결제하기</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface OrderDoneProps {
  state?: StorePaymentRequestState
  error?: Error
  waiting?: WaitingReason
  leftTime: number
}

const OrderDone = ({ state, error, waiting, leftTime }: OrderDoneProps) => {
  if (error) {
    return (
      <div className='result-view-contents'>
        <StatusIndicator icon='error' title={error.message}></StatusIndicator>
        <h3 className='auto-close-text'>
          {leftTime < 0
            ? '이 창은 곧 닫힙니다.'
            : `이 창은 ${comma(Math.floor(leftTime / 1000))}초 후에 닫힙니다.`}
        </h3>
      </div>
    )
  }

  if (state === StorePaymentRequestState.Waiting) {
    if (waiting) {
      return (
        <div className='result-view-contents'>
          <StatusIndicator
            icon={waiting.icon || 'loading'}
            title={waiting.title || '결제 승인 대기 중입니다...'}
            description={waiting.description || '잠시 기다려주세요.'}
          ></StatusIndicator>
          <h3 className='auto-close-text'>
            {comma(Math.floor(waiting.left / 1000 / 60))}분 후에 결제가
            만료됩니다.
          </h3>
        </div>
      )
    }

    return (
      <div className='result-view-contents'>
        <StatusIndicator
          icon='loading'
          title={'결제 승인 대기 중입니다...'}
          description={'잠시 기다려주세요.'}
        ></StatusIndicator>
      </div>
    )
  }

  if (state === StorePaymentRequestState.Error) {
    return (
      <div className='result-view-contents'>
        <StatusIndicator
          icon='error'
          title={'결제하는 중에 오류가 발생하였습니다.'}
          description={'잠시 기다려주세요.'}
        ></StatusIndicator>
      </div>
    )
  }

  return (
    <div className='result-view-contents'>
      <StatusIndicator
        icon='check'
        title={'결제가 완료되었습니다!'}
        description={'음식이 완성되면 주문 번호를 챙겨 카운터로 와주세요.'}
      ></StatusIndicator>
      <h3 className='auto-close-text'>
        {leftTime < 0
          ? '이 창은 곧 닫힙니다.'
          : `이 창은 ${comma(Math.floor(leftTime / 1000))}초 후에 닫힙니다.\n
          화면 밖을 눌러 바로 끌 수 있습니다.`}
      </h3>
    </div>
  )
}

export enum PurchaseStep {
  Selecting,
  Verify,
  Purchase,
  Done
}

interface WaitingReason {
  icon: string
  title: string
  left: number
  description?: string
}

const useOrderPlace = (): [
  string,
  StorePaymentRequestState,
  Error?,
  WaitingReason?
] => {
  const { orderState } = useParams<{
    orderState: string
  }>()

  const [state, setState] = useState<StorePaymentRequestState>(
    StorePaymentRequestState.Waiting
  )

  const [waiting, setWaiting] = useState<WaitingReason | undefined>()

  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (!orderState) {
      return
    }

    if (orderState === 'order_success') {
      const url = new URL(location.href)

      const orderId = url.searchParams.get('orderId')
      const paymentKey = url.searchParams.get('paymentKey')
      const amount = url.searchParams.get('amount')

      setWaiting(undefined)

      fetch(process.env.API_ENDPOINT! + `/order/${orderId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          orderId,
          paymentKey,
          amount
        })
      })
        .then(v => v.json())
        .then(res => {
          if (res.status !== 'success') {
            setState(StorePaymentRequestState.Error)
            setError(new Error(res.error || '알 수 없는 오류가 발생했습니다.'))

            return
          }

          if (res.data.state === StoreOrderState.WaitingPayment) {
            setState(StorePaymentRequestState.Waiting)

            if (res.data.virtualAccount) {
              setWaiting({
                icon: 'bank',
                title: '입금을 기다리는 중입니다.',
                left:
                  new Date(res.data.virtualAccount.dueDate).getTime() -
                  new Date().getTime(),
                description: `${res.data.virtualAccount.bank} ${
                  res.data.virtualAccount.accountNumber
                } 계좌로 ${comma(res.data.price)}원을 '${
                  res.data.virtualAccount.customerName
                }' 이름으로 보내주세요.`
              })
            }

            return
          } else if (res.data.state === StoreOrderState.WaitingAccept) {
            setState(StorePaymentRequestState.Waiting)

            setWaiting({
              icon: 'loading',
              title: '주문 확인을 기다리고 있습니다...',
              left: 1800000,
              description: '가게에서 확인할 때까지 잠시 기다려주세요.'
            })

            return
          }

          if (
            res.data.state === StoreOrderState.Aborted ||
            res.data.state === StoreOrderState.Expired ||
            res.data.state === StoreOrderState.Failed ||
            res.data.state === StoreOrderState.Canceled
          ) {
            setState(StorePaymentRequestState.Error)
            setError(new Error(res.data.error))

            return
          }

          setState(StorePaymentRequestState.Success)
        })
        .catch(e => {})
    }

    if (orderState === 'order_failed') {
      const url = new URL(location.href)

      const orderId = url.searchParams.get('orderId')
      const code = url.searchParams.get('code')
      const message = url.searchParams.get('message')

      setState(StorePaymentRequestState.Error)

      if (code && message) {
        setError(new Error(`${code}: ${message}`))
      }

      console.log(orderId)
    }
  }, [orderState])

  return [orderState, state, error, waiting]
}

const useStep = (): [
  PurchaseStep,
  React.Dispatch<React.SetStateAction<PurchaseStep>>,
  () => void,
  () => void
] => {
  const [step, setStep] = useState<PurchaseStep>(PurchaseStep.Selecting)

  const next = () => {
    if (step === PurchaseStep.Verify) {
      setStep(PurchaseStep.Purchase)
    }
  }

  const previous = () => {
    if (step === PurchaseStep.Verify) {
      setStep(PurchaseStep.Selecting)
    }

    if (step === PurchaseStep.Purchase) {
      setStep(PurchaseStep.Verify)
    }
  }

  return [step, setStep, previous, next]
}

const useAutoClose = (
  step: PurchaseStep,
  setStep: ReturnType<typeof useStep>[1],
  orderState: StorePaymentRequestState,
  backToMain: () => void
) => {
  const [leftTime, setLeftTime] = useState<number>(READY_TIME)
  const [closeAt, setCloseAt] = useState<number>(0)

  useEffect(() => {
    if (
      step !== PurchaseStep.Done ||
      orderState === StorePaymentRequestState.Waiting
    ) {
      return
    }

    if (!closeAt) {
      setCloseAt(Date.now() + READY_TIME)
    }

    const update = setTimeout(() => {
      setLeftTime(closeAt - Date.now())
    }, 100)

    if (leftTime < 0) {
      backToMain()
      setStep(PurchaseStep.Selecting)
    }

    return () => {
      clearTimeout(update)
    }
  }, [step, orderState, closeAt, leftTime])

  return leftTime
}

export const PurchasePopup = () => {
  const carts = useSelector((state: RootState) => state.cart.items)
  const history = useHistory()

  const backToMain = () => {
    history.replace('/')
  }

  const minimize = () => {
    if (step !== PurchaseStep.Done) {
      setStep(PurchaseStep.Selecting)
      return
    }

    backToMain()
  }

  const [step, setStep, previous, next] = useStep()
  const [
    orderResponseDefined,
    orderState,
    orderError,
    orderWaiting
  ] = useOrderPlace()
  const leftTime = useAutoClose(step, setStep, orderState, backToMain)

  const [lastStep, setLastStep] = useState<PurchaseStep>(step)

  useEffect(() => {
    if (!carts.length && step === PurchaseStep.Verify) {
      setStep(PurchaseStep.Selecting)
    }
  }, [carts, step])

  useEffect(() => setLastStep(step), [step])

  useEffect(() => {
    if (!orderResponseDefined) {
      return
    }

    if (step !== PurchaseStep.Done) {
      setStep(PurchaseStep.Done)
    }
  }, [orderResponseDefined])

  let InnerContents: ReactNode = (
    <ViewCarts
      items={carts}
      onClick={() => setStep(PurchaseStep.Verify)}
    ></ViewCarts>
  )

  if (step === PurchaseStep.Verify) {
    InnerContents = (
      <VerifyCarts
        orderState={orderState}
        items={carts}
        prev={previous}
        next={next}
      ></VerifyCarts>
    )
  } else if (step === PurchaseStep.Purchase) {
    InnerContents = (
      <SelectPayments
        items={carts}
        orderState={orderState}
        prev={previous}
        next={() => {}}
      ></SelectPayments>
    )
  } else if (step === PurchaseStep.Done) {
    InnerContents = (
      <OrderDone
        leftTime={leftTime}
        state={orderState}
        waiting={orderWaiting}
        error={orderError}
      ></OrderDone>
    )
  }

  let popupState = PopupState.Hidden

  if (step > PurchaseStep.Selecting || orderResponseDefined) {
    popupState = PopupState.Full
  } else if (carts.length) {
    popupState = PopupState.Minimize
  }

  return (
    <>
      <Popup state={popupState} minimize={minimize}>
        <CSSTransition
          in={step === lastStep}
          key={step}
          appear
          timeout={600}
          classNames='purchase-popup'
        >
          {InnerContents}
        </CSSTransition>
      </Popup>
    </>
  )
}

export default PurchasePopup
