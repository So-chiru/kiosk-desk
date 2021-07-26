interface AmountSelectionProps {
  value: number
  update?: (num: number) => void
  zeroToDelete?: boolean
}

import '@/styles/components/amount.scss'

const MinusSVG = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M5 11h14v2H5z' />
  </svg>
)

const DeleteSVG = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z' />
  </svg>
)

const PlusSVG = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z' />
  </svg>
)

export const AmountSelection = ({
  value,
  update,
  zeroToDelete = true
}: AmountSelectionProps) => {
  const remove = zeroToDelete && value <= 1

  return (
    <div className='amount-selection'>
      <div
        className='minus'
        data-remove={remove}
        onClick={() => update && update(value - 1)}
      >
        {remove ? DeleteSVG : MinusSVG}
      </div>
      <div className='number'>
        <h1 className='amount-number'>{value}</h1>
      </div>
      <div className='plus' onClick={() => update && update(value + 1)}>
        {PlusSVG}
      </div>
    </div>
  )
}

export default AmountSelection
