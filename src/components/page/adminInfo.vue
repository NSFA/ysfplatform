<template>
  <div class="iframe_slot" style="padding: 20px;">
    <el-col style="padding-bottom: 20px;width: 200px;display: inline-block;float: right;">
      <el-input
        placeholder="搜索"
        icon="search"
        v-model="search"
        :on-icon-click="handleIconClick" :autofocus="true" @keyup.enter.native="handleIconClick">
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
          <el-form-item label="webSocket">
            <span>{{serverInfo.wsPort}}</span>
          </el-form-item>
        </el-form>
      </el-popover>
      <el-popover
        ref="popover2"
        title="证书信息"
        trigger="hover">
        <div style="text-align: center">
          <h4>手机扫描下载</h4>
          <div v-html="qrCode.qrImgDom"></div>
          <p>证书安装情况：{{qrCode.isRootCAFileExists ? "已安装" : "未安装"}}</p>
          <a :href="qrCode.url" download>
            <el-button>点击下载</el-button>
          </a>
        </div>
      </el-popover>
      <el-button v-popover:popover2 type="primary">获取证书</el-button>
      <el-button v-popover:popover1 type="primary">服务器信息</el-button>
      <el-button type="success" @click="clearList">Clear</el-button>
      <el-button :type="btnType" @click="toggleReceive"> {{recording ? "Stop" : "Resume"}}</el-button>
      <el-button type="primary" @click="Reload">Reload</el-button>
    </el-col>
    <el-table
      :data="wsListFilter"
      style="width: 100%" stripe border
      :default-sort="{prop: 'id', order: 'descending'}">
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
        width="100" sortable>
      </el-table-column>
      <el-table-column
        prop="protocol"
        label="Protocol"
        width="100">
      </el-table-column>
      <el-table-column
        prop="method"
        label="Method"
        width="180">
      </el-table-column>
      <el-table-column
        prop="statusCode"
        label="Status"
        width="180">
      </el-table-column>
      <el-table-column
        prop="host"
        label="Host" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="path"
        label="PATH" :show-overflow-tooltip="true">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {_getInitData, _getlatestLog, _getReqBody, _getQrCode} from '../../javascript/getData'
  import {initWs} from '../../javascript/wsUtil'
  import moment from  'moment'
  import{mapState, mapMutations, mapGetters} from 'vuex'
  export default{
    data(){
      return {
        serverInfo: {},
        search: "",
        qrCode: {}
      }
    },
    computed: {
      ...mapState(["recording", "wsInited", "wsList", "initList", 'filter']),
      ...mapGetters(['wsListFilter']),
      btnType(){
        return this.recording ? "warning" : "primary"
      }
    },
    methods: {
      ...mapMutations(['SET_WS', 'SET_WS_LIST', 'SET_WS_LIST_FILTER', 'SET_RECORDING', 'SET_INIT_LIST']),
      clearList(){
        this.SET_WS_LIST({
          type: "clear"
        })
      },
      Reload(){
        _getlatestLog().then((res) => {
          this.SET_WS_LIST({
            type: "init",
            data: res.data.result
          })
        });
      },
      toggleReceive(){
        this.SET_RECORDING();
      },
      handleIconClick(){
        this.SET_WS_LIST_FILTER(this.search)
      },
      onWsMessage(event) {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'updateMultiple': {
              const records = data.content;
              if (this.recording) {
                const msg = {
                  type: 'updateMultiple',
                  data: records
                };
                this.filterData(records);
              }
              break;
            }
            default : {
              break;
            }
          }
        } catch (error) {
          console.error(error);
          console.error('Failed to parse the websocket data with message: ', event.data);
        }
      },
      initWsServer(wsPort) {
        if (!wsPort || this.wsInited) {
          return;
        }
        this.SET_WS(true);
        const wsClient = initWs(wsPort);
        wsClient.onmessage = this.onWsMessage;
      },
      filterData(res){
        const data = res[res.length - 1], index = _.findIndex(this.wsList, function (o) {
          return o.id === data.id;
        });
        if (index === -1) {
          this.SET_WS_LIST({
            type: "add",
            data: data
          })
        } else {
          this.SET_WS_LIST({
            type: "change",
            data: data,
            index: index
          });
        }
      },
    },
    mounted(){
      this.search = this.filter;

      _getQrCode().then((res) => {
        this.qrCode = res.data;
      });

      _getInitData().then((perms) => {
        this.initWsServer(perms.data.wsPort);
        this.serverInfo = perms.data;
      });

      if (!this.initList) {
        _getlatestLog().then((res) => {
          this.SET_INIT_LIST();
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
