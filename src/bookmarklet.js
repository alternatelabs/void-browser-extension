// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import BookmarkletApp from "./BookmarkletApp";

(function() {
  function setup() {
    console.log("Void::Bookmarklet setup()");
    var data = {
      host: "pooreffort.com",
      apiRoot: "http://void.dev/",
      token: "a0699293-f2f6-4616-935f-31744e63b45a"
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
      template: '<BookmarkletApp :site-data="data" @close="close" />',
      components: { BookmarkletApp },

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
