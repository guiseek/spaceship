import {create} from './create'
import {query} from './query'

export const onProgress = (innerText = 'model') => {
  const footer = query('footer')!
  let progress: HTMLProgressElement
  let output: HTMLOutputElement
  let span: HTMLSpanElement
  let label = create('label')!

  return (e: ProgressEvent<EventTarget>) => {
    if (!progress) {
      progress = create('progress', {max: e.total, value: 0})
      output = create('output', {innerText: '0%'})!
      span = create('span', {innerText})
      label.append(progress, output, span)
      footer.appendChild(label)
    }
    const percent = Math.floor((e.loaded * 100) / e.total)
    output.innerText = `${percent}%`
    progress.value = e.loaded
    if (e.loaded >= e.total || percent > 100) {
      label.remove()
    }
  }
}
