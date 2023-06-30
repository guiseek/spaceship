let alpha = 4

export function setAlpha(value: number) {
  alpha = value
}

export function getAlpha(deltaTime: number) {
  return Math.min(alpha * deltaTime, 1)
}
