"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import {
  clearApiKey,
  getApiKey,
  getLastSyncAt,
  getProviderConfig,
  setApiKey,
  setProviderConfig
} from "@/lib/storage";
import type { ProviderConfig } from "@/lib/types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { pullCloudToLocal, syncLocalToCloud } from "@/lib/cloud";

export default function SettingsPage() {
  const [keyInput, setKeyInput] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [providerConfig, setProviderConfigState] = useState<ProviderConfig | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAtState] = useState<number | null>(null);

  useEffect(() => {
    const existing = getApiKey();
    setSavedKey(existing);
    setProviderConfigState(getProviderConfig());
    setLastSyncAtState(getLastSyncAt());
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setLoggedIn(Boolean(data.session));
    });
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
    await supabaseBrowser.auth.signOut();
    setLoggedIn(false);
    setMessage("已退出登录");
  };

  const handleSyncPush = async () => {
    setMessage(null);
    setSyncing(true);
    try {
      await syncLocalToCloud(supabaseBrowser);
      setLastSyncAtState(getLastSyncAt());
      setMessage("本地记录已同步到云端。");
    } catch {
      setMessage("同步失败，请稍后重试。");
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncPull = async () => {
    setMessage(null);
    setSyncing(true);
    try {
      await pullCloudToLocal(supabaseBrowser);
      setLastSyncAtState(getLastSyncAt());
      setMessage("云端记录已拉取到本地。");
    } catch {
      setMessage("拉取失败，请稍后重试。");
    } finally {
      setSyncing(false);
    }
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
          {lastSyncAt ? (
            <div className="text-xs text-earth-muted">
              上次同步：{new Date(lastSyncAt).toLocaleString()}
            </div>
          ) : null}
          {loggedIn ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSyncPush}
                disabled={syncing}
                className="w-fit rounded-full bg-earth-accent px-5 py-2 text-white disabled:opacity-60"
              >
                {syncing ? "同步中..." : "同步到云端"}
              </button>
              <button
                type="button"
                onClick={handleSyncPull}
                disabled={syncing}
                className="w-fit rounded-full border border-earth-accent/40 px-5 py-2 text-earth-accent disabled:opacity-60"
              >
                {syncing ? "拉取中..." : "拉取到本地"}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-fit rounded-full border border-black/10 px-5 py-2 text-earth-muted"
              >
                退出登录
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="w-fit rounded-full bg-earth-accent px-5 py-2 text-white"
            >
              去登录
            </Link>
          )}
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
