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
        <h2>My {{ selectedType }}</h2>
        <button @click="addItem">+ Add {{ displayTypeTitle }}</button>
      </div>
      <div class="vault-items">
        <!-- Logins Section -->
        <div v-if="selectedType === 'Logins'">
          <div v-for="item in loginItems" :key="item.id" class="item">
            <div v-if="item.editMode">
              <!-- Editable Fields for Logins -->

              <!-- URL -->
              <label>URL:</label>
              <input type="text" v-model="item.url" placeholder="Enter URL" />

              <!-- Username -->
              <label>Username:</label>
              <input
                type="text"
                v-model="item.username"
                placeholder="Enter Username"
              />

              <!-- Password -->
              <label>Password:</label>
              <div class="password-field">
                <input
                  type="text"
                  v-model="item.password"
                  placeholder="Enter Password"
                  @input="checkPasswordStrength(item)"
                  class="password-input"
                />
                <button
                  type="button"
                  @click="generatePasswordForItem(item)"
                  class="btn-generate-password"
                >
                  Generate
                </button>
              </div>
              <div class="password-feedback" v-if="passwordFeedback">
                {{ passwordFeedback }}
              </div>

              <button class="btn save-btn" @click="saveItem(item)">Save</button>
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

          <!-- Check if there are no logins -->
          <div v-if="loginItems.length === 0">
            <p>No logins found.</p>
          </div>
        </div>
        <!-- Cards Section -->
        <div v-if="selectedType === 'Cards'">
          <div v-for="item in cardItems" :key="item.id" class="item">
            <div v-if="item.editMode">
              <!-- Editable Fields for Card -->
              <label>Card Number:</label>
              <input
                type="text"
                v-model="item.cardNumber"
                placeholder="Enter Card Number"
              />

              <label>CVV:</label>
              <input type="text" v-model="item.cvv" placeholder="Enter CVV" />

              <button class="btn save-btn" @click="saveItem(item)">Save</button>
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

          <!-- Check if there are no cards -->
          <div v-if="cardItems.length === 0">
            <p>No cards found.</p>
          </div>
        </div>
        <!-- Identities Section -->
        <div v-if="selectedType === 'Identities'">
          <div v-for="item in identityItems" :key="item.id" class="item">
            <div v-if="item.editMode">
              <!-- Editable Fields for Identities -->
              <label>Name:</label>
              <input type="text" v-model="item.name" placeholder="Name" />

              <label>Email:</label>
              <input type="text" v-model="item.email" placeholder="Email" />

              <label>Phone:</label>
              <input type="text" v-model="item.phone" placeholder="Phone" />

              <label>Passport Number:</label>
              <input
                type="text"
                v-model="item.passportNumber"
                placeholder="Passport Number"
              />

              <label>License Number:</label>
              <input
                type="text"
                v-model="item.licenseNumber"
                placeholder="License Number"
              />

              <label>SSN:</label>
              <input type="text" v-model="item.ssn" placeholder="SSN" />

              <button class="btn save-btn" @click="saveItem(item)">Save</button>
              <button class="btn" @click="cancelEdit(item)">Cancel</button>
            </div>
            <div v-else>
              <!-- Display Mode for Identities -->
              <div>Name: {{ item.name }}</div>
              <div>Email: {{ item.email }}</div>
              <div>Phone: {{ item.phone }}</div>

              <div>
                Passport Number:
                {{ item.passportNumberMasked ? "••••••" : item.passportNumber }}
                <button class="btn" @click="toggleMask(item, 'passportNumber')">
                  Toggle
                </button>
              </div>

              <div>
                License Number:
                {{ item.licenseNumberMasked ? "••••••" : item.licenseNumber }}
                <button class="btn" @click="toggleMask(item, 'licenseNumber')">
                  Toggle
                </button>
              </div>

              <div>
                SSN: {{ item.ssnMasked ? "••••••" : item.ssn }}
                <button class="btn" @click="toggleMask(item, 'ssn')">
                  Toggle
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

          <!-- Check if there are no identities -->
          <div v-if="identityItems.length === 0">
            <p>No identities found.</p>
          </div>
        </div>
        <!-- Secure Notes Section -->
        <div v-if="selectedType === 'Notes'">
          <div v-for="note in secureNotes" :key="note.id" class="item">
            <div v-if="note.editMode">
              <!-- Editable Fields for Secure Notes -->
              <label>Title:</label>
              <input type="text" v-model="note.title" placeholder="Title" />

              <label>Content:</label>
              <textarea v-model="note.content" placeholder="Content"></textarea>

              <button class="btn save-btn" @click="saveItem(note)">Save</button>
              <button class="btn" @click="cancelEdit(note)">Cancel</button>
            </div>
            <div v-else>
              <!-- Display Mode for Secure Notes -->
              <div>Title: {{ note.title }}</div>
              <div>Content: {{ note.content }}</div>

              <div class="item-actions">
                <button class="btn edit-btn" @click="editItem(note)">
                  Edit
                </button>
                <button class="btn delete-btn" @click="deleteItem(note)">
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Check if there are no secure notes -->
          <div v-if="secureNotes.length === 0">
            <p>No secure notes found.</p>
          </div>
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
import SessionManager from "../SessionManager"
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
import PasswordStrengthSubject from "../PasswordStrengthSubject"
import PasswordBuilder from "../PasswordBuilder"
import VaultMediator from "../VaultMediator"

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
      selectedType: "Logins",
      clipboardMessage: "",
      showModal: false,
      userRef: null,
      loginItems: [],
      cardItems: [],
      identityItems: [],
      secureNotes: [],
      passwordObserver: new PasswordStrengthSubject(),
      passwordFeedback: "",
      mediator: null,
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
    isPasswordShort() {
      return function (password) {
        return password.length > 0 && password.length < 8
      }
    },
  },
  methods: {
    setupInactivityTimer() {
      let inactivityTimer

      const resetTimer = () => {
        clearTimeout(inactivityTimer)
        inactivityTimer = setTimeout(
          () => this.handleInactivityLogout(),
          600000
        ) // 10 minutes
      }

      // Add event listeners for various user actions
      document.addEventListener("mousemove", resetTimer)
      document.addEventListener("keypress", resetTimer)
      document.addEventListener("click", resetTimer)

      // Initialize timer
      resetTimer()
    },
    handleInactivityLogout() {
      console.log("Logging out due to inactivity.")

      const sessionManager = SessionManager.getInstance()
      sessionManager.logOut()

      const message = encodeURIComponent(
        "You've been logged out due to inactivity."
      )
      this.$router.push({ path: "/login", query: { message } })
    },
    handleFormSubmitted() {
      this.closeModal()
      this.fetchItems()
    },
    selectType(type) {
      this.selectedType = type
    },
    addItem() {
      this.mediator.openForm(this.selectedType)
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
          passportNumberMasked: true,
          licenseNumberMasked: true,
          ssnMasked: true,
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
    clearClipboardMessage() {
      if (!document.hasFocus()) {
        console.error("Document is not focused. Unable to clear clipboard.")
        return
      }

      navigator.clipboard
        .writeText("")
        .then(() => {
          this.clipboardMessage = ""
          alert("Clipboard cleared")
        })
        .catch((error) => {
          console.error("Error clearing clipboard:", error)
        })
    },
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.clipboardMessage = "Copied to clipboard"
          alert("Copied to clipboard")
          setTimeout(() => {
            this.clearClipboardMessage()
          }, 15000)
        })
        .catch((err) => {
          console.error("Could not copy text: ", err)
          this.clipboardMessage = "Error copying text"
        })
    },
    toggleMask(item, field) {
      switch (field) {
        case "username":
          item.usernameMasked = !item.usernameMasked
          break
        case "password":
          item.passwordMasked = !item.passwordMasked
          break
        case "cardNumber":
          item.cardNumberMasked = !item.cardNumberMasked
          break
        case "cvv":
          item.cvvMasked = !item.cvvMasked
          break
        case "passportNumber":
          item.passportNumberMasked = !item.passportNumberMasked
          break
        case "licenseNumber":
          item.licenseNumberMasked = !item.licenseNumberMasked
          break
        case "ssn":
          item.ssnMasked = !item.ssnMasked
          break
        // Add additional cases as needed
        default:
          // Optionally handle any unrecognized field
          console.warn(`toggleMask: Unhandled field ${field}`)
      }
    },
    updatePasswordFeedback(feedback) {
      this.passwordFeedback = feedback
    },
    checkPasswordStrength(item) {
      this.passwordObserver.notify(item.password)
    },
    generatePasswordForItem(item) {
      const builder = new PasswordBuilder()
        .setLength(12) // Adjust the length as needed
        .includeNumbers(true)
        .includeUpperCaseLetters(true)
        .includeLowerCaseLetters(true)
        .includeSpecialCharacters(true)

      item.password = builder.build()
      this.checkPasswordStrength(item)
    },
  },
  created() {
    this.mediator = new VaultMediator(this)
    const sessionManager = SessionManager.getInstance()
    sessionManager.checkLoginStatus()

    if (!sessionManager.isLoggedIn) {
      const message = encodeURIComponent("Please log in to access your vault.")
      this.$router.push({ path: "/login", query: { message } })
    } else {
      this.fetchItems()
    }

    this.passwordObserver.subscribe(this.updatePasswordFeedback)
  },
  mounted() {
    this.fetchItems()
    this.setupInactivityTimer()
  },
}
</script>

