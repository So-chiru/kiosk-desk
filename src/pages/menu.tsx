import Header from '@/components/Header'
import SmallLogo from '@/components/Logo/Small'
import MenuList from '@/components/Menu/List'
import Spacer from '@/components/Spacer'
import { RootState } from '@/store'
import { updateMenuData } from '@/store/main/actions'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import '@/styles/pages/menu.scss'

const useMenuDataFetch = () => {
  const data = useSelector((state: RootState) => state.main.menus)
  const [LastTry, setLastTry] = useState<number>(0)

  const dispatch = useDispatch()

  useEffect(() => {
    if ((!data || !data.length) && Date.now() - LastTry > 500) {
      fetch(process.env.GRAPHQL_ENDPOINT!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: `
          {
            menus {
              id
              name
              items {
                id
                description,
                name
                image,
                price
              }
            }
          }
          `.trim()
        })
      })
        .then(r => {
          if (r.status !== 200) {
            throw new Error('Status is not 200. server returned ' + r.status)
          }

          return r
        })
        .then(r => r.json())
        .then(data => {
          return data.data.menus
        })
        .then(v => {
          if (!v.length) {
            return
          }

          setLastTry(Date.now())
          dispatch(updateMenuData(v))
        })
    }
  }, [data])

  return data
}

export const MenuPage = () => {
  const menus = useMenuDataFetch()

  return (
    <div className='page menu'>
      <Spacer template='main-contents' flex={true}>
        <div className='page-contents'>
          <Spacer template='header-logo'>
            <SmallLogo></SmallLogo>
          </Spacer>
          <Header
            title='우선, 주문하실 음식을 골라주세요.'
            description='다 고르신 후에는 화면 아래의 선택 완료 버튼을 눌러주세요.'
          ></Header>
          <MenuList items={menus}></MenuList>
        </div>
      </Spacer>
    </div>
  )
}

export default MenuPage
