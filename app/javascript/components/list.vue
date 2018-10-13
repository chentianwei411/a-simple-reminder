<template>
  <div class="list">
    <h6 >{{ list.name }}</h6>

    <draggable v-model='list.cards' :options="{group: 'cards'}" class="list-card" @change="cardMoved">
      <card v-for="card in list.cards" v-bind:card='card' v-bind:list="list"></card>
    </draggable>

    <a v-if="!editable" @click="inputMessage">add a card</a>
    <div v-if="editable">
      <input type="text" class="form-control mb-1" v-model='message' ref='input'>
      <button @click="createCard" class="btn btn-secondary btn-sm">add card</button>
      <a @click="editable = false">cancel</a>
    </div>
  </div>
</template>

<script>
  import draggable from "vuedraggable"
  import card from 'components/card'

  export default {
    components: { draggable, card },
    props: ['list'],
    data: function() {
      return {
        message:"",
        editable: false
      }
    },
    methods: {
      inputMessage: function() {
        this.editable = true,
        this.$nextTick(function() {
          this.$refs.input.focus()
        })
      },

      cardMoved: function(event) {
        // 移动card的行为有2种：1.list内移动，产生event.moved；2.跨list移动，产生event.added, event.removed。
        // 用户行为会改变card属性list_id, postion
        const evt = event.added || event.moved

        if ( evt == undefined) { return }
        // 改为使用全局变量window.store
        var list_index = window.store.lists.findIndex((list) => {
          return list.cards.find((card) => {
            return card.id === evt.element.id
          })
        })

        var data = new FormData
        data.append("card[list_id]", window.store.lists[list_index].id)
        data.append("card[position]", evt.newIndex + 1)

        Rails.ajax({
          url: `/cards/${ evt.element.id}/move`,
          type: 'PATCH',
          data: data,
          dataType: 'json'
        })
      },

      createCard: function() {
        if (this.message == undefined) {
          return
        }

        var data = new FormData()
        // card记录有list_id和name，2个字段属性。
        data.append("card[list_id]", this.list.id)
        data.append("card[name]", this.message)

        // 注意，传入的参数list_id, name都要通过参数白名单，和模型validats
        // 手脚架自动生成的card_params方法中没有:list_id，所以自己要改，否则报告错误
        // list: [must exits]即@list.errors
        Rails.ajax({
          url: '/cards',
          type: "POST",
          data: data,
          dataType: 'json',
          success: (data) => {
            // 每个list进行函数测试，找到符合测试条件的list,返回它的id号。
            // 这里从window对象中的全局变量store中找对应list的index。
            // const index = window.store.state.lists.findIndex((item) => {
            //   return item.id == this.list.id
            // })
            // window.store.lists[index].cards.push(data)

            // 使用Vuex.Store实例，对state.lists进行状态的管理
            this.$store.commit('addCard', data)
            this.message = ""
          }
        })
      }

    }
  }
</script>

<style scoped>
/* CSS#list-card  内部需要添加min-height,这是draggable插件的一个bug的处理方法。 */
.list-card {
  overflow: hidden;
  position: relative;
  min-height: 10px;
}
</style>
