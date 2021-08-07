import { RootState } from '@/store'
import { updateSocket } from '@/store/main/actions'
import eventBus from '@/utils/events'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface socketEventsInterface {
  open: (socket: WebSocket, event: Event) => void
  close: (event: CloseEvent) => void
  commands: (type: string, data: unknown) => void
}

export const socketEvents = new eventBus<socketEventsInterface>()

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

        localSocket.onopen = ev => {
          console.log('Connected to the websocket kiosk server.')

          socketEvents.runAll('open', localSocket, ev)
        }

        localSocket.onclose = ev => {
          console.log(
            'Connection with the kiosk server was terminated. reason:',
            ev.reason
          )

          timeout = (setTimeout(() => {
            dispatch(updateSocket(createNewConnection()))
          }, 500) as unknown) as number

          socketEvents.runAll('close', ev)
        }

        localSocket.onmessage = ev => {
          if (typeof ev.data === 'string' && ev.data.indexOf('{') === 0) {
            const message = JSON.parse(ev.data)
            socketEvents.runAll('commands', message.code, message.data)
          }
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

export default useDataSocket
