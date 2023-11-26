<template>
  <div id="app">
    <Banner />
    <router-view />
  </div>
</template>

<script>
import Banner from "./components/Banner.vue"

export default {
  name: "App",
  components: {
    Banner,
  },
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f5f5f5;
}
</style>
