<template>
  <div class="login">
    <h1>Login</h1>
    <div v-if="loginMessage" class="login-message">{{ loginMessage }}</div>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          :type="passwordProxy.isDataMasked() ? 'password' : 'text'"
          id="password"
          v-model="passwordProxy.realData"
          required
        />
        <button type="button" @click="togglePasswordVisibility">
          {{ passwordProxy.isDataMasked() ? "Show Password" : "Hide Password" }}
        </button>
      </div>
      <button type="submit">Login</button>
    </form>

    <!-- Add security questions setup here if needed -->
    <div>
      Forgot your password? <router-link to="/reset">Reset it here</router-link>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import SessionManager from "../SessionManager"
import SensitiveDataProxy from "../SensitiveDataProxy"

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      passwordProxy: new SensitiveDataProxy(""),
      loginMessage: "",
    }
  },
  created() {
    const sessionManager = SessionManager.getInstance()
    sessionManager.checkLoginStatus()

    if (sessionManager.isLoggedIn) {
      this.$router.push("/vault")
    } else {
      const queryMessage = this.$route.query.message
      if (queryMessage) {
        this.loginMessage = decodeURIComponent(queryMessage)
      }
    }
  },
  methods: {
    async login() {
      try {
        const q = query(
          collection(db, "Users"),
          where("email", "==", this.email)
        )
        const querySnapshot = await getDocs(q)

        let userExists = false

        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          if (userData.password === this.passwordProxy.realData) {
            userExists = true
            const sessionManager = SessionManager.getInstance()

            // Generate a session token and use SessionManager to log in
            const sessionToken = btoa(new Date().getTime().toString())
            sessionManager.logIn(this.email, sessionToken)

            this.$router.push("/vault")
          }
        })

        if (!userExists) {
          this.loginMessage = "Invalid login credentials."
        }
      } catch (error) {
        console.error("Login error:", error.message)
      }
    },
    togglePasswordVisibility() {
      this.passwordProxy.toggleMask()
    },
  },
  watch: {
    password(newVal) {
      this.passwordProxy.setData(newVal)
    },
  },
}
</script>

<style>
/* Add CSS styling as needed */
</style>
