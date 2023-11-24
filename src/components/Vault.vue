<template>
  <div id="vault">
    <aside class="sidebar">
      <div class="types">
        <h3>TYPES</h3>
        <div
          class="item"
          :class="{ active: selectedType === 'Login' }"
          @click="selectType('Login')"
        >
          Login
        </div>
        <div
          class="item"
          :class="{ active: selectedType === 'Card' }"
          @click="selectType('Card')"
        >
          Card
        </div>
        <div
          class="item"
          :class="{ active: selectedType === 'Identity' }"
          @click="selectType('Identity')"
        >
          Identity
        </div>
        <div
          class="item"
          :class="{ active: selectedType === 'Secure Note' }"
          @click="selectType('Secure Note')"
        >
          Secure Note
        </div>
      </div>
    </aside>
    <main class="content">
      <div class="content-header">
        <button @click="addItem">+ Add Item</button>
      </div>
      <div class="vault-items">
        <div v-if="selectedType === 'Login'">
          <h2>Login Items</h2>
          <ul v-if="loginItems.length">
            <li v-for="item in loginItems" :key="item.id">
              {{ item.name }} - {{ item.details }}
            </li>
          </ul>
          <div v-else>You have no Login items.</div>
        </div>
        <div v-if="selectedType === 'Card'">
          <h2>Card Items</h2>
          <ul v-if="cardItems.length">
            <li v-for="item in cardItems" :key="item.id">
              {{ item.name }} - {{ item.details }}
            </li>
          </ul>
          <div v-else>You have no Card items.</div>
        </div>
        <div v-if="selectedType === 'Identity'">
          <h2>Identity Items</h2>
          <ul v-if="identityItems.length">
            <li v-for="item in identityItems" :key="item.id">
              {{ item.name }} - {{ item.details }}
            </li>
          </ul>
          <div v-else>You have no Identity items.</div>
        </div>
        <div v-if="selectedType === 'Secure Note'">
          <h2>Secure Notes</h2>
          <ul v-if="secureNotes.length">
            <li v-for="note in secureNotes" :key="note.id">
              {{ note.title }} - {{ note.content }}
            </li>
          </ul>
          <div v-else>You have no Secure Notes.</div>
        </div>
      </div>
    </main>

    <DynamicModal :show="showModal" :title="modalTitle" @close="closeModal">
      <component :is="currentFormComponent" />
    </DynamicModal>
  </div>
</template>

<script>
import DynamicModal from "./DynamicModal.vue"
import AddLoginItemForm from "./AddLoginItemForm.vue"
import AddCardItemForm from "./AddCardItemForm.vue"
import AddSecureNoteForm from "./AddSecureNoteForm.vue"
import AddIdentityItemForm from "./AddIdentityItemForm.vue"

export default {
  name: "Vault",
  components: {
    DynamicModal,
    AddLoginItemForm,
    AddCardItemForm,
    AddSecureNoteForm,
    AddIdentityItemForm,
  },
  data() {
    return {
      selectedType: "Login",
      showModal: false,
      modalType: null,
      loginItems: [], // This should be populated with data from your database
      cardItems: [], // This should be populated with data from your database
      identityItems: [], // This should be populated with data from your database
      secureNotes: [], // This should be populated with data from your database
    }
  },
  computed: {
    currentFormComponent() {
      switch (this.selectedType) {
        case "Login":
          return AddLoginItemForm
        case "Card":
          return AddCardItemForm
        case "Secure Note":
          return AddSecureNoteForm
        case "Identity":
          return AddIdentityItemForm
        default:
          return null
      }
    },
  },
  methods: {
    selectType(type) {
      this.selectedType = type
    },
    addItem() {
      this.openModal("Add New " + this.selectedType)
    },
    openModal(title) {
      this.showModal = true
      this.modalTitle = title
    },
    closeModal() {
      this.showModal = false
    },
  },
  // In a real application, you'd fetch the items from your backend in the created or mounted lifecycle hooks
  created() {
    // Fetch items for each type and populate the corresponding arrays
  },
}
</script>

<style scoped>
/* Add CSS styling here */
#vault {
  display: flex;
}
.sidebar {
  width: 250px;
  /* Styling for the sidebar */
}

.item {
  cursor: pointer;
}

.item.active {
  font-weight: bold;
  color: orange;
}

.item:hover {
  color: rgb(207, 135, 1);
}

.content {
  flex-grow: 1;
  /* Styling for the content area */
}
</style>
