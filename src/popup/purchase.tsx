import Button from '@/components/Button'
import Header from '@/components/Header'
import { DetailedCartList } from '@/components/Cart/List'
import Popup, { PopupState } from '@/components/Popup'
import { RootState } from '@/store'

import '@/styles/popup/purchase.scss'
import React, { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cartTotal, comma } from '@/utils/number'

import { loadTossPayments } from '@tosspayments/sdk'
import { initializeTossPayments } from '@/store/payment/actions'
import { useHistory, useParams } from 'react-router-dom'
import StatusIndicator from '@/components/StatusIndicator'
import {
  StoreOrderState,
  StorePaymentMethod,
  StorePaymentRequestState
} from '@/@types/order'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { BankIcon, CardIcon, DirectIcon, TossIcon } from '@/components/Icons'
import { cancelOrder, makeAnOrder } from '@/api/order'
import ValueCounter from '@/components/ValueCounter'
import { socketEvents } from '@/components/Data/socket'

const READY_TIME = 30000
interface ViewCartsProps {
  items: CartItem[]
  onClick: () => void
}

interface StateUpdateData {
  state: StoreOrderState
  price?: number
  left?: number
  virtualAccount?: {
    accountNumber: string
    bank: string
    customerName: string
    dueDate: string
    refundStatus: 'NONE' | 'FAILED' | 'PENDING' | 'PARTIAL_FAILED' | 'COMPLETED'
  }
  error?: string
}

