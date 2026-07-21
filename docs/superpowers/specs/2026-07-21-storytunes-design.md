# StoryTunes — 幼儿英语启蒙绘本应用设计文档

> 2026-07-21 | 家庭自用 SaaS

## 1. 产品概述

### 1.1 定位

为一名 2 岁 7 个月男孩（2023-12-19 出生）打造的英语启蒙绘本应用。孩子说话清晰、会背儿歌、对音乐感兴趣。应用以英文绘本为核心载体，结合 AI 定制生成和韵律朗读，在亲子共读中自然建立英语语感。

**受众：** 单一家庭内部使用，非商用产品。
**使用设备：** iPad mini（第 7 代，2024 款），8.3 寸 Liquid Retina 横屏为主；也支持手机和桌面响应式访问。

### 1.2 核心流程

```
家长打开 iPad → 横屏 → 绘本馆首页
                          ├── 📚 选一本 → 亲子共读（翻页 + 朗读 + 韵律模式）
                          └── ✨ Create New → 三步向导 → AI 生成 → 自动进入共读
```

### 1.3 内容分级

| 级别 | 词汇量/本 | 句式特点 | 目标 |
|------|:------:|------|------|
| 🌱 Seeds | 10-20 词 | 一页一词/一句，指认式 | 单词认知 |
| 🌿 Sprouts | 30-50 词 | 重复句式，"I see a..." | 句型内化 |
| 🌳 Trees | 50-80 词 | 3-5 句/页，简单叙事 | 短故事理解 |

---

## 2. 技术架构

### 2.1 技术栈

| 层 | 选型 | 理由 |
|---|------|------|
| 框架 | Next.js 15 (App Router) + TypeScript | 全栈一体，SSR + API Routes |
| 样式 | Tailwind CSS 4 | 响应式原生支持 |
| 动画 | framer-motion + react-pageflip | 翻页 + UI 过渡 |
| 数据库 | SQLite (better-sqlite3) | 零运维，家庭用量足够 |
| 文件存储 | Cloudinary | 免费层 25 GB，按需缩放 |
| 数据同步 | Supabase | 跨设备同步 |
| 部署 | Vercel (Hobby) | 免费，自动 HTTPS |
| 认证 | 家庭共享密码（bcrypt 哈希 + session cookie） | 无需邮箱/OAuth |

### 2.2 AI 服务

| 环节 | 选型 | 理由 |
|------|------|------|
| 故事生成 | **DeepSeek V3** | 国产英文故事最强，逻辑一致性/角色一致性优秀 |
| 插图生成 | **通义千问 Qwen-Image-2.0** | 儿童绘本场景已验证，水彩/卡通风稳定 |
| 朗读 (TTS) | **Azure Cognitive Services Speech** | 英文自然度行业第一，免费层 50 万字符/月 |

全链路国内 API 直连。

### 2.3 项目结构

```
src/
├── app/
│   ├── layout.tsx                      # 根布局（横屏优化）
│   ├── page.tsx                        # 绘本馆首页
│   ├── login/
│   │   └── page.tsx                    # 密码登录
│   ├── create/
│   │   └── page.tsx                    # AI 创作三步向导
│   ├── read/[bookId]/
│   │   └── page.tsx                    # 阅读器（核心）
│   └── api/
│       ├── stories/
│       │   ├── route.ts                # GET 绘本列表
│       │   └── generate/route.ts       # POST AI 生成绘本
│       ├── stories/[id]/
│       │   └── route.ts                # GET/PUT/DELETE 单本绘本
│       ├── auth/
│       │   └── route.ts                # POST 密码验证
│       └── tts/
│           └── route.ts                # POST 生成朗读音频（代理 Azure）
├── components/
│   ├── reader/
│   │   ├── BookReader.tsx              # 翻页容器
│   │   ├── PageContent.tsx             # 单页（图+文）
│   │   ├── AudioControls.tsx           # 音频模式（默读/朗读/韵律）
│   │   ├── RhythmDisplay.tsx           # 韵律节拍显示
│   │   └── CompletionScreen.tsx        # 读完动画
│   ├── library/
│   │   ├── BookGrid.tsx                # 绘本网格
│   │   ├── BookCard.tsx                # 单本卡片
│   │   └── LevelFilter.tsx             # 难度筛选
│   ├── create/
│   │   ├── ThemePicker.tsx             # 主题选择
│   │   ├── CharacterStep.tsx           # 角色配置
│   │   ├── LevelSlider.tsx             # 难度滑块
│   │   ├── PreviewConfirm.tsx          # 确认 + 生成
│   │   └── GeneratingSpinner.tsx       # 生成进度
│   └── ui/
│       ├── Button.tsx
│       └── Spinner.tsx
├── lib/
│   ├── db.ts                           # SQLite 初始化 + 查询
│   ├── auth.ts                         # 密码验证 + session
│   ├── ai/
│   │   ├── story.ts                    # DeepSeek 故事生成
│   │   ├── image.ts                    # Qwen-Image 插图生成
│   │   ├── character-schema.ts         # 角色一致性 Schema
│   │   └── prompts/
│   │       ├── story.ts                # 故事 prompt 模板（按难度）
│   │       ├── image.ts                # 插图 prompt 模板（按画风）
│   │       ├── rhythm.ts               # 韵律转换 prompt
│   │       └── toddler-vocab.ts        # 幼儿核心词汇表（200-300 词）
│   ├── audio/
│   │   ├── tts.ts                      # Azure TTS (SSML)
│   │   └── rhythm.ts                   # Web Audio API 节拍引擎
│   └── sync.ts                         # Supabase 同步逻辑
├── data/
│   └── preset-books/                   # 15 本预生成绘本 (JSON)
└── types/
    └── index.ts                        # Book, Page, User 等类型定义
```

