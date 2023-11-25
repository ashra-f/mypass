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
        <input type="password" id="password" v-model="password" required />
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

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      loginMessage: "", // Add a data property for the login message
    }
  },
  created() {
    if (this.sessionTokenExists()) {
      this.$router.push("/vault")
    } else {
      // Check for a message in the URL
      const queryMessage = this.$route.query.message
      if (queryMessage) {
        this.loginMessage = decodeURIComponent(queryMessage)
      }
    }
  },
  methods: {
    async login() {
      try {
        // Query Firestore for user data
        const q = query(
          collection(db, "Users"),
          where("email", "==", this.email)
        )
        const querySnapshot = await getDocs(q)

        let userExists = false

        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          if (userData.password === this.password) {
            userExists = true
            // Generate a session token
            const sessionToken = btoa(new Date().getTime().toString())

            // Set session token as a cookie
            this.setCookie("sessionToken", sessionToken, 1) // Expires in 1 day
            this.setCookie("email", this.email, 1) // Expires in 1 day

            // Redirect to vault
            this.$router.push("/vault")
          }
        })

        if (!userExists) {
          console.error("Invalid login credentials.")
        }
      } catch (error) {
        console.error("Login error:", error.message)
      }
    },
    sessionTokenExists() {
      return document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("sessionToken="))
    },
    setCookie(name, value, days) {
      let expires = ""
      if (days) {
        let date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = "; expires=" + date.toUTCString()
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/"
    },
  },
}
</script>

<style>
/* Add CSS styling as needed */
</style>
