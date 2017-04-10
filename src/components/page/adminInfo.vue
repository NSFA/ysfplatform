<template>
  <div class="iframe_slot"></div>
</template>
<script>
  import {_getProxy} from '../../javascript/getData'
  export default{
    mounted(){
      _getProxy().then((perms) => {
        const parent = document.querySelector('.iframe_slot');
        const iframe = document.createElement('iframe');
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = 0;
        //打包需更改为服务器ip, anyproxy代码里也一样 59.111.99.122
        iframe.src = `http://localhost:${perms.data.result.anyproxy_port}`;
        parent.appendChild(iframe);
      });
    }
  }
</script>
<style>
  .iframe_slot {
    padding: 20px;
  }
</style>
