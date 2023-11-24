<template>
  <div class="modal">
    <form @submit.prevent="submitForm">
      <input v-model="name" placeholder="Name" required />
      <input v-model="ssn" placeholder="Social Security Number" required />
      <input v-model="licenseNumber" placeholder="License Number" required />
      <input v-model="passportNumber" placeholder="Passport Number" required />
      <input v-model="email" placeholder="Email" required />
      <input v-model="phone" placeholder="Phone Number" required />
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
      name: "",
      ssn: "",
      licenseNumber: "",
      passportNumber: "",
      email: "",
      phone: "",
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
      addDoc(collection(db, "Identities"), {
        name: this.name,
        ssn: this.ssn,
        licenseNumber: this.licenseNumber,
        passportNumber: this.passportNumber,
        email: this.email,
        phone: this.phone,
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
