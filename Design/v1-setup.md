# v1 启动说明（Supabase + 邮箱验证码）

## 必填环境变量
在 `.env.local` 中配置：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Supabase Auth 设置

### 登录方式
- Email OTP（6 位验证码）
### Email OTP 说明
- 这是 6 位数字验证码流程，不使用验证链接。

### 邮件服务商（Resend）
在 Supabase 控制台中配置 SMTP：
- Host: `smtp.resend.com`
- Port: `465` 或 `587`
- Username: `resend`
- Password: Resend API Key
- Sender: 默认域名即可（后续可换自定义域名）

## 数据结构预留
- 账号资料表保留 `phone` / `phone_verified_at`
- 预留后续手机号登录与验证链接扩展
