import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  Presentation,
  PresentationFile,
  row,
  column,
  grid,
  layers,
  panel,
  text,
  shape,
  rule,
  fill,
  hug,
  fixed,
  wrap,
  grow,
  fr,
  auto
} from "@oai/artifact-tool";

const W = 1920;
const H = 1080;
const OUT = "output/output.pptx";
const PREVIEW_DIR = "scratch/previews";
const LAYOUT_DIR = "scratch/layouts";
const FINAL_DIR = "../../presentation-output";

const C = {
  navy: "#071030",
  navy2: "#0C1A40",
  blue: "#1A3A8F",
  orange: "#E8471D",
  orange2: "#F57C00",
  pink: "#D81B60",
  white: "#FFFFFF",
  off: "#F4F5F9",
  ink: "#111827",
  muted: "#6B7280",
  line: "#DDE2EF"
};

const title = {
  fontSize: 58,
  bold: true,
  color: C.navy,
  fontFace: "Noto Sans KR"
};

const label = {
  fontSize: 18,
  bold: true,
  color: C.orange,
  fontFace: "Noto Sans KR"
};

const body = {
  fontSize: 28,
  color: C.ink,
  fontFace: "Noto Sans KR"
};

const small = {
  fontSize: 20,
  color: C.muted,
  fontFace: "Noto Sans KR"
};

const deck = Presentation.create({
  slideSize: { width: W, height: H }
});

function bg() {
  return layers({ width: fill, height: fill }, [
    shape({ name: "bg", width: fill, height: fill, fill: C.off }),
    shape({ name: "top-band", width: fill, height: fixed(14), fill: C.orange })
  ]);
}

function darkBg() {
  return layers({ width: fill, height: fill }, [
    shape({ name: "bg-dark", width: fill, height: fill, fill: C.navy }),
    grid(
      {
        name: "color-field",
        width: fill,
        height: fill,
        columns: [fr(1.2), fr(0.42), fr(0.18)],
        rows: [fr(1)]
      },
      [
        shape({ name: "navy-field", width: fill, height: fill, fill: C.navy }),
        shape({ name: "blue-field", width: fill, height: fill, fill: C.blue }),
        shape({ name: "orange-field", width: fill, height: fill, fill: C.orange })
      ]
    )
  ]);
}

function footer(page) {
  return row(
    { name: "footer", width: fill, height: hug, align: "center", justify: "between" },
    [
      text("캠퍼스 스로우다운 2026", {
        name: "footer-brand",
        width: hug,
        height: hug,
        style: { fontSize: 16, bold: true, color: C.muted, fontFace: "Noto Sans KR" }
      }),
      text(String(page).padStart(2, "0"), {
        name: "page",
        width: hug,
        height: hug,
        style: { fontSize: 16, bold: true, color: C.orange, fontFace: "Noto Sans KR" }
      })
    ]
  );
}

function baseSlide(page, slideTitle, subtitle, content) {
  const s = deck.slides.add();
  s.compose(
    layers({ name: "slide", width: fill, height: fill }, [
      bg(),
      column(
        {
          name: "root",
          width: fill,
          height: fill,
          padding: { x: 96, y: 72 },
          gap: 48
        },
        [
          column({ name: "title-stack", width: fill, height: hug, gap: 26 }, [
            text("캠퍼스 스로우다운 2026", { name: "eyebrow", width: hug, height: hug, style: label }),
            text(slideTitle, { name: "title", width: wrap(1320), height: hug, style: title }),
            subtitle
              ? text(subtitle, {
                  name: "subtitle",
                  width: wrap(1280),
                  height: hug,
                  style: { ...small, fontSize: 24, color: "#475569" }
                })
              : rule({ name: "title-rule", width: fixed(220), stroke: C.orange, weight: 6 })
          ]),
          content,
          footer(page)
        ]
      )
    ]),
    { frame: { left: 0, top: 0, width: W, height: H }, baseUnit: 8 }
  );
}

function fact(labelText, value, accent = C.orange) {
  return column({ name: `fact-${labelText}`, width: fill, height: hug, gap: 8 }, [
    text(labelText, {
      width: fill,
      height: hug,
      style: { fontSize: 18, bold: true, color: accent, fontFace: "Noto Sans KR" }
    }),
    text(value, {
      width: fill,
      height: hug,
      style: { fontSize: 32, bold: true, color: C.navy, fontFace: "Noto Sans KR" }
    })
  ]);
}

