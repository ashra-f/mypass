class PasswordBuilder {
  constructor() {
    this.length = 12
    this.includeNumbers = true
    this.includeUpperCase = true
    this.includeLowerCase = true
    this.includeSpecialChars = true
  }

  setLength(length) {
    this.length = Math.max(8, length)
    return this
  }

  includeNumbers(include = true) {
    this.includeNumbers = include
    return this
  }

  includeUpperCaseLetters(include = true) {
    this.includeUpperCase = include
    return this
  }

  includeLowerCaseLetters(include = true) {
    this.includeLowerCase = include
    return this
  }

  includeSpecialCharacters(include = true) {
    this.includeSpecialChars = include
    return this
  }

  build() {
    let charset = ""
    if (this.includeLowerCase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (this.includeUpperCase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (this.includeNumbers) charset += "0123456789"
    if (this.includeSpecialChars) charset += '!@#$%^&*()_+{}:"<>?|[];,./`~'

    let password = ""
    for (let i = 0; i < this.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }
}
