// 简版Vue
class Kvue {
  constructor(options) {
    this.$options = options
    this.$data = options.data

    // 拦截$data
    observer(this.$data)

    // 代理$data到this
    proxy(this, '$data')

    // watch
    Object.keys(options.watch || {}).forEach(key => {
      new Watcher(this, key, options.watch[key])
    })

    // compile
    new Compile(options.el, this)

    // created
    options.created && options.created.call(this)
  }
}

// 代理对象的下一级对象属性代理到对象上
function proxy(vm, key) {
  const data = vm[key]
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return data[key]
      },
      set(newVal) {
        data[key] = newVal
      }
    })
  })
}

// 拦截对象参数
function defineReactive(obj, key, val) {
  // 递归
  observer(val)

  // 创建一个Dep
  const dep = new Dep()

  // 拦截对象属性
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key)
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(newVal) {
      if (newVal === val) return
      console.log('set', key, newVal)
      val = newVal
      // 重新处理传入的newVal
      observer(newVal)

      dep.notify()
    }
  })

}

//  拦截
function observer(obj) {
  if (typeof obj !== 'object' || obj === null) return

  // 对象响应
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })

  // 数组响应
}

// 观察者：保存更新函数
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    // Dep的静态属性上设置当前water实例
    Dep.target = this
    // 触发getter
    this.vm[this.key]
    // 依赖收集完成置空target
    Dep.target = null
  }

  update() {
    this.cb.call(this.vm, this.vm[this.key])
  }
}

// Dep依赖收集，管理莫个key相关的water实例
class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

