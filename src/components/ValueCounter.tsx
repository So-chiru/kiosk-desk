import { ReactNode, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import '@/styles/components/valueCounter.scss'

export const ValueCounter = ({
  value,
  before,
  after
}: {
  value: number | string
  before?: ReactNode
  after?: ReactNode
}) => {
  const [lastValue, setLastValue] = useState<number | string>()

  const TIME = 280

  useEffect(() => {
    setLastValue(value)
  }, [value])

  return (
    <CSSTransition
      in={value === lastValue}
      timeout={TIME}
      classNames='value-count'
    >
      <span className='value-count'>
        {before}
        {value}
        {after}
      </span>
    </CSSTransition>
  )
}

export default ValueCounter
