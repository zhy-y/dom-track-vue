<template>
  <h2 @click="$emit('click')">基础示例</h2>
  <section>
    <h2>1. 使用指令方式</h2>
    <section v-dom-track>1.0 指令 - 默认使用方式</section>
    <section
      v-dom-track="{
        title: '1.1 手动传入 title、content',
        content: '默认内容示例',
      }"
    >
      1.1 手动传入 title、content
    </section>
    <section v-dom-track="{ title: '1.2 指令-自动获取内容' }">1.2 指令 - 自动获取内容</section>
    <section v-dom-track="{ title: '默认params', beforeTrack: handlebeforeTrack }">
      1.3 默认params - 手动处理 beforeTrack
    </section>

    <h2>2. 使用 TrackWrapper 组件方式</h2>
    <TrackWrapper title="2.1 TrackWrapper" type="wrapper">
      <div class="wrapper-content">2.1 TrackWrapper - 默认 mounted 时track</div>
    </TrackWrapper>
    <br />

    <button text @click="open = !open">2.2 打开弹框 - 捕获指定事件</button>
    <TrackWrapper :track-events="['open']" title="2.2 打开弹框 - 捕获指定事件">
      <jd-dialog v-model="open" title="dialog" append-to-body> 2.2 这是弹框内容 </jd-dialog>
    </TrackWrapper>

    <button text @click="open2 = !open2">2.3 打开弹框 -手动处理@track事件</button>
    <TrackWrapper
      :track-events="['open']"
      title="2.3 打开弹框 - 手动处理@track事件"
      @track="handleManualTrack"
      :config="{ manual: true }"
    >
      <jd-dialog v-model="open2" title="dialog" append-to-body> 2.3 这是弹框内容 </jd-dialog>
    </TrackWrapper>

    <h2>3. 直接调用</h2>
    <button @click="handleTrackUser">3.1 直接track</button>
    <button @click="handleAsyncTrackUser">3.2 异步track</button>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TrackWrapper, asyncTrackUser, trackUser, useFormatter } from '../../../../src'
import type { DomTrackBinding, TrackData } from '../../../../src/types'
defineOptions({
  name: 'SimpleDemo',
})
// 定义emit事件
defineEmits<{
  click: []
}>()

// 定义ref类型
const open = ref<boolean>(false)
const open2 = ref<boolean>(false)

// 定义事件处理函数
const formatter = useFormatter<string>(() => {
  return (params) => `【基础示例】${params || ''}`
})

const handleTrackUser = (): void => {
  trackUser({
    title: formatter('3.1 直接调用'),
    content: '通过API直接调用',
    type: 'html',
  })
}

const handleAsyncTrackUser = (): void => {
  asyncTrackUser({
    title: formatter('3.2 异步调用'),
    content: '通过API直接调用',
    type: 'html',
  })
}

const handleManualTrack = (context: TrackData, args?: any[]): void => {
  console.log('handleManualTrack 追踪到事件:', context, args)
  trackUser(context)
}

const handlebeforeTrack: DomTrackBinding['beforeTrack'] = ({ el, binding }) => {
  return Promise.resolve({
    title: `1.3 【${binding.value.title}】 - 手动处理 beforeTrack`,
    content: '自定义内容',
  })
}
</script>
<style lang="scss" scoped></style>
