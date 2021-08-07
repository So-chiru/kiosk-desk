import { StorePaymentMethod } from '@/@types/order'

export const makeAnOrder = (items: CartItem[], payWith: StorePaymentMethod) =>
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
        throw new Error('Failed to make an order: ' + v.error)
      }

      if (!v.data) {
        throw new Error('주문 데이터가 없습니다.')
      }

      if (!v.data.order) {
        throw new Error('주문이 정의되지 않았습니다.')
      }

      return v
    })

export const acceptOrder = (orderId: string) =>
  fetch(process.env.API_ENDPOINT! + `/order/${orderId}/accept`, {
    method: 'get'
  })
    .then(v => v.json())
    .then(v => {
      if (v.status === 'success') {
        return v
      }

      throw new Error('Failed to accept the order.')
    })

export const cancelOrder = (orderId: string, cancelReason: string) =>
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
        return v
      }

      throw new Error('Failed to cancel the order.')
    })
