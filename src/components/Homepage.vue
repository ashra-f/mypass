<template>
  <div class="homepage">
    <h1>Welcome to Our Secure Vault</h1>
    <p>Store and manage your sensitive data with confidence.</p>
    <button @click="goToLogin">Login</button>
    <button @click="goToJoin">Join</button>
  </div>
</template>

<script>
import SessionManager from "../SessionManager"

export default {
  name: "Homepage",
  methods: {
    goToLogin() {
      this.$router.push("/login")
    },
    goToJoin() {
      this.$router.push("/join")
    },
  },
  created() {
    const sessionManager = SessionManager.getInstance()
    sessionManager.checkLoginStatus()

    if (sessionManager.isLoggedIn) {
      this.$router.push("/vault")
    }
  },
}
</script>

<style>
.homepage {
  text-align: center;
  margin-top: 50px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
