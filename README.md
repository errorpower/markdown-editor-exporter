# EditMD

> 一个轻量的在线 Markdown 编辑器，支持实时预览、导出 PDF / Word、一键复制，并提供 REST API 供外部项目调用。

[English](./README_EN.md)

---

## 界面预览

<!-- 替换为实际截图 -->
<!-- ![EditMD 界面预览](./screenshot.png) -->

```
+----------------------------------------------------------+
|  EditMD  [H1][H2][H3][H4] | [B][I][~][🔗]...  [复制][Word][PDF] |
+-----------------------------+----------------------------+
|  Markdown 编辑区            |  实时预览区                 |
|  # 标题                     |  标题                       |
|  **粗体**                   |  粗体                       |
|  ```js                      |  ┌─────────────┐            |
|  console.log('hello');      |  │ console.log │            |
|  ```                        |  └─────────────┘            |
+-----------------------------+----------------------------+
|  120 字符 | 15 行 | 自动保存已开启                       |
+----------------------------------------------------------+
```

---

## 功能特性

### 编辑器
- 左右分栏布局，左侧 Markdown 编辑，右侧实时预览
- 工具栏快捷按钮：标题(H1-H4)、加粗、斜体、删除线、链接、图片、代码、代码块、引用、列表、任务列表、表格、分割线
- Emoji 选择器（6 大分类，100+ 种 emoji），同时支持 `:emoji_name:` 语法
- Tab 缩进支持
- 拖拽 `.md` 文件导入，或点击导入按钮选择文件

### 导出
- **导出 PDF** — 浏览器端直接生成，保留代码高亮、表格、引用块等排版样式
- **导出 Word** — 浏览器端生成 `.docx` 文档，支持标题、加粗、列表、表格、引用、代码块等格式
- **一键复制** — 复制 Markdown 源码到剪贴板

### REST API
- `POST /api/export/pdf` — 传入 Markdown，返回 PDF 文件流
- `POST /api/export/word` — 传入 Markdown，返回 Word 文件流
- `GET /api/health` — 健康检查

### 增强功能
- **代码高亮** — highlight.js，支持多种编程语言语法高亮
- **全角字符自动转换** — 从微信、Word 等应用复制内容时，全角标点（`＊＃＿～（）【】：｜`）自动转为半角，确保 Markdown 语法正确解析
- **本地自动保存** — 内容自动保存到浏览器 localStorage，刷新不丢失
- **状态栏** — 实时显示字符数、行数、自动保存状态
- **响应式布局** — 大屏左右分栏，窄屏自动堆叠

---

## 快速开始

### 环境要求

- Node.js >= 18

### 安装与启动

```bash
# 克隆项目
git clone https://github.com/errorpower/editmd.git
cd editmd

# 安装依赖
npm install

# 同时启动前端 + 后端 API
npm run dev:all
```

前端访问 http://localhost:7812
后端 API 访问 http://localhost:7813

### 仅启动前端

```bash
npm run dev
```

### 仅启动后端 API

```bash
npm run dev:server
```

---

## 使用说明

### 编辑器

1. 打开 http://localhost:7812
2. 在左侧编辑区输入 Markdown 内容
3. 右侧实时预览渲染效果
4. 使用工具栏快捷按钮插入 Markdown 语法
5. 点击顶部按钮导出 PDF / Word / 复制

### Emoji 使用

**方式一：Emoji 选择器**

点击工具栏最右侧的 😊 按钮，从弹出面板中选择 emoji。

**方式二：Markdown 语法**

在编辑区输入 `:emoji_name:`，预览区会自动渲染为对应 emoji：

```
:fire: → 🔥
:star: → ⭐
:warning: → ⚠️
:thumbsup: → 👍
:heart: → ❤️
```

支持 100+ 种 emoji 名称，完整列表可在 Emoji 选择器面板底部查看。

### 全角字符自动转换

从微信、Word、WPS 等应用复制 Markdown 内容时，标点符号常被自动转为全角字符（如 `＊` 代替 `*`），导致 Markdown 语法失效。

EditMD 会自动将以下全角字符转为半角：

| 全角 | 半角 | Markdown 用途 |
| --- | --- | --- |
| ＊ | * | 加粗、斜体、列表 |
| ＃ | # | 标题 |
| ＿ | _ | 加粗、斜体 |
| ～ | ~ | 删除线 |
| （） | () | 链接、图片 |
| 【】 | [] | 链接、图片 |
| ： | : | 链接、Emoji |
| ｜ | \| | 表格 |

---

## API 文档

### POST /api/export/pdf

将 Markdown 内容转换为 PDF 文件。

**请求：**

```bash
curl -X POST http://localhost:7812/api/export/pdf \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nThis is **bold** text."}' \
  -o output.pdf
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| markdown | string | 是 | Markdown 文本内容 |
| filename | string | 否 | 输出文件名，默认 `document.pdf` |

**响应：**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="document.pdf"`
- Body: PDF 二进制流

