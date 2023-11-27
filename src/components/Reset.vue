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
          :type="newPasswordProxy.isDataMasked() ? 'password' : 'text'"
          id="newPassword"
          v-model.lazy="newPassword"
          required
        />
      </div>
      <div>
        <label for="repeatNewPassword">Repeat New Password:</label>
        <input
          :type="repeatNewPasswordProxy.isDataMasked() ? 'password' : 'text'"
          id="repeatNewPassword"
          v-model.lazy="repeatNewPassword"
          required
        />
      </div>
      <button type="button" @click="togglePasswordVisibility">
        {{
          newPasswordProxy.isDataMasked() ? "Show Password" : "Hide Password"
        }}
      </button>
      <button type="button" @click="generatePassword">
        Generate Strong Password
      </button>
      <div class="password-feedback warning">
        {{ passwordStrengthFeedback }}
      </div>
      <button type="submit" class="reset-submission-btn">Reset Password</button>
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
import PasswordStrengthSubject from "../PasswordStrengthSubject"
import PasswordBuilder from "../PasswordBuilder"
import SensitiveDataProxy from "@/SensitiveDataProxy"

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
      passwordObserver: new PasswordStrengthSubject(),
      passwordStrengthFeedback: "",
      newPasswordProxy: new SensitiveDataProxy(""),
      repeatNewPasswordProxy: new SensitiveDataProxy(""),
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
    togglePasswordVisibility() {
      this.newPasswordProxy.toggleMask()
      this.repeatNewPasswordProxy.toggleMask()
    },
    generatePassword() {
      const builder = new PasswordBuilder()
        .setLength(12)
        .includeNumbers(true)
        .includeUpperCaseLetters(true)
        .includeLowerCaseLetters(true)
        .includeSpecialCharacters(true)

      this.newPassword = this.repeatNewPassword = builder.build()
      this.updatePasswordStrength()
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
  watch: {
    newPassword(newVal) {
      this.newPasswordProxy.setData(newVal)
      this.updatePasswordStrength()
    },
    repeatNewPassword(newVal) {
      this.repeatNewPasswordProxy.setData(newVal)
    },
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

.reset-submission-btn {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #fcac34;
  color: #fff;
  font-weight: bold;
  font-size: 1.1em;
  border: none;
  cursor: pointer;
}

.reset-submission-btn:hover {
  background-color: #fcbf6b;
}
</style>
