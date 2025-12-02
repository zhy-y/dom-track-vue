# DOM-Track-Vue

Vue 3 DOM 跟踪插件，用于跟踪和记录用户在 Vue 应用中的交互行为，支持组件生命周期、自定义事件和属性变化的跟踪。

## 功能特性

- 🔧 **灵活的跟踪配置**：支持自动/手动跟踪、延迟跟踪、事件类型配置等
- 📊 **全面的行为记录**：跟踪组件挂载、卸载、自定义事件和属性变化
- 📝 **智能内容捕获**：自动获取组件的 HTML 内容和状态
- 🎯 **精细的属性监控**：可配置监听特定组件属性的变化
- 🔄 **多种使用方式**：支持插件安装、单独组件导入和指令使用
- 💡 **可扩展的上下文**：支持自定义跟踪数据的上下文信息
- 🏷️ **标题格式化**：支持层级化的标题格式化和上下文传递
- ⚙️ **配置管理**：支持全局和局部的跟踪配置管理

## 安装

使用 npm、yarn 或 pnpm 安装：

```bash
# npm
npm install dom-track-vue

# yarn
yarn add dom-track-vue

# pnpm
pnpm install dom-track-vue
```

## 快速开始

### 作为插件全局安装

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import DOMTrack from "dom-track-vue";

const app = createApp(App);

// 安装插件并配置跟踪函数
app.use(DOMTrack, {
  // 跟踪数据处理函数
  onTrack: (data) => {
    console.log("跟踪数据:", data);
    // fetch('/api/track', { method: 'POST', body: data })
  },
  // 获取即时上下文信息
  context: () => ({
    timestamp: Date.now(),
    userId: "userId",
  }),
  // 暴露键配置
  exposedKeys: {
    jdDialog: ["dialogContentRef", "$el", "outerHTML"],
    jdAlert: ["content"],
    jdButton: ["ref", "outerHTML"],
    myComponent: ["targetRef", "outerHTML"],
  },
  // 默认是否禁用跟踪
  defaultDisabled: false,
});

