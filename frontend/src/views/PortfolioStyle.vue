<script setup>
import { onMounted } from 'vue';
onMounted(() => {
    // ====== (샘플) 작성된 포트폴리오 섹션 데이터 ======
    const defaultSections = [
      { id: "s1", title: "INTRO", icon: "👋", visible: true, kind: "summary",
        content: "문제를 단순하게 만들고, 사용자가 바로 이해하는 UI를 설계합니다. 디자인-개발 커뮤니케이션까지 고려해요." },
      { id: "s2", title: "SKILLS", icon: "🧰", visible: true, kind: "summary",
        content: ["Figma", "Prototyping", "Design System", "React", "Tailwind"].join(", ") },
      { id: "s3", title: "PROJECTS", icon: "🧩", visible: true, kind: "detail",
        content: [
          { name: "E-commerce UI 리디자인", period: "2023.01–06", tags: ["Figma","React","UX"] },
          { name: "Design System 구축", period: "2023.07–09", tags: ["Tokens","Docs","Figma"] },
        ]},
      { id: "s4", title: "EXPERIENCE", icon: "🏢", visible: true, kind: "detail",
        content: [
          "ABC Studio / UX Designer (2022–2023)",
          "디자인 QA & 사용자 테스트 리딩",
          "핵심 플로우 전환율 개선"
        ]},
      { id: "s5", title: "CONTACT", icon: "📩", visible: true, kind: "summary",
        content: "contact@poticard.io · github.com/kimpoti" },
    ];

    // state
    let sections = JSON.parse(JSON.stringify(defaultSections));
    let layout = "single";         // single | two | cards
    let accent = "amber";
    let font = "sans";

    // DOM
    const sectionListEl = document.getElementById("sectionList");
    const previewSectionsEl = document.getElementById("previewSections");
    const tagRowEl = document.getElementById("tagRow");
    const previewCardEl = document.getElementById("previewCard");
    const roleTextEl = document.getElementById("roleText");
    const avatarEl = document.getElementById("avatar");

    // inputs
    document.getElementById("layout_single").addEventListener("change", () => { layout="single"; renderPreview(); });
    document.getElementById("layout_two").addEventListener("change", () => { layout="two"; renderPreview(); });
    document.getElementById("layout_cards").addEventListener("change", () => { layout="cards"; renderPreview(); });

    document.getElementById("resetSections").addEventListener("click", ()=>{
      sections = JSON.parse(JSON.stringify(defaultSections));
      renderList(); renderPreview();
    });

    // accent buttons
    document.querySelectorAll("[data-accent]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        accent = btn.dataset.accent;
        document.querySelectorAll("[data-accent]").forEach(b=>b.classList.remove("ring-2","ring-amber-200"));
        btn.classList.add("ring-2","ring-amber-200");
        renderPreview();
      });
    });

    // typography buttons
    const fontSansBtn = document.getElementById("fontSans");
    const fontSerifBtn = document.getElementById("fontSerif");

    const fontActiveClass =
      "border border-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-left";

    const fontInactiveClass =
      "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl p-3 text-left";

    fontSansBtn.addEventListener("click", () => {
      font = "sans";

      fontSansBtn.className = fontActiveClass;
      fontSerifBtn.className = fontInactiveClass;

      previewCardEl.classList.remove("font-serif");
      renderPreview();
    });

    fontSerifBtn.addEventListener("click", () => {
      font = "serif";

      fontSerifBtn.className = fontActiveClass;
      fontSansBtn.className = fontInactiveClass;

      previewCardEl.classList.add("font-serif");
      renderPreview();
    });


    // helpers
    const accentMap = {
      amber: { text:"text-amber-500", pillBg:"bg-amber-50", pillText:"text-amber-600", border:"border-amber-100", panel:"bg-amber-50" },
      sky: { text:"text-sky-500", pillBg:"bg-sky-50", pillText:"text-sky-600", border:"border-sky-100", panel:"bg-sky-50" },
      emerald: { text:"text-emerald-500", pillBg:"bg-emerald-50", pillText:"text-emerald-600", border:"border-emerald-100", panel:"bg-emerald-50" },
      violet: { text:"text-violet-500", pillBg:"bg-violet-50", pillText:"text-violet-600", border:"border-violet-100", panel:"bg-violet-50" },
      pink: { text:"text-pink-500", pillBg:"bg-pink-50", pillText:"text-pink-600", border:"border-pink-100", panel:"bg-pink-50" },
    };

    // Left: render section list (drag + toggle)
    function renderList(){
      sectionListEl.innerHTML = "";
      sections.forEach((s, idx)=>{
        const item = document.createElement("div");
        item.className = "drag-item flex items-center justify-between gap-3 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 bg-white dark:bg-zinc-900";

        item.draggable = true;
        item.dataset.id = s.id;

        const left = document.createElement("div");
        left.className = "flex items-center gap-3 min-w-0";
        left.innerHTML = `
          <div class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-sm" title="드래그 핸들">⠿</div>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">SECTION ${idx+1}</span>
              <span class="text-sm">${s.icon}</span>
            </div>
            <div class="font-semibold truncate">${s.title}</div>
          </div>
        `;

        const right = document.createElement("div");
        right.className = "flex items-center gap-2";
        right.innerHTML = `
          <label class="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>${s.visible ? "ON" : "OFF"}</span>
            <input type="checkbox" ${s.visible ? "checked":""} class="w-4 h-4 accent-amber-400" />
          </label>
        `;

        // toggle visibility
        right.querySelector("input").addEventListener("change", (e)=>{
          s.visible = e.target.checked;
          right.querySelector("span").textContent = s.visible ? "ON" : "OFF";
          renderPreview();
        });

        // drag events
        item.addEventListener("dragstart", ()=> item.classList.add("dragging"));
        item.addEventListener("dragend", ()=> {
          item.classList.remove("dragging");
          document.querySelectorAll(".drag-item").forEach(x=>x.classList.remove("over"));
        });
        item.addEventListener("dragover", (e)=>{
          e.preventDefault();
          item.classList.add("over");
          const dragging = document.querySelector(".drag-item.dragging");
          if(!dragging || dragging===item) return;

          const rect = item.getBoundingClientRect();
          const after = (e.clientY - rect.top) > rect.height/2;

          if(after) item.after(dragging);
          else item.before(dragging);
        });
        item.addEventListener("dragleave", ()=> item.classList.remove("over"));
        item.addEventListener("drop", ()=>{
          const newOrder = [...sectionListEl.querySelectorAll(".drag-item")].map(el=>el.dataset.id);
          sections = newOrder.map(id => sections.find(s=>s.id===id));
          renderPreview();
        });

        item.appendChild(left);
        item.appendChild(right);
        sectionListEl.appendChild(item);
      });
    }

    // Right: render preview by selected layout
    function renderPreview(){
      const a = accentMap[accent] || accentMap.amber;

      roleTextEl.className = `text-[11px] font-bold tracking-wider ${a.text}`;
      avatarEl.className = `w-16 h-16 rounded-2xl border ${a.border} ${a.panel} grid place-items-center`;

      // tags (항상 표시)
      tagRowEl.innerHTML = "";
      ["#Figma", "#Prototyping", "#Problem_Solver"].forEach(t=>{
        const span = document.createElement("span");
        span.className = `px-2.5 py-1 rounded-full ${a.pillBg} ${a.pillText} text-xs font-semibold`;
        span.textContent = t;
        tagRowEl.appendChild(span);
      });

      const visibleSections = sections.filter(s=>s.visible);
      previewSectionsEl.innerHTML = "";

      if(layout === "single"){
        const wrapper = document.createElement("div");
        wrapper.className = "space-y-5";
        visibleSections.forEach(s => wrapper.appendChild(renderSectionBlock(s, a)));
        previewSectionsEl.appendChild(wrapper);
        return;
      }

      if(layout === "cards"){
        const grid = document.createElement("div");
        grid.className = "grid sm:grid-cols-2 gap-4";
        visibleSections.forEach(s=>{
          const card = document.createElement("div");
          card.className = "border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900";
          card.appendChild(renderSectionHeader(s, a));
          card.appendChild(renderSectionBody(s));
          grid.appendChild(card);
        });
        previewSectionsEl.appendChild(grid);
        return;
      }

      if(layout === "two"){
        const left = visibleSections.filter(s=>s.kind==="summary");
        const right = visibleSections.filter(s=>s.kind!=="summary");

        const two = document.createElement("div");
        two.className = "grid md:grid-cols-3 gap-6";

        const colL = document.createElement("div");
        colL.className = "md:col-span-1 space-y-4";
        left.forEach(s => colL.appendChild(renderSectionBlock(s, a)));

        const colR = document.createElement("div");
        colR.className = "md:col-span-2 space-y-4";
        right.forEach(s => colR.appendChild(renderSectionBlock(s, a)));

        two.appendChild(colL);
        two.appendChild(colR);
        previewSectionsEl.appendChild(two);
        return;
      }
    }

    function renderSectionHeader(section, a){
      const header = document.createElement("div");
      header.className = "flex items-center gap-2 text-sm font-bold";
      header.innerHTML = `
        <span class="${a.text}">●</span>
        <span class="text-base">${section.icon}</span>
        <span>${section.title}</span>
      `;
      return header;
    }

    function renderSectionBody(section){
    const body = document.createElement("div");
    body.className = "mt-2";

    if(section.title === "PROJECTS" && Array.isArray(section.content)){
      const grid = document.createElement("div");
      grid.className = "grid sm:grid-cols-2 gap-3";

      section.content.forEach(p=>{
        const card = document.createElement("div");
        card.className =
          "border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 bg-white dark:bg-zinc-900";

        card.innerHTML = `
          <div class="flex items-start justify-between gap-2">
            <div class="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              ${p.name}
            </div>
            <span class="text-[11px] text-zinc-500 dark:text-zinc-400">
              ${p.period}
            </span>
          </div>

          <div class="mt-2 flex flex-wrap gap-1.5">
            ${p.tags.map(t=>`
              <span class="px-2 py-0.5 rounded-full
                bg-zinc-100 dark:bg-zinc-800
                text-zinc-700 dark:text-zinc-200
                text-[11px]">
                ${t}
              </span>
            `).join("")}
          </div>
        `;

        grid.appendChild(card);
      });

      body.appendChild(grid);
      return body;
    }

  /* 기존 EXPERIENCE / 기본 처리 로직은 그대로 */


      if(section.title === "EXPERIENCE" && Array.isArray(section.content)){
        const ul = document.createElement("ul");
        ul.className = "text-sm text-zinc-700 dark:text-zinc-200 list-disc pl-5 space-y-1";
        section.content.forEach(line=>{
          const li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        });
        body.appendChild(ul);
        return body;
      }

      const p = document.createElement("p");
      p.className = "text-sm text-zinc-700 dark:text-zinc-200";
      p.textContent = String(section.content ?? "");
      body.appendChild(p);
      return body;
    }

    function renderSectionBlock(section, a){
      const wrap = document.createElement("div");
      wrap.className = "border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 bg-white dark:bg-zinc-900";

      wrap.appendChild(renderSectionHeader(section, a));
      wrap.appendChild(renderSectionBody(section));
      return wrap;
    }

    // init
    renderList();
    renderPreview();
});
</script>

