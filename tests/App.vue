<template>
  <TrackConfigProvider :config="config">
    <div class="demo-container">
      <h1>DOM-Track 示例</h1>
      <h4>track开关：{{ config }}</h4>
      <button @click="config.disabled = !config.disabled">
        切换track开关：{{ config.disabled ? '禁用' : '启用' }}
      </button>
      <TrackWrapper track-events="click" title="点击事件"> <SimpleDemo /></TrackWrapper>
      <MultiParentDemo />
    </div>
  </TrackConfigProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SimpleDemo from './src/components/simple-demo/simple-demo.vue'
import MultiParentDemo from './src/components/multi-component/multi-demo.vue'
import { useFormatter } from '../src/hooks'

// 定义配置类型
const config = ref({ disabled: true })

// 模拟配置获取
const fetchConfig = async () => {
  // 模拟API延迟
  const res = await new Promise<{ disabled: boolean }>((resolve) =>
    setTimeout(() => resolve({ disabled: Math.random() > 0.5 }), 100)
  )
  config.value = res
  return res
}

fetchConfig()

useFormatter<string>((formatter) => {
  const formatted = formatter('custom')
  console.log(formatted)
  return (params: string) => `【APP】-> ${params}`
})
</script>

<style>
.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
.wrapper-content {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 4px;
}
</style>
