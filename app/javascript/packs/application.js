import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
import App from '../app.vue'

Vue.use(TurbolinksAdapter)
// 增加一个全局变量
window.store = {}

document.addEventListener('turbolinks:load', () => {
  var element = document.getElementById("boards")
  if ( element != undefined ) {
    window.store.lists = JSON.parse(element.dataset.lists)
    const app = new Vue({
      el: element,
      data:  window.store,
      template: "<App v-bind:original_lists='lists'/>",
      components: {App}
    })
  }

  // var main = document.getElementById("main")
  // if ( main != undefined) {
  //   var vm = new Vue({
  //     el: main,
  //     data: {
  //       list: [
  //         {name: 'John'}, {name: "123"}, {name: "world!!!"}
  //       ]
  //     },
  //     methods: {
  //       add: function() {
  //         this.list.push({name: "hahhas"})
  //       },
  //       replace: function() {
  //         this.list= [{}]
  //       }
  //     },
  //     components: { draggable }
  //   })
  // }
})
