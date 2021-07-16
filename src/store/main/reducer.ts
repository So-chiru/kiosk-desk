import { MainAction } from './actions'

const MainDefault = {
  store: '테스트 가게'
}

const MainReducer = (state = MainDefault, action: MainAction) => {
  switch (action.type) {
    case '@kiosk/update':
      return state
    default:
      return state
  }
}

export default MainReducer
