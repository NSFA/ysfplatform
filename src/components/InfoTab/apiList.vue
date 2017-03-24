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
        :filters="[{ text: '开启', value: '开启' }, { text: '关闭', value: '关闭' }]"
        :filter-method="filterTag">
        <template scope="scope">
          <el-tag
            :type="scope.row.status === '开启' ? 'primary' : 'warning'"
            close-transition>{{scope.row.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template scope="scope">
          <el-button @click="deleteClick(scope.row.pid)" type="text" size="small">移除</el-button>
          <el-button @click="editClick(scope.row.pid)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import editor from '../editor.vue'
  import {_getApiList,_delApi} from '../../javascript/getData'
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
      dialogOpen(){
        this.$nextTick(function () {
          this.$refs['editor'].$emit('openDialog');
        })
      },
      deleteClick(pid){
        _delApi(pid).then((res)=>{
          const data = res.data, result = data.result;
          if (data.code === 200) {
            this.tableData = _.filter(this.tableData, (item) => item.pid !== pid)
          } else {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
        });
      },
      editClick(pid) {
        this.dialog_id = +pid;
        this.dialogFormVisible = true;
      },
      filterTag(value, row) {
        return row.status === value;
      },
      getList(){
        this.loading = true;
        _getApiList.then((res) => {
          this.loading = false;
          const data = res.data, result = data.result;
          if (data.code === 200) {
            _.assign(this.tableData, result);
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
//        this.getList();
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