const ViewCarts = ({ items, onClick }: ViewCartsProps) => {
  return (
    <div className='mini-cart-wrapper'>
      <div className='mini-cart'>
        <div className='item-lists'>
          <TransitionGroup className='item-list-wrapper'>
            {items.map(v => (
              <CSSTransition
                appear
                timeout={300}
                key={v.item.id}
                classNames='item-listin'
              >
                <span className='item'>
                  {`${v.item.name} `}
                  <ValueCounter value={v.amount} before={'x '}></ValueCounter>
                </span>
              </CSSTransition>
            ))}
          </TransitionGroup>
          <p className='total-price'>
            <ValueCounter
              value={comma(cartTotal(items))}
              after='???'
            ></ValueCounter>
          </p>
        </div>
        <Button onClick={onClick}>?????? ??????</Button>
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
            title='???????????? ????????? ??????????????????.'
            description='????????? ????????? ????????? ?????? ????????? ???????????? ????????? ???????????????.'
          ></Header>
          <div className='back-button'>
            <Button theme='alt' onClick={prev}>
              ?????? ?????? ?????????
            </Button>
          </div>
        </div>
        <div className='contents'>
          <DetailedCartList items={items}></DetailedCartList>
          <div className='next-button'>
            <Button big onClick={next}>
              <ValueCounter
                value={comma(cartTotal(items))}
                after='??? ????????????'
              ></ValueCounter>
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

const PaymentMethods = [
  {
    theme: '',
    icon: TossIcon,
    text: '????????? ????????????',
    method: StorePaymentMethod.Toss
  },
  {
    theme: 'alt',
    icon: CardIcon,
    text: '????????? ????????????',
    method: StorePaymentMethod.Card
  },
  {
    theme: 'alt',
    icon: BankIcon,
    text: '?????? ????????? ????????????',
    method: StorePaymentMethod.VirtualAccount
  },
  {
    theme: 'alt',
    icon: DirectIcon,
    text: '?????? ???????????? (??????)',
    method: StorePaymentMethod.Direct
  }
]

const SelectPayments = ({
  prev,
  orderState,
  items,
  next
}: PopupContentsProps) => {
  const toss = useInitToss()
  const history = useHistory()

  const [fetching, setFetching] = useState<boolean>(false)

  const cancelPayment = async (orderId: string, cancelReason: string) => {
    setFetching(true)

    // TODO : ????????? ?????? ?????????

    cancelOrder(orderId, cancelReason)
      .then(() => prev)
      .finally(() => setFetching(false))
  }

  const goPayment = async (payWith: StorePaymentMethod) => {
    if (!toss) {
      // TODO : toss ???????????? ????????? ?????? ?????? ????????????
      return false
    }

    setFetching(true)
    makeAnOrder(items, payWith)
      .then(v => {
        if (v.data.toss) {
          const orderData = {
            amount: v.data.toss.amount,
            orderId: v.data.toss.orderId,
            orderName: v.data.toss.orderName,
            customerName: v.data.toss.customerName,
            successUrl: window.location.origin + '/menu/order_processing',
            failUrl: window.location.origin + '/menu/order_failed'
          }

          if (payWith === StorePaymentMethod.Toss) {
            toss
              .requestPayment('??????', {
                ...orderData,
                flowMode: 'DIRECT',
                easyPay: 'TOSSPAY'
              })
              .catch(e => cancelPayment(v.data.order.id, e.message))
          } else if (payWith === StorePaymentMethod.Card) {
            toss
              .requestPayment('??????', orderData)
              .catch(e => cancelPayment(v.data.order.id, e.message))
          } else if (payWith === StorePaymentMethod.VirtualAccount) {
            toss
              .requestPayment('????????????', { ...orderData, validHours: 3 })
              .catch(e => cancelPayment(v.data.order.id, e.message))
          } else if (payWith === StorePaymentMethod.Mobile) {
            toss
              .requestPayment('?????????', orderData)
              .catch(e => cancelPayment(v.data.order.id, e.message))
          }
        }

        if (payWith === StorePaymentMethod.Direct) {
          history.replace(
            `/menu/order_processing/?orderId=${v.data.order.id}&amount=${v.data.order.price}`
          )
        }
      })
      .finally(() => {
        setFetching(false)
      })
      .catch(e => {
        // TODO : ????????? ?????? ?????????
      })
  }

  return (
    <div className='purchase-view-wrapper'>
      <div className='purchase-view'>
        <div className='header'>
          <Header title='????????? ????????? ???????????????????'></Header>
          <div className='back-button'>
            <Button theme='alt' onClick={prev}>
              ?????? ???????????? ??????
            </Button>
          </div>
        </div>
        <div className='contents'>
          <h1 className='purchase-total'>
            ??? {comma(cartTotal(items))}?????? ???????????????.
          </h1>
          <div className='purchase-buttons'>
            {PaymentMethods.map(v => (
              <Button
                key={'purchase-button-method-' + v.method}
                big
                theme={v.theme}
                disabled={fetching}
                onClick={() => goPayment(v.method)}
              >
                {v.icon}
                <span>{v.text}</span>
              </Button>
            ))}
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
  cancelable: boolean
}

const OrderDone = ({
  state,
  error,
  waiting,
  leftTime,
  cancelable
}: OrderDoneProps) => {
  const OrderCancelButton = (
    <div className='button-group'>
      <Button theme='danger'>?????? ????????????</Button>
    </div>
  )

  if (error) {
    return (
      <div className='result-view-contents'>
        <StatusIndicator icon='error' title={error.message}></StatusIndicator>
        <h3 className='auto-close-text'>
          {leftTime < 0
            ? '??? ?????? ??? ????????????.'
            : `??? ?????? ${comma(Math.floor(leftTime / 1000))}??? ?????? ????????????.`}
        </h3>
      </div>
    )
  }

  if (state === StorePaymentRequestState.Waiting) {
    if (waiting) {
      const leftTime = useAutoClose(waiting.left)

      return (
        <div className='result-view-contents'>
          <StatusIndicator
            icon={waiting.icon || 'loading'}
            title={waiting.title || '?????? ?????? ?????? ????????????...'}
            description={waiting.description || '?????? ??????????????????.'}
          ></StatusIndicator>
          <h3 className='auto-close-text'>
            {comma(Math.floor(leftTime / 1000 / 60))}??? ?????? ????????? ???????????????.
          </h3>
          {cancelable && OrderCancelButton}
        </div>
      )
    }

    return (
      <div className='result-view-contents'>
        <StatusIndicator
          icon='loading'
          title={'?????? ?????? ?????? ????????????...'}
          description={'?????? ??????????????????.'}
        ></StatusIndicator>
        {cancelable && OrderCancelButton}
      </div>
    )
  }

  if (state === StorePaymentRequestState.Error) {
    return (
      <div className='result-view-contents'>
        <StatusIndicator
          icon='error'
          title={'???????????? ?????? ????????? ?????????????????????.'}
          description={'?????? ??????????????????.'}
        ></StatusIndicator>
      </div>
    )
  }

  return (
    <div className='result-view-contents'>
      <StatusIndicator
        icon='check'
        title={'????????? ?????????????????????!'}
        description={'????????? ???????????? ?????? ????????? ?????? ???????????? ????????????.'}
      ></StatusIndicator>
      <h3 className='auto-close-text'>
        {leftTime < 0
          ? '??? ?????? ??? ????????????.'
          : `??? ?????? ${comma(Math.floor(leftTime / 1000))}??? ?????? ????????????.\n
          ?????? ?????? ?????? ?????? ??? ??? ????????????.`}
      </h3>
    </div>
  )
}

const useSocketEvents = (
  stateUpdate: (data: StateUpdateData) => void
): [React.Dispatch<React.SetStateAction<string | undefined>>, WebSocket?] => {
  const socket = useSelector((state: RootState) => state.main.socket)
  const [orderId, setOrderId] = useState<string>()

  useEffect(() => {
    if (!socket) {
      return
    }

    let IdSet = false
    if (orderId && socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ setOrderId: orderId }))
      IdSet = true
    }

    const openEventId = socketEvents.on('open', socket => {
      if (orderId && !IdSet) {
        socket.send(JSON.stringify({ setOrderId: orderId }))
      }
    })

    const messageEventId = socketEvents.on('commands', (type, data) => {
      if (type === 'STATE_UPDATE') {
        stateUpdate(data as StateUpdateData)
      }
    })

    return () => {
      socketEvents.off('open', openEventId)
      socketEvents.off('commands', messageEventId)
    }
  }, [socket, orderId])

  return [setOrderId, socket]
}

