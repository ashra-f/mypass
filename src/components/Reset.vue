<template>
  <div class="reset">
    <h1>Reset Password</h1>

    <div class="error-message" style="color: red" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <!-- Step 1: Request Email -->
    <form v-if="!emailSubmitted" @submit.prevent="submitEmail">
      <div>
        <label for="email">Enter your email:</label>
        <input type="email" id="email" v-model="userEmail" required />
      </div>
      <button type="submit">Submit</button>
    </form>

    <!-- Step 2: Answer Security Questions -->
    <form
      v-if="emailSubmitted && !showPasswordReset"
      @submit.prevent="validateSecurityQuestions"
    >
      <div v-for="(question, index) in securityQuestions" :key="index">
        <label :for="'question' + index">{{ question }}</label>
        <input
          :id="'question' + index"
          type="text"
          v-model="answers[index]"
          required
        />
      </div>
      <button type="submit">Validate Questions</button>
    </form>

    <!-- Step 3: Reset Password -->
    <form v-if="showPasswordReset" @submit.prevent="resetPassword">
      <div>
        <label for="newPassword">New Password:</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="newPassword"
          v-model="newPassword"
          @input="updatePasswordStrength"
          required
        />
        <button @click="togglePasswordVisibility('newPassword')">
          Show Password
        </button>
        <!-- Show Password Button -->
        <div class="password-feedback warning">
          {{ passwordStrengthFeedback }}
        </div>
      </div>
      <div>
        <label for="repeatNewPassword">Repeat New Password:</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          id="repeatNewPassword"
          v-model="repeatNewPassword"
          required
        />
        <button @click="togglePasswordVisibility('repeatNewPassword')">
          Show Password
        </button>
        <!-- Show Password Button -->
      </div>
      <button type="submit">Reset Password</button>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase/config"
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore"
import SessionManager from "../SessionManager"
import {
  TeacherNameHandler,
  FirstPetNameHandler,
  ChildhoodNicknameHandler,
} from "../SecurityQuestionHandler"
import PasswordStrengthObserver from "../PasswordStrengthObserver"

export default {
  name: "Reset",
  data() {
    return {
      userEmail: "",
      emailSubmitted: false,
      handlerChain: new TeacherNameHandler(
        new FirstPetNameHandler(new ChildhoodNicknameHandler())
      ),
      securityQuestions: [],
      answers: ["", "", ""],
      showPasswordReset: false,
      newPassword: "",
      repeatNewPassword: "",
      userDocId: null,
      passwordObserver: new PasswordStrengthObserver(),
      passwordStrengthFeedback: "",
      showPassword: false,
      errorMessage: "",
    }
  },
  methods: {
    submitEmail() {
      this.emailSubmitted = true
    },
    async validateSecurityQuestions() {
      try {
        const q = query(
          collection(db, "Users"),
          where("email", "==", this.userEmail)
        )
        const querySnapshot = await getDocs(q)

        let userDoc = null

        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          if (this.handlerChain.handleRequest(this.answers, userData)) {
            userDoc = doc
          }
        })

        if (userDoc) {
          this.userDocId = userDoc.id
          this.errorMessage = ""
          this.showPasswordReset = true
        } else {
          this.errorMessage = "Security questions not answered correctly."
        }
      } catch (error) {
        console.error("Error validating security questions:", error.message)
      }
    },
    async resetPassword() {
      if (this.newPassword === this.repeatNewPassword) {
        try {
          await updateDoc(doc(db, "Users", this.userDocId), {
            password: this.newPassword,
          })

          console.log("Password successfully reset")
          this.$router.push("/login")
        } catch (error) {
          console.error("Error resetting password:", error.message)
        }
      } else {
        this.errorMessage = "Passwords do not match."
      }
    },
    generateSecurityQuestions() {
      let handler = this.handlerChain
      while (handler) {
        this.securityQuestions.push(handler.question)
        handler = handler.nextHandler
      }
    },
    updatePasswordStrength() {
      this.passwordObserver.notify(this.newPassword)
    },
    togglePasswordVisibility(fieldId) {
      const field = document.getElementById(fieldId)
      if (field) {
        field.type = this.showPassword ? "password" : "text"
      }
    },
  },
  created() {
    this.generateSecurityQuestions()
    const sessionManager = SessionManager.getInstance()
    sessionManager.checkLoginStatus()

    if (sessionManager.isLoggedIn) {
      this.$router.push("/vault")
    }

    this.passwordObserver.subscribe((feedback) => {
      this.passwordStrengthFeedback = feedback
    })
  },
}
</script>

<style>
.warning {
  color: #fcac34;
  padding-bottom: 1rem;
  font-size: 0.9em;
  font-weight: bold;
}
</style>
