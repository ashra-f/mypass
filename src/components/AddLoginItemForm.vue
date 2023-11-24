<template>
  <div class="modal">
    <form @submit.prevent="submitForm">
      <input v-model="username" placeholder="Username" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <input v-model="url" placeholder="URL" required />
      <button type="submit">Add</button>
      <button @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase/config"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import Cookies from "js-cookie"

export default {
  data() {
    return {
      username: "",
      password: "",
      url: "",
      userRef: null,
    }
  },
  created() {
    this.getUserRef()
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
            this.userRef = querySnapshot.docs[0].id // Assuming email is unique and gets one document
          } else {
            console.log("No user found with that email")
          }
        } catch (error) {
          console.log("Error getting user:", error)
        }
      }
    },
    submitForm() {
      // Add data to Firestore
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
  },
}
</script>

<!-- Add styles for modal -->
