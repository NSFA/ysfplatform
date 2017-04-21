<template>
  <div class="iframe_slot" style="padding: 20px;">
    <el-col style="padding-bottom: 20px;width: 200px;display: inline-block;float: right;">
      <el-input
        placeholder="搜索"
        icon="search"
        v-model="filter"
        :autofocus="true">
      </el-input>
    </el-col>
    <el-col style="padding-bottom: 20px;width: 500px;display: inline-block;float:right;">
      <el-popover
        ref="popover1"
        title="服务器信息"
        trigger="hover">
        <el-form>
          <el-form-item label="拦截模式">
            <span>HTTP</span>
          </el-form-item>
          <template v-for="x in serverInfo.ipAddress">
            <el-form-item label="IP地址">
              <span>{{x}}</span>
            </el-form-item>
          </template>
        </el-form>
      </el-popover>
      <el-popover
        ref="popover2"
        title="HTTPS 证书信息"
        trigger="hover">
        <div style="text-align: center">
          <h4>手机扫描下载</h4>
          <div v-html="qrCode.qrImgDom"></div>
          <a :href="qrCode.url" download>
            <el-button>点击下载</el-button>
          </a>
        </div>
      </el-popover>
      <el-button v-popover:popover2 type="primary">获取证书</el-button>
      <el-button v-popover:popover1 type="primary">服务器信息</el-button>
      <el-button type="success" @click="clearList">Clear</el-button>
      <el-button :type="btnType" @click="SET_RECORDING"> {{recording ? "Stop" : "Resume"}}</el-button>
      <el-button type="info" @click="reloadList">Reload</el-button>
    </el-col>
    <el-table
      :data="wsListFilter"
      style="width: 100%" stripe border>
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" class="list-expand" labelWidth="150px">
            <el-form-item label="id">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="method">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="Host">
              <span>{{ props.row.host}}</span>
            </el-form-item>
            <el-form-item label="Path">
              <span>{{ props.row.path }}</span>
            </el-form-item>
            <el-form-item label="MIME-Type">
              <span>{{ props.row.mime }}</span>
            </el-form-item>
            <el-form-item label="startTime">
              <span>{{ props.row.startTime | momentFormat }}</span>
            </el-form-item>
            <el-form-item label="endTime">
              <span>{{ props.row.endTime | momentFormat}}</span>
            </el-form-item>
            <el-form-item label="reqBody">
              <span>{{ props.row.reqBody }}</span>
            </el-form-item>
            <h3 v-show="props.row.reqHeader">Request Header</h3>
            <template v-for="(value,key,index) in props.row.reqHeader">
              <el-form labelWidth="150px">
                <el-form-item :label="key">
                  <span>{{value}}</span>
                </el-form-item>
              </el-form>
            </template>
            <h3 v-show="props.row.resHeader">Response Header</h3>
            <template v-for="(value,key,index) in props.row.resHeader">
              <el-form labelWidth="150px">
                <el-form-item :label="key">
                  <span>{{value}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="#"
        width="100">
      </el-table-column>
      <el-table-column
        prop="timeZh"
        label="时间"
        width="200">
      </el-table-column>
      <el-table-column
        prop="protocol"
        label="协议"
        width="100">
      </el-table-column>
      <el-table-column
        prop="method"
        label="Method"
        width="100">
      </el-table-column>
      <el-table-column
        prop="statusCode"
        label="Status"
        width="100">
      </el-table-column>
      <el-table-column
        prop="host"
        label="Host"
        width="200"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="path"
        label="PATH" :show-overflow-tooltip="true">
      </el-table-column>
    </el-table>
    <template v-if="filter.length">
      <el-pagination
        style="margin-top: 20px;float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterSet.currentPage"
        :page-sizes="[20, 50, 100]"
        :page-size="filterSet.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="filterSet.total">
      </el-pagination>
    </template>
  </div>
</template>
<script>
  import {_getInitData, _getlatestLog, _getReqBody, _getQrCode} from '../../javascript/getData'
  import {initWs} from '../../javascript/wsUtil'
  import moment from  'moment'
  import{mapState, mapMutations, mapGetters, mapActions} from 'vuex'
  export default{
    data(){
      return {
        serverInfo: {}, //服务器信息
        qrCode: {} //二维码信息
      }
    },
    computed: {
      //筛选字符串
      filter: {
        get () {
          return this.$store.state.filter
        },
        set (value) {
          this.$store.commit('SET_WS_LIST_FILTER', value)
        }
      },

      //暂停开关样式
      btnType(){
        return this.recording ? "warning" : "primary"
      },

      ...mapState(["recording", "wsInited", "initList", "filterSet"]),

      ...mapGetters(['wsListFilter']),
    },

    methods: {

      ...mapMutations(['SET_WS', 'SET_WS_LIST', 'SET_WS_LIST_FILTER', 'SET_RECORDING', 'SET_INIT_LIST', 'SET_FILTER']),

      ...mapActions(['reloadList', 'clearList', 'onWsMessage']),


      /**
       * 筛选时，单页条数改变
       */
      handleSizeChange(val){
        this.SET_FILTER({
          pageSize: val
        })
      },

      /**
       *筛选时，当前页数改变
       */
      handleCurrentChange(val){
        this.SET_FILTER({
          currentPage: val
        })
      },

      /**
       * 初始化Ws对象
       * @param wsPort
       */
      initWsServer(wsPort) {
        if (!wsPort || this.wsInited) {
          return;
        }

        const wsClient = initWs(wsPort);
        this.SET_WS(true);

        wsClient.onmessage = this.onWsMessage;
      },

    },
    mounted(){

      /**
       * 获取https证书二维码
       */
      _getQrCode().then((res) => {
        this.qrCode = res.data;
      });


      /**
       * 获取服务器初始化信息
       */
      _getInitData().then((perms) => {
        this.initWsServer(perms.data.wsPort);
        this.serverInfo = perms.data;
      });

      /**
       * 如果没有初始化过，
       * 拉取记录列表
       */
      if (!this.initList) {
        _getlatestLog().then((res) => {

          this.SET_INIT_LIST(true);
          this.SET_WS_LIST({
            type: "init",
            data: res.data.result
          })

        });
      }
    },

    filters: {
      momentFormat(value){
        if (!value)return "--";
        moment.locale("zh-cn");
        return moment(value).format('lll');
      }
    }
  }
</script>
