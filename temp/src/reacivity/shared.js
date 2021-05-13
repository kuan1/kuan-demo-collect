export const isObject = (val) => val !== null && typeof val === 'object'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val, key) => hasOwnProperty.call(val, key)

export const isSymbol = (val) => typeof val === 'symbol'

export const builtInSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map((key) => Symbol[key])
    .filter(isSymbol)
)

// 不追踪字段
export const nonTrackableKeysMap = {
  __proto__: true,
  __v_isRef: true,
  __isVue: true,
}

export const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue)
