// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueAnalytics from "vue-analytics";
import VTooltip from "v-tooltip";
import BookmarkletApp from "./BookmarkletApp";

Vue.use(VTooltip);
Vue.use(VueAnalytics, {
  id: "UA-8135554-9",
});

(function() {
  function setup() {
    console.log("Void::Bookmarklet setup()");
    var data = {
      host: "pooreffort.com",
      apiRoot: "http://void.dev/",
      token: "useCredentials"
    };

    var div = document.createElement("div");

    document.body.appendChild(div);

    var scriptTag = document.getElementById("void-app-bookmarklet-tag");

    if (scriptTag) {
      data.host = window.location.host || window.location.href;
      data.apiRoot = scriptTag.dataset.apiRoot;
    }

    /* eslint-disable no-new */
    new Vue({
      components: { BookmarkletApp },

      render: function(createElement) {
        return createElement("BookmarkletApp", {
          props: {
            siteData: data
          },
          on: {
            close: this.close
          }
        });
      },

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
