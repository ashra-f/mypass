<template>
  <div class="modal">
    <form @submit.prevent="submitForm">
      <input v-model="cardNumber" placeholder="Card Number" required />
      <input v-model="cvv" placeholder="CVV" required />
      <button type="submit">Add</button>
      <button @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardNumber: "",
      cvv: "",
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
