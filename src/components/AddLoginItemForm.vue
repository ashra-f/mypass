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
export default {
  data() {
    return {
      username: "",
      password: "",
      url: "",
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
