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
          :type="passwordProxy.isDataMasked() ? 'password' : 'text'"
          id="password"
          v-model="password"
          required
        />
        <button type="button" @click="togglePasswordVisibility">
          {{ passwordProxy.isDataMasked() ? "Show" : "Hide" }}
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
import PasswordStrengthSubject from "../PasswordStrengthSubject"
import {
  TeacherNameHandler,
  FirstPetNameHandler,
  ChildhoodNicknameHandler,
} from "../SecurityQuestionHandler"
import PasswordBuilder from "../PasswordBuilder"
import SensitiveDataProxy from "@/SensitiveDataProxy"

export default {
  name: "Join",
  data() {
    return {
      email: "",
      password: "",
      securityQuestionHandlers: [
        new TeacherNameHandler(),
        new FirstPetNameHandler(),
        new ChildhoodNicknameHandler(),
      ],
      securityQuestions: [],
      answers: ["", "", ""],

      passwordWarning: "",
      PasswordStrengthSubject: null,
      passwordProxy: new SensitiveDataProxy(""),
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
    this.PasswordStrengthSubject = new PasswordStrengthSubject()
    this.PasswordStrengthSubject.subscribe(this.updatePasswordWarning)
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
      const builder = new PasswordBuilder()
        .setLength(12)
        .includeNumbers(true)
        .includeUpperCaseLetters(true)
        .includeLowerCaseLetters(true)
        .includeSpecialCharacters(true)

      let newPassword = builder.build()
      this.PasswordStrengthSubject.notify(newPassword)

      // You can add additional logic here to handle the case if the password is still considered weak.
      this.password = newPassword
    },
    togglePasswordVisibility() {
      this.passwordProxy.toggleMask()
    },
    updatePasswordWarning(message) {
      this.passwordWarning = message
    },
  },
  watch: {
    password(newVal) {
      this.PasswordStrengthSubject.notify(newVal)
      this.passwordProxy.setData(newVal)
    },
  },
}
</script>

<style>
.password-warning {
  color: rgb(247, 176, 69);
  font-weight: bold;
}
/* Add more CSS styling as needed */
</style>