---

### POST /api/export/word

将 Markdown 内容转换为 Word 文档。

**请求：**

```bash
curl -X POST http://localhost:7812/api/export/word \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nThis is **bold** text.", "filename": "report.docx"}' \
  -o output.docx
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| markdown | string | 是 | Markdown 文本内容 |
| filename | string | 否 | 输出文件名，默认 `document.docx` |

**响应：**

- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Content-Disposition: `attachment; filename="report.docx"`
- Body: DOCX 二进制流

---

### GET /api/health

健康检查接口。

```bash
curl http://localhost:7812/api/health
# {"status":"ok","service":"EditMD API"}
```

---

## Markdown 语法支持

| 语法 | 支持 | 说明 |
| --- | --- | --- |
| 标题 `# ~ ######` | ✅ | H1-H6 |
| 加粗 `**text**` | ✅ | |
| 斜体 `*text*` | ✅ | |
| 删除线 `~~text~~` | ✅ | |
| 行内代码 `` `code` `` | ✅ | |
| 代码块 ` ``` ` | ✅ | 语法高亮 |
| 链接 `[text](url)` | ✅ | |
| 图片 `![alt](url)` | ✅ | |
| 无序列表 `- item` | ✅ | |
| 有序列表 `1. item` | ✅ | |
| 任务列表 `- [ ] item` | ✅ | |
| 引用 `> text` | ✅ | |
| 表格 | ✅ | GFM 表格 |
| 分割线 `---` | ✅ | |
| Emoji `:name:` | ✅ | 100+ 种 |
| 全角字符自动转换 | ✅ | 微信/Word 复制兼容 |

---

## 技术栈

| 层面 | 技术 | 说明 |
| --- | --- | --- |
| 前端框架 | React 18 + TypeScript | Vite 构建 |
| 样式 | Tailwind CSS v4 | 原子化 CSS |
| Markdown 解析 | marked | GFM 支持 |
| 代码高亮 | highlight.js | 多语言语法高亮 |
| Emoji | marked-emoji | `:name:` 语法支持 |
| PDF 导出(前端) | html2pdf.js | 浏览器端生成 |
| PDF 导出(后端) | pdfkit | 服务端生成 |
| Word 导出 | docx | 前后端通用 |
| 后端 | Express.js | REST API |
| 开发工具 | tsx, concurrently | 热重载 + 并发启动 |

---

## 项目结构

```
editmd/
├── index.html                    # 入口 HTML
├── package.json
├── vite.config.ts                # Vite 配置（端口 7812，API 代理）
├── tsconfig.json
├── server/                       # 后端 API
│   ├── index.ts                  # Express 服务入口（端口 7813）
│   ├── routes/
│   │   └── export.ts             # /api/export/pdf & /api/export/word
│   └── utils/
│       ├── generatePdf.ts        # PDF 生成逻辑
│       └── generateWord.ts       # Word 生成逻辑
├── src/                          # 前端源码
│   ├── main.tsx                  # 入口
│   ├── App.tsx                   # 主布局
│   ├── components/
│   │   ├── Editor.tsx            # Markdown 编辑器
│   │   ├── Preview.tsx           # 实时预览
│   │   ├── Toolbar.tsx           # 工具栏 + Emoji 选择器
│   │   ├── ActionBar.tsx         # 导出按钮区
│   │   ├── StatusBar.tsx         # 状态栏
│   │   └── Toast.tsx             # 提示通知
│   ├── hooks/
│   │   ├── useLocalStorage.ts    # 自动保存
│   │   └── useMarkdown.ts        # Markdown 解析 + Emoji + 全角转换
│   ├── utils/
│   │   ├── exportPdf.ts          # 前端 PDF 导出
│   │   ├── exportWord.ts         # 前端 Word 导出
│   │   └── copyToClipboard.ts    # 复制到剪贴板
│   └── styles/
│       ├── index.css             # Tailwind 入口
│       └── preview.css           # 预览区排版样式
```

---

## 开发指南

### 命令

```bash
npm run dev          # 启动前端开发服务器 (端口 7812)
npm run dev:server   # 启动后端 API 服务器 (端口 7813)
npm run dev:all      # 同时启动前端 + 后端
npm run build        # 构建生产版本
npm run lint         # 代码检查
```

### 前端开发

前端使用 Vite 开发服务器，支持热模块替换 (HMR)。修改代码后浏览器自动刷新。

`/api/*` 请求通过 Vite proxy 自动转发到后端（端口 7813），开发环境无需额外配置。

### 后端 API 开发

后端使用 `tsx watch` 运行，修改代码后自动重启。

---

## License

[MIT](./LICENSE)
