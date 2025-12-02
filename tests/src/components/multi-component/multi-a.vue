<template>
  <h4>子组件A</h4>
  <TrackWrapper
    track-events="click"
    title="用户操作"
    type="user-action"
    :config="{ manual: true }"
    @track="handleUserAction"
  >
    <button>click - manual 手动 track 事件</button>
  </TrackWrapper>

  <button
    v-dom-track="{
      title: '子组件A-指令',
      type: 'directive-a',
    }"
    @click="handleClick"
  >
    子组件A指令按钮 - 点击后 count: {{ count }}
  </button>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { trackUser, useFormatter } from '../../../../src/index'
import type { TrackData } from '../../../../src/types'

// 定义ref类型
const count = ref<number>(0)

// 定义emit事件
const emit = defineEmits<{
  change: []
}>()

const handleClick = (): void => {
  count.value = count.value + 1
  emit('change')
}

const formatter = useFormatter<string>((formatter) => {
  const _params = formatter('4.2.1【嵌套02】')
  return (params: string) => `${_params} -> ${params}`
})

const handleUserAction = (context: TrackData): void => {
  trackUser({
    ...context,
    title: formatter(`子组件A`),
    content: '子组件A的编程式调用',
    type: 'programmatic-a',
  })
}

defineExpose({
  count,
})
</script>

<style scoped>
.parent-a {
  padding: 15px;
  border-radius: 6px;
}
.child-a {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

button {
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
