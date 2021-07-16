declare interface StoreItem {
  id: string
  name: string
  image?: string
  price: number
}

declare interface CartItem {
  item: StoreItem
  amount: number
}