function bullet(items, color = C.ink) {
  return column(
    { name: "bullet-list", width: fill, height: hug, gap: 18 },
    items.map((item, index) =>
      row({ name: `bullet-${index}`, width: fill, height: hug, gap: 16, align: "start" }, [
        shape({ name: `dot-${index}`, width: fixed(12), height: fixed(12), fill: C.orange }),
        text(item, {
          name: `bullet-text-${index}`,
          width: fill,
          height: hug,
          style: { ...body, fontSize: 27, color }
        })
      ])
    )
  );
}

function addCover() {
  const s = deck.slides.add();
  s.compose(
    layers({ name: "cover", width: fill, height: fill }, [
      darkBg(),
      grid(
        {
          name: "cover-root",
          width: fill,
          height: fill,
          columns: [fr(1), fixed(430)],
          rows: [fr(1), auto],
          padding: { x: 96, y: 84 },
          columnGap: 56,
          rowGap: 42
        },
        [
          column({ name: "cover-copy", width: fill, height: fill, gap: 24 }, [
            text("UNIVERSITY CROSSFIT CHAMPIONSHIP", {
              name: "cover-kicker",
              width: hug,
              height: hug,
              style: { fontSize: 22, bold: true, color: "#FFB199", fontFace: "Noto Sans KR" }
            }),
            text("BATTLE\nOF THE\nCAMPUS", {
              name: "cover-title",
              width: wrap(1180),
              height: hug,
              style: { fontSize: 106, bold: true, color: C.white, fontFace: "Noto Sans KR" }
            }),
            text("학교 이름을 걸고 뛰는 2026년 9월의 WOD", {
              name: "cover-subtitle",
              width: wrap(980),
              height: hug,
              style: { fontSize: 34, bold: true, color: "#DDE7FF", fontFace: "Noto Sans KR" }
            })
          ]),
          column({ name: "cover-date", width: fill, height: fill, justify: "end", gap: 16 }, [
            text("2026.09.12 SAT\n2026.09.13 SUN", {
              name: "cover-dates",
              width: fill,
              height: hug,
              style: { fontSize: 42, bold: true, color: C.white, fontFace: "Noto Sans KR" }
            }),
            rule({ name: "cover-rule", width: fill, stroke: C.white, weight: 3, opacity: 0.45 }),
            text("서울 올림픽공원 체조경기장", {
              name: "cover-venue",
              width: fill,
              height: hug,
              style: { fontSize: 24, color: "#FFE4D6", fontFace: "Noto Sans KR" }
            })
          ]),
          text("소개 및 홍보 협업 제안서", {
            name: "cover-footer",
            columnSpan: 2,
            width: fill,
            height: hug,
            style: { fontSize: 24, bold: true, color: "#FFB199", fontFace: "Noto Sans KR" }
          })
        ]
      )
    ]),
    { frame: { left: 0, top: 0, width: W, height: H }, baseUnit: 8 }
  );
}

addCover();

baseSlide(
  2,
  "대회 한 줄 소개",
  "대학생 크로스핏 참가자와 관람객을 모으는 캠퍼스 대표전입니다.",
  grid(
    {
      name: "pitch-grid",
      width: fill,
      height: grow(1),
      columns: [fr(1.05), fr(0.95)],
      rows: [fr(1)],
      columnGap: 72
    },
    [
      column({ name: "pitch-left", width: fill, height: fill, gap: 26, justify: "center" }, [
        text("학교 이름을 걸고 뛰는 9월의 WOD.", {
          name: "big-claim",
          width: wrap(820),
          height: hug,
          style: { fontSize: 68, bold: true, color: C.navy, fontFace: "Noto Sans KR" }
        }),
        text("초급부부터 중급부까지, 지금 실력으로 도전할 수 있는 대학생 크로스핏 대회.", {
          name: "claim-detail",
          width: wrap(780),
          height: hug,
          style: { fontSize: 30, color: "#334155", fontFace: "Noto Sans KR" }
        })
      ]),
      grid(
        {
          name: "facts",
          width: fill,
          height: fill,
          columns: [fr(1), fr(1)],
          rows: [fr(1), fr(1)],
          columnGap: 34,
          rowGap: 34
        },
        [
          fact("일정", "9.12-9.13"),
          fact("모집", "선착순 200명", C.blue),
          fact("참가비", "30,000원", C.pink),
          fact("장소", "올림픽공원", C.orange2)
        ]
      )
    ]
  )
);

