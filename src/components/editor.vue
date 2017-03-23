<template>
  <div class="json_editor_wrapper">
    <div class="json_editor" ref="json_editor"></div>
    <div class="json_editor_group">
      <el-button type="success" size="large" @click="submitEditor()">保存</el-button>
    </div>
  </div>
</template>
<script>
  import JSONEditor from 'jsoneditor';
  import 'jsoneditor/dist/jsoneditor.css'
  export default{
    name: 'jsoneditor',
    props: ['initData'],
    data(){
      return {}
    },
    methods: {
      submitEditor(){
        const json = this.editor.get();
        this.$emit('getjson', json);
      }
    },
    mounted(){
      this.editor = new JSONEditor(this.$refs.json_editor, {
        modes: ['code', 'tree', 'form', 'view'],
        onError: (err) => {
          this.$notify.error({
            title: "编辑错误",
            message: err.toString()
          });
        }
      });
      if (this.initData) {
        this.editor.set(this.initData)
      }
    }
  }
</script>
<style lang="scss">
  .json_editor_group {
    text-align: center;
    padding-top: 20px;
  }
</style>
