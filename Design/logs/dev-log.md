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
