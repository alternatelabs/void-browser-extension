// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

(function() {
  function setup() {
    console.log("Void::App setup()");
    var data = {
      url: "https://pooreffort.com/",
      host: "pooreffort.com",
      apiRoot: process.env.API_BASE_URL,
      token: "a0699293-f2f6-4616-935f-31744e63b45a"
    };

    function loadApp() {
      /* eslint-disable no-new */
      new Vue({
        el: "#app",
        render: function(createElement) {
          return createElement("App", {
            props: {
              siteData: data
            },
            on: {
              close: this.close
            }
          });
        },

        components: { App },

        methods: {
          close() {
            console.log("Void::Bookmarklet remove()");
            window.close();
          }
        }
      });
    }

    /*global browser*/
    if (browser !== undefined && browser.tabs !== undefined) {
      console.log("Fetching Tabs");
      browser.tabs.query({
        active: true,
        currentWindow: true
      }).then((arrayOfTabs) => {
        const activeTab = arrayOfTabs[0];
        const parser = document.createElement("a");
        parser.href = activeTab.url;

        data.host = parser.hostname;
        data.url = activeTab.url;
        data.pageTitle = activeTab.title;
        loadApp();
      });
    } else {
      loadApp();
    }
  }

  if (document.body) {
    setup();
  } else {
    document.addEventListener("DOMContentLoaded", setup);
  }
}());
