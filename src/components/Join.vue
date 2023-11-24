<template>
  <div class="join">
    <h1>Join Us</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          required
        />
        <button type="button" @click="togglePasswordVisibility">
          {{ showPassword ? "Hide" : "Show" }}
        </button>
        <button type="button" @click="generatePassword">
          Generate Password
        </button>
        <span v-if="passwordWarning" class="password-warning">{{
          passwordWarning
        }}</span>
      </div>
      <div v-for="(question, index) in securityQuestions" :key="index">
        <label :for="'question' + index">{{ question }}</label>
        <input
          :id="'question' + index"
          type="text"
          v-model="answers[index]"
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Join",
  data() {
    return {
      email: "",
      password: "",
      answers: ["", "", ""],
      showPassword: false,
      securityQuestions: [
        "What's your third-grade teacher's name?",
        "What was the name of your first pet?",
        "What was your childhood nickname?",
      ],
      passwordWarning: "",
    }
  },
  methods: {
    register() {
      // Implement registration logic
      console.log("Registering:", this.email, this.password, this.answers)
    },
    generatePassword() {
      let length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = ""
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
      }
      this.password = retVal
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    checkPasswordStrength() {
      const hasNumbers = /\d/.test(this.password)
      const hasMixedCase =
        this.password !== this.password.toLowerCase() &&
        this.password !== this.password.toUpperCase()

      if (this.password.length < 8 || !hasNumbers || !hasMixedCase) {
        this.passwordWarning =
          "Weak password: should be at least 8 characters long, include both numbers and mixed case letters."
      } else {
        this.passwordWarning = ""
      }
    },
  },
  watch: {
    password(newVal) {
      this.checkPasswordStrength()
    },
  },
}
</script>

<style>
.password-warning {
  color: red;
}
/* Add more CSS styling as needed */
</style>
