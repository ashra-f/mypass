import { createRouter, createWebHistory } from "vue-router"
import Homepage from "@/components/Homepage.vue"
import Login from "@/components/Login.vue"
import Join from "@/components/Join.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Homepage",
      component: Homepage,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/join",
      name: "Join",
      component: Join,
    },
    // ... other routes
  ],
})

export default router
