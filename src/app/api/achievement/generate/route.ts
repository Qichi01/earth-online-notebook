import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";
import type { ProviderRequest } from "@/lib/provider";

function buildPrompt(diaryText: string, date: string, location: string | null) {
  return `你是“地球 Online”的成就生成器。请根据用户日记内容，生成成就 JSON。\n\n输出要求（必须）：\n- 只输出 JSON，不要任何解释文本\n- 字段必须完整：titles, description, xp, tags, location.city, achievement_version\n- titles 数组长度 1～3\n- xp 为整数，范围 10～40\n- description 1 段中文，60～140 字\n\n风格要求：\n- 星露谷/游戏成就系统语感：命名 + 温柔肯定 + 轻微幽默可选\n- 不油腻、不夸张、不说教\n- 不讽刺，不使用“你应该/你必须”\n\n成就称号规则：\n- 使用【】包裹，偏“身份/角色”\n\n用户信息：\n- 日期：${date}\n- 地点：${location ?? "无"}\n- 日记：${diaryText}`;
}

function parseJsonContent(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end >= 0) {
      return JSON.parse(content.slice(start, end + 1));
    }
    throw new Error("MODEL_OUTPUT_PARSE_FAILED");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { diaryText, date, location, provider } = body;

    if (!provider?.apiKey) {
      return NextResponse.json(
        { error: "MISSING_API_KEY", message: "请先在设置页填写 API Key" },
        { status: 400 }
      );
    }

    if (!diaryText || !date) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "日记内容或日期为空" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(diaryText, date, location ?? null);

    const providerRequest: ProviderRequest = {
      providerType: "openai_compatible",
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
      path: provider.path,
      model: provider.model,
      auth: {
        header: provider.authHeader || "Authorization",
        prefix: provider.authPrefix || "Bearer "
      }
    };
    const providerInstance = getProvider(providerRequest);
    const { content } = await providerInstance.generateJson(prompt, providerRequest);
    const result = parseJsonContent(content);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "服务异常，请稍后重试" },
      { status: 500 }
    );
  }
}
