import { reactive, effect } from './reacivity/index.js'

const state = reactive({ a: { a: 1 }, b: 2, c: 3 })

effect(
  () => {
    console.log('effect', state.a.a)
  },
  {
    onTrack(e) {
      console.log('onTrack', e)
    },
  }
)

// state.b = 3
// state.b = 4

// state.a.a = 2

state.a.a = 1
state.a.a = 2
state.a.a = 3

// state2.a.a = 2
// state2.a.a = 3

// console.log(state.a.a)
