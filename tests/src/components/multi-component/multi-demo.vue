<template>
  <h2>高阶用法</h2>
  <section>
    <h2>4. 多级嵌套组件</h2>
    <h4>父级：【高阶用法】</h4>
    <div class="parent-section">
      <h3>4.1 继承父级</h3>
      <section
        v-dom-track="{
          title: '4.1.1 普通dom指令',
        }"
      >
        4.1.1 普通dom指令1
      </section>

      <TrackWrapper track-events="click" title="4.1.2 TrackWrapper 全局继承" type="view">
        <button class="demo-btn">4.1.2 TrackWrapper 全局继承 - click</button>
      </TrackWrapper>

      <h3>4.2 局部自定义格式化</h3>
      <TrackFormatter prefix="4.2.1 局部【前缀】-> " suffix="-> 【尾缀】">
        <section
          v-dom-track="{
            title: '4.2.1 局部指令',
          }"
        >
          4.2.1 局部【前后缀】【使用 TrackFormatter 自定义前后缀】
        </section>
      </TrackFormatter>

      <TrackFormatter :formatter="handleCustom">
        <section
          v-dom-track="{
            title: '4.2.2 局部指令',
          }"
        >
          4.2.2 局部【自定义格式化】【使用 TrackFormatter 自定义格式化】
        </section>

        <TrackWrapper track-events="click" title="4.2.3 TrackWrapper局部" type="view">
          <button class="demo-btn">4.2.3 TrackWrapper局部 - click</button>
        </TrackWrapper>
      </TrackFormatter>
    </div>
    <!-- <TrackFormatter :formatter="(title) => `4.2 【高阶用法】-> ${title}`"> -->
    <div class="multi-parent-demo">
      <h3>4.3 更深级子组件</h3>
      <h4>父级【高阶用法】</h4>
      <section class="parent-section">
        <TrackWrapper
          title="4.3.0 监听属性变化"
          :config="{
            deps: ['count'],
          }"
        >
          <MultiDemoA />
        </TrackWrapper>
      </section>
    </div>
    <!-- </TrackFormatter> -->
  </section>
</template>

<script setup lang="ts">
import MultiDemoA from './multi-a.vue'
import { useFormatter } from '../../../../src'

useFormatter<string>((formatter) => {
  const _params = formatter('【高阶用法】')
  return (params: string) => `${_params} -> ${params}`
})

const handleCustom = (params: string) => `4.2.2 局部【自定义格式化】-> ${params}`
</script>

<style scoped>
.multi-parent-demo {
  border-radius: 8px;
}

.parent-section {
  margin: 20px 0;
  border-radius: 6px;
}
</style>
