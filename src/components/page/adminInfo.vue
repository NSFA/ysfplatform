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
    <el-col style="padding-bottom: 20px;width: 300px;display: inline-block;float:right;">
      <el-popover
        ref="popover1"
        title="Proxy Running Info"
        trigger="hover">
        <el-form>
          <template v-for="x in serverInfo.ipAddress">
            <el-form-item label="Host Address">
              <span>{{x}}</span>
            </el-form-item>
          </template>
          <el-form-item label="port">
            <span>{{serverInfo.port}}</span>
          </el-form-item>
          <el-form-item label="wsPort">
            <span>{{serverInfo.wsPort}}</span>
          </el-form-item>
        </el-form>
      </el-popover>
      <el-button v-popover:popover1 type="primary">服务器信息</el-button>
      <el-button type="success" @click="clearList">Clear</el-button>
      <el-button :type="btnType" @click="toggleReceive"> {{recording ? "Stop" : "Resume"}}</el-button>
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
  import {_getInitData, _getlatestLog, _getReqBody} from '../../javascript/getData'
  import {initWs} from '../../javascript/wsUtil'
  import moment from  'moment'
  import{mapState, mapMutations, mapGetters} from 'vuex'
  export default{
    data(){
      return {
        search: '',
        serverInfo: {}
      }
    },
    computed: {
      ...mapState(["recording", "wsInited", "wsList", "initList"]),
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
            case 'update': {
              const record = data.content;
              if (this.recording) {
                const msg = {
                  type: 'updateSingle',
                  data: record
                };
                console.info(JSON.stringify(msg));
              }
              break;
            }

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
      //获取端口号后插入iFrame
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
