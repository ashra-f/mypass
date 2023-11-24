<template>
  <div class="login">
    <h1>Login</h1>
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
            // Password matches
            userExists = true
            // Set up session (rudimentary example)
            sessionStorage.setItem(
              "user",
              JSON.stringify({ email: this.email, uid: doc.id })
            )
            // Redirect to vault
            this.$router.push("/vault")
          }
        })

        if (!userExists) {
          // Handle login failure
          console.error("Invalid login credentials.")
          // Update UI with error message
        }
      } catch (error) {
        console.error("Login error:", error.message)
        // Handle database errors
        // Update UI with error message
      }
    },
  },
}
</script>

<style>
/* Add CSS styling as needed */
</style>