baseSlide(
  3,
  "참가자가 바로 이해하는 운영 정보",
  "홍보 문구는 짧게, 운영 정보는 흔들리지 않게 고정합니다.",
  grid(
    {
      name: "schedule-root",
      width: fill,
      height: grow(1),
      columns: [fr(1), fr(1), fr(1)],
      rows: [fr(1)],
      columnGap: 48
    },
    [
      column({ name: "step-1", width: fill, height: fill, gap: 18 }, [
        text("STEP 01", { width: fill, height: hug, style: { ...label, color: C.orange } }),
        text("2026.08.31", { width: fill, height: hug, style: { ...title, fontSize: 44 } }),
        rule({ width: fill, stroke: C.orange, weight: 5 }),
        text("참가 신청 마감\n선착순 200명 기준", { width: fill, height: hug, style: { ...body, fontSize: 29 } })
      ]),
      column({ name: "step-2", width: fill, height: fill, gap: 18 }, [
        text("STEP 02", { width: fill, height: hug, style: { ...label, color: C.blue } }),
        text("2026.09.12", { width: fill, height: hug, style: { ...title, fontSize: 44 } }),
        rule({ width: fill, stroke: C.blue, weight: 5 }),
        text("예선전\n오전 9시 시작", { width: fill, height: hug, style: { ...body, fontSize: 29 } })
      ]),
      column({ name: "step-3", width: fill, height: fill, gap: 18 }, [
        text("STEP 03", { width: fill, height: hug, style: { ...label, color: C.pink } }),
        text("2026.09.13", { width: fill, height: hug, style: { ...title, fontSize: 44 } }),
        rule({ width: fill, stroke: C.pink, weight: 5 }),
        text("결선 및 시상식\n오전 10시 시작", { width: fill, height: hug, style: { ...body, fontSize: 29 } })
      ])
    ]
  )
);

baseSlide(
  4,
  "왜 지금 참여해야 하나",
  "경쟁감은 강하게, 진입 장벽은 낮게 설계합니다.",
  grid(
    {
      name: "why-root",
      width: fill,
      height: grow(1),
      columns: [fr(0.9), fr(1.1)],
      rows: [fr(1)],
      columnGap: 70
    },
    [
      column({ name: "why-number", width: fill, height: fill, justify: "center", gap: 14 }, [
        text("200", {
          name: "capacity",
          width: fill,
          height: hug,
          style: { fontSize: 180, bold: true, color: C.orange, fontFace: "Noto Sans KR" }
        }),
        text("선착순 참가 모집", {
          name: "capacity-label",
          width: fill,
          height: hug,
          style: { fontSize: 38, bold: true, color: C.navy, fontFace: "Noto Sans KR" }
        }),
        text("마감 전 빠른 행동을 만드는 가장 강한 정보입니다.", {
          name: "capacity-note",
          width: wrap(620),
          height: hug,
          style: { ...small, fontSize: 24 }
        })
      ]),
      bullet([
        "학교 이름을 걸고 출전하는 캠퍼스 대표전 메시지",
        "초급부와 중급부를 나눠 첫 대회 참가 부담 완화",
        "운동 동아리, 체육 관련 학과, 크로스핏 박스에 맞는 타깃성",
        "현장 관람까지 확장 가능한 대학 스포츠 이벤트"
      ])
    ]
  )
);

baseSlide(
  5,
  "홍보 채널 운영안",
  "같은 문구를 반복하기보다 채널별 역할을 나눕니다.",
  grid(
    {
      name: "channel-root",
      width: fill,
      height: grow(1),
      columns: [fr(0.74), fr(1.26)],
      rows: [fr(1)],
      columnGap: 60
    },
    [
      column({ name: "channel-lead", width: fill, height: fill, justify: "center", gap: 20 }, [
        text("FEED\nSTORY\nCOMMUNITY\nPOSTER", {
          name: "channel-stack",
          width: fill,
          height: hug,
          style: { fontSize: 56, bold: true, color: C.navy, fontFace: "Noto Sans KR" }
        }),
        rule({ width: fixed(280), stroke: C.orange, weight: 6 }),
        text("각 채널은 다른 질문에 답합니다.", {
          width: wrap(560),
          height: hug,
          style: { ...small, fontSize: 25 }
        })
      ]),
      column({ name: "channel-table", width: fill, height: fill, gap: 22 }, [
        fact("Instagram Feed", "대회 정체성과 일정 고지", C.orange),
        fact("Instagram Story", "마감 알림과 신청 링크 반복 노출", C.blue),
        fact("대학 커뮤니티", "참가 자격, 부문, 참가비 중심 안내", C.pink),
        fact("동아리/학생회 단톡", "짧은 공유문과 신청 링크 배포", C.orange2),
        fact("오프라인 포스터", "날짜, 장소, QR 신청 동선 집중", C.navy2)
      ])
    ]
  )
);

