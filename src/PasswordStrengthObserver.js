export default class PasswordStrengthObserver {
  constructor() {
    this.subscribers = []
  }

  subscribe(fn) {
    this.subscribers.push(fn)
  }

  notify(password) {
    for (const fn of this.subscribers) {
      fn(this.evaluatePasswordStrength(password))
    }
  }

  evaluatePasswordStrength(password) {
    const hasNumbers = /\d/.test(password)
    const hasMixedCase =
      password !== password.toLowerCase() && password !== password.toUpperCase()
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (
      password.length < 8 ||
      !hasNumbers ||
      !hasMixedCase ||
      !hasSpecialChars
    ) {
      return "Weak password: should be at least 8 characters long and include numbers, mixed case letters, and special characters."
    }
    return ""
  }
}
