<template>
  <div class="api_list">
    <div class="api_list_add">
      <el-button type="primary" icon="edit" @click="editClick(-1)">添加</el-button>
      <el-dialog v-model="dialogFormVisible" :modal-append-to-body="false" :show-close="false" @open="dialogOpen">
        <editor :dialog_id="dialog_id" ref="editor"></editor>
      </el-dialog>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      element-loading-text="拼命加载中"
      border>
      <el-table-column
        prop="date"
        label="创建日期"
        sortable
        width="200">
      </el-table-column>
      <el-table-column
        prop="name"
        sortable
        label="API">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100"
        :filters="[{ text: '开启', value: true }, { text: '关闭', value: false }]"
        :filter-method="filterTag">
        <template scope="scope">
          <el-tag
            :type="scope.row.status === true ? 'primary' : 'warning'"
            close-transition>{{scope.row.status === true ? "开启" :"关闭" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template scope="scope">
          <el-button @click="deleteClick(scope.row._id)" type="text" size="small">移除</el-button>
          <el-button @click="editClick(scope.row._id)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  //TODO:有空再做个分页
  import editor from '../editor.vue'
  import {_getApiList, _delApi} from '../../javascript/getData'
  import moment from 'moment'
  export default{
    components: {
      editor
    },
    data() {
      return {
        loading: false,
        dialogFormVisible: false,
        dialog_id: -1,
        tableData: []
      }
    },
    methods: {
      /**
       * 模态框开启回调
       * 监听editor事件
       */
      dialogOpen(){
        this.$nextTick(function () {
          this.$refs['editor'].$emit('openDialog');
          this.$refs['editor'].$on('hideDialog', (res) => {
            if (res.listchange) {
              this.getListInfo();
            }
            this.dialogFormVisible = false;
          });
        })
      },
      /**
       * 删除Api
       * @param pid
       */
      deleteClick(pid){
        _delApi({id: pid}).then((res) => {
          const data = res.data, result = data.result;
          if (data.code === 200) {
            this.tableData = _.filter(this.tableData, (item) => item._id !== pid)
            this.$notify.success({
              message: "删除Api成功"
            });
          } else {
            this.$notify.error({
              message: data.msg
            });
          }
        });
      },
      /**
       * 编辑/新增Api
       * @param pid
       */
      editClick(pid) {
        this.dialog_id = pid;
        this.dialogFormVisible = true;
      },
      /**
       * 筛选方法，详见Element
       * @param value
       * @param row
       * @returns {boolean}
       */
      filterTag(value, row) {
        return row.status === value;
      },
      /**
       * 获取列表信息
       */
      getListInfo(){
        this.loading = true;
        _getApiList().then((res) => {
          this.loading = false;
          const data = res.data, result = data.result;
          if (data.code === 200) {
            moment.locale('zh-cn');
            this.tableData = _.forEach(result, (item) => {
              item.date = moment(item.date).format('lll');
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
        });
      },
    },
    mounted(){
      /**
       * 初始化列表信息
       */
      this.getListInfo();
    }
  }
</script>
<style>
  .dialogForm_title {
    text-align: center;
  }

  .api_list_add {
    text-align: right;
    margin-bottom: 20px;
  }

  .api_list {
    width: 90%;
    margin: 0 auto;
  }
</style>
