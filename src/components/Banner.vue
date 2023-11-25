<template>
  <header class="app-banner">
    <button class="app-name" @click="goHome">MyPass</button>
    <nav class="navigation">
      <template v-if="isLoggedIn">
        <button @click="logout">Logout</button>
      </template>
      <template v-else>
        <button @click="goToLogin">Login</button>
        <button @click="goToJoin">Join</button>
      </template>
    </nav>
  </header>
</template>

<script>
import Cookies from "js-cookie"

export default {
  name: "Banner",
  data() {
    return {
      isUserLoggedIn: false,
    }
  },
  computed: {
    isLoggedIn() {
      return this.isUserLoggedIn
    },
  },
  methods: {
    checkLoginStatus() {
      this.isUserLoggedIn = !!Cookies.get("sessionToken")
    },
    goHome() {
      this.$router.push("/")
    },
    goToLogin() {
      this.$router.push("/login")
    },
    goToJoin() {
      this.$router.push("/join")
    },
    logout() {
      Cookies.remove("sessionToken")
      Cookies.remove("email")
      this.checkLoginStatus() // Manually update the login state
      this.$router.push("/login")
    },
  },
  created() {
    this.checkLoginStatus()
  },
  watch: {
    // You can use a watcher to periodically check the cookie's state.
    // This can be a workaround for external changes (like cookies) that Vue can't detect automatically.
    $route: function () {
      this.checkLoginStatus()
    },
  },
}
</script>

<style scoped>
.app-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
  color: #fff;
}

.app-name {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin: 0;
  font-size: 3rem;
}

.navigation button {
  margin-left: 10px;
  padding: 10px 15px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.navigation button:hover {
  background-color: darkorange;
}
</style>
