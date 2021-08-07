import React, { useLayoutEffect, useRef, useState } from 'react'

interface LazyImageProps {
  src: string
  width?: number
  height?: number
  className?: string
}

enum LazyLoadState {
  Hidden,
  Loading,
  Done,
  Error
}

export const LazyImage = ({
  src,
  width,
  height,
  className
}: LazyImageProps) => {
  const [state, setState] = useState<LazyLoadState>(LazyLoadState.Loading)

  const hideImage =
    state === LazyLoadState.Loading || state === LazyLoadState.Hidden

  const ref = useRef<HTMLImageElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const onLoad = () => {
      setState(LazyLoadState.Done)
    }

    const onError = () => {
      setState(LazyLoadState.Error)
    }

    ref.current.addEventListener('load', onLoad)
    ref.current.addEventListener('error', onError)

    return () => {
      ref.current?.removeEventListener('load', onLoad)
      ref.current?.removeEventListener('error', onError)
    }
  }, [ref])

  return (
    <img
      src={src}
      className={className}
      ref={ref}
      data-lazy={state}
      style={{
        opacity: hideImage ? 0 : 1,
        width,
        height,
        transition: '0.23s opacity cubic-bezier(0.19, 1, 0.22, 1)'
      }}
    ></img>
  )
}

export default LazyImage
