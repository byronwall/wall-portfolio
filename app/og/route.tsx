import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const palette = {
  page: "#eef2f6",
  paper: "#ffffff",
  quiet: "#f7f9fc",
  border: "#e1e5eb",
  ink: "#141b2b",
  body: "#3d4657",
  muted: "#68758a",
  action: "#2f536c",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") || "Byron Wall";
  const description =
    url.searchParams.get("description") ||
    "Software engineer building full-stack applications, data tools, and developer tooling.";
  const section = url.searchParams.get("section") || "Portfolio";
  const image = url.searchParams.get("image");
  const portraitBuffer = await readFile(
    path.join(process.cwd(), "public", "byron-wall-headshot.jpg"),
  );
  const portrait = `data:image/jpeg;base64,${portraitBuffer.toString("base64")}`;
  const isPortfolio = section.toLowerCase() === "portfolio";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 24,
          background: palette.page,
          color: palette.ink,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "34px 46px 28px",
            border: `1px solid ${palette.border}`,
            borderRadius: 12,
            background: palette.paper,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 438,
              overflow: "hidden",
              border: `1px solid ${palette.border}`,
              borderRadius: 8,
              background: palette.paper,
            }}
          >
            {image || isPortfolio ? (
              <div
                style={{
                  width: "42%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isPortfolio ? 0 : 22,
                  borderRight: `1px solid ${palette.border}`,
                  background: palette.quiet,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isPortfolio ? portrait : image!}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: isPortfolio ? "cover" : "contain",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "42%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: `1px solid ${palette.border}`,
                  background: palette.quiet,
                }}
              >
                <div
                  style={{
                    width: 164,
                    height: 164,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${palette.border}`,
                    borderRadius: 8,
                    background: palette.paper,
                    color: palette.action,
                    fontSize: 46,
                    fontWeight: 800,
                    letterSpacing: "-3px",
                  }}
                >
                  BW
                </div>
              </div>
            )}

            <div
              style={{
                width: "58%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "38px 42px",
              }}
            >
              <div style={{ fontSize: title.length > 56 ? 42 : 49, lineHeight: 1.06, fontWeight: 750, letterSpacing: "-2.2px" }}>
                {title}
              </div>
              <div style={{ marginTop: 22, color: palette.body, fontSize: 21, lineHeight: 1.4 }}>
                {description}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-1.2px" }}>BW</div>
              <div
                style={{
                  marginLeft: 16,
                  paddingLeft: 16,
                  borderLeft: `1px solid ${palette.border}`,
                  color: palette.muted,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                {section}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: isPortfolio ? 0 : 14, fontSize: 25, fontWeight: 750, letterSpacing: "-0.7px" }}>
                Byron Wall
              </div>
              {!isPortfolio && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portrait}
                  alt=""
                  width="54"
                  height="54"
                  style={{ width: 54, height: 54, borderRadius: 7, objectFit: "cover" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
