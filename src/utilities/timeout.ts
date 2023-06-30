export function timeOut(fn: VoidFunction, seconds = 1) {
  setTimeout(fn, seconds * 1000)
}
