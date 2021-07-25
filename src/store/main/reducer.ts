import { MainAction } from './actions'

const MainDefault = {
  storeName: '맛있는 치킨집 가로수길점',
  menus: []
}

const MainReducer = (state = MainDefault, action: MainAction) => {
  switch (action.type) {
    case '@kiosk/updateMenu':
      return Object.assign({}, state, {
        menus: action.data
      })
    default:
      return state
  }
}

export default MainReducer
