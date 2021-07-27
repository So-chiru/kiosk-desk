import { TossPaymentsInstance } from '@tosspayments/sdk'

export interface PaymentAction {
  type: string
  data?: unknown
}

export const initializeTossPayments = async (
  instance: Promise<TossPaymentsInstance>
) => {
  return {
    type: '@kiosk/payments/initializeInstance',
    data: await instance
  }
}
