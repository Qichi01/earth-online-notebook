import { NextResponse } from "next/server";
import type { AchievementScene } from "@/lib/achievementVisuals";
import { buildAchievementPosterSvg } from "@/lib/achievementPoster";
import { getProvider } from "@/lib/providers";
import type { ProviderImageRequest } from "@/lib/provider";

const allowedScenes = new Set<AchievementScene>([
  "mountain-night",
  "city-night",
  "cafe-table",
  "bakery-cozy",
  "mentor-talk",
  "kitchen",
  "street-walk",
  "desk-focus",
  "cozy-rest",
  "growth-garden"
]);

function normalizeDate(date: string) {
  return date.split("-").join(".");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "【今日成就】";
  const date = normalizeDate(searchParams.get("date") || "2026.02.28");
  const sceneParam = (searchParams.get("scene") || "city-night") as AchievementScene;
  const scene = allowedScenes.has(sceneParam) ? sceneParam : "city-night";

  const svg = buildAchievementPosterSvg({ title, date, scene });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function buildSceneDescription(scene: AchievementScene) {
  switch (scene) {
    case "mountain-night":
      return "A warm night mountain scene. Two tiny chibi explorers seen from behind stand on a rocky peak, looking at a city full of glowing lights below. Distant mountains, starry sky, crescent moon, gentle adventurous feeling.";
    case "city-night":
      return "A retro city at night with glowing windows, layered buildings, soft street lights, dreamy sky, and a calm evening atmosphere.";
    case "cafe-table":
      return "A cozy retro cafe at dusk with warm lamps, a small table, drinks, and two chibi companions in a quiet happy moment.";
    case "bakery-cozy":
      return "A cozy bakery interior with warm lights, fresh bread and pastries on a wooden table, a small paper bag, bakery shelves, and a simple happy discovery feeling. Focus on bread, pastry, and shop atmosphere only.";
    case "mentor-talk":
      return "A warm indoor mentoring scene with two chibi characters, one guiding and one listening, notebook in hand, supportive and focused atmosphere. Make it feel like interview practice or career coaching in a quiet room.";
    case "kitchen":
      return "A warm kitchen interior with stove light, cooking tools, food steam, and a cozy home game feeling.";
    case "street-walk":
      return "An evening street walk scene with road lights, sidewalks, small city details, and a calm adventure vibe.";
    case "desk-focus":
      return "A focused desk scene with notebook, lamp light, and a quiet determined late-evening mood.";
    case "cozy-rest":
      return "A cozy rest scene with soft lamp light, a quiet room, gentle healing atmosphere, and a safe rest-point feeling.";
    case "growth-garden":
      return "A tiny fantasy garden with sprouts, glowing leaves, gentle progress, and a hopeful retro game mood.";
    default:
      return "A warm retro game scene illustration with layered environment and soft evening light.";
  }
}

function buildImagePrompt({
  scene
}: {
  scene: AchievementScene;
}) {
  return [
    "Pixel art, 8-bit, retro game background illustration, cinematic warm lighting.",
    buildSceneDescription(scene),
    "This image is only a background scene for later UI overlay. It is not a poster and it is not a card cover with built-in text.",
    "Composition: 3:2 horizontal image, wide framing, simple and readable silhouette, open darker area near top-left for later title overlay, open darker area near bottom-left for later date overlay.",
    "No text anywhere. No Chinese. No English. No letters. No numbers. No logos. No signs. No labels. No speech bubbles. No subtitles. No watermark. No UI elements. No printed words on books, boards, cups, screens, paper, walls, windows, clothing, or objects.",
    "Keep the image clean, quiet, and text-free.",
    "Detailed pixel illustration, layered foreground midground background, coherent scene, soft highlights, warm atmosphere."
  ].join(" ");
}

function buildNegativePrompt(scene: AchievementScene) {
  const shared = [
    "text",
    "letters",
    "words",
    "Chinese characters",
    "English words",
    "numbers",
    "logo",
    "watermark",
    "speech bubble",
    "caption",
    "subtitle",
    "signboard",
    "label",
    "poster",
    "typography"
  ];

  const sceneSpecific: Partial<Record<AchievementScene, string[]>> = {
    "bakery-cozy": ["mountain", "backpack", "night city skyline", "hiking scene", "office interview"],
    "mentor-talk": ["bread", "cake", "croissant", "coffee close-up", "mountain", "night city skyline"],
    "mountain-night": ["bakery shelf", "office interview", "desk mentoring", "bread table"],
    "cafe-table": ["mountain", "office interview", "bakery shelf"],
    "desk-focus": ["mountain", "bakery food close-up", "street crowd"],
    "street-walk": ["indoor bakery table", "office interview", "mountain summit"]
  };

  return [...shared, ...(sceneSpecific[scene] ?? [])].join(", ");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body?.title || "【今日成就】");
    const date = String(body?.date || "2026-02-28");
    const sceneParam = String(body?.scene || "city-night") as AchievementScene;
    const scene = allowedScenes.has(sceneParam) ? sceneParam : "city-night";
    const provider = body?.provider;

    if (!provider?.apiKey) {
      return NextResponse.json({ message: "缺少图片生成 API Key" }, { status: 400 });
    }

    if (!provider?.baseUrl || !provider?.imagePath || !provider?.imageModel) {
      return NextResponse.json({ message: "缺少图片生成配置" }, { status: 400 });
    }

    const prompt = buildImagePrompt({ scene });

    const providerRequest: ProviderImageRequest = {
      providerType: "openai_compatible",
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
      path: provider.imagePath,
      model: provider.imageModel,
      size: provider.imageSize || "1024x1024",
      negativePrompt: buildNegativePrompt(scene),
      auth: {
        header: provider.authHeader || "Authorization",
        prefix: provider.authPrefix || "Bearer "
      }
    };

    const providerInstance = getProvider({
      providerType: "openai_compatible",
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
      path: provider.path || "/chat/completions",
      model: provider.model || "",
      auth: {
        header: provider.authHeader || "Authorization",
        prefix: provider.authPrefix || "Bearer "
      }
    });
    const result = await providerInstance.generateImage(prompt, providerRequest);

    return NextResponse.json({
      imageUrl: result.imageUrl,
      prompt,
      params: {
        model: providerRequest.model,
        size: providerRequest.size,
        style: "pixel-art-poster"
      },
      fallbackUrl: `/api/achievement-card/image?title=${encodeURIComponent(title)}&date=${encodeURIComponent(
        date
      )}&scene=${encodeURIComponent(scene)}`
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "图片生成失败";
    return NextResponse.json({ message }, { status: 500 });
  }
}
