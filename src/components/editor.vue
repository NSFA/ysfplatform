<template>
  <div>
    <div slot="title" class="dialogForm_title">
      <span class="el-dialog__title" v-if="dialog_id === -1 ">添加API</span>
      <span class="el-dialog__title" v-else>编辑API</span>
    </div>
    <div class="dialogForm_body">
      <el-form :model="form" label-width="120px">
        <el-form-item label="API地址">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="返回状态码">
          <el-input v-model.number="form.statusCode" auto-complete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="开启状态">
          <el-switch on-text="开启" off-text="关闭" v-model="form.status" :width="60"></el-switch>
        </el-form-item>
      </el-form>
      <div style="position: relative">
        <div style="margin-bottom: 20px;">
          <el-popover ref="popover1" placement="bottom" width="160" v-model="addFormVisible">
            <p>请填写模板名</p>
            <el-input v-model="addName" size="mini" auto-complete="off" style="margin-bottom: 5px;"></el-input>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="addFormReset">取消</el-button>
              <el-button type="primary" size="mini" @click="addFormSubmit">确定</el-button>
            </div>
          </el-popover>
          <el-button v-popover:popover1 type="text" style="position: absolute;right: 18px;bottom: 80px;z-index: 1">
            添加模板
          </el-button>
        </div>
        <el-tabs v-model="form.template" type="card" closable @tab-remove="removeTab">
          <el-tab-pane v-for="item in templateOptions" :label="item.label" :name="item.value"></el-tab-pane>
        </el-tabs>
      </div>
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
        jsonArr: {  //JSON editor数据
          "1": {
            code: 200,
            message: "",
            result: ""
          }
        },
        form: {  //提交表单数据
          name: '',
          status: false,
          template: "1"
        },
        templateOptions: [], //Tab选项
        addFormVisible: false, //添加Tab选项popover是否可见
        addName: '' //新添加的Tab的名字
      }
    },
    methods: {
      /**
       * 重置添加Tab框
       */
      addFormReset(){
        this.addName = '';
        this.addFormVisible = false;
      },
      /**
       * 确认添加Tab框
       */
      addFormSubmit(){
        const index = _.maxBy(this.templateOptions, (o) => +o.value).value;
        const newTab = {
          value: (+index + 1).toString(),
          label: this.addName
        };
        const newContent = {
          code: 200,
          message: "",
          result: ""
        };
        this.templateOptions.push(newTab);
        this.jsonArr[+index + 1] = newContent;
        this.addFormReset();
      },
      /**
       * 确认删除Tab框
       */
      removeTab(name){
        if (this.templateOptions.length <= 1) {
          this.$message({
            showClose: true,
            message: '至少需要保留一个Tab哟',
            type: 'warning'
          });
          return;
        }
        //处理删除数据
        _.forEach(this.templateOptions, (option, index) => {
          if (option.value === name) {
            this.templateOptions.splice(index, 1);
            delete this.jsonArr[index + 1];
            //删除当前Tab回到第一个Tab
            if (this.form.template === name) {
              this.form.template = this.templateOptions[0].value;
            }
            return !1;
          }
        });
      },
      /**
       * 取消操作
       */
      reset(){
        this.$emit("hideDialog", {"listchange": false});
      },
      /**
       * 提交编辑或添加Api
       */
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
        this.jsonArr[this.form.template] = json;
        //组合提交数据
        const formData = {
          ...this.form,
          jsonArr: this.jsonArr,
          id: this.dialog_id,
          templateOptions: this.templateOptions
        };
        //发送请求
        _addApi(formData).then((res) => {
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
      },
      /**
       * 添加API时填默认数据
       */
      init(){
        //初始化表单数据
        _.assign(this.form, {
          name: '',
          status: true,
          statusCode: 200,
          template: "1"
        });
        //初始化JSON编辑器数据
        this.jsonArr = {
          "1": {
            code: 200,
            message: "",
            result: ""
          },
        };
        //初始化Tab数据
        this.templateOptions = [{
          value: "1",
          label: '默认模板'
        }];
        //设置编辑器内容
        this.editor.set(this.jsonArr[this.form.template]);
      },
      /**
       * 设置watch
       */
      setWatch(){
        this.unwatch = this.$watch('form.template', function (newTpl, oldTpl) {
          try {
            var jsonItem = this.editor.get();
          } catch (err) {
            this.$notify.error({
              title: "编辑错误",
              message: err.toString()
            });
            this.editor.set(this.jsonArr[newTpl]);
            return;
          }
          this.jsonArr[oldTpl] = jsonItem;
          this.editor.set(this.jsonArr[newTpl]);
        })
      }
    },
    mounted(){
      /**
       * 监听模态框打开
       */
      this.$on('openDialog', function () {
        if (this.dialog_id === -1) {
          this.init();
          this.setWatch();
        } else {
          _getApi(this.dialog_id).then((res) => {
            const data = res.data, result = data.result;
            if (data.code === 200) {
              this.form = {
                name: result.name,
                status: result.status,
                statusCode: result.statusCode,
                template: result.template
              };
              this.jsonArr = result.jsonArr;
              this.templateOptions = result.templateOptions;
              this.editor.set(result.jsonArr[result.template]);
              this.setWatch();
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
       *监听模态框关闭
       *关闭时停止watch
       */
      this.$on('closeDialog', function () {
        this.unwatch();
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
