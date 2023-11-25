<template>
  <div id="vault">
    <aside class="sidebar">
      <div class="types">
        <h3>TYPES</h3>
        <div
          class="item-type"
          :class="{ active: selectedType === 'Logins' }"
          @click="selectType('Logins')"
        >
          Logins
        </div>
        <div
          class="item-type"
          :class="{ active: selectedType === 'Cards' }"
          @click="selectType('Cards')"
        >
          Cards
        </div>
        <div
          class="item-type"
          :class="{ active: selectedType === 'Identities' }"
          @click="selectType('Identities')"
        >
          Identities
        </div>
        <div
          class="item-type"
          :class="{ active: selectedType === 'Notes' }"
          @click="selectType('Notes')"
        >
          Secure Notes
        </div>
      </div>
    </aside>
    <main class="content">
      <div class="content-header">
        <h2>{{ displayTypeTitle }} Items</h2>
        <button @click="addItem">+ Add {{ displayTypeTitle }}</button>
      </div>
      <div class="vault-items">
        <div v-if="selectedType === 'Logins'">
          <div v-for="item in loginItems" :key="item.id" class="item">
            <div v-if="item.editMode">
              <!-- Editable Fields for Card -->
              <input
                :type="item.cardNumberMasked ? 'password' : 'text'"
                v-model="item.cardNumber"
              />
              <button class="btn" @click="toggleMask(item, 'cardNumber')">
                Toggle
              </button>

              <input
                :type="item.cvvMasked ? 'password' : 'text'"
                v-model="item.cvv"
              />
              <button class="btn" @click="toggleMask(item, 'cvv')">
                Toggle
              </button>

              <button class="btn" @click="saveItem(item)">Save</button>
              <button class="btn" @click="cancelEdit(item)">Cancel</button>
            </div>
            <div v-else>
              <!-- Display Mode -->
              <div class="credential">
                <span class="item-url">URL: {{ item.url }}</span>
                <button class="btn" @click="copyToClipboard(item.url)">
                  Copy
                </button>
              </div>
              <div class="credential">
                <span class="item-username"
                  >Username:
                  {{ item.usernameMasked ? "••••••" : item.username }}</span
                >
                <button class="btn" @click="toggleMask(item, 'username')">
                  Toggle
                </button>
                <button class="btn" @click="copyToClipboard(item.username)">
                  Copy
                </button>
              </div>
              <div class="credential">
                <span class="item-password"
                  >Password:
                  {{ item.passwordMasked ? "••••••" : item.password }}</span
                >
                <button class="btn" @click="toggleMask(item, 'password')">
                  Toggle
                </button>
                <button class="btn" @click="copyToClipboard(item.password)">
                  Copy
                </button>
              </div>
              <div class="item-actions">
                <button class="btn edit-btn" @click="editItem(item)">
                  Edit
                </button>
                <button class="btn delete-btn" @click="deleteItem(item)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedType === 'Cards'">
          <div v-for="item in cardItems" :key="item.id" class="item">
            <div v-if="item.editMode">
              <!-- Editable Fields for Card -->
              <input type="text" v-model="item.cardNumber" />
              <input type="text" v-model="item.cvv" />
              <button class="btn" @click="saveItem(item)">Save</button>
              <button class="btn" @click="cancelEdit(item)">Cancel</button>
            </div>
            <div v-else>
              <!-- Display Mode for Card -->
              <div class="credential">
                Card Number:
                {{ item.cardNumberMasked ? "••••••" : item.cardNumber }}
                <button class="btn" @click="toggleMask(item, 'cardNumber')">
                  Toggle
                </button>
                <button class="btn" @click="copyToClipboard(item.cardNumber)">
                  Copy
                </button>
              </div>
              <div class="credential">
                CVV: {{ item.cvvMasked ? "•••" : item.cvv }}
                <button class="btn" @click="toggleMask(item, 'cvv')">
                  Toggle
                </button>
                <button class="btn" @click="copyToClipboard(item.cvv)">
                  Copy
                </button>
              </div>
              <div class="item-actions">
                <button class="btn edit-btn" @click="editItem(item)">
                  Edit
                </button>
                <button class="btn delete-btn" @click="deleteItem(item)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedType === 'Identities'">
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
          <ul v-if="secureNotes.length">
            <li v-for="note in secureNotes" :key="note.id">
              Title: {{ note.title }}, Content: {{ note.content }},
            </li>
          </ul>
          <div v-else>You have no Secure Notes.</div>
        </div>
      </div>
    </main>

    <!-- Modal -->
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
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore"

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
    displayTypeTitle() {
      // Handling pluralization and word formation for titles
      switch (this.selectedType) {
        case "Logins":
          return "Login"
        case "Cards":
          return "Card"
        case "Identities":
          return "Identity"
        case "Notes":
          return "Secure Note"
        default:
          return ""
      }
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

        this.currentItems = itemsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          editMode: false,
          usernameMasked: true,
          passwordMasked: true,
          cardNumberMasked: true,
          cvvMasked: true,
        }))
      } catch (error) {
        console.error("Error fetching items:", error)
      }
    },
    async deleteItem(item) {
      if (
        confirm(
          `Are you sure you want to delete this ${this.selectedType
            .slice(0, -1)
            .toLowerCase()}?`
        )
      ) {
        try {
          const itemRef = doc(db, this.selectedType, item.id)
          await deleteDoc(itemRef)
          // Remove the item from the local list
          this.currentItems = this.currentItems.filter((i) => i.id !== item.id)
          alert("Item successfully deleted.")
        } catch (error) {
          console.error("Error deleting item:", error)
          alert("There was an error deleting the item.")
        }
      }
    },
    editItem(item) {
      item.editMode = true
    },
    cancelEdit(item) {
      item.editMode = false
    },
    async saveItem(item) {
      try {
        const itemRef = doc(db, this.selectedType, item.id)
        await updateDoc(itemRef, { ...item })
        item.editMode = false
        alert("Item successfully updated.")
      } catch (error) {
        console.error("Error updating item:", error)
        alert("There was an error updating the item.")
      }
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Copied to clipboard")
        })
        .catch((err) => {
          console.error("Could not copy text: ", err)
        })
    },
    toggleMask(item, field) {
      if (field === "cardNumber") {
        item.cardNumberMasked = !item.cardNumberMasked
      } else if (field === "cvv") {
        item.cvvMasked = !item.cvvMasked
      } else {
        // Existing logic for username and password
        if (field === "username") {
          item.usernameMasked = !item.usernameMasked
        } else if (field === "password") {
          item.passwordMasked = !item.passwordMasked
        }
      }
    },
  },
  created() {
    this.fetchItems()
  },
}
</script>

<style scoped>
/* Base Layout */
#vault {
  display: flex;
}

.sidebar {
  width: 250px;
}

.content {
  flex-grow: 1;
}

/* Content Header */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.content-header h2 {
  margin: 0;
}

/* Vault Items and List */
.vault-items .items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vault-items .item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.item-type {
  cursor: pointer;
}

.item-type.active {
  font-weight: bold;
  color: orange;
}

.item-type:hover {
  color: rgb(207, 135, 1);
}

/* Item Details */
.vault-items .item-details {
  display: flex;
  flex-direction: column;
}

.vault-items .item-details .credential {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Added spacing between username and password sections */
}

.vault-items .item-details .item-url {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px; /* Spacing under URL */
}

.vault-items .item-details .item-username,
.vault-items .item-details .item-password {
  font-size: 1em;
  margin-right: 10px; /* Spacing between text and first button */
}

/* Styles for Edit and Delete Buttons */
.item-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.edit-btn {
  color: #4caf50; /* Green */
}

.delete-btn {
  color: #f44336; /* Red */
}
.btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
