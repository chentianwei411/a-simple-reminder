<template>
  <div>
    <div v-on:click='editing = true' class="card card-body mb-3">
      {{ card.name }}
    </div>
    <!-- 通过editing，来决定是否加载这个div，连带2个类， -->
    <div v-if='editing' class="modal-backdrop show"></div>

    <div v-if='editing' @click='closeModal' class="modal show ignore-element" style="display: block" >
      <div class="modal-dialog modal-dialog-centered " >
        <div class="modal-content">

          <div class="modal-header">
            <h4 class="modal-title" @click='editingTitle = !editingTitle' v-if='!editingTitle'>{{ card.name }}<span>✎</span></h4>
            <input v-if="editingTitle" v-bind:value='name' @input="name = $event.target.value" class="form-control">
          </div>

          <div class="modal-body">
            <div v-if='!editingText'>
              <p id="bodyText">{{ text }}</p>
              <p v-on:click="editingText = !editingText">✎</p>
            </div>
            <textarea v-if='editingText' v-bind:value='text' @input="text = $event.target.value" class="form-control"></textarea>
          </div>

          <div class="modal-footer">
            <button @click="save" type="button" class="btn btn-primary btn-sm">Save changes</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ["card", "list"],
    data: function() {
      return {
        editingTitle: false,
        editingText: false,
        editing: false,
        name: this.card.name,
        text: this.card.text,
      }
    },

    methods: {
      // classList 属性， 得到元素的类的列表，一个对象DOMTokenList(2)
      closeModal: function(event) {
        if (event.target.classList.contains("modal")) {
          this.editing = false
          this.editingTitle = false
          this.editingText = false
        }
      },

      save: function() {
        var data = new FormData
        data.append("card[name]", this.name)
        data.append("card[text]", this.text)
        // const list_id = this.list.id
        const card_id = this.card.id

        Rails.ajax({
          url:`/cards/${card_id}`,
          type: "PATCH",
          data: data,
          dataType: 'json',
          success: data => {
            // const list_index = window.store.lists.findIndex((item) => {
            //   return item.id === list_id
            // })
            // const cardIndex = window.store.lists[list_index].cards.findIndex((item) => {
            //   return item.id === card_id
            // })
            // window.store.lists[list_index].cards.splice(cardIndex, 1, data)
            // 使用ActionCable，注释掉：
            // this.$store.commit('editCard', data)
          }
        })
        this.editing = false
        this.editingTitle = false
        this.editingText = false
      },
    }
  }
</script>

<!--
show 是否显示modal
fade 添加一个过度，从上到下出现窗口。
modal-backdrop provide a click area for dismissing shown modals when clicking outside the modal.
modal-lg 弹出窗口大小
 -->

<style scoped>
#bodyText {
  width: 100%;
  overflow: scroll;
}
</style>
