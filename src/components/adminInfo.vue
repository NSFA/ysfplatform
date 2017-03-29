<template>
  <div class="iframe_slot"></div>
</template>

<script>
  import {_getInfo, _getProxy} from '../javascript/getData'
  import {mapState} from 'vuex'
  import axios from 'axios'
  export default{
    data(){
      return {}
    },
    mounted(){
      _getProxy().then((perms) => {
        const parent = document.querySelector('.iframe_slot');
          const iframe = document.createElement('iframe');
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = 0;
//          ip 上线需更改为服务器ip, anyproxy 源码里也一样
          iframe.src = `http://localhost:${perms.data.result.anyproxy_port}`;
          parent.appendChild(iframe);
      });
    }
  }
</script>
<style>
  .iframe_slot{
    padding: 20px;
  }
</style>
