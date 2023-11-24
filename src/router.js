import { createRouter, createWebHistory } from "vue-router"
import Homepage from "@/components/Homepage.vue"
import Login from "@/components/Login.vue"
import Join from "@/components/Join.vue"
import Reset from "@/components/Reset.vue"
import Vault from "@/components/Vault.vue"

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
    {
      path: "/reset",
      name: "Reset",
      component: Reset,
    },
    {
      path: "/vault",
      name: "Vault",
      component: Vault,
    },
  ],
})

export default router
