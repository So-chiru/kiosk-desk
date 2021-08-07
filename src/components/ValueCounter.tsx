import { ReactNode, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import '@/styles/components/valueCounter.scss'

export const ValueCounter = ({
  value,
  before,
  after,
  noTransform
}: {
  value: number | string
  before?: ReactNode
  after?: ReactNode
  noTransform?: boolean
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
      classNames={noTransform ? 'value-count-no-transform' : 'value-count'}
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
