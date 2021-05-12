// 保存所有的响应对象
const reactiveMap = new WeakMap()

// 保存响应对象和依赖的关系
const targetMap = new WeakMap()

let currentCb
