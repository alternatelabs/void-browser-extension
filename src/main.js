// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

document.addEventListener("DOMContentLoaded", function() {
  var data = {
    host: "pooreffort.com",
    apiRoot: "http://localhost:5000/",
    token: "fake-token"
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
    template: '<App :site-data="data" />',
    components: { App }
  }).$mount(div);
});
