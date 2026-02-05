import type { Provider, ProviderRequest, ProviderResult } from "@/lib/provider";

async function generateJson(prompt: string, request: ProviderRequest): Promise<ProviderResult> {
  const baseUrl = request.baseUrl;
  const model = request.model;
  const path = request.path.startsWith("/") ? request.path : `/${request.path}`;
  const headerName = request.auth.header || "Authorization";
  const prefix = request.auth.prefix ?? "Bearer ";

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [headerName]: `${prefix}${request.apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是严格遵循 JSON 输出格式的成就生成器。"
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("PROVIDER_ERROR");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("EMPTY_OUTPUT");
  }

  return { content };
}

export const openaiCompatibleProvider: Provider = {
  generateJson
};
