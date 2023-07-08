export function create<K extends keyof HTMLElementTagNameMap>(
  name: K,
  attributes: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: Element[]
) {
  const el = Object.assign(document.createElement(name), attributes)
  if (children) el.append(...children)
  return el
}
