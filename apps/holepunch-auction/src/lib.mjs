// sleep time expects milliseconds
export function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// The maximum is exclusive and the minimum is inclusive
export function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
