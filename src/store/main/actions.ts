export interface MainAction {
  type: string
  data?: unknown
}

export const updateMenuData = (data: unknown) => {
  return {
    type: '@kiosk/updateMenu',
    data
  }
}

export const updateSocket = (data: WebSocket) => {
  return {
    type: '@kiosk/updateSocket',
    data
  }
}
