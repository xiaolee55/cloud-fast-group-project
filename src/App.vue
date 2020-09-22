<template>
  <div id="app">
    <study/>
  </div>
</template>

<script>
import Study from "./components/study.vue";

export default {
  name: "App",
  components: {
    Study,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logo {
  width: 120px;
  padding: 10px;
}
</style>
