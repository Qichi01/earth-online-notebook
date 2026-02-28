import type { CSSProperties, SVGProps } from "react";
import type { AchievementScene, VisualIconName } from "@/lib/achievementVisuals";

function IconSpark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M12 2.5l1.8 5.7L19.5 10l-5.7 1.8L12 17.5l-1.8-5.7L4.5 10l5.7-1.8L12 2.5z" />
    </svg>
  );
}

function IconPan(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M5 12.5a5.5 5.5 0 0 1 5.5-5.5h2A5.5 5.5 0 0 1 18 12.5v1H5v-1z" />
      <path d="M18 12h3.5" />
      <path d="M7.5 16h7" />
    </svg>
  );
}

function IconShoe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M4 15.5c2.8 0 4.8-.6 6.2-1.8l1.5-1.2 2.1 2.7c.9 1.1 2.2 1.8 3.6 1.8H20v2H4v-3.5z" />
      <path d="M12 12l1.2-4" />
    </svg>
  );
}

function IconMap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M8 4.5l8-2v17l-8 2-4-1.5v-17L8 4.5z" />
      <path d="M8 4.5v17" />
      <path d="M16 2.5v17" />
    </svg>
  );
}

function IconTea(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M6 8h9v4.5A4.5 4.5 0 0 1 10.5 17 4.5 4.5 0 0 1 6 12.5V8z" />
      <path d="M15 9h1.5A2.5 2.5 0 0 1 19 11.5 2.5 2.5 0 0 1 16.5 14H15" />
      <path d="M8 4.5c1 1 .4 1.7 0 2.5" />
      <path d="M11 4c1 1 .4 1.7 0 2.5" />
    </svg>
  );
}

function IconBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M6 4.5h9a3 3 0 0 1 3 3v12H9a3 3 0 0 0-3 3v-18z" />
      <path d="M6 4.5v15a3 3 0 0 1 3-3h9" />
    </svg>
  );
}

function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M5 6.5h14v9H9l-4 3v-12z" />
      <path d="M8.5 10.5h7" />
      <path d="M8.5 13h4.5" />
    </svg>
  );
}

function IconLeaf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M18.5 5.5c-7 0-11 4-11 10 0 1.2.2 2 .5 3 1-.3 1.8-.5 3-.5 6 0 10-4 10-11V5.5h-2.5z" />
      <path d="M8 17c1.5-2 3.4-3.9 6.5-6" />
    </svg>
  );
}

function IconStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 3.5z" />
    </svg>
  );
}

const iconMap: Record<VisualIconName, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  spark: IconSpark,
  pan: IconPan,
  shoe: IconShoe,
  map: IconMap,
  tea: IconTea,
  book: IconBook,
  chat: IconChat,
  leaf: IconLeaf,
  star: IconStar
};

export function VisualIcon({
  icon,
  className
}: {
  icon: VisualIconName;
  className?: string;
}) {
  const Icon = iconMap[icon];
  return <Icon className={className} />;
}

function Character({
  left,
  body,
  head,
  accessory,
  accent
}: {
  left: string;
  body: string;
  head: string;
  accessory?: string;
  accent: string;
}) {
  return (
    <div className={`absolute bottom-16 ${left} flex flex-col items-center`}>
      <div className="relative h-16 w-14">
        <div className="absolute left-2 top-0 h-10 w-10 rounded-full" style={{ backgroundColor: head }} />
        <div className="absolute bottom-0 left-0 h-10 w-14 rounded-[14px_14px_10px_10px]" style={{ backgroundColor: body }} />
        <div className="absolute bottom-0 left-2 h-4 w-2 rounded-b-full bg-[#4a3729]" />
        <div className="absolute bottom-0 right-2 h-4 w-2 rounded-b-full bg-[#4a3729]" />
        <div className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-[#2b2b2b]" />
        <div className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-[#2b2b2b]" />
        <div className="absolute left-[22px] top-6 h-1 w-2 -translate-x-1/2 rounded-full bg-[#f18c7c]" />
        {accessory ? (
          <div className="absolute -top-1 left-1 h-5 w-12 rounded-full" style={{ backgroundColor: accessory }} />
        ) : null}
        <div className="absolute -right-1 bottom-4 h-4 w-4 rounded-full opacity-75" style={{ backgroundColor: accent }} />
      </div>
    </div>
  );
}

function MountainNightScene({ accent, accentSoft }: { accent: string; accentSoft: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#17356d_0%,#2b4b84_38%,#f6dda0_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,#fff7c4_0%,transparent_55%)] opacity-70" />
      <div className="absolute left-6 top-6 text-white/90"><VisualIcon icon="spark" className="h-8 w-8" /></div>
      <div className="absolute right-8 top-12 text-white/80"><VisualIcon icon="star" className="h-6 w-6" /></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent_0%,#132b5d_100%)]" />
      <div className="absolute inset-x-2 bottom-0 h-36 rounded-t-[120px] bg-[#33446f]" />
      <div className="absolute inset-x-12 bottom-10 h-32 rounded-t-[160px] bg-[#4f3c3f]" />
      <div className="absolute bottom-0 left-4 right-4 flex items-end justify-between gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="relative w-10 rounded-t-md bg-[#24304f]" style={{ height: `${28 + (index % 3) * 10}px` }}>
            <div className="absolute left-2 top-2 h-2 w-2 rounded-sm bg-[#ffd971]" />
            <div className="absolute right-2 top-2 h-2 w-2 rounded-sm bg-[#ffd971]" />
          </div>
        ))}
      </div>
      <Character left="left-[28%]" body="#d9a56f" head="#f8d2b4" accessory="#ba8f42" accent={accentSoft} />
      <Character left="left-[43%]" body="#6d85c9" head="#f6c7a6" accent={accent} />
    </>
  );
}

