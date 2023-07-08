import {create} from '../utilities'

const dialog = create(
  'dialog',
  {open: true},

  create('h2', {innerText: 'Está pronto pra jogar?'}),

  create('button', {
		innerText: 'Sim, bora!',
		onclick() {
      dialog.close()
    },
  })
)

export {dialog}
