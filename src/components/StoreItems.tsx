import '@/styles/components/storeItem.scss'
import { comma } from '@/utils/number'

interface StoreItemComponentProps {
  id: string
  title: string
  image: string
  price: number
  add?: (id: string) => void
  added?: number
}

export const StoreItemComponent = ({
  id,
  title,
  image,
  price,
  add,
  added
}: StoreItemComponentProps) => {
  return (
    <div
      className='store-item'
      data-added={added}
      onClick={() => add && add(id)}
    >
      {(added && (
        <div className='added'>
          <div className='added-contents'>
            <p>{added}개가 주문 목록에 추가되었습니다.</p>

            <span>TODO : 제거 기능 구현.</span>
          </div>
        </div>
      )) ||
        undefined}
      <img className='image' src={image}></img>
      <div className='detail'>
        <div className='contents'>
          <div className='info'>
            <h1 className='menu-title'>{title}</h1>
            <p className='menu-price'>{comma(price)}원</p>
          </div>
          {/* {add && (
            <div className='control'>
              <Button onClick={() => add(id)}>주문 목록에 넣기</Button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}

interface StoreItemProps {
  item: StoreItem
  add: (id: string) => void
  added?: number
}

export const StoreItem = ({ item, add, added }: StoreItemProps) => {
  return (
    <StoreItemComponent
      id={item.id}
      title={item.name}
      price={item.price}
      image={item.image || 'https://picsum.photos/seed/' + item.id + '/400'}
      add={add}
      added={added}
    ></StoreItemComponent>
  )
}

export default StoreItem
