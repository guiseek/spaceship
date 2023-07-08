type Selector<K extends keyof HTMLElementTagNameMap> =
  | K
  | `${K}#${string}`
  | `${K}.${string}`
  | `${K}[${string}]`

export function query<K extends keyof HTMLElementTagNameMap>(
  name: K | Selector<K> | `${string} ${Selector<K>}`,
  parent: HTMLElement = document.body
) {
  return parent.querySelector(name) as HTMLElementTagNameMap[K]
}
