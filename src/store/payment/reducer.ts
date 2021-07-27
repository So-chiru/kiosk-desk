import { TossPaymentsInstance } from '@tosspayments/sdk'

import { PaymentAction } from './actions'

const PaymentDefault: {
  toss?: TossPaymentsInstance
} = {}

const PaymentReducer = (state = PaymentDefault, action: PaymentAction) => {
  switch (action.type) {
    case '@kiosk/payments/initializeInstance':
      return Object.assign({}, state, {
        toss: action.data
      })
    default:
      return state
  }
}

export default PaymentReducer
