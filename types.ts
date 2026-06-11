---
name: taro-project
description: Scaffolds and develops Taro mini-program applications with React syntax for WeChat.
allowed_create_modes:
  - miniprogram
---
# Taro 小程序开发规范

## 核心约束

- **Taro 4.x + React + TypeScript + pnpm**，开发端口固定 `3015`（H5 预览）
- **必须**使用 `@tarojs/components`（View / Text / Button / Input / Image 等），禁用原生 HTML 标签
- **必须** Tailwind CSS 原子类；**禁止**任意值（`w-[340px]` / `text-[14px]`）和硬编码 `style={{ width: '200px' }}`，`style` 只用于跨端兼容修正
- **禁止** 直接 `process.env.XXX` 读环境变量，走项目内的配置入口
- 包体限制：主包 ≤ 2MB，总包 ≤ 20MB
- 首页路径必须是 `pages/index/index`
- TabBar 不要手动实现，在 `app.config.ts` 配置；如配置 TabBar 必须 ≥ 2 个（推荐 ≤ 4），少于 2 个微信会报错
- 真机预览 / 发布：引导用户在 Meoo 平台配置 APPID
- 启动开发：`pnpm run dev`；任务完成总结前必须跑 `pnpm run validate && pnpm run dev` 校验
- **检查类命令禁止自加截断**：跑 `tsc` / `lint` / `build` / `validate` 时，直接 `pnpm run xxx` 即可，**禁止** `| head` / `| tail`。一次性看完所有错误，按文件聚类批量修，再跑一次确认归零。

## 开发流程

### 新增页面（四步）
1. 编写页面组件：`src/pages/example/index.tsx`
2. 编写页面配置：`src/pages/example/index.config.ts`
3. 注册路由：`src/app.config.ts` 的 `pages` 数组追加 `pages/example/index`
4. 若是 TabBar 页面，用 `taro-lucide-tabbar` 生成 PNG 图标（见「图标 → TabBar」）

> 改 `app.config.ts` 后必须重启 `pnpm run dev`，否则不生效。

### 路径别名
`@/*` 已配置指向 `src/*`，**必须**用别名导入：

```typescript
import { SomeComponent } from '@/components/some-component'        // ✅
import { SomeComponent } from '../../../components/some-component' // ❌
```

### 命名

| 对象 | 规则 | 示例 |
|---|---|---|
| 文件 / 目录 | kebab-case | `user-profile.tsx`、`user-center/` |
| 组件 / 类型 | PascalCase | `UserProfile`、`ApiResponse` |
| 变量 / 函数 | camelCase | `getUserInfo` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |

## 样式

### 配色（语义 token）

**禁止 tsx 内联十六进制色值**（`bg-[#562aff]` / `text-[#xxx]`），全部走 `src/app.css` 中预置的语义 token。

**第一步：按 App 调性改 `src/app.css` 的 `:root, page` 块**（只改色值，不改变量名）。

**第二步：组件只用语义类名**

```tsx
<View className="bg-background min-h-screen">
  <View className="bg-card rounded-lg p-4 border border-border">
    <Text className="text-foreground text-lg font-bold">主标题</Text>
    <Text className="text-muted-foreground text-sm">副文案</Text>
    <View className="mt-3 bg-primary px-4 py-2 rounded-md">
      <Text className="text-primary-foreground text-center">主按钮</Text>
    </View>
  </View>
</View>
```

### Tailwind / WXSS 禁用清单

以下类名 / 选择器会导致预览或上传失败（eslint `no-restricted-syntax` 强制）：

| 禁用 | 替代 |
|---|---|
| `peer-*` / `group-*` 修饰符（如 `peer-checked` / `group-hover`） | 自己用 state 控制 |
| 任意小数值类名（`space-y-1.5` / `w-0.5`，`gap-*` 除外） | 用整数（`space-y-2` / `w-1`） |
| `has-*` 变体 / 任意 `[&:has(...)]` | 在父级用 state 标记 |
| `[&>*...]` 通配符选择器 | 用明确标签（`[&>view]`） |
| `[&>[data-...]]` 属性选择器 | 改用 className 区分 |
| `[&~...]` 兄弟选择器 | 用 flex 顺序 + 条件类 |
| `bg-color/N` / `bg-opacity-N` | inline `style={{ backgroundColor: 'rgba(...)' }}` |

CSS 文件里 **禁止远程 `@import`**（如 `@import url("https://fonts.googleapis.com/...")`），字体 / 图片改为本地静态资源。

### 小程序样式坑

**Input 必须 View 包装** — H5 端 Input 自身的 padding / bg / radius 会被原生样式覆盖：

