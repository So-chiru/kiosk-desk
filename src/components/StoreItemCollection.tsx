import { RootState } from '@/store'
import { addItemToCart } from '@/store/cart/actions'
import '@/styles/components/collection.scss'
import { useDispatch, useSelector } from 'react-redux'
import StoreItem from './StoreItems'

const exampleItems: StoreItem[] = [
  {
    id: 'aaaa',
    name: '김치찌개',
    price: 6000,
    image: 'https://ppss.kr/wp-content/uploads/2019/08/0-87.jpg'
  },
  {
    id: 'bbbb',
    name: '뿌링클',
    price: 17000,
    image: 'http://www.bhc.co.kr/upload/bhc/menu/BB(0).jpg'
  },
  {
    id: 'cccc',
    name: '다른 것',
    price: 6000
  }
]

interface StoreItemCollectionComponentProps {
  cart: CartItem[]
}

const getAmount = (items: CartItem[], id: string) => {
  const item = items.filter(item => item.item.id === id)

  if (!item.length) {
    return 0
  }

  return item[0].amount
}

export const StoreItemCollectionComponent = ({
  cart
}: StoreItemCollectionComponentProps) => {
  const dispatch = useDispatch()

  const add = (item: StoreItem) => {
    dispatch(addItemToCart(item))
  }

  return (
    <div className='item-collection'>
      {exampleItems.map(item => (
        <StoreItem
          key={item.id}
          item={item}
          add={() => add(item)}
          added={getAmount(cart, item.id)}
        ></StoreItem>
      ))}
    </div>
  )
}

export const StoreItemCollection = () => {
  const cart = useSelector((state: RootState) => state.cart.items)

  return (
    <StoreItemCollectionComponent cart={cart}></StoreItemCollectionComponent>
  )
}

export default StoreItemCollection
