const effectStack = []
let activeEffect

let shouldTrack = true
const trackStack = [] // Boolean[]

let uid = 0

// interface ReactiveEffect<T = any> {
//   (): T
//   _isEffect: true
//   id: number
//   active: boolean
//   raw: () => T
//   deps: Array<Dep>
//   options: ReactiveEffectOptions
//   allowRecurse: boolean
// }

// export interface ReactiveEffectOptions {
//   lazy?: boolean
//   scheduler?: (job: ReactiveEffect) => void
//   onTrack?: (event: DebuggerEvent) => void
//   onTrigger?: (event: DebuggerEvent) => void
//   onStop?: () => void
//   allowRecurse?: boolean
// }

export const ITERATE_KEY = Symbol('iterate')

// 原始对象和依赖 对应关系
const targetMap = new WeakMap()

// depsMap {key1: [], key2: [], key3: []}
export function track(target, key) {
  // shouldTrack 或者 activeEffect为undefined 直接返回
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
  // 根据原始对象，找到所有依赖的Map对象
  let depsMap = targetMap.get(target)
  // 如果没有找到依赖Map对象，添加一个空Map对象
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 获取key对应所有依赖
  let dep = depsMap.get(key)
  // 没有对应key的依赖Set，赋值空Set
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 添加依赖
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        key,
      })
    }
  }
}

export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // 获取要触发的函数
  const effects = new Set()
  const effectsToAdd = depsMap.get(key)
  if (effectsToAdd) {
    effectsToAdd.forEach((effect) => {
      effect !== activeEffect && effects.add(effect)
    })
  }

  // 循环触发依赖函数
  const run = (effect) => {
    if (effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        newValue,
        oldValue,
        oldTarget,
      })
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }
  effects.forEach(run)
}

export function isEffect(fn) {
  return fn && fn._isEffect === true
}

export function effect(fn, options = {}) {
  // 获取原始函数
  isEffect(fn) && (fn = fn.raw)
  const effect = createReactiveEffect(fn, options)
  !options.lazy && effect()
  return effect
}

function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
    if (!effectStack.includes(effect)) {
      cleanup(effect)
      try {
        enableTracking()
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++
  effect.allowRecurse = !!options.allowRecurse
  effect.__isEffect = true
  effect.active = true
  effect.raw = fn
  effect.deps = []
  effect.options = options
  return effect
}

// 新增变量shouldTrack true，并保存旧shouldTrack变量到trackStack
function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}

function cleanup(effect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
}
