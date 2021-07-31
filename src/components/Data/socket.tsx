import { RootState } from '@/store'
import { updateSocket } from '@/store/main/actions'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useDataSocket = () => {
  const socket = useSelector((state: RootState) => state.main.socket)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket || socket.readyState === socket.CLOSED) {
      let timeout = 0

      const createNewConnection = () => {
        const localSocket = new WebSocket(
          process.env.API_ENDPOINT!.replace('http', 'ws') + '/socket'
        )

        localSocket.onopen = () => {
          console.log('Connected to the websocket kiosk server.')
        }

        localSocket.onclose = ev => {
          console.log(
            'Connection with the kiosk server was terminated. reason:',
            ev.reason
          )

          timeout = (setTimeout(() => {
            dispatch(updateSocket(createNewConnection()))
          }, 500) as unknown) as number
        }

        return localSocket
      }

      dispatch(updateSocket(createNewConnection()))

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
  }, [socket])

  return socket
}

export const DataSocket = () => {
  const socket = useDataSocket()

  return <></>
}

export default DataSocket
