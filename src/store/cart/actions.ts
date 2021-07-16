export interface CartAction {
  type: string
  item: StoreItem
}

export const addItemToCart = (item: StoreItem) => {
  return {
    type: '@kiosk/cart/addItem',
    item
  }
}

export const removeItemToCart = (item: StoreItem, all = false) => {
  return {
    type: '@kiosk/cart/removeItem',
    item
  }
}
