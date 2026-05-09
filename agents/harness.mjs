import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const teamPath = join(root, "team.json");
const outputDir = join(root, "runs");

const team = JSON.parse(await readFile(teamPath, "utf8"));
const objective = process.argv.slice(2).join(" ").trim()
  || "참가 신청 전환을 높이는 2주 홍보 캠페인을 만든다.";

const projectTimeZone = team.project.timezone || "Asia/Seoul";
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: projectTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(new Date());
const runId = new Date().toISOString().replace(/[:.]/g, "-");

function section(title, body) {
  return `## ${title}\n\n${body.trim()}\n`;
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderProjectBrief() {
  const { project } = team;
  return [
    section("프로젝트", [
      `- 이름: ${project.name}`,
      `- 성격: ${project.domain}`,
      `- 기본 목표: ${project.primary_goal}`,
      `- 이번 실행 목표: ${objective}`,
      `- 기준 시간대: ${projectTimeZone}`,
      `- 작성일: ${today}`
    ].join("\n")),
    section("타깃", list(project.audience)),
    section("브랜드 톤", list(project.brand_voice)),
    section("확정 사실", Object.entries(project.hard_facts)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join("\n"))
  ].join("\n");
}

function renderAgentBlock(agent, prompt) {
  return [
    `# ${agent.name} (${agent.id})`,
    "",
    `미션: ${agent.mission}`,
    "",
    "입력:",
    list(agent.inputs),
    "",
    "기대 산출물:",
    list(agent.outputs),
    "",
    "프롬프트:",
    prompt.trim()
  ].join("\n");
}

function starterOutput(agentId) {
  const facts = team.project.hard_facts;
  const capacityLabel = facts.capacity.replace(/^선착순\s*/, "");
  const capacityCount = Number(facts.capacity.replace(/[^\d]/g, ""));
  const feeAmount = Number(facts.fee.replace(/[^\d]/g, ""));
  const maxRevenue = capacityCount && feeAmount
    ? `${(capacityCount * feeAmount).toLocaleString("ko-KR")}원`
    : "확인 필요";
  const outputs = {
    planning_lead: [
      "### 목표 정의",
      "- 참가자 모집: 선착순 200명 접수를 마감일까지 안정적으로 채운다.",
      "- 참가자 경험: 날짜, 장소, 참가비, 부문, 신청 후 안내를 혼란 없이 전달한다.",
      "- 실행 관리: 마케팅, 운영, 재무 확인 항목을 분리해 의사결정 병목을 줄인다.",
      "",
      "### 핵심 의사결정",
      "- 참가 부문과 참가 자격의 최종 문구",
      "- 신청 데이터 저장 방식과 접수 완료 안내 방식",
      "- 참가비 납부/확인 프로세스",
      "- 환불 및 개인정보 처리 안내 문서",
      "",
      "### 부서별 요청사항",
      "- 마케팅: 모집 마감 전 반복 노출할 메시지와 채널별 소재 준비",
      "- 운영: 신청, 문의, 참가 안내, 현장 체크인 체크리스트 작성",
      "- 재무: 참가비 수익, 필수 비용, 환불 리스크 기준 정리"
    ],
    marketing_lead: [
      "### 마케팅 목표",
      `- ${facts.registration_deadline}까지 선착순 ${capacityLabel} 모집을 돕는 신청 행동을 만든다.`,
      "- 대학생 참가자와 운동 동아리 공유자를 분리해 메시지를 설계한다.",
      "",
      "### 핵심 메시지",
      `- ${facts.event_dates}, ${facts.venue}에서 학교 이름을 걸고 뛰는 대학생 크로스핏 대회.`,
      "",
      "### 채널 전략",
      "- Instagram: 대회 정체성, 마감일, 신청 링크 반복 노출",
      "- 대학 커뮤니티: 참가 자격, 참가비, 일정 중심의 정보형 게시",
      "- 동아리/학생회: 공유하기 쉬운 짧은 문구와 이미지 제공",
      "- 제휴/협업: 크로스핏 박스와 운동 관련 단체에 홍보 협조 요청",
      "",
      "### 콘텐츠 요청 브리프",
      "- 카피라이터: 피드 캡션, 스토리 문구, 포스터 헤드라인",
      "- 채널 플래너: 2주 게시 캘린더와 재게시 기준",
      "- 전환 분석가: 신청 페이지 CTA와 FAQ 개선안"
    ],
    operations_lead: [
      "### 운영 체크리스트",
      "- 신청 접수 데이터 저장 방식 확인",
      "- 신청 완료 후 참가자에게 발송할 안내 문구 확정",
      "- 문의 채널과 답변 담당자 지정",
      "- 참가비 납부 확인 방식 확정",
      "- 현장 체크인 기준과 준비물 안내 작성",
      "",
      "### 리스크 대응",
      "- 개인정보 처리방침 URL이 없으면 신청 전 확정 안내를 보류",
      "- 환불 기준이 없으면 환불 가능 여부를 확정 표현으로 쓰지 않음",
      "- 장소/시간 변경 가능성이 있으면 최종 공지일을 별도로 둠",
      "",
      "### 검수 필요 항목",
      "- 참가 자격",
      "- 부문 구분",
      "- 환불 및 결제 안내",
      "- 개인정보 동의",
      "- 안전 및 부상 책임 안내"
    ],
    finance_lead: [
      "### 수익 추정",
      `- 기준 수익: ${facts.fee} x ${capacityLabel} = ${maxRevenue}`,
      "- 실제 수익은 환불, 미입금, 무료 초청, 제휴 조건에 따라 달라질 수 있음",
      "",
      "### 예산 항목",
      "- 장소/장비 대관",
      "- 심판/스태프 운영비",
      "- 보험/안전 관리",
      "- 홍보물 제작",
      "- 참가자 키트/기념품",
      "- 결제/송금 수수료",
      "",
      "### 확인 질문",
      "- 장소 대관료가 확정되었는가?",
      "- 참가비 결제 방식은 카드, 계좌이체, 현장 납부 중 무엇인가?",
      "- 환불 가능 기간과 수수료 기준은 무엇인가?",
      "- 협찬 물품이나 현금 후원이 확정되었는가?"
    ],
    campaign_strategist: [
      "### 캠페인 각도",
      "- 캠퍼스 대표전: 학교 이름을 걸고 뛰는 대학생 크로스핏 대회",
      "- 마감 임박: 선착순 200명, 신청 마감 전 행동 유도",
      "- 첫 대회 진입: 초급부/중급부 구분으로 부담을 낮춘 참가 메시지",
      "",
      "### 핵심 메시지",
      `2026년 9월, ${facts.venue}에서 캠퍼스의 체력을 증명하세요.`,
      "",
      "### 우선 액션",
      "- 인스타그램 피드와 스토리에 신청 마감일을 고정 노출",
      "- 주관 대학 운동 동아리와 체육 관련 학과 단톡방에 공유 요청",
      "- 랜딩 페이지 CTA 주변에 참가비, 장소, 마감일을 한 번 더 노출"
    ],
    copywriter: [
      "### SNS 캡션",
      "- 학교 이름을 걸고 뛰는 9월의 WOD. 캠퍼스 스로우다운 참가 신청 오픈.",
      "- 초급부부터 중급부까지, 지금 실력으로 도전할 수 있는 대학생 크로스핏 대회.",
      "- 선착순 200명. 마감 전에 캠퍼스 대표전 라인업에 합류하세요.",
      "",
      "### CTA",
      "- 참가 신청하기",
      "- 내 부문 선택하기",
      "- 마감 전 신청하기",
      "- 대회 일정 확인하기",
      "- 참가 안내 보기"
    ],
    channel_planner: [
      "### 채널별 역할",
      "- Instagram Feed: 대회 정체성과 핵심 일정 고지",
      "- Instagram Story: 마감 알림, 신청 링크 반복 노출",
      "- 대학 커뮤니티: 참가 자격, 부문, 참가비 중심 안내",
      "- 동아리/학생회 단톡: 짧은 공유문과 신청 링크 배포",
      "- 오프라인 포스터: 장소, 날짜, QR 신청 동선 집중",
      "",
      "### 측정 지표",
      "- 신청 버튼 클릭 수",
      "- 폼 시작 수",
      "- 신청 완료 수",
      "- 채널별 UTM 클릭 수",
      "- 문의 메일/DM 수"
    ],
    partnership_manager: [
      "### 제휴 타깃",
      "- 주관 대학 운동 동아리",
      "- 교내 체육 관련 학과/학생회",
      "- 대학가 크로스핏 박스",
      "- 운동복/보충제/헬스케어 브랜드",
      "",
      "### DM 초안",
      `안녕하세요. ${team.project.name} 운영팀입니다. ${facts.event_dates} ${facts.venue}에서 열리는 대학생 크로스핏 대회 홍보 협업을 제안드리고 싶습니다. 학생 참가자에게 의미 있는 도전 기회를 함께 알릴 수 있을까요? 가능하시다면 간단한 소개 자료를 보내드리겠습니다.`
    ],
    conversion_analyst: [
      "### 전환 리스크",
      "- 신청 버튼 근처에 참가비와 마감일이 충분히 반복되지 않음",
      "- 참가 자격과 환불 기준이 FAQ 안에만 있어 신청 직전 불안이 남을 수 있음",
      "- 신청 완료 후 실제 저장/메일 발송이 되는지 사용자가 오해할 수 있음",
      "",
      "### 빠른 개선안",
      "- 신청 섹션 상단에 날짜, 장소, 참가비, 선착순 정보를 요약",
      "- CTA 문구를 '신청 완료하기'보다 '참가 신청 제출하기'로 명확화",
      "- 완료 메시지에 '데모 페이지인 경우 실제 접수 여부' 안내 추가",
      "- 채널별 UTM 파라미터를 받을 수 있게 링크 규칙 정의"
    ],
    ops_reviewer: [
      "### 검수 포인트",
      "- 날짜, 장소, 참가비, 선착순 200명 표현은 현재 페이지 정보와 일치",
      "- 공식 인증, 최대 규모, 스폰서 확정 등 검증되지 않은 표현은 사용 금지",
      "- 환불 기준과 개인정보 처리방침은 실제 운영 문서 확정 후 연결 필요",
      "",
      "### 게시 전 체크리스트",
      "- 신청 폼 데이터 저장 방식 확정",
      "- 개인정보 처리방침 URL 연결",
      "- 참가비 납부 안내 메일 템플릿 확인",
      "- 커뮤니티 홍보 규정 확인",
      "- 현장 장소/시간 최종 확인"
    ]
  };

  return outputs[agentId]?.join("\n") || "- 담당 산출물을 작성하세요.";
}

await mkdir(outputDir, { recursive: true });

const agentBlocks = [];
for (const agentId of team.workflow) {
  const agent = team.agents.find((item) => item.id === agentId);
  if (!agent) {
    throw new Error(`Unknown agent in workflow: ${agentId}`);
  }

  const prompt = await readFile(join(root, agent.prompt_file), "utf8");
  agentBlocks.push(renderAgentBlock(agent, prompt));
}

const markdown = [
  "# 캠퍼스 스로우다운 홍보 에이전트 팀 실행 브리프",
  "",
  renderProjectBrief(),
  "## 워크플로",
  "",
  team.workflow.map((agentId, index) => `${index + 1}. ${agentId}`).join("\n"),
  "",
  "## 에이전트 지시문",
  "",
  agentBlocks.join("\n\n---\n\n"),
  "",
  "## 초안 산출물",
  "",
  team.workflow.map((agentId) => {
    const agent = team.agents.find((item) => item.id === agentId);
    return `### ${agent.name}\n\n${starterOutput(agentId)}`;
  }).join("\n\n")
].join("\n");

const runPath = join(outputDir, `${runId}.md`);
const latestPath = join(outputDir, "latest.md");

await writeFile(runPath, markdown, "utf8");
await writeFile(latestPath, markdown, "utf8");

console.log(`Created agent run: ${runPath}`);
console.log(`Updated latest run: ${latestPath}`);
