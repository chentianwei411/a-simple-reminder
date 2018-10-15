<template>
  <draggable v-model='lists' :options="{group: 'lists'}" class='board' @end='listMoved'>
    <list v-for="(list, index) in lists" v-bind:list='list'></list>

    <a v-if="!editable" @click="inputMessage">add a list</a>
    <div v-if="editable" class="list">
      <label>Please enter your list:</label>
      <input type="text" class="form-control mb-1" v-model='message' ref='inputlist'>
      <button @click="createList" class="btn btn-secondary btn-sm">add list</button>
      <a @click="editable = false">cancel</a>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import list from 'components/list'

export default {
  components: { draggable, list},

  // props: ["original_lists",], //改用vuex

  data: function() {
    return {
      // messages必须是一个对象，而不能是String。
      // 因为有多个输入框，它们的value必须各自绑定各自的。
      // messages: {}, 移动到子组件list.vue中去了，并改变了type,为string.
      // lists: this.original_lists, //改用vuex
      editable: false,
      message: undefined
    }
  },

  computed: {
    lists() {
      return this.$store.state.lists;
    }
  },

  methods: {
    inputMessage: function() {
      this.editable = true
      this.$nextTick(function(){
        this.$refs.inputlist.focus()
      })
    },
    createList: function() {
      if (this.message == undefined ) {
        return
      }

      var data = new FormData()
      data.append("list[name]", this.message)

      Rails.ajax({
        url: '/lists',
        type: "POST",
        data: data,
        dataType: 'json',
        success: (data) => {
          // 改用vuex,所有lists的变化统一放到Vuex.Store实例中。
          this.$store.commit('addList', data)
          // window.store.lists.push(data)
          this.message = ''
          this.editable = false
        }

      })
    },

    listMoved: function(event) {
      console.log(event)
      // 改变位置发生改变的list的position属性。
      var data = new FormData
      data.append("list[position]", event.newIndex + 1)

      Rails.ajax({
        // url定位到这个被拖拉的元素并执行move方法
        url: `/lists/${this.lists[event.newIndex].id}/move`,
        type: 'PATCH',
        data: data,
        dataType: 'json',
      })
    },
    // cardMoved: function(event) {
    //   console.log(event)
    //   // 移动card的行为有2种：
    //   // 1.list内移动，产生event.moved
    //   // 2.跨list移动，产生event.added, event.removed。
    //   // 用户行为会改变card属性list_id, postion
    //   const evt = event.added || event.moved
    //
    //   if ( evt == undefined) { return }
    //
    //   var list_index = this.lists.findIndex((list) => {
    //     return list.cards.find((card) => {
    //       return card.id === evt.element.id
    //     })
    //   })
    //
    //   var data = new FormData
    //   data.append("card[list_id]", this.lists[list_index].id)
    //   data.append("card[position]", evt.newIndex + 1)
    //
    //   Rails.ajax({
    //     url: `/cards/${ evt.element.id}/move`,
    //     type: 'PATCH',
    //     data: data,
    //     dataType: 'json'
    //   })
    // },

    // 移动到子组件list.vue中。
    // submitMessages: function(list_id) {
    //   if (this.messages[list_id] == undefined) {
    //     return
    //   }
    //
    //   var data = new FormData()
    //   // card记录有list_id和name，2个字段属性。
    //   data.append("card[list_id]", list_id)
    //   data.append("card[name]", this.messages[list_id])
    //
    //   // 注意，传入的参数list_id, name都要通过参数白名单，和模型validats
    //   // 手脚架自动生成的card_params方法中没有:list_id，所以自己要改，否则报告错误
    //   // list: [must exits]即@list.errors
    //   Rails.ajax({
    //     url: '/cards',
    //     type: "POST",
    //     data: data,
    //     dataType: 'json',
    //     success: (data) => {
    //       console.log(list_id)
    //       // 每个list进行函数测试，找到符合测试条件的list,返回它的id号。
    //       const index = this.lists.findIndex((list) => {
    //         return list.id == list_id
    //       })
    //       console.log(index)
    //       this.lists[index].cards.push(data)
    //       this.messages[list_id] = undefined
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>

.board {
  white-space: nowrap;
  overflow-x: auto;
  margin-bottom: 8px;
  padding-bottom: 8px;
}
.list {
  background-color: #dfe3e6;
  border-radius: 3px;
  display:inline-block;
  vertical-align: top;
  width: 270px;
  padding: 10px;
  margin-right: 10px;
  margin-top:10px;
}

</style>
