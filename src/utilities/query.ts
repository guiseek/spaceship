export function query<K extends keyof HTMLElementTagNameMap>(
  name: K,
  parent: HTMLElement = document.body
) {
  return parent.querySelector(name)
}
