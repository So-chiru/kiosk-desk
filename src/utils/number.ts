export const comma = (num: number) => num.toLocaleString('ko-KR')

export const cartTotal = (cart: CartItem[]) =>
  cart.map(v => v.amount * v.item.price).reduce((p, c) => p + c)
