<template>
  <div class="void-bookmarklet">
    <span class="text"><strong>{{ title }}</strong> has been added to the void!</span>
  </div>
</template>

<script>
export default {
  name: 'bookmarklet',
  data () {
    return {
      title: "Demo"
    }
  }
}
</script>

<style lang="scss" scoped>
$font-stack: -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
  "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

.void-bookmarklet {
  position: fixed;
  top: 30px;
  left: 30px;
  padding: 10px 20px;
  background: #fff;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
  border-radius: 6px;
  max-width: 60%;

  .text {
    font-family: $font-stack;
    font-size: 19px;
    font-weight: 300;
    line-height: 24px;
    color: #444;
  }
}
</style>
