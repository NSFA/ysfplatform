<template>
  <div>
    <div slot="title" class="dialogForm_title">
      <span class="el-dialog__title" v-if="dialog_id === -1 "> 添加API </span>
      <span class="el-dialog__title" v-else>编辑API</span>
    </div>
    <div class="dialogForm_body">
      <el-form :model="form" label-width="120px">
        <el-form-item label="API地址">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-switch on-text="开启" off-text="关闭" v-model="form.status" :width="60"></el-switch>
        </el-form-item>
        <el-form-item label="请求格式">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="json_editor_wrapper" v-show="form.type === 1">
      <div class="json_editor" ref="json_editor"></div>
    </div>
    <div v-show="form.type ===2" class="reqData_body reqData_body_1">
      <template v-for="(item,index) in formDatas">
        <div class="reqData_item">
          <el-col :span="10">
            <el-input v-model="item.key" placeholder="key"></el-input>
          </el-col>
          <el-col :span="10">
            <el-input v-model="item.value" placeholder="value"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" icon="delete" plain @click="deleteFormItem(index)"></el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" plain @click="addFromItem">添加</el-button>
          </el-col>
        </div>
      </template>
    </div>
    <div v-show="form.type ===3" class="reqData_body reqData_body_2">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入请求内容"
        :autosize="{ minRows: 2, maxRows: 4}"
        v-model="raw">
      </el-input>
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
  import {_getReqApi, _addReqApi} from '../javascript/getData'
  export default{
    name: 'jsoneditor',
    props: ['dialog_id'],
    data(){
      return {
        options: [{
          value: 1,
          label: "application/json"
        }, {
          value: 2,
          label: "application/x-www-form-urlencoded"
        }, {
          value: 3,
          label: "raw"
        }],
        initData: {
          form: {
            name: '',
            status: true,
            type: 1
          },
          reqData: {
            request: ""
          }
        },
        formDatas: [
          {
            key: "",
            value: "",
          }
        ],
        form: {
          name: '',
          status: false,
          type: 1
        },
        raw: "",
      }
    },
    methods: {
      /**
       * 取消操作
       */
      reset(){
        this.$emit("hideDialog", {"listchange": false});
      },
      /**
       * 删除form项
       */
      deleteFormItem(index){
        this.formDatas.splice(index, 1);
      },
      /**
       * 添加form项
       */
      addFromItem(){
        this.formDatas.push({key: "", vale: ""})
      },
      /**
       * 提交编辑或添加Api
       */
      submitEditor(){
        var reqData;
        switch (this.form.type) {
          case 1:
            try {
              reqData = this.editor.get();
            } catch (err) {
              this.$notify.error({
                title: "编辑错误",
                message: err.toString()
              });
              return;
            }
            break;
          case 2:
            reqData = this.formDatas;
            break;
          case 3:
            reqData = this.raw;
            break;
          default:
            break;
        }
        const formData = _.assign({reqData, id: this.dialog_id}, this.form);
        _addReqApi(formData).then((res) => {
          const data = res.data;
          if (data.code === 200) {
            this.$emit("hideDialog", {"listchange": true});
            this.$notify.success({
              message: data.msg,
            });
          } else {
            this.$notify.error({
              message: data.msg
            });
          }
        })
      }
      ,
      /**
       * 初始化默认数据
       */
      init(){
        this.editor.set(this.initData.reqData);
        _.assign(this.form, this.initData.form)
      }
    },
    mounted(){
      /**
       * 监听模态框关闭
       */
      this.$on('openDialog', function () {
        if (this.dialog_id === -1) {
          this.init();
        } else {
          _getReqApi(this.dialog_id).then((res) => {
            const data = res.data, result = data.result;
            if (data.code === 200) {
              this.form.name = result.name;
              this.form.status = result.status;
              this.form.type = result.type;
              switch (result.type) {
                case 1:
                  this.editor.set(result.reqData);
                  break;
                case 2:
                  this.formDatas = result.reqData;
                  break;
                case 3:
                  this.raw = result.reqData;
                  break;
                default:
                  break;
              }
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
    }
  }
</script>
<style lang="scss" scoped>
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

  .reqData_body {
    width: 90%;
    padding: 20px;
    margin: 0 auto;
    .reqData_item {
      zoom: 1;
      padding-bottom: 2px;
      &:after, &:before {
        clear: both;
        content: '.';
        display: block;
        width: 0;
        height: 0;
        visibility: hidden;
      }
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