```tsx
<View className="bg-secondary rounded-2xl p-4 mb-4">           {/* ✅ */}
  <Input className="w-full bg-transparent" />
</View>
<Input className="bg-secondary rounded-xl px-4 py-3 w-full" /> {/* ❌ H5 失效 */}
```

**Fixed + Flex 在 H5 失效** — 必须 inline style：

```tsx
<View style={{
  position: 'fixed', bottom: 50, left: 0, right: 0,
  display: 'flex', flexDirection: 'row', gap: '12px',
  padding: '12px', backgroundColor: '#fff', zIndex: 100,
}}>
  <Button>确认</Button>
</View>
```

**半透明背景** — 小程序下 `bg-foo/N` / `bg-opacity-N` 透明度会丢，改用 inline `style={{ backgroundColor: 'rgba(...)' }}`。

**ScrollView padding 撑爆视口** — 子元素 `w-full` 会基于含 padding 的内容区计算宽度而溢出。把水平 padding 移到内部容器：

```tsx
<ScrollView className="py-4">                {/* ✅ ScrollView 只留 py，px 给内部 */}
  <View className="w-full px-4">内容</View>
</ScrollView>
<ScrollView className="px-4 py-4">           {/* ❌ 子元素 w-full 溢出 */}
  <View className="w-full">内容</View>
</ScrollView>
```

## 图标

### 页面图标（`@egoist/tailwindcss-icons`）

已注册 `mdi`（Material Design）和 `lucide` 两个集合，用 `i-{collection}-{kebab-name}` 类名：

```tsx
<View className="i-mdi-home w-6 h-6" />
<View className="i-lucide-bot w-6 h-6 text-red-500" />
```

- 尺寸用 `w-*` / `h-*`；颜色通过 `text-*` 设置（CSS 层面继承 `currentColor`）
- kebab-case 命名：`House` → `i-lucide-house`，`MousePointerClick` → `i-lucide-mouse-pointer-click`
- **类名必须字面量**，动态拼接（`` `i-mdi-${name}` ``）扫描不到、不会打包
- **禁止** `import '@iconify-json/mdi'`，会把 7000+ JSON 全打进包
- **禁止**给图标组件传 `color="currentColor"`（如 `<MyIcon color="currentColor" />`），小程序端不会继承，请用显式色值或通过 Provider 提供默认色

### TabBar 图标（必须本地 PNG）

微信 TabBar 不支持 SVG。用 `taro-lucide-tabbar` 生成到 `src/assets/tabbar/`：

```bash
npx taro-lucide-tabbar House Settings User -c "#999999" -a "#1890ff" -o ./src/assets/tabbar
```

`app.config.ts`：

```typescript
export default defineAppConfig({
  tabBar: {
    color: '#999999',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    list: [
      { pagePath: 'pages/index/index', text: '首页',
        iconPath: './assets/tabbar/house.png',
        selectedIconPath: './assets/tabbar/house-active.png' },
    ],
  },
})
```

## 跨端兼容

H5 不支持 Camera / Map / Canvas 等原生组件。**用 `Taro.getEnv()` 直接判断，不要 `useState + useEffect`**（会有渲染延迟）：

```tsx
const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP   // ✅

{isWeapp ? (
  <Camera className="w-full h-96" devicePosition="back" />
) : (
  <View className="flex items-center justify-center h-96 bg-muted">
    <Text className="text-muted-foreground">请在微信小程序中打开体验完整功能</Text>
  </View>
)}
```

**默认不用 `<Button>`** — 原生 Button 有不可控的默认尺寸 / 样式，改用 `<View onClick>` + Tailwind 自实现。

**日期 / 时间 / 枚举用 `<Picker>` 不要用 `<Input>`** — `mode="date|time|selector|multiSelector|region"` 原生滚轮，onChange 返回已格式化值（`date` → `YYYY-MM-DD`、`time` → `HH:mm`、`selector` → index），避免手输格式错。

## 数据与云

```
页面 ──► store (zustand) ──► api ──► supabase
```

- **禁止页面 / 组件 / store 内 `import { supabase }`**，所有调用走 `src/api/`
- 后端数据全部进 store，mutation 走 action 自动同步
- meoo-cloud 不预设"匿名优先"，RLS 按业务实际需要设计（覆盖 meoo-cloud SKILL 默认）
- 详细规则：`src/api/README.md`、`src/store/README.md`

## 小程序特性

### 本地存储
没有 `window`，**禁用** `localStorage` / `sessionStorage` / `wx.setStorageSync`，统一走 `Taro.*StorageSync`。value 自动 JSON 序列化，单 key ≤ 1MB，总量 ≤ 10MB：

```tsx
import Taro from '@tarojs/taro';
Taro.setStorageSync('pref', { theme: 'dark' });
const pref = Taro.getStorageSync('pref');   // 不存在返回 ''
Taro.removeStorageSync('pref');
```