app.mount("#app");
```

## API 文档

### 1. 插件配置选项

| 选项              | 类型     | 必需 | 说明                                     |
| ----------------- | -------- | ---- | ---------------------------------------- |
| `delay`            | Number    | 否   | 默认跟踪延迟时间（毫秒），默认为 2000        |
| `exposedKeys`     | Object   | 否   | 组件暴露键配置，用于获取组件指定 HTML 内容   |
| `defaultDisabled` | Boolean  | 否   | 默认是否禁用跟踪，默认为 false           |
| `defaultFormatter` | Function  | 否   | 默认格式化函数，默认为 `(params) => params` |
| `onTrack`         | Function | 否   | 跟踪数据处理函数，默认输出到控制台       |
| `getContext`         | Function | 否   | 获取即时上下文信息的函数，默认返回空对象 |

### 2. TrackWrapper 组件属性

| 属性            | 类型          | 必需 | 说明                                 |
| --------------- | ------------- | ---- | ------------------------------------ |
| `title`         | Any        | 否   | 跟踪标题                             |
| `trackEvents`   | String\|Array | 否   | 要跟踪的事件类型                     |
| `config`        | Object        | 否   | 跟踪配置对象                         |
| `innerHtmlKeys` | String\|Array | 否   | 自定义 HTML 键名，优先级高于组件键名 |

#### config 配置选项

| 属性        | 类型    | 默认值   | 说明                   |
| ----------- | ------- | -------- | ---------------------- |
| `delay`     | Number  | 2000     | 延迟跟踪时间（毫秒）   |
| `manual`    | Boolean | false    | 是否手动触发跟踪       |
| `type`      | String  | "dialog" | 跟踪类型               |
| `deps`      | Array   | []       | 监听的依赖属性         |
| `immediate` | Boolean | false    | 是否立即跟踪           |
| `disabled`  | Boolean | false    | 是否禁用跟踪           |

### 3. TrackFormatter 组件属性

| 属性        | 类型     | 默认值 | 说明                     |
| ----------- | -------- | ------ | ------------------------ |
| `prefix`    | String   | ""     | 标题前缀                 |
| `suffix`    | String   | ""     | 标题后缀                 |
| `formatter` | Function | null   | 自定义格式化函数         |

### 4. TrackConfigProvider 组件属性

| 属性        | 类型     | 默认值 | 说明               |
| ----------- | -------- | ------ | ------------------ |
| `fetchConfig` | Function | null   | 异步获取配置的函数 |
| `config`    | Object   | {}     | 配置对象           |

### 5. domTrack 指令绑定值

| 属性                     | 类型     | 必需 | 说明                   |
| ------------------------ | -------- | ---- | ---------------------- |
| `title`                  | Any   | 是   | 跟踪标题               |
| `content`                | String   | 否   | 跟踪内容               |
| `type`                   | String   | 是   | 跟踪类型               |
| `trackOnlyBeforeUnmount` | Boolean  | 否   | 是否仅在组件卸载前跟踪 |
| `beforeTrack`            | Function | 否   | 自定义跟踪处理函数     |

### 6. trackUser 函数参数

| 参数           | 类型    | 必需 | 说明         |
| -------------- | ------- | ---- | ------------ |
| `title`        | Any  | 是   | 跟踪标题     |
| `content`      | String  | 否   | 跟踪内容     |
| `type`         | String  | 是   | 跟踪类型     |
| `arguments`       | Any     | 否   | 其他自定义参数 |

### 7. asyncTrackUser 函数参数

| 参数              | 类型             | 必需 | 说明                            |
| ----------------- | ---------------- | ---- | ------------------------------- |
| `title`           | Any           | 否   | 跟踪标题                        |
| `content`         | String           | 否   | 跟踪内容                        |
| `contentSelector` | String\|Function | 否   | 内容选择器或获取函数            |
| `targetRef`       | Object           | 否   | 目标元素引用                    |
| `delay`           | Number           | 否   | 延迟时间（毫秒），默认 2000     |
| `type`            | String           | 是   | 跟踪类型          
| `arguments`       | Any     | 否   | 其他自定义参数 |              |

### 8. useFormatter 钩子函数

`useFormatter` 钩子现在是处理所有格式化需求的统一接口，提供更灵活的格式化能力。

| 参数       | 类型     | 必需 | 说明                |
| ---------- | -------- | ---- | ------------------- |
| `formatter` | Function | 否   | 格式化函数，可以是单层函数或接收之前格式化函数的嵌套函数 |

| 返回值        | 类型     | 说明                |
| ------------- | -------- | ------------------- |
| `formatter` | Function | 未传入参数则返回父级或初始化时的格式化函数，可用于访问父级格式化逻辑。否则返回组合后的格式化函数 |


## 基础用法

### 单独使用组件

```vue
<template>
  <div>
    <!-- 使用 TrackWrapper 包装组件 -->
    <TrackWrapper
      title="用户登录表单"
      :trackEvents="['submit']"
      :config="{ type: 'form', delay: 500, }"
    >
      <LoginForm />
    </TrackWrapper>

    <!-- 使用全局配置开关 -->
    <TrackConfigProvider :config="{ disabled }">
      <TrackWrapper title="动态内容">
        <DynamicContent />
      </TrackWrapper>
    </TrackConfigProvider>
  </div>
</template>

<script setup>
import {
  TrackWrapper,
  TrackFormatter,
  TrackConfigProvider,
} from "dom-track-vue";
</script>
```

### 使用 DOM 指令

```vue
<template>
  <div>
    <!-- 基本用法 -->
    <div v-dom-track="{ title: '首页横幅', type: 'banner' }">
      这是一个会被跟踪的 DOM 元素
    </div>

    <!-- 带自定义处理函数 -->
    <button
      v-dom-track="{
        title: '提交按钮',
        type: 'click',
        beforeTrack: async ({ el, binding }) => {
          return {
            title: '自定义标题',
            content: el.textContent,
          };
        },
      }"
    >
      提交
    </button>

    <!-- 仅在卸载前跟踪 -->
    <div
      v-dom-track="{
        title: '临时组件',
        type: 'temp',
        trackOnlyBeforeUnmount: true,
      }"
    >
      临时内容
    </div>
  </div>
</template>

<script setup>
// 确保已安装插件或单独导入指令
import { domTrack } from "dom-track-vue";
</script>
```

### 编程式跟踪

```vue
<script setup>
import { trackUser, asyncTrackUser } from "dom-track-vue";  

// 立即跟踪
const handleImmediateTrack = () => {
  trackUser({
    title: "用户操作",
    content: "点击了按钮",
    type: "click",
  });
};

