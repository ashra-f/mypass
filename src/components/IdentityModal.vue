<template>
  <div class="modal">
    <h2>Add Identity Item</h2>
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
export default {
  data() {
    return {
      name: "",
      ssn: "",
      licenseNumber: "",
      passportNumber: "",
      email: "",
      phone: "",
    }
  },
  methods: {
    submitForm() {
      // Handle form submission
      this.$emit("close")
    },
  },
}
</script>

<!-- Add styles for modal -->
