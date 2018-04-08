// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueAnalytics from "vue-analytics";
import VTooltip from "v-tooltip";
import App from "./App";

Vue.use(VTooltip);
Vue.use(VueAnalytics, {
  id: "UA-8135554-9",
});

(function() {
  console.log("Void::App setup()");
  var data = {
    url: "https://pooreffort.com/",
    host: "pooreffort.com",
    apiRoot: process.env.API_BASE_URL,
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
  if (typeof browser !== "undefined") {
    if (!browser.tabs) return;

    console.log("Fetching Tabs");
    browser.tabs.query({
      active: true,
      currentWindow: true
    }).then((arrayOfTabs) => {
      const activeTab = arrayOfTabs[0];
      const parser = document.createElement("a");
      parser.href = activeTab.url;

      console.log("Active Tab", parser.hostname);

      data.host = parser.hostname;
      data.url = activeTab.url;
      data.pageTitle = activeTab.title;
      loadApp();
    });
  } else {
    loadApp();
  }
}());
