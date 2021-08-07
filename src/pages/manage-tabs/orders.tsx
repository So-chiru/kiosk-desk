import { StoreOrder } from '@/@types/order'
import OrderBrief from '@/components/Manage/OrderBrief'
import { useEffect, useState } from 'react'

import '@/styles/pages/manage-tabs/orders.scss'
import { acceptOrder, cancelOrder } from '@/api/order'
import { socketEvents } from '@/components/Data/socket'

const useOrderData = (
  update?: number,
  filter?: { start: number; end: number }
) => {
  const [lists, setLists] = useState<StoreOrder[]>()
  const [internalUpdate, requestUpdate] = useState<number>(-1)

  useEffect(() => {
    const messageEventId = socketEvents.on('commands', type => {
      // TODO : 가능한 경우 데이터의 필드를 활용할 수 있도록 특정 ID를 가진 요소만 업데이트할 수 있돌고 구현하기

      if (type === 'ORDER_UPDATE') {
        requestUpdate(Math.random())
      }
    })

    return () => {
      socketEvents.off('commands', messageEventId)
    }
  }, [])

  useEffect(() => {
    fetch(
      process.env.API_ENDPOINT +
        '/orders' +
        (filter ? `?start=${filter.start}&end=${filter.end}` : '')
    )
      .then(v => {
        if (v.status !== 200) {
          throw new Error()
        }

        return v.json()
      })
      .then(v => {
        if (v.status !== 'success') {
          throw new Error()
        }

        return v.data
      })
      .then(v => {
        setLists(v)
      })
  }, [update, internalUpdate])

  return lists
}

const accept = (id: string) => acceptOrder(id)
const refund = (id: string) => cancelOrder(id, '가게에서 취소')

interface OrderListsProps {
  orders?: StoreOrder[]
  update: () => void
}

const OrderLists = ({ orders, update }: OrderListsProps) => {
  return (
    <div className='order-list'>
      {...(orders || []).map(v => (
        <OrderBrief
          key={v.id}
          order={v}
          onAccept={async () => {
            await accept(v.id)
            update()

            return
          }}
          onRefund={async () => {
            await refund(v.id)
            update()

            return
          }}
        ></OrderBrief>
      ))}
    </div>
  )
}

export const ManageOrders = () => {
  const [_, update] = useState<number>(-1)
  const data = useOrderData()

  return (
    <div className='manage-tab'>
      <OrderLists
        orders={data}
        update={() => update(Math.random())}
      ></OrderLists>
    </div>
  )
}

export default ManageOrders
