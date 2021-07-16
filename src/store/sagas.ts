import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
// import { call, put, takeEvery } from 'redux-saga/effects'

const sagaMiddleware = createSagaMiddleware()

// 첫 번째 인자를 가진 Action이 Dispatch 되어 요청이 들어오면 그 Action을 처리할 수 있도록 호출할 함수를 2번째 인자로 지정합니다.
// 두 번째 인자가 가지는 함수는 generator이며 이 주석 위에다 정의하면 편합니다. 인자는 action 객체를 가집니다.
export function * defaultSaga () {
  // yield takeEvery('@llct/api_lists/request', fetchAPIData)
}

// 하위 saga들을 모두 실행합니다.
export function * rootSaga () {
  yield all([defaultSaga()])
}

export default sagaMiddleware
