// Abstract Handler
export class SecurityQuestionHandler {
  constructor(nextHandler = null) {
    this.nextHandler = nextHandler
    this.question = "" // Initialize with an empty question
  }

  handleRequest(userInput, userData) {
    if (this.validate(userInput, userData)) {
      if (this.nextHandler) {
        return this.nextHandler.handleRequest(userInput, userData)
      }
      return true
    }
    return false
  }

  validate(userInput, userData) {
    throw new Error("Validate method should be implemented")
  }
}

// Concrete Handlers
export class TeacherNameHandler extends SecurityQuestionHandler {
  constructor(nextHandler = null) {
    super(nextHandler)
    this.question = "What's your third-grade teacher's name?"
  }

  validate(userInput, userData) {
    return userData.securityQuestions[0].answer === userInput[0]
  }
}

export class FirstPetNameHandler extends SecurityQuestionHandler {
  constructor(nextHandler = null) {
    super(nextHandler)
    this.question = "What was the name of your first pet?"
  }

  validate(userInput, userData) {
    return userData.securityQuestions[1].answer === userInput[1]
  }
}

export class ChildhoodNicknameHandler extends SecurityQuestionHandler {
  constructor(nextHandler = null) {
    super(nextHandler)
    this.question = "What was your childhood nickname?"
  }

  validate(userInput, userData) {
    return userData.securityQuestions[2].answer === userInput[2]
  }
}
