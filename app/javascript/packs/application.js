/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
import App from '../app.vue'
import draggable from 'vuedraggable'

Vue.use(TurbolinksAdapter)

document.addEventListener('turbolinks:load', () => {
  var element = document.getElementById("boards")
  if ( element != undefined ) {
    const app = new Vue({
      el: element,
      data: {
        lists: JSON.parse(element.dataset.lists)
      },
      // 不理解template
      template: "<App v-bind:original_lists='lists' />",
      components: {App, draggable}
    })
  }

  var main = document.getElementById("main")
  if ( main != undefined) {
    var vm = new Vue({
      el: main,
      data: {
        list: [
          {name: 'John'}, {name: "123"}, {name: "world!!!"}
        ]
      },
      methods: {
        add: function() {
          this.list.push({name: "hahhas"})
        },
        replace: function() {
          this.list= [{}]
        }
      },
      components: { draggable }
    })
  }
})
