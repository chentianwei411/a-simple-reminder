<template>
  <div id="app" class='row'>
      <div v-for='(list, index) in lists' class="col-3">
        <h6 >{{ list.name }}</h6>
        <hr>
        <div class='card'>
          <div v-for="(card, index) in list.cards" class='card-body mb-3'>
            {{card.name}}.
          </div>
          <div class="card-footer">
            <div class="input-group input-group-sm">
              <input type="text" class="form-control" @input="messages[list.id] = $event.target.value" v-bind:value='messages[list.id]'>
              <div class="input-group-append">
                <span  @click="submitMessages(list.id)" class="input-group-text">add</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: ["original_lists",],
  data: function() {
    return {
      messages:{},
      lists: this.original_lists,
    }
  },
  methods: {
    submitMessages: function(list_id) {
      var data = new FormData()
      // card记录有list_id和name，2个字段属性。
      data.append("card[list_id]", list_id)
      data.append("card[name]", this.messages[list_id])

      // 注意，传入的参数list_id, name都要通过参数白名单，和模型validats
      // 手脚架自动生成的card_params方法中没有:list_id，所以自己要改，否则报告错误
      // list: [must exits]即@list.errors
      Rails.ajax({
        url: '/cards',
        type: "POST",
        data: data,
        dataType: 'json',
        success: (data) => {
          const index = this.lists.findIndex(item => item.id == list_id)
          this.lists[index].cards.push(data)
          this.messages[list_id] = undefined
        }
      })
    }
  }
}
</script>

<style scoped>
h6 {
  text-align: center;
}
p {
  font-size: 4em;
  text-align: center;
}
</style>
