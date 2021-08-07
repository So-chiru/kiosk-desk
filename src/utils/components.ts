/**
 * CSS 클래스를 병합하여 하나의 class string으로 만들어줍니다.
 */
export const concatClass = (...args: (string | boolean | undefined)[]) =>
  args.filter(v => v !== false && v !== undefined).join(' ')
