import { StoreOrderState, StorePaymentMethod } from '@/@types/order'
import OrderBrief from '@/components/Manage/OrderBrief'

export const ManageDashboard = () => {
  return (
    <div className='manage-tab'>
      <OrderBrief
        order={{
          id: '3XFSACXX',
          date: new Date('2021-08-06 09:54:30').toISOString(),
          payWith: StorePaymentMethod.Toss,
          state: StoreOrderState.Done,
          price: 30000,
          items: [{ id: 'a', amount: 3, name: '뿌링클', price: 3000 }]
        }}
      ></OrderBrief>
    </div>
  )
}

export default ManageDashboard
