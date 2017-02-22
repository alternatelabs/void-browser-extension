<template>
  <span class="loading">
    <span class="spinner" v-show="isLoading"></span>
    <span class="checkmark" v-show="!isLoading">
      <img :src="checkmarkPng" width="18">
    </span>
  </span>
</template>

<script>
import checkmarkPng from "assets/checkmark@2x.png";

export default {
  name: "loading",

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      checkmarkPng
    };
  },
};
</script>

<style lang="scss" scoped>
$base-line-height: 16px;
$strokeColor: rgba(0,0,0,0.7);
$bgColor: rgba(0,0,0,0.2);
$spin-duration: 1s;

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading {
  display: block;
  width: 18px;
  height: 20px;
}

.spinner {
    display: block;
    border-radius: 50%;
    width: $base-line-height;
    height: $base-line-height;
    border: .15rem solid $bgColor;
    border-top-color: $strokeColor;
    animation: spin $spin-duration infinite linear;
    margin: 0 auto;
}

.checkmark {
  padding-top: 3px;
}

.checkmark, .checkmark > img {
  display: block;
  width: 18px;
  height: 14px;
}
</style>
