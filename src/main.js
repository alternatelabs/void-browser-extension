// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

document.addEventListener('DOMContentLoaded', function () {
  var div = document.createElement('div')

  document.body.appendChild(div)

  /* eslint-disable no-new */
  new Vue({
    template: '<App/>',
    components: { App }
  }).$mount(div)
})
