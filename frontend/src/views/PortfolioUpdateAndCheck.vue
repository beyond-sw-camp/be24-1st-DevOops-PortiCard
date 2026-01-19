<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

/* =========================
   ✅ 기존 키워드 추출 로직 유지
========================= */
function extractKeywords() {
  const loadingBtn = document.getElementById('extract-btn')
  const tagSection = document.getElementById('keyword-result-section')
  const nextStepBtn = document.getElementById('next-step-btn')
  const editBtn = document.getElementById('top-edit-btn')

  if (!loadingBtn || !tagSection || !nextStepBtn) return

  loadingBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> 키워드 분석 중...'
  loadingBtn.disabled = true

  setTimeout(() => {
    tagSection.classList.remove('hidden')
    tagSection.classList.add('animate-fade-in')
    loadingBtn.classList.add('hidden')
    nextStepBtn.classList.remove('hidden')
    if (editBtn) editBtn.style.display = 'none'
    tagSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 1200)
}

/* =========================
   ✅ AI 첨삭 팝업 (핵심 변경)
   - 첨삭본 1/2/3 탭 유지
   - 선택한 첨삭본을 "같은 팝업에서 바로 수정" 가능 (textarea)
   - 적용은 수정된 텍스트(variantsDraft)를 본문에 반영
========================= */
const circledNums = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳']
const getCircled = (n) => circledNums[n - 1] || String(n)

// ✅ 본문 5개 섹션을 projects로 관리
const projects = ref([
  {
    title: 'Project Overview',
    original:
      '본 프로젝트는 이커머스 플랫폼의 결제 전환율 개선을 목표로 설정하였습니다. 기존의 복잡한 결제 단계를 사용자 중심의 원스톱 프로세스로 재설계하여 이탈률을 최소화하였습니다.',
  },
  {
    title: 'Key Features',
    original:
      'React 기반의 SPA 환경에서 실시간 재고 연동 시스템을 도입했습니다. 사용자가 결제 시점에 정확한 정보를 확인하도록 하여 서비스의 신뢰도를 높였습니다.',
  },
  {
    title: 'Technical Challenges',
    original:
      '대규모 데이터 렌더링 시 발생하는 병목 현상을 해결하기 위해 가상 스크롤(Virtual Scroll) 기법을 적용했습니다. 이를 통해 초기 로딩 속도를 40% 이상 개선했습니다.',
  },
  {
    title: 'Collaboration',
    original:
      'Atomic Design 패턴을 활용한 공통 컴포넌트 라이브러리를 구축하여 디자이너와의 협업 효율을 극대화했습니다.',
  },
  {
    title: 'Results & Future',
    original:
      '런칭 후 실제 결제 완료 건수가 15% 상승하는 성과를 거두었습니다. 향후 수집된 데이터를 바탕으로 추천 엔진을 고도화할 예정입니다.',
  },
])

const makeVariants = (original) => {
  const o = (original || '').trim()
  return [
    `📌 (핵심 요약형)\n${o}\n\n- 역할/기여/성과를 한 줄로 요약해 보세요.`,
    `✨ (스토리텔링형)\n${o}\n\n- 문제 → 접근 → 결과 흐름으로 읽히게 다듬어 보세요.`,
    `🧩 (수치 강조형)\n${o}\n\n- 수치/지표(%, ms, 건수 등)를 넣으면 설득력이 크게 올라갑니다.`,
  ]
}

// ✅ (중요) variants + variantsDraft 같이 세팅
projects.value = projects.value.map((p) => {
  const variants = makeVariants(p.original)
  return {
    ...p,
    variants,
    // ✅ 사용자가 팝업에서 바로 수정할 수 있는 편집본
    variantsDraft: [...variants],
  }
})

// UI 상태
const ui = reactive({
  open: false,
  projectIndex: 0,
  activeVariant: null, // 0..2
})

const toast = reactive({
  open: false,
  message: '',
  timer: null,
})

const showToast = (message) => {
  toast.message = message
  toast.open = true
  if (toast.timer) clearTimeout(toast.timer)
  toast.timer = setTimeout(() => {
    toast.open = false
  }, 2000)
}

const openEval = () => {
  ui.open = true
  ui.projectIndex = 0
  ui.activeVariant = null
}

const closeEval = () => {
  ui.open = false
  ui.activeVariant = null
}

const selectProject = (idx) => {
  ui.projectIndex = idx
  ui.activeVariant = null
}

const selectVariant = (i) => {
  ui.activeVariant = i

  // ✅ 혹시 drafts가 비어있으면 안전하게 채워두기
  const p = projects.value[ui.projectIndex]
  if (p && (!p.variantsDraft || p.variantsDraft.length !== 3)) {
    p.variantsDraft = [...(p.variants || makeVariants(p.original))]
  }
}

const closeVariant = () => {
  ui.activeVariant = null
}

// ✅ 적용: "variantsDraft(사용자가 수정한 내용)"을 본문에 반영
const applyVariant = () => {
  if (ui.activeVariant === null) return

  const p = projects.value[ui.projectIndex]
  if (!p) return

  const edited = (p.variantsDraft?.[ui.activeVariant] || '').trim()
  if (!edited) return

  // 선택(수정)한 문장을 원문으로 적용
  p.original = edited

  // 적용 후 variants/draft 갱신 (다음 편집도 가능)
  const nextVariants = makeVariants(edited)
  p.variants = nextVariants
  p.variantsDraft = [...nextVariants]

  ui.activeVariant = null
  showToast('적용했습니다!')
}

// 팝업 열리면 스크롤 잠금
watch(
  () => ui.open,
  (v) => {
    document.documentElement.classList.toggle('eval-open', !!v)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.documentElement.classList.remove('eval-open')
  if (toast.timer) clearTimeout(toast.timer)
})

const activeProject = () => projects.value[ui.projectIndex]
const goBack = () => router.back()
</script>

<template>
  <div class="bg-pattern text-gray-800 dark:text-gray-200 flex flex-col min-h-screen">
    <div id="app-header"></div>

    <div id="authModal" class="modal-backdrop" aria-hidden="true">
      <div class="modal-card">
        <div class="rounded-3xl border border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-black text-gray-900 dark:text-white">회원 선택</p>
            <button id="authClose" class="w-9 h-9 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center justify-center" aria-label="닫기" type="button">
              ✕
            </button>
          </div>
          <div class="grid grid-cols-1 gap-3">
            <a href="login.html" class="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60 hover:border-point-yellow transition text-left block">
              <span class="text-base font-black text-gray-900 dark:text-white">👤 개인</span>
            </a>
            <a href="login.html" class="w-full px-4 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/60 hover:border-point-yellow transition text-left block">
              <span class="text-base font-black text-gray-900 dark:text-white">🏢 법인</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <main class="flex-1 pt-10 pb-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12 max-w-3xl mx-auto">
          <div class="flex justify-between text-sm font-bold text-gray-400 dark:text-gray-500 mb-2 px-1 font-poppins">
            <span>01. 프로젝트 작성</span>
            <span class="text-point-yellow">02. 프로젝트 수정 & 확인</span>
            <span>03. 스타일</span>
          </div>
          <div class="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div class="w-2/3 h-full bg-point-yellow rounded-full transition-all duration-700"></div>
          </div>
        </div>

        <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8 md:p-14 relative">
          <div class="flex flex-col md:flex-row md:items-start justify-between mb-16 pb-10 border-b border-gray-50 dark:border-zinc-800 gap-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-full text-[11px] font-bold mb-4">
                <i class="fa-solid fa-wand-magic-sparkles"></i> AI Content Review
              </div>
              <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">내용 확정 및 키워드 추출</h2>
              <p class="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                내용이 확정되면 키워드를 추출해 주세요.<br />
                <span class="text-point-yellow font-bold">키워드 추출 후에는 내용 수정이 불가능합니다.</span>
              </p>
            </div>

            <!-- ✅ 이름 변경 + id 유지(키워드 추출 시 숨김 처리 유지) -->
            <button
              id="top-edit-btn"
              type="button"
              class="px-8 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 text-sm"
              @click="openEval"
            >
              <i class="fa-solid fa-wand-sparkles text-point-yellow"></i> AI 첨삭
            </button>
          </div>

          <!-- ✅ 본문 5개 섹션 (projects에 연결) -->
          <div class="space-y-16 mb-20">
            <div>
              <h3 class="text-[10px] font-black text-gray-300 dark:text-zinc-600 mb-4 uppercase tracking-[0.2em]">Project Overview</h3>
              <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ projects[0].original }}
              </div>
            </div>

            <div>
              <h3 class="text-[10px] font-black text-gray-300 dark:text-zinc-600 mb-4 uppercase tracking-[0.2em]">Key Features</h3>
              <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ projects[1].original }}
              </div>
            </div>

            <div>
              <h3 class="text-[10px] font-black text-gray-300 dark:text-zinc-600 mb-4 uppercase tracking-[0.2em]">Technical Challenges</h3>
              <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ projects[2].original }}
              </div>
            </div>

            <div>
              <h3 class="text-[10px] font-black text-gray-300 dark:text-zinc-600 mb-4 uppercase tracking-[0.2em]">Collaboration</h3>
              <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ projects[3].original }}
              </div>
            </div>

            <div>
              <h3 class="text-[10px] font-black text-gray-300 dark:text-zinc-600 mb-4 uppercase tracking-[0.2em]">Results & Future</h3>
              <div class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ projects[4].original }}
              </div>
            </div>
          </div>

          <div
            id="keyword-result-section"
            class="hidden mt-10 p-10 bg-gray-50/50 dark:bg-zinc-800/30 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 border-dashed relative"
          >
            <div
              class="absolute -top-4 left-10 px-4 py-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-full text-[10px] font-black text-point-yellow shadow-sm tracking-widest uppercase"
            >
              Final Tech Keywords
            </div>
            <h4 class="text-sm font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <i class="fa-solid fa-check-circle text-green-500"></i> 내용 확정 및 키워드 추출이 완료되었습니다.
            </h4>
            <div class="flex flex-wrap gap-3">
              <span class="px-5 py-2.5 bg-white dark:bg-zinc-800 border-2 border-point-yellow/20 text-gray-700 dark:text-gray-300 text-sm rounded-2xl font-bold shadow-sm">#React</span>
              <span class="px-5 py-2.5 bg-white dark:bg-zinc-800 border-2 border-point-yellow/20 text-gray-700 dark:text-gray-300 text-sm rounded-2xl font-bold shadow-sm">#Virtual Scroll</span>
              <span class="px-5 py-2.5 bg-white dark:bg-zinc-800 border-2 border-point-yellow/20 text-gray-700 dark:text-gray-300 text-sm rounded-2xl font-bold shadow-sm">#Atomic Design Pattern</span>
            </div>
          </div>

          <div class="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-50 dark:border-zinc-800">
            <button
              type="button"
              class="px-8 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all flex items-center gap-2 text-sm"
              @click="goBack"
            >
              <i class="fa-solid fa-arrow-left"></i> 이전 단계
            </button>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                class="flex-1 md:flex-none px-8 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
              >
                임시 저장
              </button>

              <button
                id="extract-btn"
                type="button"
                class="flex-1 md:flex-none px-10 py-3 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold shadow-xl hover:bg-black dark:hover:bg-white transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                @click="extractKeywords()"
              >
                내용 확정 및 키워드 추출 <i class="fa-solid fa-wand-sparkles text-point-yellow"></i>
              </button>

              <RouterLink
                id="next-step-btn"
                to="/portfolio-style"
                class="hidden flex-1 md:flex-none px-12 py-3 bg-point-yellow text-gray-900 rounded-2xl font-bold shadow-xl shadow-yellow-200/50 hover:bg-yellow-400 transform hover:-translate-y-0.5 transition-all animate-fade-in inline-flex items-center justify-center"
              >
                스타일 설정하기 <i class="fa-solid fa-chevron-right ml-1 text-sm"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- =========================
         ✅ AI 첨삭 팝업 (여기서 바로 수정 가능)
         - 첨삭본 1/2/3 탭 유지
         - 탭 누르면 textarea로 바로 편집
    ========================= -->
    <div class="eval-overlay" :class="ui.open ? 'eval-open' : ''" aria-hidden="true">
      <div class="eval-dim" @click="closeEval"></div>

      <section class="eval-modal" role="dialog" aria-modal="true" aria-label="AI 첨삭 보기">
        <header class="eval-head">
          <div class="eval-title">
            <span class="eval-badge">AI</span>
            <h2>
              AI 첨삭
              <span class="eval-sub">({{ ui.projectIndex + 1 }} / {{ projects.length }})</span>
            </h2>
          </div>
          <button class="eval-x" type="button" aria-label="닫기" @click="closeEval">✕</button>
        </header>

        <div class="eval-body">
          <aside class="eval-side">
            <p class="eval-side-title">섹션 목록</p>
            <div class="eval-side-list">
              <button
                v-for="(p, idx) in projects"
                :key="p.title + idx"
                type="button"
                class="eval-item"
                :class="idx === ui.projectIndex ? 'active' : ''"
                @click="selectProject(idx)"
              >
                <span class="eval-num">{{ getCircled(idx + 1) }}</span>
                <span class="eval-item-text">{{ p.title }}</span>
              </button>
            </div>
          </aside>

          <main class="eval-main">
            <section class="eval-card">
              <div class="eval-card-head">
                <h3>현재 내용</h3>
                <span class="eval-chip">Original</span>
              </div>
              <p class="eval-text">{{ activeProject()?.original }}</p>
            </section>

            <section class="eval-card">
              <div class="eval-card-head">
                <h3>추천 첨삭본</h3>
                <span class="eval-chip">3 variants</span>
              </div>

              <!-- ✅ 첨삭본 1/2/3 탭 유지 -->
              <div class="eval-tabs">
                <button
                  v-for="i in 3"
                  :key="i"
                  type="button"
                  class="eval-tab"
                  :class="ui.activeVariant === i - 1 ? 'active' : ''"
                  @click="selectVariant(i - 1)"
                >
                  첨삭본 {{ i }}
                </button>
              </div>

              <!-- ✅ 여기서부터가 핵심 변경: 같은 팝업에서 바로 수정 -->
              <div v-if="ui.activeVariant !== null" class="eval-variant">
                <textarea
                  v-model="activeProject().variantsDraft[ui.activeVariant]"
                  class="eval-variant-text w-full min-h-[170px] resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/60 px-4 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-100 outline-none"
                ></textarea>

                <div class="eval-actions">
                  <button type="button" class="eval-btn ghost" @click="closeVariant">닫기</button>
                  <button type="button" class="eval-btn" @click="applyVariant">적용</button>
                </div>
              </div>

              <div v-else class="eval-empty">원하는 첨삭본 탭을 선택하세요.</div>
            </section>
          </main>
        </div>
      </section>
    </div>

    <div class="eval-toast" :class="toast.open ? 'show' : ''" role="status" aria-live="polite">
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
:deep(body) {
  font-family: 'Noto Sans KR', sans-serif;
  transition: background-color 0.3s ease;
}
.bg-pattern {
  background-color: #fcfcfc;
  background-image: radial-gradient(#e2e8f0 0.8px, transparent 0.8px);
  background-size: 20px 20px;
}
.dark .bg-pattern {
  background-color: #121212;
  background-image: radial-gradient(#2d2d2d 0.8px, transparent 0.8px);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
</style>

<!-- ✅ 전역 스타일(팝업은 html/body까지 제어해야 해서 scoped 불가) -->
<style>
html.eval-open,
html.eval-open body {
  overflow: hidden;
}

.eval-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.eval-overlay.eval-open {
  pointer-events: auto;
  opacity: 1;
}

.eval-dim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.eval-modal {
  position: relative;
  width: min(1080px, calc(100vw - 32px));
  height: min(720px, calc(100vh - 32px));
  margin: 16px auto;
  background: var(--card, #fff);
  color: var(--text, #111827);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 22px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.eval-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border, #e5e7eb);
  background: linear-gradient(180deg, rgba(250, 204, 21, 0.12), transparent);
}

.eval-title { display: flex; align-items: center; gap: 10px; }

.eval-badge {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(250, 204, 21, 0.22);
  border: 1px solid rgba(250, 204, 21, 0.35);
  font-weight: 900;
}

.eval-title h2 { font-size: 18px; font-weight: 900; line-height: 1.2; }

.eval-sub { font-size: 12px; font-weight: 800; color: rgba(107, 114, 128, 1); margin-left: 6px; }

.eval-x {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--border, #e5e7eb);
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}
.eval-x:hover { background: rgba(0, 0, 0, 0.04); }

.eval-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: calc(100% - 66px);
}

.eval-side {
  border-right: 1px solid var(--border, #e5e7eb);
  padding: 16px;
  background: rgba(24, 24, 27, 0.02);
}
html.dark .eval-side { background: rgba(255, 255, 255, 0.03); }

.eval-side-title {
  font-size: 12px;
  font-weight: 900;
  color: rgba(107, 114, 128, 1);
  margin-bottom: 10px;
}

.eval-side-list { display: flex; flex-direction: column; gap: 10px; }

.eval-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid var(--border, #e5e7eb);
  background: var(--card, #fff);
  cursor: pointer;
  text-align: left;
}
.eval-item:hover { background: rgba(0, 0, 0, 0.03); }
.eval-item.active {
  border-color: rgba(250, 204, 21, 0.55);
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.18);
}

.eval-num {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(250, 204, 21, 0.18);
  font-weight: 900;
}

.eval-item-text { font-weight: 900; }

.eval-main { padding: 16px; overflow: auto; }

.eval-card {
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  background: var(--card, #fff);
  padding: 14px;
  margin-bottom: 14px;
}

.eval-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.eval-card-head h3 { font-size: 14px; font-weight: 900; }

.eval-chip {
  font-size: 11px;
  font-weight: 900;
  color: rgba(107, 114, 128, 1);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 999px;
  padding: 6px 10px;
}

.eval-text { font-size: 14px; line-height: 1.7; white-space: pre-line; }

.eval-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }

.eval-tab {
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid var(--border, #e5e7eb);
  background: transparent;
  cursor: pointer;
  font-weight: 900;
  font-size: 12px;
}
.eval-tab:hover { background: rgba(0, 0, 0, 0.03); }
.eval-tab.active {
  border-color: rgba(250, 204, 21, 0.55);
  background: rgba(250, 204, 21, 0.16);
}

.eval-variant {
  border: 1px dashed rgba(250, 204, 21, 0.55);
  border-radius: 16px;
  padding: 12px;
  background: rgba(250, 204, 21, 0.08);
}

.eval-variant-text {
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

.eval-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }

.eval-btn {
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid rgba(250, 204, 21, 0.55);
  background: rgba(250, 204, 21, 1);
  color: #111827;
  font-weight: 900;
  cursor: pointer;
}
.eval-btn.ghost {
  background: transparent;
  color: inherit;
  border-color: var(--border, #e5e7eb);
}
.eval-btn.ghost:hover { background: rgba(0, 0, 0, 0.03); }
.eval-btn:hover { filter: brightness(0.98); }

.eval-empty {
  padding: 16px;
  border-radius: 16px;
  border: 1px dashed var(--border, #e5e7eb);
  color: rgba(107, 114, 128, 1);
  font-weight: 800;
  font-size: 13px;
}

.eval-toast {
  position: fixed;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%) translateY(12px);
  background: rgba(17, 24, 39, 0.92);
  color: white;
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 13px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 10000;
}
.eval-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

@media (max-width: 920px) {
  .eval-body { grid-template-columns: 1fr; }
  .eval-side { border-right: none; border-bottom: 1px solid var(--border, #e5e7eb); }
}
</style>
