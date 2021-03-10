// html元素
const isElement = (node) => node.nodeType === 1

// 插值文本
const isInterpolation = node => node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)

// 将宿主元素中代码拿出来遍历, 这样做比较搞笑
function node2Fragment(el) {
  const fragment = document.createDocumentFragment()
  // 将el中所有自元素搬家到frag中
  let child
  while (child = el.firstChild) {
    fragment.appendChild(child)
  }
  return fragment
}

// 编译
class Compile {
  constructor(el, vm) {
    this.$vm = vm // vue 实例
    this.$el = document.querySelector(el) // 绑定元素

    // 编译
    if (this.$el) {
      // 转换内部内容为片段Frament
      this.$fragment = node2Fragment(this.$el)
      // 执行编译
      this.compile(this.$fragment)
      // 编译后的html追加到el
      this.$el.appendChild(this.$fragment)
    }
  }

  compile(node) {
    // 找到并替换
    const childNodes = node.childNodes
    Array.from(childNodes).forEach(node => {
      if (isElement(node)) {
        console.log('编译元素', node.nodeName)
      } else if (isInterpolation(node)) {
        this.compileText(node)
      }

      // 递归子元素
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  compileText(node) {
    const originText = node.textContent
    const textContent = originText.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      // 监听修改
      new Watcher(this.$vm, key, () => this.textUpdater(node, originText))
      return this.$vm[key.trim()]
    })
    this.textUpdater(node, originText, textContent)
  }

  // 更新函数
  textUpdater(node, originText, textContent) {
    console.log('textUpdater', node.textContent, this.$vm.a)
    // 更新文本
    node.textContent = textContent || originText.replace(/\{\{(.*?)\}\}/g, (_, key) => this.$vm[key.trim()])
  }

}
