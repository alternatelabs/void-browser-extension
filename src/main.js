// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

(function() {
  function setup() {
    console.log("Void::Bookmarklet setup()");
    var data = {
      host: "pooreffort.com",
      apiRoot: "http://localhost:5000/",
      token: "a40e0b9b-a8c6-4118-8667-4dea6600bcbb"
    };

    var div = document.createElement("div");

    document.body.appendChild(div);

    var scriptTag = document.getElementById("void-app-bookmarklet-tag");

    if (scriptTag) {
      data.host = window.location.host || window.location.href;
      data.apiRoot = scriptTag.dataset.apiRoot;
      data.token = scriptTag.dataset.secureToken;
    }

    /* eslint-disable no-new */
    new Vue({
      data: { data },
      template: '<App :site-data="data" @close="close" />',
      components: { App },

      methods: {
        close() {
          console.log("Void::Bookmarklet remove()");
          this.$destroy();
          document.body.removeChild(this.$el);

          if (scriptTag) {
            document.body.removeChild(scriptTag);
          }
        }
      }
    }).$mount(div);
  }

  if (document.body) {
    setup();
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
}());
