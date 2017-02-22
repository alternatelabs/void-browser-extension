<template>
  <div id="app">
    <bookmarklet></bookmarklet>
  </div>
</template>

<script>
import Bookmarklet from './components/Bookmarklet'

export default {
  name: 'app',
  components: {
    Bookmarklet
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999999;
}
</style>
