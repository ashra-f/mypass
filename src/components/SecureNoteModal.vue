<template>
  <div class="modal">
    <h2>Add Secure Note</h2>
    <form @submit.prevent="submitForm">
      <input v-model="title" placeholder="Note Title" required />
      <textarea
        v-model="content"
        placeholder="Note Content"
        required
      ></textarea>
      <button type="submit">Add</button>
      <button @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      content: "",
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
