<template>
  <div class="api_list">
    <div class="api_list_add">
      <el-button type="primary" icon="edit" @click="editClick(-1)">添加</el-button>
      <el-dialog v-model="dialogFormVisible" :modal-append-to-body="false" :show-close="false" @open="dialogOpen" @close="dialogClose">
        <reqEditor :dialog_id="dialog_id" ref="editor"></reqEditor>
      </el-dialog>
    </div>
    <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" border>
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="list-expand">
            <el-form-item label="API:">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ props.row.date }}</span>
            </el-form-item>
            <el-form-item label="更新时间:">
              <span>{{ props.row.update }}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span>{{ props.row.status ? '开启' : '关闭' }}</span>
            </el-form-item>
            <template v-for="(x,index) in props.row.reqArr">
              <el-form-item :label="props.row.templateOptions[index-1].label">
                <span>{{x}}</span>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="创建日期" sortable width="200"></el-table-column>
      <el-table-column prop="update" label="更新时间" sortable width="200"></el-table-column>
      <el-table-column prop="name" sortable label="请求拦截API">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100"
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
  import reqEditor from '../editor/reqEditor.vue'
  import {_getReqApiList, _delReqApi} from '../../javascript/getData'
  import moment from 'moment'
  export default{
    components: {
      reqEditor
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
      dialogClose(){
        this.$refs['editor'].$emit('closeDialog');
      },
      /**
       * 删除Api
       * @param pid
       */
      deleteClick(pid){
        this.$confirm('此操作将永久删除该API, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          _delReqApi({id: pid}).then((res) => {
            const data = res.data;
            if (data.code === 200) {
              this.tableData = _.filter(this.tableData, (item) => item._id !== pid);
              this.$message.success({
                message: "删除Api成功"
              });
            } else {
              this.$message.error({
                message: data.msg
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
        _getReqApiList().then((res) => {
          this.loading = false;
          const data = res.data, result = data.result;
          if (data.code === 200) {
            moment.locale('zh-cn');
            this.tableData = _.forEach(result, (item) => {
              item.date = moment(item.date).format('lll');
              item.update = moment(item.update).format('lll');
            });
          } else {
            this.$message.error({
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