baseSlide(
  6,
  "제휴 제안 포인트",
  "동아리, 학생회, 박스, 브랜드가 얻는 이득을 먼저 말합니다.",
  grid(
    {
      name: "partner-root",
      width: fill,
      height: grow(1),
      columns: [fr(1), fr(1)],
      rows: [fr(1)],
      columnGap: 64
    },
    [
      column({ name: "partner-left", width: fill, height: fill, gap: 24 }, [
        text("제휴 타깃", { width: fill, height: hug, style: { ...label, fontSize: 22 } }),
        bullet([
          "주관 대학 운동 동아리",
          "교내 체육 관련 학과 및 학생회",
          "대학가 크로스핏 박스",
          "운동복, 보충제, 헬스케어 브랜드"
        ])
      ]),
      column({ name: "dm-right", width: fill, height: fill, gap: 22 }, [
        text("DM 초안", { width: fill, height: hug, style: { ...label, fontSize: 22, color: C.blue } }),
        text(
          "안녕하세요. 캠퍼스 스로우다운 2026 운영팀입니다.\n\n2026년 9월 서울 올림픽공원 체조경기장에서 열리는 대학생 크로스핏 대회 홍보 협업을 제안드리고 싶습니다.\n\n학생 참가자에게 의미 있는 도전 기회를 함께 알릴 수 있을까요?",
          {
            name: "dm-copy",
            width: fill,
            height: hug,
            style: { ...body, fontSize: 27, color: "#334155" }
          }
        )
      ])
    ]
  )
);

baseSlide(
  7,
  "NEXT ACTION",
  "게시 전 운영 리스크를 닫고, 신청 링크 중심으로 배포합니다.",
  grid(
    {
      name: "next-root",
      width: fill,
      height: grow(1),
      columns: [fr(1.05), fr(0.95)],
      rows: [fr(1)],
      columnGap: 72
    },
    [
      column({ name: "next-left", width: fill, height: fill, justify: "center", gap: 28 }, [
        text("마감 전 신청 흐름을 짧게 만듭니다.", {
          width: wrap(760),
          height: hug,
          style: { fontSize: 64, bold: true, color: C.navy, fontFace: "Noto Sans KR" }
        }),
        text("CTA 주변에 날짜, 장소, 참가비, 선착순 정보를 다시 노출하세요.", {
          width: wrap(760),
          height: hug,
          style: { ...body, fontSize: 30, color: "#334155" }
        })
      ]),
      column({ name: "checklist", width: fill, height: fill, gap: 20 }, [
        text("게시 전 체크리스트", { width: fill, height: hug, style: { ...label, fontSize: 22 } }),
        bullet([
          "개인정보 처리방침 URL 연결",
          "참가비 납부 안내 메일 템플릿 확인",
          "환불 및 참가 자격 안내 확정",
          "커뮤니티 홍보 규정 확인",
          "채널별 UTM 링크 준비"
        ])
      ])
    ]
  )
);

await mkdir("output", { recursive: true });
await mkdir(PREVIEW_DIR, { recursive: true });
await mkdir(LAYOUT_DIR, { recursive: true });
await mkdir(FINAL_DIR, { recursive: true });

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT);
await copyFile(OUT, join(FINAL_DIR, "campus-throwdown-2026.pptx"));

for (let index = 0; index < deck.slides.count; index += 1) {
  const slide = deck.slides.getItem(index);
  const png = await deck.export({ slide, format: "png" });
  await writeFile(
    join(PREVIEW_DIR, `slide-${String(index + 1).padStart(2, "0")}.png`),
    Buffer.from(await png.arrayBuffer())
  );
  const layout = await deck.export({ slide, format: "layout" });
  await writeFile(
    join(LAYOUT_DIR, `slide-${String(index + 1).padStart(2, "0")}.json`),
    Buffer.from(await layout.arrayBuffer())
  );
}

await writeFile(
  "scratch/qa-summary.json",
  JSON.stringify(
    {
      deck: "캠퍼스 스로우다운 2026 소개 및 홍보 협업 제안서",
      slides: deck.slides.count,
      pptx: OUT,
      copied_pptx: join(FINAL_DIR, "campus-throwdown-2026.pptx"),
      previews: PREVIEW_DIR,
      layouts: LAYOUT_DIR
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Exported ${OUT}`);
console.log(`Copied ${join(FINAL_DIR, "campus-throwdown-2026.pptx")}`);
console.log(`Rendered previews to ${PREVIEW_DIR}`);