### 2.4 数据模型

```typescript
interface Book {
  id: string;              // nanoid
  title: string;
  level: 'seed' | 'sprout' | 'tree';
  theme: string;           // animals / colors / numbers / daily ...
  pages: Page[];
  coverImageUrl: string;
  defaultAudioMode: 'none' | 'read' | 'chant';
  isPreset: boolean;
  generationPrompt?: {
    theme: string;
    character: 'boy' | 'girl' | 'animal' | 'none';
    childName?: string;
    languageFocus?: string;
  };
  createdAt: string;
  lastReadAt?: string;
  readCount: number;
}

interface Page {
  index: number;
  imageUrl: string;        // Cloudinary URL
  imagePrompt: string;
  text: string;
  rhythmText?: string;     // 韵律版文字
  rhythmBeats?: string;    // 节拍标记
  audioUrl?: string;       // Azure TTS 预设音频 URL
}
```

### 2.5 AI 生成数据流

```
POST /api/stories/generate
  ├── 1. DeepSeek V3 → 故事文本 + 插图描述
  │    输入: { theme, level, character, childName, languageFocus }
  │    输出: { title, pages: [{ text, imagePrompt, rhythmHint }] }
  │    约束: 幼儿词汇表 (200-300 词), 按级别控制句长和页数
  │
  ├── 2. Qwen-Image-2.0 → 每页插图 (并行请求)
  │    每页 prompt 注入角色 Schema 以保证一致性
  │    固定画风: 水彩/卡通
  │
  ├── 3. Azure TTS → 每页朗读音频 (可选, 按需生成)
  │    使用 SSML 控制语速/停顿/音高
  │    韵律模式: 按节拍标记分段朗读
  │
  └── 4. 图片上传 Cloudinary + 元数据写 SQLite + sync→Supabase
```

### 2.6 路由设计

| 路由 | 认证 | 说明 |
|------|:---:|------|
| `/` | ✅ | 绘本馆首页（默认重定向到登录） |
| `/login` | - | 密码登录 |
| `/read/[bookId]` | ✅ | 全屏阅读器 |
| `/create` | ✅ | AI 创作三步向导 |
| `GET /api/stories` | ✅ | 绘本列表（支持 level/theme 筛选） |
| `GET /api/stories/[id]` | ✅ | 单本绘本详情 |
| `DELETE /api/stories/[id]` | ✅ | 删除绘本 |
| `POST /api/stories/generate` | ✅ | AI 生成新绘本 |
| `POST /api/auth` | - | 密码验证 |
| `POST /api/tts` | ✅ | TTS 音频生成代理 |

---

## 3. 界面设计

### 3.1 设计原则

- **横屏优先** — iPad mini 是主力设备，所有页面以横屏（1024×768+）为基准设计
- **大触控目标** — 所有可交互元素 ≥ 44pt，方便家长指尖操作
- **全英文沉浸** — 界面文字、绘本内容全英文，无中文翻译
- **高对比大字** — 文字足够大，适合亲子共读时远距离看清

### 3.2 绘本馆首页

