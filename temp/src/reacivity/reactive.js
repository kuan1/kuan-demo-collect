import { isObject } from './shared.js'
import { mutableHandlers } from './baseHandlers.js'

// 保存所有的响应对象
export const reactiveMap = new WeakMap()

export const ReactiveFlags = {
  IS_REACTIVE: '__v_isReactive',
  IS_READONLY: '__v_isReadonly',
  RAW: '__v_raw',
}

// 获取响应式数据的原始对象
export function toRaw(observed) {
  return (observed && toRaw(observed[ReactiveFlags.RAW])) || observed
}

// 此处target仅支持简单对象，详细代码看 [@vue/reactivity](https://github.com/vuejs/vue-next/blob/master/packages/reactivity/src/reactive.ts)
export function reactive(target) {
  // 如果是readonly直接返回
  if (target && target[ReactiveFlags.IS_READONLY]) return target

  // 如果不是对象直接返回
  if (!isObject) {
    console.warn(`value cannot be made reactive: ${String(target)}`)
    return target
  }

  // 如果对象已经有了相应proxy直接返回
  const existingProxy = reactiveMap.get(target)
  if (existingProxy) return existingProxy

  // 代理原对象
  const proxy = new Proxy(target, mutableHandlers)

  // 缓存proxy
  reactiveMap.set(target, proxy)

  return proxy
}
