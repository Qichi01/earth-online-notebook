# 开发日志

## 2026-02-03

**进度概览**
- 初始化 Web 版本项目骨架（Next.js + TypeScript + Tailwind）。
- 搭建 4 个核心页面：日记、角色、历史、设置。
- 完成本地存储数据模型与经验值升级逻辑。
- 实现成就生成 API 代理（OpenAI 兼容接口）。

**关键决策**
- 技术栈选择：Next.js（App Router）+ TypeScript + Tailwind，便于后续扩展为移动端或共享业务逻辑。
- 本地存储为主：API Key、日记、成就、角色进度全部 localStorage。后续如需云同步再扩展。

**新增文件/目录**
- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.env.example`
- `src/app/*`（页面与 API 路由）
- `src/components/*`
- `src/lib/*`
- `src/styles/globals.css`
- `Design/logs/dev-log.md`

**下一步**
- 补全前端与 API 的错误兜底体验（如模板成就）。
- 增加“同日仅生成一次”的可选限制开关。
- 完善 UI 细节与文案。

## 2026-02-04

**进度概览**
- 增加 Provider 抽象层（OpenAI-compatible），为后续 Azure/OpenRouter 扩展留入口。
- 加入“同日仅生成一次”设置与本地开关。
- 增加离线兜底：生成失败时可使用模板成就。

**关键调整**
- API 代理从直接调用改为通过 Provider 抽象。
- Settings 页面新增“同日仅生成一次”开关。
- 日记页根据限制状态禁用生成按钮，并提示前往设置。

**新增文件/目录**
- `src/lib/provider.ts`
- `src/lib/providers/index.ts`
- `src/lib/providers/openaiCompatible.ts`
- `src/lib/fallback.ts`

## 2026-02-04（修复启动）

**问题定位**
- 项目路径包含 `:`（`4 Earth Online-web:app`），导致 npm 注入 PATH 时被拆分，`next` 命令找不到。

**处理方式**
- 将 `package.json` 的脚本改为直接调用 `./node_modules/.bin/next`，绕过 PATH 注入。

**修改文件**
- `package.json`

## 2026-02-04（Provider 配置化）

**进度概览**
- Provider 层改为可配置（baseUrl/path/model/authHeader/authPrefix）。
- 默认配置内置为智谱 OpenAI-compatible 接口。
- 设置页新增“模型配置”区。

**修改文件**
- `src/lib/provider.ts`
- `src/lib/providers/openaiCompatible.ts`
- `src/lib/storage.ts`
- `src/app/settings/page.tsx`
- `src/app/page.tsx`
- `src/app/api/achievement/generate/route.ts`
- `Design/prd2`

## 2026-02-04（修复 Provider 编译错误）

**问题**
- Provider 实现文件出现字符串转义错误，导致 Next.js 编译失败。

**修复**
- 修正 `openaiCompatible.ts` 中错误的转义字符，恢复正常编译与成就生成。

**修改文件**
- `src/lib/providers/openaiCompatible.ts`

## 2026-02-04（兜底优化 + 文案更新）

**进度概览**
- 成就生成失败时自动生成离线成就，不向用户暴露兜底路径。
- 全站文案优化为更游戏化、轻幽默语气。

**关键调整**
- 生成失败自动落地成就与经验值更新，用户体验无中断。
- 成就卡与页面空态/提示文案更轻松。

**修改文件**
- `src/app/page.tsx`
- `src/lib/fallback.ts`
- `src/components/AchievementCard.tsx`
- `src/app/history/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/settings/page.tsx`

## 2026-02-04（多次记录 + 文案风格）

**进度概览**
- 支持同日多次记录：每条记录生成独立成就，不再互相覆盖。
- 记录时间自动展示：开始写时刷新时间。
- 文案整体更轻松幽默，贴近成就口吻。

**关键调整**
- 成就存储由“按日期”改为“按记录 id”。
- 历史页展示到具体时间点。
- 生成失败自动产生成就，不提示兜底路径。

**修改文件**
- `src/app/page.tsx`
- `src/app/history/page.tsx`
- `src/app/settings/page.tsx`
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/fallback.ts`
- `src/lib/date.ts`
- `Design/prd2`

## 2026-02-04（历史记录分组 + 文案微调）

**进度概览**
- 日记页文案改回“今日记录 / 新的记录”。
- 历史页增加按日期分组展示，同日多条记录归并到同一日期下。

**修改文件**
- `src/app/page.tsx`
- `src/app/history/page.tsx`

## 2026-02-04（v1 起步：Auth + Supabase）

**进度概览**
- 接入 Supabase 客户端（浏览器端）。
- 新增邮箱验证码登录页。
- 设置页增加登录状态与退出登录。
- 提供 v1 数据结构草案与 Resend 配置说明。

**新增文件**
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/app/auth/page.tsx`
- `Design/v1-setup.md`
- `Design/v1-schema.sql`

**修改文件**
- `package.json`
- `src/app/settings/page.tsx`
- `src/app/layout.tsx`
- `.env.example`

## 2026-02-04（v1 同步 + 账号）

**进度概览**
- 新增本地 ↔ 云端同步能力（手动推送/拉取）。
- 设置页新增同步按钮与上次同步时间。
- 更新 v1 数据结构草案（profile 增加等级字段）。

**新增文件**
- `src/lib/cloud.ts`

**修改文件**
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/app/settings/page.tsx`
- `Design/v1-schema.sql`
- `Design/v1-setup.md`

## 2026-02-04（登录前置 + Auth 跳转）

**进度概览**
- 增加全站登录前置：未登录自动跳转到 `/auth`。
- 登录成功后自动回到首页。

**新增文件**
- `src/components/AuthGate.tsx`

**修改文件**
- `src/app/layout.tsx`
- `src/app/auth/page.tsx`

## 2026-02-04（登录前置修正）

**进度概览**
- 登录前置覆盖到整个布局，未登录时不渲染主站内容。
- 增加登录检查的全屏加载态，避免内容闪现。

**修改文件**
- `src/components/AuthGate.tsx`
- `src/app/layout.tsx`

## 2026-02-04（登录页独立样式）

**进度概览**
- 登录页作为独立页面展示，不显示主站导航与功能区。

**新增文件**
- `src/components/AppShell.tsx`

**修改文件**
- `src/app/layout.tsx`

## 2026-02-04（登录/注册分离）

**进度概览**
- 登录与注册拆分为独立页面。
- 登录页不显示主站导航，注册页同理。

**新增文件**
- `src/app/register/page.tsx`

**修改文件**
- `src/app/auth/page.tsx`
- `src/components/AppShell.tsx`
- `src/components/AuthGate.tsx`

## 2026-02-04（登录页独立布局重构）

**进度概览**
- 使用路由分组 `(app)` 与 `(auth)` 将登录/注册页与主站布局彻底隔离。
- 未登录访问主站会被强制跳转至 `/auth`，主站导航仅在登录后显示。

**新增文件**
- `src/app/(app)/layout.tsx`
- `src/app/(auth)/layout.tsx`

**修改文件**
- `src/app/layout.tsx`

**删除文件**
- `src/components/AppShell.tsx`

## 2026-02-05（改为验证链接登录）

**进度概览**
- 登录/注册改为邮箱验证链接流程。
- 新增回调页处理链接登录后跳转。

**修改文件**
- `src/app/(auth)/auth/page.tsx`
- `src/app/(auth)/register/page.tsx`

**新增文件**
- `src/app/(auth)/auth/callback/page.tsx`

## 2026-02-05（邮箱+密码登录）

**进度概览**
- 登录改为邮箱+密码。
- 注册改为邮箱+密码，注册后需邮箱验证。

**修改文件**
- `src/app/(auth)/auth/page.tsx`
- `src/app/(auth)/register/page.tsx`

## 2026-02-05（密码长度调整）

**进度概览**
- 注册/登录密码长度提示改为至少 6 位。

**修改文件**
- `src/app/(auth)/auth/page.tsx`
- `src/app/(auth)/register/page.tsx`

## 2026-02-19（生产域名上线 + 认证代理方案启动）

**当前状态**
- Vercel 与域名已完成配置，可通过 `https://www.earth-online.life` 访问网站。
- 生产环境中用户侧对 `*.supabase.co` 存在连接/解析问题，导致前端直连认证失败。

**本次处理（方案 1）**
- 启动站内认证代理：登录/注册/会话/退出改为调用站内 `/api/auth/*`，由服务端转发 Supabase 认证请求。
- 前端认证页面与 `AuthGate` 已切换为站内接口，不再浏览器直连 `supabase.co`。
- 设置页登录态与退出改为站内接口，暂时关闭直接云同步入口（下一步改为服务端代理同步）。

## 2026-02-19（邮箱验证提示优化）

**进度概览**
- 邮箱验证回调页新增明确提示："邮箱验证成功"。
- 验证成功后跳转登录页，并显示"验证成功，请登录"提示文案。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(auth)/auth/callback/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(auth)/auth/page.tsx`

## 2026-02-19（邮箱验证跳转行为修复）

**问题**
- 用户点击邮箱验证链接后会直接进入站内主页面，未出现“验证成功，请登录”提示。

**修复**
- 注册接口将邮箱验证回调地址改为 `/auth/callback?verified=1`。
- 回调页新增固定成功提示，并在跳转登录页前清理当前登录态，确保回到登录页显示“验证成功，请登录”。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/auth/register/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(auth)/auth/callback/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（邮箱验证回跳登录页二次修复）

**问题**
- 邮箱验证链接点击后仍可能直接落到站点首页，没有进入“验证成功提示 -> 登录页”的路径。

**修复**
- 调整注册请求到 Supabase Auth 的参数，显式同时传递：
- `signup` 接口 query 参数 `redirect_to`
- 请求体中的 `options.emailRedirectTo`
- 请求体中的 `email_redirect_to`
- 目标是兼容不同的 GoTrue 参数解析路径，强制验证链接回跳到 `/auth/callback?verified=1`，再由回调页清登录态并跳转登录页。

**验证**
- 本地已通过：`npm run build`

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/supabase/authProxy.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（验证成功提示居中微调）

**问题**
- 邮箱验证成功提示卡片在页面中偏左，不在视觉中心。

**修复**
- 调整回调页容器布局，改为在认证页主容器内水平居中显示成功提示卡片。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(auth)/auth/callback/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（v1 收口完成 + v2 迭代准备）

**v1 完成状态**
- 生产站点已上线：`https://www.earth-online.life`
- 邮箱+密码注册/登录链路可用，邮箱验证流程可用。
- 登录前置与主站隔离已完成（未登录不可访问主功能页）。
- Provider 配置化、成就生成主链路、同日多记录与历史归档能力稳定可用。

**本次记录**
- 确认 v1 开发目标已完成，进入 v2 规划与迭代阶段。
- 启动 v2 准备文档，明确地图模块的迭代方向与阶段边界。

**新增文件**
- `/Users/baibai/claude/4 Earth Online-web:app/Design/v2-plan.md`

## 2026-02-26（v2 方向调整：成就可视化优先）

**需求调整**
- v2 优先做成就可视化，不先做地图。
- 徽章按“成就类型”配置，不是每条成就都单独发一个徽章。
- 日记页“成就卡”从纯文字升级为带图案设计的视觉卡片，图案根据成就内容生成。

**本次实现**
- 新增成就分类规则层：根据标题 / 描述 / tags 推断成就类型。
- 新增类型徽章系统：同一类型按累计记录次数解锁 1～3 枚徽章。
- 日记页与历史页的成就卡升级为图案化视觉卡片。
- 角色页新增“徽章柜”，展示已解锁的类型徽章。
- 优化 AI 提示词，要求输出更具体、可视化的 tags，提升卡片图案匹配稳定性。

**新增文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/achievementVisuals.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementArtwork.tsx`

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/history/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/profile/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement/generate/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/v2-plan.md`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡画面感与文案规则强化）

**问题**
- 第一版成就卡图画感弱，和成就内容关联不强。
- AI 文案偏复述记录，不够像“成就结算语”。
- 同一条记录有时会生成多个并列称号，信息焦点不够集中。

**本次修复**
- 成就卡视觉从“图标拼贴”升级为“场景插画卡”：
- 按山顶夜景、城市夜景、咖啡店、厨房、街道、书桌、休整、成长等场景渲染不同画面。
- 称号改为主标题展示，卡面强化海报感和画面感。
- 收紧 AI 生成规则：
- `titles` 固定只保留 1 个最准确的称号。
- 文案要求避免复述原文，改为更像结算播报 + 轻微幽默。
- 增加结果清洗逻辑，服务端统一把多称号裁成单称号。
- 优化离线成就文案，避免兜底文案过于平直。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementArtwork.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/achievementVisuals.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement/generate/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/fallback.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡海报化重构）

**需求目标**
- 将成就卡从 UI 信息卡升级为更接近“像素插画海报”的视觉形式。
- 减少信息堆叠，突出主标题、场景插画、日期与少量角标信息。

**本次实现**
- 新增服务端海报图接口：`/api/achievement-card/image`
- 服务端按场景返回 3:2 SVG 海报图，目前覆盖山顶夜景、城市夜景、咖啡店、街道、书桌等场景模板。
- 成就卡组件改为海报容器：
- 海报图全覆盖展示
- 标题改为叠在图上的大标题
- 日期固定到左下角，格式 `YYYY.MM.DD`
- 经验值与小 logo 缩到右下角
- 标签与描述收缩到海报下方，避免挤占主视觉
- 当前采用 B 方案：服务端出插画底图，前端叠标题/日期/角标，方便控排版与可读性。

**新增文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/achievementPoster.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement-card/image/route.ts`

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡接入真实图片生成链路）

**目标**
- 将成就卡从纯规则海报模板升级为“真实图片生成优先，SVG 海报兜底”。

**本次实现**
- 扩展 Provider 配置，增加图片生成专用参数：
- `imagePath`
- `imageModel`
- `imageSize`
- 新增 OpenAI-compatible 图片生成能力：
- 兼容 `POST /images/generations`
- 兼容返回 `url` 或 `b64_json`
- 成就生成完成后，前端会自动调用 `/api/achievement-card/image` 生成图片海报：
- 成功则保存真实图片 URL 到成就记录
- 失败则回退到本地 SVG 海报
- 设置页新增图片生成模型配置项。
- Supabase 同步结构补充成就卡图片字段，避免后续同步时丢失海报信息。

**新增文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/achievementPoster.ts`

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/types.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/provider.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/providers/openaiCompatible.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/storage.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/cloud.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/fallback.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement-card/image/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/settings/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/v1-schema.sql`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（兜底原因显式提示）

**问题**
- 当前成就与成就卡失败后会直接兜底，用户只能看到结果，无法判断是“文本生成失败”还是“图片生成失败”。

**修复**
- 首页生成提示改为区分两种情况：
- 文本成就失败：明确提示“本次文本成就走离线兜底 + 错误原因”
- 文本成功但图片失败：明确提示“成就卡图片暂时走海报兜底 + 错误原因”

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡尺寸与图片约束修正）

**问题**
- 成就卡海报尺寸过大，压迫页面布局。
- 真实图片生成结果中频繁出现背景文字、气泡文字、标签文字，破坏海报感。
- 某些日记场景映射仍不够贴近内容，例如“面包”与“模拟面试”类场景。

**本次修复**
- 缩小成就卡展示宽度，限制为更紧凑的海报布局。
- 收紧图片生成 prompt，明确禁止：
- 任何中英文文字
- 字母
- 对话气泡
- 标签
- 水印
- 新增更具体的场景映射：
- `bakery-cozy`
- `mentor-talk`

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/achievementVisuals.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement-card/image/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡二次收紧：尺寸与去文字）

**问题**
- 成就卡在首页里仍然过大。
- 图片生成 prompt 中仍包含容易诱导模型产出文字的表述，导致背景持续出现大字。

**修复**
- 成就卡最大宽度从 `max-w-4xl` 收紧到 `max-w-3xl`。
- 图片 prompt 去掉了 `poster` / `title concept` 这类强诱导文字元素的描述。
- 明确改为“仅生成背景插画”，并追加：
- 不允许中文
- 不允许英文
- 不允许数字
- 不允许任何像单词的符号

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement-card/image/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（AI 生图三次收紧：只生成纯背景）

**问题**
- 即使已经加强约束，模型仍会在画面中私自写字。
- 原因是 prompt 中仍残留“海报感”和文本语义注入，继续诱导模型产出文字元素。

**修复**
- 图片 prompt 不再注入标题、描述、tags 文本。
- 图片生成目标改为：只生成纯背景场景图，不生成任何海报/卡面内文字。
- 增加统一 `negative_prompt`，进一步压制：
- text
- letters
- words
- Chinese characters
- English words
- numbers
- logo
- watermark
- speech bubble
- subtitle
- signboard
- label
- poster
- typography
- 成就卡容器继续缩小，最大宽度改为 `max-w-2xl`。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/provider.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/providers/openaiCompatible.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement-card/image/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡布局再收紧 + 场景判断增强）

**问题**
- 成就卡尺寸依然偏大。
- 部分日记内容场景判断不准，例如“买到面包”仍可能跑偏到山景/城市类画面。

**修复**
- 成就卡容器进一步收紧到 `max-w-3xl` 的双栏信息布局，海报与文字区重新分配。
- 场景判断增加对原始日记内容与地点文本的参与，不再只依赖成就标题与 tags。
- 图片生成增加按场景的负向约束，进一步排除不相关元素。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/lib/achievementVisuals.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/(app)/page.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/src/app/api/achievement-card/image/route.ts`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`

## 2026-02-26（成就卡文字栏与海报等高修正）

**问题**
- 新版双栏布局里，右侧文字栏高度没有与左侧海报保持一致。

**修复**
- 成就卡双栏布局继续收紧，右侧信息栏改为显式 `self-stretch + h-full`。
- 文字内容重新包裹为内部纵向布局，保证描述区与标签区在整栏内上下分布，整体高度与海报对齐。
- 右侧栏宽轻微上调，避免等高后文字过于拥挤。

**修改文件**
- `/Users/baibai/claude/4 Earth Online-web:app/src/components/AchievementCard.tsx`
- `/Users/baibai/claude/4 Earth Online-web:app/Design/logs/dev-log.md`
