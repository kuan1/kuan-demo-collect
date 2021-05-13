import { isObject } from './shared.js'
import { ReactiveFlags, reactiveMap, toRaw, reactive } from './reactive.js'
import { hasOwn, hasChanged, isSymbol, builtInSymbols, nonTrackableKeysMap } from './shared.js'
import { track, trigger } from './effect.js'

function get(target, key, receiver) {
  // 添加一个 __v_isReactive 的属性，true
  if (key === ReactiveFlags.IS_REACTIVE) return true

  // 添加一个 __v_isReadonly 的属性，false
  if (key === ReactiveFlags.IS_READONLY) return false

  // 添加一个 __v_raw 的属性，返回没有被代理的原始对象
  if (key === ReactiveFlags.RAW && receiver === reactiveMap.get(target)) return target

  // 正常返回内容
  const res = Reflect.get(target, key, receiver)

  // 不追踪key，直接返回
  if (isSymbol(key) ? builtInSymbols.has(key) : nonTrackableKeysMap[key]) {
    return res
  }

  // 追踪依赖
  track(target, key)

  // 循环转化
  if (isObject(res)) {
    return reactive(res)
  }

  return res
}

function set(target, key, value, receiver) {
  let oldValue = target[key]

  value = toRaw(value)
  oldValue = toRaw(oldValue)

  const hadKey = hasOwn(target, key)
  const result = Reflect.set(target, key, value, receiver)
  // don't trigger if target is something up in the prototype chain of original
  if (target === toRaw(receiver)) {
    if (!hadKey) {
      trigger(target, key, value)
    } else if (hasChanged(value, oldValue)) {
      trigger(target, key, value, oldValue)
    }
  }
  return result
}

function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key)
  const oldValue = target[key]
  const result = Reflect.deleteProperty(target, key)
  if (result && hadKey) {
    trigger(target, key, undefined, oldValue)
  }
  return result
}

export const mutableHandlers = {
  get,
  set,
  deleteProperty,
}
