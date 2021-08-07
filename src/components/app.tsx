import { Route, Switch } from 'react-router-dom'

import { TransitionGroup, CSSTransition } from 'react-transition-group'
import MainPage from '@/pages/main'
import MenuPage from '@/pages/menu'
import DataSocket from './Data/socket'
import ManagePage from '@/pages/manage'

// 애플리케이션의 최상위 (따지면 아니지만) 가 될 컴포넌트입니다. 이 안에서 원하는 컴포넌트들을
// 정의하여 사용하시면 됩니다.
const App = () => {
  return (
    <>
      <DataSocket></DataSocket>
      <Route
        render={({ location }) => {
          return (
            <TransitionGroup appear={true}>
              <CSSTransition
                key={location.key}
                timeout={230}
                classNames='kiosk-page'
                unmountOnExit
              >
                <Switch location={location}>
                  <Route path='/' exact>
                    <MainPage></MainPage>
                  </Route>
                  <Route path='/menu' exact>
                    <MenuPage></MenuPage>
                  </Route>
                  <Route path='/menu/:orderState' exact>
                    <MenuPage></MenuPage>
                  </Route>
                  <Route path='/manage' exact>
                    <ManagePage></ManagePage>
                  </Route>
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )
        }}
      ></Route>
    </>
  )
}

export default App
