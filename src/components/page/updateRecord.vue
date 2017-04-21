<template>
  <div class="update-list">
    <template v-for="(x,index) in List">
      <h2>{{x.version}} 版本更新说明</h2>
      <p>{{x.date}}</p>
      <ol class="m-notes">
        <li v-for="v in x.content">{{v}}</li>
      </ol>
    </template>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        List: [
          {
            version: "v0.1",
            date: "2017年4月11日",
            content: [
              "简单支持响应拦截",
              "通过iFrame支持监控",
              "添加使用简介模块"
            ]
          },
          {
            version: "v0.2",
            date: "2017年4月21日",
            content: [
              "支持访问限速功能",
              "支持请求、响应拦截",
              "支持代理信息监控",
              "添加更新记录模块"
            ]
          },
        ]
      }
    }
  }
</script>
<style lang="scss">
  .update-list {
    padding: 60px;
    h2 {
      font-weight: normal;
      font-size: 20px;
      line-height: 40px;
      color: #3c3e4b;
    }
    p, li {
      white-space: nowrap;
      font-size: 14px;
      line-height: 30px;
      color: #8c8d95;
    }
  }
</style>
