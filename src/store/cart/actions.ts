export interface CartAction {
  type: string
  item: StoreItem
  data?: unknown
}

export const addItemToCart = (item: StoreItem) => {
  return {
    type: '@kiosk/cart/addItem',
    item
  }
}

export const updateCartItemCount = (item: StoreItem, newCount: number) => {
  return {
    type: '@kiosk/cart/updateItemCount',
    item,
    data: newCount
  }
}

export const removeItemToCart = (item: StoreItem, all = false) => {
  return {
    type: '@kiosk/cart/removeItem',
    item
  }
}
