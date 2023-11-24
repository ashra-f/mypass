<template>
  <div id="vault">
    <aside class="sidebar">
      <div class="types">
        <h3>TYPES</h3>
        <div
          class="item"
          :class="{ active: selectedType === 'Logins' }"
          @click="selectType('Logins')"
        >
          Logins
        </div>
        <div
          class="item"
          :class="{ active: selectedType === 'Cards' }"
          @click="selectType('Cards')"
        >
          Cards
        </div>
        <div
          class="item"
          :class="{ active: selectedType === 'Identities' }"
          @click="selectType('Identities')"
        >
          Identities
        </div>
        <div
          class="item"
          :class="{ active: selectedType === 'Notes' }"
          @click="selectType('Notes')"
        >
          Secure Notes
        </div>
      </div>
    </aside>
    <main class="content">
      <div class="content-header">
        <button @click="addItem">+ Add {{ selectedType }}</button>
      </div>
      <div class="vault-items">
        <div v-if="selectedType === 'Logins'">
          <h2>Login Items</h2>
          <ul v-if="loginItems.length">
            <li v-for="item in loginItems" :key="item.username">
              Username: {{ item.username }}, URL: {{ item.url }}
            </li>
          </ul>
          <div v-else>No login items found.</div>
        </div>
        <div v-if="selectedType === 'Cards'">
          <h2>Card Items</h2>
          <ul v-if="cardItems.length">
            <li v-for="item in cardItems" :key="item.id">
              Card Number: {{ item.cardNumber }}, CVV: {{ item.cvv }},
            </li>
          </ul>
          <div v-else>You have no Card items.</div>
        </div>
        <div v-if="selectedType === 'Identities'">
          <h2>Identity Items</h2>
          <ul v-if="identityItems.length">
            <li v-for="item in identityItems" :key="item.id">
              Email: {{ item.email }}, name: {{ item.name }}, License Number:
              {{ item.licenseNumber }}, Passport Number:
              {{ item.passportNumber }}, Phone: {{ item.phone }}, SSN:
              {{ item.ssn }},
            </li>
          </ul>
          <div v-else>You have no Identity items.</div>
        </div>
        <div v-if="selectedType === 'Notes'">
          <h2>Secure Notes</h2>
          <ul v-if="secureNotes.length">
            <li v-for="note in secureNotes" :key="note.id">
              Title: {{ note.title }}, Content: {{ note.content }},
            </li>
          </ul>
          <div v-else>You have no Secure Notes.</div>
        </div>
      </div>
    </main>

    <DynamicModal :show="showModal" :title="modalTitle" @close="closeModal">
      <component
        :is="currentFormComponent"
        @formSubmitted="handleFormSubmitted"
      />
    </DynamicModal>
  </div>
</template>

<script>
import DynamicModal from "./DynamicModal.vue"
import AddLoginItemForm from "./AddLoginItemForm.vue"
import AddCardItemForm from "./AddCardItemForm.vue"
import AddSecureNoteForm from "./AddSecureNoteForm.vue"
import AddIdentityItemForm from "./AddIdentityItemForm.vue"
import Cookies from "js-cookie"
import { db } from "@/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"

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
      selectedType: "Logins", // Ensure this matches the Firestore collection names
      showModal: false,
      userRef: null, // Store the user reference here
      loginItems: [],
      cardItems: [],
      identityItems: [],
      secureNotes: [],
    }
  },
  watch: {
    selectedType() {
      this.fetchItems()
    },
  },
  computed: {
    currentFormComponent() {
      switch (this.selectedType) {
        case "Logins":
          return AddLoginItemForm
        case "Cards":
          return AddCardItemForm
        case "Notes":
          return AddSecureNoteForm
        case "Identities":
          return AddIdentityItemForm
        default:
          return null
      }
    },
    currentItems: {
      get() {
        switch (this.selectedType) {
          case "Logins":
            return this.loginItems
          case "Cards":
            return this.cardItems
          case "Identities":
            return this.identityItems
          case "Notes":
            return this.secureNotes
          default:
            return []
        }
      },
      set(newValue) {
        switch (this.selectedType) {
          case "Logins":
            this.loginItems = newValue
            break
          case "Cards":
            this.cardItems = newValue
            break
          case "Identities":
            this.identityItems = newValue
            break
          case "Notes":
            this.secureNotes = newValue
            break
        }
      },
    },
  },
  methods: {
    handleFormSubmitted() {
      this.closeModal()
      this.fetchItems()
    },
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
    async fetchItems() {
      if (!this.userRef) {
        await this.getUserRef()
        if (!this.userRef) return
      }

      try {
        const itemsRef = collection(db, this.selectedType)
        const itemsQuery = query(itemsRef, where("userRef", "==", this.userRef))
        const itemsSnapshot = await getDocs(itemsQuery)

        this.currentItems = itemsSnapshot.docs.map((doc) => doc.data())
      } catch (error) {
        console.error("Error fetching items:", error)
      }
    },
  },
  created() {
    this.fetchItems()
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
