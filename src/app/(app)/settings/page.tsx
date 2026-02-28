"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import {
  clearApiKey,
  getApiKey,
  getProviderConfig,
  setApiKey,
  setProviderConfig
} from "@/lib/storage";
import type { ProviderConfig } from "@/lib/types";

export default function SettingsPage() {
  const [keyInput, setKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [providerConfig, setProviderConfigState] = useState<ProviderConfig | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const existing = getApiKey();
    setSavedKey(existing);
    setProviderConfigState(getProviderConfig());

    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => setLoggedIn(Boolean(data.authenticated)))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleSave = () => {
    if (!keyInput.trim()) {
      setMessage("请输入 API Key");
      return;
    }

    setApiKey(keyInput.trim());
    setSavedKey(keyInput.trim());
    setKeyInput("");
    setMessage("已保存 API Key（仅本地存储）");
  };

  const handleClear = () => {
    if (!window.confirm("确认清除本地 API Key 吗？")) return;
    clearApiKey();
    setSavedKey(null);
    setMessage("已清除 API Key");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    setMessage("已退出登录");
    window.location.href = "/auth";
  };

  const handleProviderChange = (field: keyof ProviderConfig, value: string) => {
    if (!providerConfig) return;
    setProviderConfigState({ ...providerConfig, [field]: value });
  };

  const handleProviderSave = () => {
    if (!providerConfig) return;
    if (!providerConfig.baseUrl || !providerConfig.path || !providerConfig.model) {
      setMessage("请补全 baseUrl / path / model");
      return;
    }
    setProviderConfig(providerConfig);
    setMessage("已保存模型配置（仅本地）");
  };

  return (
    <div className="grid gap-6">
      <Card title="钥匙仓库">
        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-black/10 bg-white/70 px-4 py-3">
            当前模式：<span className="font-semibold">用户自带 Key（BYOK）</span>
          </div>
          <label className="grid gap-2">
            API Key
            <input
              type="password"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="输入你的 API Key"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-earth-accent px-5 py-2 text-white"
            >
              保存
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-earth-accent/40 px-5 py-2 text-earth-accent"
            >
              清除
            </button>
          </div>
          <div className="text-xs text-earth-muted">
            {savedKey ? "AI 成就已就绪" : "还没放钥匙，成就生成会停摆"}
          </div>
          {message ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
              {message}
            </div>
          ) : null}
        </div>
      </Card>

      <Card title="账户">
        <div className="space-y-3 text-sm">
          <div className="rounded-lg border border-black/10 bg-white/70 px-4 py-3">
            {loggedIn ? "已登录" : "未登录"}
          </div>
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-fit rounded-full border border-black/10 px-5 py-2 text-earth-muted"
            >
              退出登录
            </button>
          ) : (
            <Link href="/auth" className="w-fit rounded-full bg-earth-accent px-5 py-2 text-white">
              去登录
            </Link>
          )}
          <div className="text-xs text-earth-muted">
            云同步功能下一步会改为服务端代理模式，当前网络环境下暂不启用。
          </div>
        </div>
      </Card>

      <Card title="模型发动机">
        {providerConfig ? (
          <div className="space-y-3 text-sm">
            <label className="grid gap-2">
              Base URL
              <input
                value={providerConfig.baseUrl}
                onChange={(event) => handleProviderChange("baseUrl", event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2"
                placeholder="https://open.bigmodel.cn/api/paas/v4"
              />
            </label>
            <label className="grid gap-2">
              Path
              <input
                value={providerConfig.path}
                onChange={(event) => handleProviderChange("path", event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2"
                placeholder="/chat/completions"
              />
            </label>
            <label className="grid gap-2">
              Model
              <input
                value={providerConfig.model}
                onChange={(event) => handleProviderChange("model", event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2"
                placeholder="glm-4.5-flash"
              />
            </label>
            <div className="rounded-lg border border-black/10 bg-white/70 px-4 py-3 text-xs text-earth-muted">
              成就卡图片会单独走图片模型配置。若图片模型不可用，系统会自动回退到本地海报模板。
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="grid gap-2">
                Image Path
                <input
                  value={providerConfig.imagePath}
                  onChange={(event) => handleProviderChange("imagePath", event.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2"
                  placeholder="/images/generations"
                />
              </label>
              <label className="grid gap-2">
                Image Model
                <input
                  value={providerConfig.imageModel}
                  onChange={(event) => handleProviderChange("imageModel", event.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2"
                  placeholder="glm-image"
                />
              </label>
              <label className="grid gap-2">
                Image Size
                <input
                  value={providerConfig.imageSize}
                  onChange={(event) => handleProviderChange("imageSize", event.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2"
                  placeholder="1024x1024"
                />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2">
                Auth Header
                <input
                  value={providerConfig.authHeader}
                  onChange={(event) => handleProviderChange("authHeader", event.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2"
                  placeholder="Authorization"
                />
              </label>
              <label className="grid gap-2">
                Auth Prefix
                <input
                  value={providerConfig.authPrefix}
                  onChange={(event) => handleProviderChange("authPrefix", event.target.value)}
                  className="rounded-lg border border-black/10 bg-white px-3 py-2"
                  placeholder="Bearer "
                />
              </label>
            </div>
            <button
              type="button"
              onClick={handleProviderSave}
              className="w-fit rounded-full bg-earth-accent px-5 py-2 text-white"
            >
              保存发动机配置
            </button>
            <div className="text-xs text-earth-muted">
              默认已配置智谱接口，可按需切换到其他模型。
            </div>
          </div>
        ) : null}
      </Card>

      <Card title="隐私说明">
        <ul className="space-y-2 text-sm text-earth-muted">
          <li>API Key 仅保存在浏览器本地，不会上传服务器。</li>
          <li>日记默认保存在本地 localStorage，可随时清除。</li>
          <li>如需云同步或账号体系，将在后续版本单独说明。</li>
        </ul>
      </Card>
    </div>
  );
}
