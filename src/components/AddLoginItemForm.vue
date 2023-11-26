<template>
  <div class="modal">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <input
          v-model="username"
          class="form-control"
          placeholder="Username"
          required
        />
      </div>

      <div class="form-group">
        <div class="password-field">
          <input
            :type="passwordFieldType"
            v-model="password"
            class="form-control"
            placeholder="Password"
            required
            @input="checkPasswordStrength"
          />
          <button
            type="button"
            class="btn-show-password"
            @click="togglePasswordVisibility"
          >
            {{ passwordFieldType === "password" ? "Show" : "Hide" }}
          </button>
          <button
            type="button"
            class="btn-generate-password"
            @click="generatePassword"
          >
            Generate
          </button>
        </div>
        <div class="password-feedback">{{ passwordFeedback }}</div>
      </div>

      <div class="form-group">
        <input v-model="url" class="form-control" placeholder="URL" required />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Add</button>
        <button @click="$emit('close')" class="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase/config"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import Cookies from "js-cookie"
import PasswordStrengthObserver from "../PasswordStrengthObserver"
import PasswordBuilder from "../PasswordBuilder"

export default {
  data() {
    return {
      username: "",
      password: "",
      url: "",
      userRef: null,
      passwordFeedback: "",
      passwordObserver: new PasswordStrengthObserver(),
      passwordFieldType: "password",
    }
  },
  created() {
    this.getUserRef()
    this.passwordObserver.subscribe(this.updatePasswordFeedback)
  },
  methods: {
    async getUserRef() {
      const userEmail = Cookies.get("email")
      if (userEmail) {
        const usersRef = collection(db, "Users")
        const q = query(usersRef, where("email", "==", userEmail))

        try {
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            this.userRef = querySnapshot.docs[0].id
          } else {
            console.log("No user found with that email")
          }
        } catch (error) {
          console.log("Error getting user:", error)
        }
      }
    },
    submitForm() {
      addDoc(collection(db, "Logins"), {
        username: this.username,
        password: this.password,
        url: this.url,
        userRef: this.userRef,
      })
        .then(() => {
          console.log("Document successfully written!")
          this.$emit("formSubmitted")
        })
        .catch((error) => {
          console.error("Error writing document: ", error)
        })
    },
    checkPasswordStrength() {
      this.passwordObserver.notify(this.password)
    },
    updatePasswordFeedback(feedback) {
      this.passwordFeedback = feedback
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password"
    },
    generatePassword() {
      const builder = new PasswordBuilder()
        .setLength(12)
        .includeNumbers(true)
        .includeUpperCaseLetters(true)
        .includeLowerCaseLetters(true)
        .includeSpecialCharacters(true)

      this.password = builder.build()
      this.checkPasswordStrength()
    },
  },
}
</script>

<style>
.form-group {
  margin-bottom: 15px;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.password-feedback {
  color: #dc3545;
  margin-top: 0.25rem;
}

.password-field {
  display: flex;
  align-items: center;
}

.btn-show-password {
  margin-left: 10px;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  background-color: #eee;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
  justify-content: space -between;
  margin-top: 20px;
}

.btn {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
}

.modal {
  width: 500px;
  margin: 0 auto;
}

.btn-generate-password {
  margin-left: 10px;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  background-color: #eee;
  border: 1px solid #ccc;
}
</style>
