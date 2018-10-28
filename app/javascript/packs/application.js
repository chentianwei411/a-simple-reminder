import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue/dist/vue.esm'
import App from '../app.vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(TurbolinksAdapter)


// 增加一个全局变量
window.store = new Vuex.Store({
  state: {
    lists: []
  },

  mutations: {
    addList(state, data) {
      state.lists.push(data)
    },
    addCard(state, data) {
      const index = state.lists.findIndex((item) => {
        return item.id == data.list.id
      })
      state.lists[index].cards.push(data)
    },
    editCard(state, data) {
      const list_index = state.lists.findIndex((item) => {
        return item.id === data.list.id
      });
      const cardIndex = state.lists[list_index].cards.findIndex((item) => {
        return item.id === data.id
      });
      state.lists[list_index].cards.splice(cardIndex, 1, data);
    },
    moveList(state, data) {
      // console.log(data)
      // const index = state.lists.findIndex((item) => {
      //   return item.id == data.id
      // })
      // state.lists[index].position = data.position
      // // const temp = state.lists
      // state.lists = []
      // state.lists = temp
      //DOM树的监听,list没有变化，所有不会动态的改变DOM结构。
    }
  }
})

document.addEventListener('turbolinks:load', () => {
  var element = document.getElementById("boards")
  if ( element != undefined ) {
    window.store.state.lists = JSON.parse(element.dataset.lists) //改用vuex,增加了.state
    const app = new Vue({
      el: element,
      store: window.store,
      template: "<App />",
      //改用vuex
      // data:  window.store,
      // template: "<App v-bind:original_lists='lists'/>",
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
