export interface MainAction {
  type: string
  data?: unknown
}

export const updateMenuData = (data: unknown) => {
  return {
    type: '@kiosk/updateMenu',
    data: data
  }
}
