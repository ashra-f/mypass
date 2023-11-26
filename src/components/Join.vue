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
        <div v-if="passwordWarning" class="password-warning">
          {{ passwordWarning }}
        </div>
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
import { db } from "@/firebase/config"
import { collection, addDoc } from "firebase/firestore"
import SessionManager from "../SessionManager"
import PasswordStrengthObserver from "../PasswordStrengthObserver"
import {
  TeacherNameHandler,
  FirstPetNameHandler,
  ChildhoodNicknameHandler,
} from "../SecurityQuestionHandler"

export default {
  name: "Join",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      securityQuestionHandlers: [
        new TeacherNameHandler(),
        new FirstPetNameHandler(),
        new ChildhoodNicknameHandler(),
      ],
      securityQuestions: [],
      answers: ["", "", ""],

      passwordWarning: "",
      passwordStrengthObserver: null,
    }
  },
  created() {
    const sessionManager = SessionManager.getInstance()
    sessionManager.checkLoginStatus()

    if (sessionManager.isLoggedIn) {
      this.$router.push("/vault")
    }

    this.securityQuestions = this.securityQuestionHandlers.map(
      (handler) => handler.question
    )
    this.passwordStrengthObserver = new PasswordStrengthObserver()
    this.passwordStrengthObserver.subscribe(this.updatePasswordWarning)
  },
  methods: {
    async register() {
      try {
        await addDoc(collection(db, "Users"), {
          email: this.email,
          password: this.password,
          securityQuestions: this.securityQuestions.map((question, index) => ({
            question: question,
            answer: this.answers[index],
          })),
        })

        const sessionManager = SessionManager.getInstance()
        const sessionToken = btoa(new Date().getTime().toString())
        sessionManager.logIn(this.email, sessionToken)

        this.$router.push("/vault")
      } catch (error) {
        console.error("Registration error:", error.message)
      }
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
    updatePasswordWarning(message) {
      this.passwordWarning = message
    },
  },
  watch: {
    password() {
      this.passwordStrengthObserver.notify(this.password)
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
