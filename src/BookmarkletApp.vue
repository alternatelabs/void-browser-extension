<template>
  <div id="app" @click="close">
    <bookmarker :host="siteData.host" :api-root="siteData.apiRoot" :api-token="siteData.token" container-class="void-bookmarklet -bookmarklet" @close="close" @unauthorized="unauthorized" @click.native.stop.prevent />
  </div>
</template>

<script>
import Bookmarker from "./components/Bookmarker";

export default {
  name: "app",

  components: {
    Bookmarker
  },

  props: {
    siteData: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },

    unauthorized() {
      /*global alert*/
      /*eslint-disable no-alert*/
      alert("Problem saving bookmark, please sign in to void");
      /*eslint-enable no-alert*/
    },
  }
};
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
