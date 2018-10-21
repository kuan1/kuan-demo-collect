import './uploadExcel.scss'
import xlsx from '../xlsx'
import loading from '../loading'

class UploadExcel {
  constructor(callback) {
    this.callback = callback
    this.container = ''
    this.init()
  }

  init() {
    let container = document.getElementById('upload-container')
    let fileInput = document.getElementById('upload-input')
    if (!container) {
      container = document.createElement('div')
      container.innerHTML = '请将文件拖拽到此处'
      container.id = 'upload-container'
      fileInput = document.createElement('input')
      fileInput.id = 'upload-input'
      fileInput.type = 'file'
      fileInput.style.display = 'none'
      container.appendChild(fileInput)
      document.body.appendChild(container)
    }
    container.style.display = 'flex'
    this.container = container
    this.fileInput = fileInput
    this.initEvent()
  }

  initEvent() {
    this.container.ondragover = (e) => {
      e.preventDefault()
    }
    this.container.ondrop = (e) => {
      e.preventDefault(e)
      this.onUpload(e)
    }
    this.container.onclick = () => {
      this.fileInput.click()
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none'
    }
  }

  async onUpload(e) {
    const [file] = e.dataTransfer.files
    loading.show('正在获取获取excel内容', 1000000)
    if (!file) {
      alert('请上传文件')
      return
    }
    try {
      console.log('获取到文件', file)
      const data = await xlsx.excelToJSON(file)
      if (this.callback) this.callback(data)
    } catch (e) {
      alert('获取excel内容失败:' + e.message)
    }
    loading.hide()
  }
}

export default UploadExcel