<style scoped>
/* Base Layout */
#vault {
  display: flex;
  background-color: #f5f5f5;
  padding: 20px;
}

.sidebar {
  height: 300px;
  width: 250px;
  background-color: #333; /* Darker background for sidebar */
  border-radius: 5px;
  color: #fff; /* Text color for better contrast */
  padding: 20px; /* Increased padding for inner spacing */
  box-sizing: border-box; /* Ensures padding doesn't add to the width */
}

.content {
  flex-grow: 1;
  padding: 20px; /* Consistent padding for spacing */
  box-sizing: border-box; /* Ensures padding doesn't add to the width */
}

/* Content Header */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; /* Added bottom margin */
}

.content-header h2 {
  color: #333; /* Dark text color for headers */
}

/* Add Button - Orange Style */
.content-header button {
  background-color: orange;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

.content-header button:hover {
  background-color: darkorange; /* Darker shade on hover */
}

/* Vault Items and List */
.item-type {
  cursor: pointer;
  margin-bottom: 10px; /* Spacing between types */
}

.item-type.active {
  font-weight: bold;
  color: orange;
}

.item-type:hover {
  color: lightgrey; /* Lighter color on hover */
}

/* Edit and Delete Button Styles */
.edit-btn {
  color: #4caf50; /* Green for edit */
}

.delete-btn {
  color: #f44336; /* Red for delete */
}

.btn {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: background-color 0.2s; /* Transition for hover effect */
}

.btn:hover {
  background-color: #e0e0e0; /* Slightly darker on hover */
}

.vault-items .item {
  background-color: #fff; /* Light background */
  border: 1px solid #ddd; /* Lighter border */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  border-radius: 10px; /* Rounded corners */
  padding: 15px; /* Increased padding */
  margin-bottom: 15px; /* Spacing between items */
  transition: box-shadow 0.3s ease; /* Smooth shadow transition */
}

.vault-items .item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

.vault-items .credential {
  margin-bottom: 10px; /* Spacing between credentials */
}

.vault-items label {
  font-weight: bold; /* Bold labels */
}

.vault-items input[type="text"],
.vault-items textarea {
  width: 100%; /* Full width inputs */
  padding: 8px;
  margin-bottom: 10px; /* Spacing after inputs */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.vault-items .credential span {
  display: block; /* Block display for better readability */
  color: #333; /* Darker color for text */
  margin-bottom: 5px; /* Spacing after each credential */
}

.vault-items .item-actions {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
}

.save-btn {
  background-color: #4caf50; /* Green for save */
  color: #fff;
}

.warning {
  color: #fbbf64;
  padding-bottom: 1rem;
  font-size: 0.9em;
  font-weight: bold;
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
  text-align: center;
}
.password-field {
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-input {
  margin: 0 !important;
}
</style>
