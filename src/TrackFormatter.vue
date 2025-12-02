<template>
  <slot></slot>
</template>

<script setup>
import { useFormatter } from './hooks'

const props = defineProps({
  // 标题前缀
  prefix: {
    type: String,
    default: '',
  },
  // 标题后缀
  suffix: {
    type: String,
    default: '',
  },
  // 自定义格式化函数
  formatter: {
    type: Function,
    default: null,
  },
})

// 创建格式化函数
const createFormatter = () => {
  if (props.formatter && typeof props.formatter === 'function') {
    return props.formatter
  }

  return (params) => {
    const parts = []
    if (props.prefix) parts.push(props.prefix)
    if (params) parts.push(params)
    if (props.suffix) parts.push(props.suffix)
    return parts.join(' ')
  }
}

useFormatter(() => createFormatter())
</script>
