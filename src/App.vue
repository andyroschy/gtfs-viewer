<template>
  <div id="app">
    <home></home>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  margin: 0px;
  padding: 0px;
}
body {
  padding: 0px;
  margin: 0px;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import Home  from '@/views/Home.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';


@Component({
  components: {
     Home
  },
})
export default class App extends Vue {  
  
}
</script>