function CityNightScene({ accent }: { accent: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#234278_0%,#385b93_45%,#f2ddb2_100%)]" />
      <div className="absolute left-10 top-8 text-white/85"><VisualIcon icon="spark" className="h-8 w-8" /></div>
      <div className="absolute right-12 top-10 text-white/70"><VisualIcon icon="star" className="h-5 w-5" /></div>
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#24395e]" />
      <div className="absolute bottom-8 left-6 right-6 flex items-end gap-2">
        {[80, 100, 64, 120, 90, 74].map((height, index) => (
          <div key={index} className="relative flex-1 rounded-t-lg bg-[#1b2e4e]" style={{ height }}>
            {Array.from({ length: Math.floor(height / 18) }).map((__, row) => (
              <div key={row} className="absolute left-2 right-2 flex justify-between" style={{ top: 10 + row * 14 }}>
                <span className="h-2 w-2 rounded-sm bg-[#ffd971]" />
                <span className="h-2 w-2 rounded-sm bg-[#ffd971]" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-14 left-10 h-2 w-36 rounded-full" style={{ backgroundColor: `${accent}55` }} />
    </>
  );
}

function CafeScene({ accentSoft }: { accentSoft: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f4e2c6_0%,#f6eddc_44%,#e2c9a4_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#d8b488]" />
      <div className="absolute left-10 top-10 h-28 w-44 rounded-[28px] bg-white/55" />
      <div className="absolute right-12 top-12 h-20 w-20 rounded-full bg-white/45" />
      <div className="absolute bottom-20 left-16 right-16 h-5 rounded-full bg-[#946c44]" />
      <div className="absolute bottom-24 left-28 h-12 w-12 rounded-full bg-white">
        <div className="absolute left-4 top-2 text-[#946c44]"><VisualIcon icon="tea" className="h-5 w-5" /></div>
      </div>
      <div className="absolute bottom-24 right-28 h-12 w-12 rounded-full bg-white">
        <div className="absolute left-4 top-2 text-[#946c44]"><VisualIcon icon="chat" className="h-5 w-5" /></div>
      </div>
      <Character left="left-[24%]" body="#d8a57a" head="#f8d2b4" accessory={accentSoft} accent="#d58c4d" />
      <Character left="left-[52%]" body="#8098d2" head="#f3c8a8" accent="#7d5d44" />
    </>
  );
}

function KitchenScene({ accent }: { accent: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f4efe6_0%,#efe4d4_42%,#d6c0a7_100%)]" />
      <div className="absolute left-6 top-8 h-16 w-16 rounded-2xl bg-white/50" />
      <div className="absolute right-8 top-8 h-20 w-28 rounded-2xl bg-white/45" />
      <div className="absolute inset-x-6 bottom-14 h-16 rounded-3xl bg-[#c69563]" />
      <div className="absolute bottom-24 left-14 h-16 w-16 rounded-full bg-[#4d4d58]">
        <div className="absolute left-4 top-4 text-white"><VisualIcon icon="pan" className="h-8 w-8" /></div>
      </div>
      <div className="absolute bottom-24 right-16 h-10 w-10 rounded-full" style={{ backgroundColor: accent }}>
        <div className="absolute left-2 top-2 text-white"><VisualIcon icon="spark" className="h-6 w-6" /></div>
      </div>
    </>
  );
}

function StreetScene({ accent }: { accent: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#dfeaf5_0%,#edf3f7_44%,#f7dfbf_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#59697a]" />
      <div className="absolute bottom-8 left-0 right-0 h-2 bg-white/70" />
      <div className="absolute left-14 top-10 h-28 w-14 rounded-t-full bg-[#f1f3f5]" />
      <div className="absolute left-[70px] top-0 h-16 w-2 bg-[#8ea0af]" />
      <div className="absolute left-[63px] top-0 h-10 w-16 rounded-full bg-[#ffe7a0]" />
      <div className="absolute right-10 bottom-10 text-white"><VisualIcon icon="shoe" className="h-8 w-8" /></div>
      <div className="absolute bottom-10 left-28 h-2 w-40 rounded-full" style={{ backgroundColor: `${accent}66` }} />
    </>
  );
}

function DeskScene({ accentSoft }: { accentSoft: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef0dc_0%,#f5f1de_42%,#dbc8a8_100%)]" />
      <div className="absolute inset-x-8 bottom-12 h-20 rounded-[28px] bg-[#b88758]" />
      <div className="absolute bottom-20 left-16 h-14 w-20 rounded-xl bg-[#ffffffd9]" />
      <div className="absolute bottom-24 left-20 text-[#6b6b6b]"><VisualIcon icon="book" className="h-8 w-8" /></div>
      <div className="absolute bottom-20 right-16 h-12 w-12 rounded-full bg-[#7a7152]">
        <div className="absolute left-3 top-3 text-white"><VisualIcon icon="spark" className="h-6 w-6" /></div>
      </div>
      <div className="absolute right-20 top-10 h-16 w-16 rounded-full" style={{ backgroundColor: accentSoft }} />
    </>
  );
}

function RestScene({ accentSoft }: { accentSoft: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#d7e8ea_0%,#eef3ee_44%,#f7e6cc_100%)]" />
      <div className="absolute left-10 top-10 text-white"><VisualIcon icon="star" className="h-7 w-7" /></div>
      <div className="absolute inset-x-10 bottom-16 h-20 rounded-[32px] bg-white/75" />
      <div className="absolute bottom-24 left-16 h-12 w-16 rounded-t-2xl" style={{ backgroundColor: accentSoft }} />
      <div className="absolute bottom-24 right-14 h-12 w-12 rounded-full bg-[#ffffffd9]">
        <div className="absolute left-3 top-3 text-[#5f887d]"><VisualIcon icon="tea" className="h-6 w-6" /></div>
      </div>
    </>
  );
}

function GardenScene({ accent }: { accent: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#e8f3d7_0%,#f1f6df_44%,#d5c696_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[#93b173]" />
      <div className="absolute bottom-16 left-16 h-20 w-20 rounded-full bg-[#cde4b6]" />
      <div className="absolute bottom-8 left-24 h-16 w-2 rounded-full bg-[#5e7d40]" />
      <div className="absolute bottom-22 left-20 text-[#5e7d40]"><VisualIcon icon="leaf" className="h-9 w-9" /></div>
      <div className="absolute bottom-20 right-16 h-14 w-14 rounded-full" style={{ backgroundColor: accent }}>
        <div className="absolute left-4 top-4 text-white"><VisualIcon icon="spark" className="h-6 w-6" /></div>
      </div>
    </>
  );
}

function Scene({
  scene,
  accent,
  accentSoft
}: {
  scene: AchievementScene;
  accent: string;
  accentSoft: string;
}) {
  switch (scene) {
    case "mountain-night":
      return <MountainNightScene accent={accent} accentSoft={accentSoft} />;
    case "city-night":
      return <CityNightScene accent={accent} />;
    case "cafe-table":
      return <CafeScene accentSoft={accentSoft} />;
    case "kitchen":
      return <KitchenScene accent={accent} />;
    case "street-walk":
      return <StreetScene accent={accent} />;
    case "desk-focus":
      return <DeskScene accentSoft={accentSoft} />;
    case "cozy-rest":
      return <RestScene accentSoft={accentSoft} />;
    case "growth-garden":
      return <GardenScene accent={accent} />;
    default:
      return <CityNightScene accent={accent} />;
  }
}

export default function AchievementArtwork({
  scene,
  accent,
  accentSoft
}: {
  scene: AchievementScene;
  accent: string;
  accentSoft: string;
}) {
  const frameStyle: CSSProperties = {
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)"
  };

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[28px] border border-white/40" style={frameStyle}>
      <Scene scene={scene} accent={accent} accentSoft={accentSoft} />
    </div>
  );
}
