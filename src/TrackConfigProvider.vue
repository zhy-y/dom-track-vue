<template>
  <slot></slot>
</template>
<script setup>
import { watch } from 'vue'
import trackManager from './track-core'

const props = defineProps({
  /**
   * 配置获取函数
   * @returns {Promise<{disabled?: boolean}>} 配置对象
   */
  fetchConfig: {
    type: Function,
    default: null,
  },
  config: {
    type: Object,
    default: () => ({ disabled: trackManager.disabled }),
  },
})

watch(
  () => props.config,
  (newConfig) => {
    if (typeof newConfig?.disabled === 'boolean') {
      trackManager.disabled = newConfig.disabled
    }
  },
  {
    deep: true,
  }
)

// 获取配置
const handleConfig = async () => {
  if (props.fetchConfig) {
    try {
      const config = await props.fetchConfig()
      if (typeof config?.disabled === 'boolean') {
        trackManager.disabled = config.disabled
      }
    } catch (error) {
      console.warn('全局TrackConfigProvider: 获取配置失败，使用默认值', error)
    }
  }
}
props.fetchConfig && handleConfig()
</script>
