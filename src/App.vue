<template>
  <div class="void-ext">
    <div v-if="token">
      <bookmarker :host="siteData.host" :url="siteData.url" :api-root="siteData.apiRoot" :api-token="token" container-class="void-bookmarklet" @close="close" @click.native.stop.prevent />
    </div>

    <div class="container -auth" v-else>
      <div class="padded-box">
        <img src="~assets/logo-dark.svg" width="69" height="20">
      </div>

      <div class="flash error" v-if="passwordError">Bad email or password.</div>

      <div id="clearance" class="sign-in">
        <form class="-auth -fullwidth" @submit.prevent="signin">
          <div class="contents">
            <h2 class="ui-heading">Please sign in</h2>

            <div class="field">
              <input type="email" placeholder="Email" v-model="email">
            </div>

            <div class="field">
              <input placeholder="Password" type="password" v-model="password">
            </div>

            <div class="field">
              <input type="submit" value="Sign in" class="bordered-button -primary -large">
            </div>
          </div>

          <ul class="other-links">
            <li v-if="false"><a href="https://voidapp.co/signups/new" target="_blank">Sign Up</a></li>
            <li><a href="https://voidapp.co/password_resets/new" target="_blank">Forgot Password</a></li>
          </ul>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
import api from "helpers/api";
import Bookmarker from "./components/Bookmarker";

export default {
  name: "app",

  components: {
    Bookmarker
  },

  data() {
    return {
      token: null,
      email: "",
      password: "",
      passwordError: false,
    };
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

  watch: {
    token() {
      this.toggleBodyClass();
    },
  },

  created() {
    this.token = localStorage.getItem("apiToken");
    this.toggleBodyClass();
  },

  methods: {
    toggleBodyClass() {
      if (this.token) {
        document.body.classList.remove("-signin");
      } else {
        document.body.classList.add("-signin");
      }
    },

    api() {
      return api.instance(this.siteData.apiRoot);
    },

    close() {
      this.$emit("close");
    },

    signin() {
      const params = {
        email: this.email,
        password: this.password
      };

      this.passwordError = false; // reset error state

      this.api().post("auth", params).then(resp => {
        console.log("Signed in", resp);
        localStorage.setItem("apiToken", resp.data.secure_token);
        localStorage.setItem("userData", JSON.stringify(resp.data.data));
        this.token = resp.data.secure_token;
      }).catch(resp => {
        console.error("Error trying to sign in", resp);
        this.passwordError = true;
        this.password = "";
      });
    }
  }
};
</script>
