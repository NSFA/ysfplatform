<template>
  <div style="overflow: auto">
    <div class="guide-main">
      <div class="guide-step">
        <el-steps :space="200" :active="active" finish-status="finish">
          <el-step title="步骤 1" description="开启代理设置" @click.native="active=1"></el-step>
          <el-step title="步骤 2" description="设置拦截项" @click.native="active=2"></el-step>
          <el-step title="步骤 3" description="开始调试使用" @click.native="active=3"></el-step>
        </el-steps>
      </div>
      <div class="guide-description">
        <template v-if="active === 1">
          <div class="description">
            <p>1.Chrome应用商店下载 <a
              href="https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif"
              target="_blank" class="step-a">Proxy SwitchyOmega</a></p>
            <img src="../../assets/guide/step1-1.png" alt="下载Proxy SwitchyOmega" class="step-img">
          </div>
          <div class="description">
            <p>2.设置代理地址为 59.111.99.122，端口8001</p>
            <img src="../../assets/guide/step1-2.png" alt="设置代理地址" class="step-img">
          </div>
        </template>
        <template v-else-if="active === 2">
          <div class="description">
            <p>1.打开<a href="http://59.111.99.122" class="step-a">当前设置网站</a>，AnyProxy设置所需拦截的地址</p>
            <img src="../../assets/guide/step2-1.png" alt="AnyProxy端口" class="step-img">
            <p>2.进入拦截设置</p>
            <img src="../../assets/guide/step2-2.png" alt="进入拦截设置" class="step-img">
            <p>3.添加拦截API，可以添加并设置多个模板</p>
            <img src="../../assets/guide/step2-3.png" alt="设置拦截" class="step-img">
          </div>
        </template>
        <template v-else>
          <div class="description">
            <p>1.选择API模板</p>
            <img src="../../assets/guide/step3-1.png" alt="设置API" class="step-img">
            <p>2.得到设置结果</p>
            <img src="../../assets/guide/step3-2.png" alt="得到结果" class="step-img">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'guide',
    data(){
      return {
        active: 1
      }
    }
  }
</script>
