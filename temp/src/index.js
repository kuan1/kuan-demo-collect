import { reactive, effect } from './reacivity/index.js'

const state = reactive({ a: { a: 1 }, b: 2, c: 3 })

const ef = effect(() => {
  state.a.a
  state.b
  state.c
  console.log('effect: ', state.__v_raw)
})

console.log(ef.deps)

state.a.a = 0

state.b = 0

state.c = 0
