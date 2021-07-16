import { CartAction } from './actions'

interface ICartDefault {
  items: CartItem[]
}

const CartDefault: ICartDefault = {
  items: []
}

const addItem = (state = CartDefault, action: CartAction): ICartDefault => {
  const items = [...state.items]

  let exists = false

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (item.item.id === action.item.id) {
      item.amount++
      exists = true

      break
    }
  }

  if (!exists) {
    items.push({
      item: action.item,
      amount: 1
    })
  }

  return Object.assign({}, state, {
    items
  })
}

const CartReducer = (state = CartDefault, action: CartAction) => {
  switch (action.type) {
    case '@kiosk/cart/addItem':
      return addItem(state, action)
    default:
      return state
  }
}

export default CartReducer
