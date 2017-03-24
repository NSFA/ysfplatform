<template>
  <div>
    <div slot="title" class="dialogForm_title">
      <span class="el-dialog__title" v-if="dialog_id === -1 "> 添加API </span>
      <span class="el-dialog__title" v-else>编辑API</span>
    </div>
    <div class="dialogForm_body">
      <el-form :model="form" :label-width="formLabelWidth">
        <el-form-item label="API地址">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-switch on-text="开启" off-text="关闭" v-model="form.status" :width="60"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <div class="json_editor_wrapper">
      <div class="json_editor" ref="json_editor"></div>
    </div>
    <div slot="footer" class="dialog-footer json_editor_group">
      <el-button @click="reset()">取 消</el-button>
      <el-button type="primary" @click="submitEditor()">确 定</el-button>
    </div>
  </div>
</template>
<script>
  import JSONEditor from 'jsoneditor';
  import 'jsoneditor/dist/jsoneditor.css'
  import {_getApi, _addApi} from '../javascript/getData'
  export default{
    name: 'jsoneditor',
    props: ['dialog_id'],
    data(){
      return {
        initData: {
          form: {
            name: '',
            status: true,
          },
          json: {
            code: 200,
            message: "",
            result: ""
          }
        },
        form: {
          name: '',
          status: false
        },
        formLabelWidth: '100px',
      }
    },
    methods: {
      reset(){
        this.$emit("hideDialog",{"listchange":false});
      },
      submitEditor(){
        try {
          var json = this.editor.get();
        } catch (err) {
          this.$notify.error({
            title: "编辑错误",
            message: err.toString()
          });
          return;
        }
        const formData = _.assign({json, id: this.dialog_id}, this.form);
        _addApi(formData).then((res) => {
          const data = res.data;
          if (data.code === 200) {
            this.$emit("hideDialog", {"listchange": true});
            this.$notify.success({
              message: '添加Api成功',
            });
          } else {
            this.$notify.error({
              message: data.msg
            });
          }
        })
      },
      init(){
        this.editor.set(this.initData.json);
        _.assign(this.form, this.initData.form)
      },
    },
    mounted(){
      /**
       * 监听模态框关闭
       */
      this.$on('openDialog', function () {
        if (this.dialog_id === -1) {
          this.init();
        } else {
          _getApi(this.dialog_id).then((res) => {
            const data = res.data, result = data.result;
            if (data.code === 200) {
              this.form.name = result.name;
              this.form.status = result.status;
              this.editor.set(result.json);
            } else {
              this.$notify.error({
                title: '错误',
                message: data.msg
              });
            }
          });
        }
      });
      /**
       * 初始化编辑器
       */
      this.editor = new JSONEditor(this.$refs.json_editor, {
        onError: (err) => {
          this.$notify.error({
            title: "编辑错误",
            message: err.toString()
          });
        }
      });
      this.editor.setMode('code');
      /**
       * 初始化编辑框数据
       */
    }
  }
</script>
<style lang="scss">
  .dialogForm_title {
    margin-bottom: 20px;
  }

  .dialogForm_body {
    width: 90%;
    margin: 0 auto;
    text-align: left;

  .el-form-item__label {
    text-align: center;
  }

  }
  .json_editor_group {
    text-align: center;
    padding-top: 20px;
  }

  .json_editor {
    height: 400px;
    width: 90%;
    margin: 0 auto;
    text-align: left;
  }
</style>