```
┌─────────────────────────────────────────────────────────────┐
│  📚 My Library                          [+ Create New Book] │
│                                                             │
│  [All] [🌱 Seeds] [🌿 Sprouts] [🌳 Trees]                    │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ [cover]  │ │ [cover]  │ │ [cover]  │ │ [cover]  │       │
│  │ I See    │ │ Red and  │ │ One Two  │ │ Bath     │       │
│  │ a Cat    │ │ Blue     │ │ Three    │ │ Time     │       │
│  │ 🌱 6 pg  │ │ 🌿 8 pg  │ │ 🌱 4 pg  │ │ 🌳 8 pg  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  ...     │ │  ...     │ │  ...     │ │  ...     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 阅读器（核心页面）

```
┌─────────────────────────────────────────────────────────────┐
│  ← Library         📖 My Red Balloon          🎵 Rhythm     │
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│                                  │    The ball is red.      │
│        📷 Illustration          │                          │
│    (全页彩色绘本插图, 左 60%)      │    The ball is big.       │
│                                  │                          │
│                                  │    Red, red, red ball.   │
│                                  │                          │
│                                  │    Big, big, big ball!   │
│                                  │                          │
│                                  │          ──────          │
│                                  │    🔊 "The ball is red"   │
├──────────────────────────────────┴──────────────────────────┤
│                     ◀         2 / 6         ▶               │
└─────────────────────────────────────────────────────────────┘
```

**交互：**
- 点击右侧 / 右滑 → 下一页
- 点击左侧 / 左滑 → 上一页
- 点击文字区域 → 重读当前页
- 长按插图 → 弹出该页关键词卡片（Seeds 级别）
- 音频模式切换（顶部右侧）：📖 默读 / 🎙️ 朗读 / 🎵 韵律

### 3.4 韵律模式

切换后，文字以节奏分组显示，附带节拍标记和视觉指示：

```
🎵 The ball is RED            ● ● ○
🎵 The ball is BIG            ● ● ○
🎵 RED ball, BIG ball         ● ○ ● ○
🎵 Bounce, bounce, BOUNCE!    ○ ○ ●
```

实现方式：
- Azure TTS 使用 SSML `<prosody>` 控制语速和重音
- 前端 Web Audio API `OscillatorNode` 生成简单节拍音效（不是完整歌曲，是节奏提示）
- 节拍标记在 prompt 阶段由 DeepSeek 生成，前端渲染

### 3.5 AI 创作三步向导

**Step 1 — Theme & Level：** 12 个主题大卡片（Animals / Pets / Dinosaurs / Vehicles / Food / Colors / Numbers / Daily / Bedtime / Music / Nature / Custom）+ 下方难度滑块

**Step 2 — Character & Focus：** 主角选择（Boy / Girl / Animal / None）+ 输入孩子英文名 + 语言焦点（重复句型 / 颜色 / 数字 / 动作 / 不指定）

**Step 3 — Preview & Generate：** 显示设定摘要 + 页数选择（4/6/8）+ "Create My Book!" 按钮 → 生成动画 → 完成后自动跳转阅读器

### 3.6 阅读完成

最后一页翻过 → 大 ⭐ 动画 + "Again?" 按钮 + "Next Book →"（推荐同级别下一本）

### 3.7 登录

单一密码输入框 + Enter，通过后设 30 天 session cookie。全家人共用同一密码。

---

## 4. 预设绘本库

开箱内置 15 本绘本，用 AI 预生成 + 人工审核后嵌入代码仓库。覆盖三个级别：

| 级别 | 数量 | 典型主题 | 句式示例 |
|------|:---:|------|------|
| 🌱 Seeds | 6 本 | Colors, Animals, Numbers, Body, Food, Things | "I see a cat." |
| 🌿 Sprouts | 5 本 | Farm, Zoo, My Home, Weather, Actions | "The cow says moo." |
| 🌳 Trees | 4 本 | Bedtime, Park, Birthday, Bath Time | 3-5 句简单叙事 |

---

## 5. 数据同步

| 场景 | 处理 |
|------|------|
| 同设备读写 | SQLite 本地，毫秒级 |
| 跨设备 | Supabase 同步绘本元数据 |
| 插图/音频 | Cloudinary CDN，天然云端，无需同步 |
| 离线 | SQLite 本地正常读，联网后自动 sync |
| Safari 清缓存 | SQLite + Cloudinary 数据不受影响，仅需重新登录 |

---

## 6. 非功能需求

- **性能：** iPad mini 上翻页动画保持 60fps
- **插图加载：** Cloudinary 按设备分辨率自动缩放，不加载原图
- **API 成本：** AI 生成是唯一成本点。预设绘本零成本；AI 定制按需生成，单本成本约 ¥0.5-1.5（DeepSeek + Qwen-Image）。家庭用量月均 < ¥20
- **隐私：** 全链路国内 API，无数据出境。SQLite 本地存储，无第三方追踪