export enum PurchasePopupStep {
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
  boolean,
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
  const [cancelable, setCancelable] = useState<boolean>(false)

  const [error, setError] = useState<Error>()

  const stateUpdate = (data: StateUpdateData) => {
    setCancelable(false)

    if (data.state === StoreOrderState.WaitingPayment) {
      setState(StorePaymentRequestState.Waiting)

      if (data.virtualAccount) {
        setWaiting({
          icon: 'bank',
          title: '????????? ???????????? ????????????.',
          left:
            new Date(data.virtualAccount.dueDate).getTime() -
            new Date().getTime(),
          description: `${data.virtualAccount.bank} ${
            data.virtualAccount.accountNumber
          } ????????? ${comma(data.price!)}?????? '${
            data.virtualAccount.customerName
          }' ???????????? ???????????????.`
        })

        setCancelable(true)
      }

      return
    } else if (data.state === StoreOrderState.WaitingAccept) {
      setState(StorePaymentRequestState.Waiting)

      setWaiting({
        icon: 'loading',
        title: '?????? ????????? ???????????? ????????????...',
        left: data.left || 1800000,
        description: '???????????? ????????? ????????? ?????? ??????????????????.'
      })

      setCancelable(true)

      return
    }

    setCancelable(false)

    if (
      data.state === StoreOrderState.Aborted ||
      data.state === StoreOrderState.Expired ||
      data.state === StoreOrderState.Failed ||
      data.state === StoreOrderState.Canceled
    ) {
      setState(StorePaymentRequestState.Error)
      setError(new Error(data.error))

      return
    }

    setState(StorePaymentRequestState.Success)
  }

  const [setOrderId] = useSocketEvents(stateUpdate)

  useEffect(() => {
    if (!orderState) {
      return
    }

    if (orderState === 'order_processing') {
      const url = new URL(location.href)

      const orderId = url.searchParams.get('orderId')
      const paymentKey = url.searchParams.get('paymentKey')
      const amount = url.searchParams.get('amount')

      setWaiting(undefined)

      if (orderId) {
        setOrderId(orderId)
      }

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
            setError(new Error(res.error || '??? ??? ?????? ????????? ??????????????????.'))

            return
          }

          stateUpdate(res.data)
        })
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

