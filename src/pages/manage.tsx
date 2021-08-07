import Button from '@/components/Button'
import { socketEvents } from '@/components/Data/socket'
import Header from '@/components/Header'
import SmallLogo from '@/components/Logo/Small'
import Spacer from '@/components/Spacer'
import { RootState } from '@/store'

import '@/styles/pages/manage.scss'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import ManageDashboard from './manage-tabs/dashboard'
import ManageOrders from './manage-tabs/orders'

interface Tab {
  name: string
  description: string
  element: React.ReactNode
}

const Tabs: Tab[] = [
  {
    name: '대시보드',
    description: '여기서 가게에서 이뤄진 모든 주문, 거래를 확인할 수 있습니다.',
    element: <ManageDashboard></ManageDashboard>
  },
  {
    name: '주문 목록',
    description: '모든 주문을 여기서 볼 수 있습니다.',
    element: <ManageOrders></ManageOrders>
  }
]

interface ManageTabButtonsProps {
  tabs: Tab[]
  currentTab: number
  changeTo: (num: number) => void
}

const ManageTabButtons = ({
  tabs,
  currentTab,
  changeTo
}: ManageTabButtonsProps) => {
  return (
    <div className='tab-buttons'>
      {tabs.map((v, i) => (
        <Button
          key={v.name}
          theme={i === currentTab ? 'manage-active' : 'manage-alt'}
          onClick={() => changeTo(i)}
        >
          {v.name}
        </Button>
      ))}
    </div>
  )
}

export const ManagePage = () => {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [previousTab, setPreviousTab] = useState<number>(-1)
  const socket = useSelector((state: RootState) => state.main.socket)

  useLayoutEffect(() => {
    setPreviousTab(currentTab)
  }, [currentTab])

  useEffect(() => {
    if (!socket) {
      return
    }

    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify({ setAdmin: true }))
    } else {
      const openEventsId = socketEvents.on('open', socket => {
        socket.send(JSON.stringify({ setAdmin: true }))
      })

      return () => {
        socketEvents.off('open', openEventsId)
      }
    }
  }, [socket])

  return (
    <div className='page manage'>
      <Spacer template='main-contents' flex={true}>
        <div className='page-contents'>
          <Spacer template='header-logo'>
            <SmallLogo></SmallLogo>
          </Spacer>
          <Spacer
            customStyles={{
              marginBottom: 64
            }}
          >
            <CSSTransition
              in={currentTab === previousTab}
              key={currentTab}
              appear
              timeout={400}
              classNames='manage-header'
            >
              <Header
                title={Tabs[currentTab].name}
                description={Tabs[currentTab].description}
              ></Header>
            </CSSTransition>
          </Spacer>
          <ManageTabButtons
            tabs={Tabs}
            currentTab={currentTab}
            changeTo={setCurrentTab}
          ></ManageTabButtons>
          <Spacer
            customStyles={{
              marginTop: 64
            }}
          >
            <CSSTransition
              in={currentTab === previousTab}
              key={currentTab}
              appear
              timeout={400}
              classNames='manage-contents'
            >
              {Tabs[currentTab].element}
            </CSSTransition>
          </Spacer>
        </div>
      </Spacer>
    </div>
  )
}

export default ManagePage
