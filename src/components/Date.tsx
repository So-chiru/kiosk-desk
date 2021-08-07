import { useEffect, useState } from 'react'
import ValueCounter from './ValueCounter'

interface DateComponentProps {
  date: Date
}

const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24

function formatShort (ms: number) {
  const msAbs = Math.abs(ms)
  if (msAbs >= d) {
    return Math.round(ms / d) + '일'
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + '시간'
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + '분'
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + '초'
  }
  return ms + 'ms'
}

const calculateTime = (date: Date) => {
  return formatShort(new Date().getTime() - date.getTime())
}

export const DateComponent = ({ date }: DateComponentProps) => {
  const [_, update] = useState<number>(-1)

  useEffect(() => {
    const td = new Date().getTime() - date.getTime()

    if (td < 86400000) {
      const timeout = setTimeout(
        () => {
          update(Math.random())
        },
        td < 60000 ? 500 : 5000
      )

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [date, _])

  return (
    <>
      <ValueCounter
        noTransform
        value={
          new Date().getTime() - date.getTime() < 86400000
            ? `${calculateTime(date)} 전`
            : date.toLocaleString('ko-KR')
        }
      ></ValueCounter>
    </>
  )
}

export default DateComponent