// 异步跟踪
const handleAsyncTrack = () => {
  asyncTrackUser({
    title: "异步操作",
    contentSelector: () => document.querySelector(".modal-content")?.innerHTML,
    type: "modal",
    delay: 1000,
  });
};
</script>
```

## 导出的组件和函数

```javascript
import {
  // 组件
  TrackWrapper,           // 跟踪包装组件
  TrackFormatter,     // 标题格式化提供者
  TrackConfigProvider,    // 配置提供者

  // 指令
  domTrack,              // DOM跟踪指令

  // 函数
  trackUser,             // 编程式跟踪
  asyncTrackUser,        // 异步跟踪
  useFormatter,              // 跟踪格式化钩子

  // 默认导出（插件）
  default                // Vue插件
} from "dom-track-vue";
```

## 高级用法

### 1. 层级化标题格式化

```vue
<!-- 父组件提供标题格式化 -->
<template>
  <TrackFormatter formatter="customFormatter">
    <UserPage />
  </TrackFormatter>
  <!-- 使用标题格式化提供者 -->
  <TrackFormatter prefix="customPrefix" suffix="customSuffix">
    <TrackWrapper title="用户列表">
      <UserList />
    </TrackWrapper>
  </TrackFormatter>
</template>

<!-- 子组件自动继承格式化 -->
<template>
  <TrackWrapper title="用户列表">
    <!-- 跟踪标题会变成: customPrefix 用户列表 customSuffix -->
    <UserList />
  </TrackWrapper>
</template>
```

### 2. 动态配置管理

```vue
<template>
  <TrackConfigProvider
    :fetch-config="
      async () => {
        const config = await fetchUserConfig();
        return { disabled: !config.enableTracking };
      }
    "
  >
    <TrackWrapper title="动态配置组件">
      <DynamicComponent />
    </TrackWrapper>
  </TrackConfigProvider>
</template>
```

### 3. 属性依赖监听

```vue
<template>
  <TrackWrapper
    title="表单组件"
    :config="{
      deps: ['formData', 'isValid'],
      type: 'form',
    }"
  >
    <FormComponent ref="formRef" />
  </TrackWrapper>
</template>

<script setup>
// 当 formRef.value.formData 或 formRef.value.isValid 发生变化时
// 会自动触发跟踪事件
</script>
```

### 4. 编程式标题格式化

```vue
<script setup>
import { useFormatter } from "dom-track-vue";
import { ref } from "vue";

const currentProject = ref("项目A");

// 使用useFormatter钩子提供格式化功能
const formatTitle = useFormatter((title) => {
  return `[仪表板|${currentProject.value}] ${title}`;
});

// 使用格式化函数
const formattedTitle = formatTitle("用户操作"); // 输出: [仪表板|项目A] 用户操作
</script>
```

### 5. 嵌套组件的标题继承

```vue
<!-- GrandParent.vue -->
<template>
  <ParentComponent />
</template>

<script setup>
import { useFormatter } from "dom-track-vue";

// 设置根级别格式化
useFormatter((title) => `[应用级别] ${title}`);
</script>

<!-- ParentComponent.vue -->
<template>
  <ChildComponent />
</template>

<script setup>
import { useFormatter } from "dom-track-vue";

// 使用useFormatter钩子获取父级格式化函数并扩展
useFormatter((prevFormatter) => {
  return (title) => {
    // 获取父级格式化的结果
    const parentTitle = prevFormatter(title);
    // 添加当前级别的格式化
    return `[模块级别] ${parentTitle}`;
  };
});
</script>

```

### 6. useFormatter 钩子函数

`useFormatter` 钩子现在是处理所有格式化需求的统一接口，提供更灵活的格式化能力。

```javascript
// 使用示例 - 基本格式化
const formatter = useFormatter(
  (prevFormatter) => {
    // prevFormatter 是之前的格式化函数（从上层继承）
    return (params) => {
      // 先应用之前的格式化（保留继承关系）
      const prevResult = prevFormatter(params);
      // 然后应用新的格式化逻辑
      return {
        ...prevResult,
        enhanced: true,
        timestamp: Date.now()
      };
    };
  }
);

// 使用示例 - 简单模式（无继承处理）
const formatter = useFormatter();

// 使用格式化后的函数
const formattedResult = formatter({ title: "用户操作" });
```
#### 关键优势

- **统一接口**：替代了多个相关函数，简化API
- **完整继承**：自动处理格式化函数的继承关系
- **类型安全**：支持泛型，提供更好的TypeScript类型支持
- **灵活性**：支持简单模式和复杂嵌套模式
