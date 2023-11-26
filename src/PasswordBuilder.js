export default class PasswordBuilder {
  constructor() {
    this.length = 12
    this.includeNumbersFlag = true
    this.includeUpperCaseFlag = true
    this.includeLowerCaseFlag = true
    this.includeSpecialCharsFlag = true
  }

  setLength(length) {
    this.length = Math.max(8, length)
    return this
  }

  includeNumbers(include = true) {
    this.includeNumbersFlag = include
    return this
  }

  includeUpperCaseLetters(include = true) {
    this.includeUpperCaseFlag = include
    return this
  }

  includeLowerCaseLetters(include = true) {
    this.includeLowerCaseFlag = include
    return this
  }

  includeSpecialCharacters(include = true) {
    this.includeSpecialCharsFlag = include
    return this
  }

  build() {
    let charset = ""
    let password = ""

    // Function to add a random character from a string to the password
    const addRandomChar = (chars) => {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Add at least one of each type of character if they are included
    if (this.includeLowerCaseFlag) {
      addRandomChar("abcdefghijklmnopqrstuvwxyz")
      charset += "abcdefghijklmnopqrstuvwxyz"
    }
    if (this.includeUpperCaseFlag) {
      addRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
      charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }
    if (this.includeNumbersFlag) {
      addRandomChar("0123456789")
      charset += "0123456789"
    }
    if (this.includeSpecialCharsFlag) {
      addRandomChar('!@#$%^&*()_+{}:"<>?|[];,./`~')
      charset += '!@#$%^&*()_+{}:"<>?|[];,./`~'
    }

    // Fill the rest of the password length with random characters
    for (let i = password.length; i < this.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    return password
  }
}
