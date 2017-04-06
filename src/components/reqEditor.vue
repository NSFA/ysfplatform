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
        <el-form-item label="模板选择">
          <el-select v-model.number="form.template" placeholder="请选择模板">
            <el-option
              v-for="item in templateOptions"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="text" @click="addTab()">添加Tab</el-button>
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
        reqArr: [],
        initData: {
          form: {
            name: '',
            status: true,
            type: 1,
            template: 1
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
          type: 1,
          template: 1
        },
        raw: "",
        templateOptions: []
      }
    },
    methods: {
      /**
       * 设置watch
       */
      setWatch(){
        this.unwatch = this.$watch('form.template', function (newTpl, oldTpl) {
          const Otype = this.form.type;
          const Ntype = this.reqArr[newTpl - 1].type;
          var Oitem;
          //存储旧的项
          switch (Otype) {
            case 1:
              try {
                Oitem = this.editor.get();
              } catch (err) {
                this.$notify.error({
                  title: "编辑错误",
                  message: err.toString()
                });
                return;
              }
              break;
            case 2:
              Oitem = this.formDatas;
              break;
            case 3:
              Oitem = this.raw;
              break;
            default:
              break;
          }
          const Odata = {
            type: this.form.type,
            reqData: Oitem
          };
          this.reqArr.splice(oldTpl - 1, 1, Odata);
          //reset
          this.editor.set({request: ""});
          this.raw = '';
          this.formDatas = [
            {
              key: "",
              value: "",
            }
          ];
          //设置新的项
          switch (Ntype) {
            case 1:
              try {
                this.editor.set(this.reqArr[newTpl - 1].reqData);
              } catch (err) {
                this.$notify.error({
                  title: "设置错误",
                  message: err.toString()
                });
                return;
              }
              break;
            case 2:
              this.formDatas = this.reqArr[newTpl - 1].reqData;
              break;
            case 3:
              this.raw = this.reqArr[newTpl - 1].reqData;
              break;
            default:
              break;
          }
          this.form.type = Ntype;
        })
      },
      /**
       *添加Tab
       */
      addTab(){
        const index = _.maxBy(this.templateOptions, (o) => o.value).value;
        this.templateOptions.push({
          value: index + 1,
          label: `模板-${index + 1}`
        });
        this.reqArr.push(
          {
            type: 1,
            reqData: {
              "request": ""
            }
          }
        );
      },
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
        if (this.formDatas.length === 1) {
          this.$notify.warning({
            message: "Form表单至少需要一项"
          });
          return;
        }
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
        const type = this.form.type;
        var item;
        switch (type) {
          case 1:
            try {
              item = this.editor.get();
            } catch (err) {
              this.$notify.error({
                title: "编辑错误",
                message: err.toString()
              });
              return;
            }
            break;
          case 2:
            item = this.formDatas;
            break;
          case 3:
            item = this.raw;
            break;
          default:
            break;
        }
        const data = {
          type: this.form.type,
          reqData: item
        };
        this.reqArr.splice(this.form.template - 1, 1, data);

        const formData = {
          reqArr: this.reqArr,
          id: this.dialog_id,
          templateOptions: this.templateOptions,
          ...this.form,
        };
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
        _.assign(this.form, this.initData.form);
        this.reqArr.push({
          type: 1,
          reqData: {
            request: "",
          }
        });
        this.templateOptions = [{
          value: 1,
          label: '模板-1'
        }];
      }
    },
    mounted()
    {
      /**
       * 监听模态框关闭
       */
      this.$on('openDialog', function () {
        if (this.dialog_id === -1) {
          this.init();
          this.setWatch();
        } else {
          _getReqApi(this.dialog_id).then((res) => {
            const data = res.data, result = data.result;
            if (data.code === 200) {
              this.form = {
                name: result.name,
                status: result.status,
                type: result.type,
                template: result.template
              };
              this.templateOptions = result.templateOptions;
              this.reqArr = result.reqArr;
              const reqData = this.reqArr[this.form.template - 1].reqData;
              switch (this.reqArr[this.form.template - 1].type) {
                case 1:
                  this.editor.set(reqData);
                  break;
                case 2:
                  this.formDatas = reqData;
                  break;
                case 3:
                  this.raw = reqData;
                  break;
                default:
                  break;
              }
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
       */
      this.$on('closeDialog', function () {
        this.reqArr = [];
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