<template>
    <div class="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">

  <main class="dot-bg">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Step progress -->
      <div class="mb-6">
        <div class="flex items-center justify-center gap-4 text-sm">
          <div class="flex items-center gap-2 text-zinc-500"><span class="font-semibold">01.</span> 기본 정보</div>
          <div class="h-px w-20 bg-amber-300"></div>
          <div class="flex items-center gap-2 text-zinc-500"><span class="font-semibold">02.</span> 프로젝트</div>
          <div class="h-px w-20 bg-amber-300"></div>
          <div class="flex items-center gap-2 text-amber-500 font-semibold"><span>03.</span> 스타일</div>
        </div>
        <div class="mt-3 flex justify-center">
          <div class="h-1 w-[520px] rounded-full bg-zinc-100 overflow-hidden">
            <div class="h-full w-full bg-amber-300"></div>
          </div>
        </div>
      </div>

      <!-- Two column layout -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Left panel -->
        <section class="col-span-12 lg:col-span-4">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-soft border border-zinc-100 dark:border-zinc-800 p-5">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-lg">✏️</span>
              <h2 class="font-bold">스타일 커스터마이징</h2>
            </div>

            <!-- Accent -->
            <div class="mb-5">
              <div class="text-xs text-zinc-500 font-semibold mb-2">ACCENT COLOR</div>
              <div class="flex items-center gap-3">
                <button data-accent="amber" class="w-8 h-8 rounded-full bg-amber-400 ring-2 ring-amber-200" title="Yellow"></button>
                <button data-accent="sky" class="w-8 h-8 rounded-full bg-sky-400" title="Blue"></button>
                <button data-accent="emerald" class="w-8 h-8 rounded-full bg-emerald-400" title="Green"></button>
                <button data-accent="violet" class="w-8 h-8 rounded-full bg-violet-400" title="Violet"></button>
                <button data-accent="pink" class="w-8 h-8 rounded-full bg-pink-400" title="Pink"></button>
              </div>
            </div>

            <!-- Typography -->
            <div class="mb-5">
              <div class="text-xs text-zinc-500 font-semibold mb-2">TYPOGRAPHY</div>
              <div class="grid grid-cols-2 gap-3">
                <button id="fontSans" class="typo-btn border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl p-3 text-left transition-colors">

                  <div class="text-sm font-bold">Sans-serif</div>
                  <div class="text-xs text-zinc-500">Modern &amp; Clean</div>
                </button>
                <button id="fontSerif" class="typo-btn border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl p-3 text-left transition-colors">

                  <div class="text-sm font-bold font-serif">Serif</div>
                  <div class="text-xs text-zinc-500">Classic &amp; Elegant</div>
                </button>
              </div>
            </div>

            <!-- Section Layout Style -->
            <div class="mb-5">
              <div class="text-xs text-zinc-500 font-semibold mb-2">SECTION LAYOUT</div>
              <div class="grid gap-3">
                <div class="radio-card">
                  <input id="layout_single" name="portfolio_layout" type="radio" checked class="hidden" />
                  <label for="layout_single" class="block cursor-pointer border border-zinc-200 rounded-xl p-3">
                    <div class="font-semibold">Single Column</div>
                    <div class="text-xs text-zinc-500">섹션을 위에서 아래로 쭉</div>
                  </label>
                </div>

                <div class="radio-card">
                  <input id="layout_two" name="portfolio_layout" type="radio" class="hidden" />
                  <label for="layout_two" class="block cursor-pointer border border-zinc-200 rounded-xl p-3">
                    <div class="font-semibold">Two Column</div>
                    <div class="text-xs text-zinc-500">왼쪽(요약) + 오른쪽(프로젝트/경험)</div>
                  </label>
                </div>

                <div class="radio-card">
                  <input id="layout_cards" name="portfolio_layout" type="radio" class="hidden" />
                  <label for="layout_cards" class="block cursor-pointer border border-zinc-200 rounded-xl p-3">
                    <div class="font-semibold">Cards</div>
                    <div class="text-xs text-zinc-500">섹션을 카드 묶음으로</div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Section Order / Visibility -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                  SECTIONS (드래그로 순서 변경)
                </div>

                <button
                  id="resetSections"
                  class="text-xs px-2 py-1 rounded-lg
                        border border-zinc-200 dark:border-zinc-700
                        bg-white dark:bg-zinc-900
                        hover:bg-zinc-50 dark:hover:bg-zinc-800
                        text-zinc-700 dark:text-zinc-200
                        transition-colors">
                  초기화
                </button>
              </div>

              <div id="sectionList" class="grid gap-2">
                <!-- items injected -->
              </div>
            </div>

          </div>
        </section>

        <!-- Right panel: Live Preview -->
        <section class="col-span-12 lg:col-span-8">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-soft border border-zinc-100 dark:border-zinc-800 p-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-bold">Live Preview</h2>
              <!-- (삭제) Portfolio 검은 탭 -->
            </div>

            <!-- Preview Canvas -->
            <div class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 p-6">
              <div id="previewCard" class="bg-white dark:bg-zinc-900 rounded-2xl shadow-soft border border-zinc-100 dark:border-zinc-800 p-6 transition-all duration-200 preview-card">

                <!-- header (always) -->
                <div class="flex items-start justify-between gap-6">
                  <div>
                    <div id="roleText" class="text-[11px] font-bold tracking-wider">UX/UI DESIGNER</div>
                    <div class="text-2xl font-extrabold leading-tight mt-1">Kim Poti</div>
                    <p class="text-sm text-zinc-600 dark:text-zinc-300 mt-2">
                      사용자 중심을 디자인하는 디자이너 김포티입니다.
                    </p>
                  </div>

                  <div id="avatar" class="w-16 h-16 rounded-2xl border grid place-items-center">
                    <span class="text-2xl">👩‍💻</span>
                  </div>
                </div>

                <!-- tags (항상 표시) -->
                <div id="tagRow" class="mt-4 flex flex-wrap gap-2"></div>

                <!-- sections render target -->
                <div id="previewSections" class="mt-6"></div>
              </div>
            </div>

            <!-- Bottom actions -->
            <div class="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button class="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm">
                ← 이전 단계
              </button>
              <div class="flex gap-3">
                <!-- (삭제) 화면 캡처 / 링크 공유 -->
                <a href="portfolio-view"
                class="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm inline-flex items-center justify-center">
                저장하기 (완료)
              </a>

              </div>
            </div>
          </div>
        </section>
      </div>
      <br>
    </div>
  </main>
</div>
</template>

<style scoped>
.dot-bg{
      background-image: radial-gradient(rgba(0,0,0,.06) 1px, transparent 1px);
      background-size: 14px 14px;
    }
    .radio-card input:checked + label{
      border-color: rgb(250 204 21);
      box-shadow: 0 0 0 3px rgba(250,204,21,.25);
    }
    .preview-card:hover{
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(0,0,0,.10);
    }

    /* 드래그 섹션 리스트 */
    .drag-item { user-select: none; }
    .drag-item.dragging { opacity: .55; }
    .drag-item.over { outline: 2px dashed rgba(250,204,21,.9); outline-offset: 4px; }
  
</style>