  return [orderState, state, cancelable, error, waiting]
}

const useStep = (): [
  PurchasePopupStep,
  React.Dispatch<React.SetStateAction<PurchasePopupStep>>,
  () => void,
  () => void
] => {
  const [step, setStep] = useState<PurchasePopupStep>(
    PurchasePopupStep.Selecting
  )

  const next = () => {
    if (step === PurchasePopupStep.Verify) {
      setStep(PurchasePopupStep.Purchase)
    }
  }

  const previous = () => {
    if (step === PurchasePopupStep.Verify) {
      setStep(PurchasePopupStep.Selecting)
    }

    if (step === PurchasePopupStep.Purchase) {
      setStep(PurchasePopupStep.Verify)
    }
  }

  return [step, setStep, previous, next]
}

const useAutoClose = (
  time: number,
  disableCondition?: () => boolean,
  onClose?: () => void
) => {
  const [leftTime, setLeftTime] = useState<number>(time)
  const [closeAt, setCloseAt] = useState<number>(0)

  useEffect(() => {
    if (disableCondition && disableCondition()) {
      return
    }

    if (!closeAt) {
      setCloseAt(Date.now() + time)
    }

    const update = setTimeout(() => {
      setLeftTime(closeAt - Date.now())
    }, 100)

    if (leftTime < 0 && onClose) {
      onClose()
    }

    return () => {
      clearTimeout(update)
    }
  }, [disableCondition, closeAt, leftTime])

  return leftTime
}

export const PurchasePopup = () => {
  const carts = useSelector((state: RootState) => state.cart.items)
  const history = useHistory()

  const backToMain = () => {
    history.replace('/')
  }

  const minimize = () => {
    if (step !== PurchasePopupStep.Done) {
      setStep(PurchasePopupStep.Selecting)
      return
    }

    backToMain()
  }

  const [step, setStep, previous, next] = useStep()
  const [
    orderResponseDefined,
    orderState,
    orderCancelable,
    orderError,
    orderWaiting
  ] = useOrderPlace()

  const leftTime = useAutoClose(
    READY_TIME,
    () =>
      step !== PurchasePopupStep.Done ||
      orderState === StorePaymentRequestState.Waiting,
    () => {
      backToMain()
      setStep(PurchasePopupStep.Selecting)
    }
  )

  const [lastStep, setLastStep] = useState<PurchasePopupStep>(step)

  // ????????? ??????????????? ????????? ??????
  useEffect(() => {
    if (!carts.length && step === PurchasePopupStep.Verify) {
      setStep(PurchasePopupStep.Selecting)
    }
  }, [carts, step])

  useLayoutEffect(() => setLastStep(step), [step])

  // ?????? ?????? ?????? URL??? ????????? ?????? ?????? ????????? Done??? ????????? Done?????? ??????
  useEffect(() => {
    if (!orderResponseDefined) {
      return
    }

    if (step !== PurchasePopupStep.Done) {
      setStep(PurchasePopupStep.Done)
    }
  }, [orderResponseDefined])

  let InnerContents: ReactNode = (
    <ViewCarts
      items={carts}
      onClick={() => setStep(PurchasePopupStep.Verify)}
    ></ViewCarts>
  )

  if (step === PurchasePopupStep.Verify) {
    InnerContents = (
      <VerifyCarts
        orderState={orderState}
        items={carts}
        prev={previous}
        next={next}
      ></VerifyCarts>
    )
  } else if (step === PurchasePopupStep.Purchase) {
    InnerContents = (
      <SelectPayments
        items={carts}
        orderState={orderState}
        prev={previous}
        next={() => {}}
      ></SelectPayments>
    )
  } else if (step === PurchasePopupStep.Done) {
    InnerContents = (
      <OrderDone
        leftTime={leftTime}
        state={orderState}
        waiting={orderWaiting}
        error={orderError}
        cancelable={orderCancelable}
      ></OrderDone>
    )
  }

  let popupState = PopupState.Hidden

  if (step > PurchasePopupStep.Selecting || orderResponseDefined) {
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
