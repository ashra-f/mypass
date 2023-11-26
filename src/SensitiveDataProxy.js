export default class SensitiveDataProxy {
  constructor(realData) {
    this.realData = realData
    this.maskedData = "••••••"
    this.isMasked = true
  }

  toggleMask() {
    this.isMasked = !this.isMasked
  }

  getData() {
    if (this.realData === "") {
      return ""
    }
    return this.isMasked ? this.maskedData : this.realData
  }

  isDataMasked() {
    return this.isMasked
  }

  setData(newData) {
    this.realData = newData
  }
}
