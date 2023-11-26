import Cookies from "js-cookie"

class SessionManager {
  static getInstance() {
    if (!this.instance) {
      this.instance = new SessionManager()
    }
    return this.instance
  }

  constructor() {
    if (SessionManager.instance) {
      throw new Error("Use SessionManager.getInstance()")
    }

    this.isLoggedIn = false
  }

  checkLoginStatus() {
    this.isLoggedIn = !!Cookies.get("sessionToken")
  }

  logIn(email, sessionToken) {
    Cookies.set("sessionToken", sessionToken, { expires: 1 }) // Expires in 1 day
    Cookies.set("email", email, { expires: 1 }) // Expires in 1 day
    this.checkLoginStatus()
  }

  logOut() {
    Cookies.remove("sessionToken")
    Cookies.remove("email")
    this.checkLoginStatus()
  }
}

export default SessionManager
