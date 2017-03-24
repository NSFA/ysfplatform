<template>
  <div class="iframe_slot"></div>
</template>

<script>
  import {_getInfo, _getProxy} from '../../javascript/getData'
  import {mapState} from 'vuex'
  import axios from 'axios'
  export default{
    computed: {
      ...mapState(['proxy_switch'])
    },
    data(){
      return {}
    },
    mounted(){
      _getProxy().then((perms) => {
        const parent = document.querySelector('.iframe_slot');
        if (this.proxy_switch && perms.data.result.anyproxy_port) {
          const iframe = document.createElement('iframe');
          const parentHeight = document.body.clientHeight - 120;
          parent.style.height = `${parentHeight}px`;
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = 0;
//          ip 上线需更改为服务器ip, anyproxy 源码里也一样
          iframe.src = `http://10.240.78.177:${perms.data.result.anyproxy_port}`;
          parent.appendChild(iframe);
        } else {
          parent.innerHTML = "服务器未开启"
        }
      });
    }
  }
</script>
