<script setup>
import { onMounted } from 'vue'

function flipCard() {
  const cardInner = document.getElementById('card-inner')
  cardInner.classList.toggle('flipped')
}
onMounted(() => {

})
</script>

<template>
  <div
    class="bg-pattern text-gray-800 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col"
  >
    <!-- header fetch -->
    <div id="header-placeholder"></div>

    <!-- 2. 메인 콘텐츠 -->
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 pt-28 pb-20">
      <!-- Hero Section: 명함 (클릭 시 뒤집힘) -->
      <section class="flex flex-col items-center mb-24">
        <div class="mb-4 text-center">
          <span
            class="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold mb-2 animate-bounce"
          >
            Click the card! 👇
          </span>
        </div>

        <!-- Card Container -->
        <div
          class="relative w-full max-w-md aspect-[1.58/1] cursor-pointer group perspective-1000"
         @click="flipCard()"
        >
          <div
            id="card-inner"
            class="relative w-full h-full transform-style-3d shadow-2xl rounded-2xl"
          >
            <!-- FRONT SIDE -->
            <div
              class="absolute inset-0 w-full h-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-8 backface-hidden overflow-hidden"
            >
              <!-- Deco -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-bl-full"></div>

              <div class="flex flex-col justify-between h-full relative z-10">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-xs font-bold text-point-yellow uppercase tracking-widest mb-1">
                      UX/UI Designer
                    </p>
                    <h2
                      class="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2"
                    >
                      Kim Poti
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      사용자 경험을 디자인하는<br />디자이너 김포티입니다.
                    </p>
                  </div>
                  <div
                    class="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-800 shadow-md overflow-hidden bg-gray-100"
                  >
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      alt="Profile"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="flex gap-2 flex-wrap">
                    <span
                      class="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-md"
                      >#Figma</span
                    >
                    <span
                      class="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-md"
                      >#Prototyping</span
                    >
                    <span
                      class="px-2.5 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-md"
                      >#Problem_Solver</span
                    >
                  </div>

                  <div
                    class="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center"
                  >
                    <div class="flex gap-3 text-gray-400 dark:text-gray-500">
                      <a href="#" class="hover:text-point-yellow transition-colors"
                        ><i class="fa-brands fa-github text-xl"></i
                      ></a>
                      <a href="#" class="hover:text-point-yellow transition-colors"
                        ><i class="fa-brands fa-linkedin text-xl"></i
                      ></a>
                      <a href="#" class="hover:text-point-yellow transition-colors"
                        ><i class="fa-brands fa-instagram text-xl"></i
                      ></a>
                      <a href="#" class="hover:text-point-yellow transition-colors"
                        ><i class="fa-solid fa-envelope text-xl"></i
                      ></a>
                    </div>
                    <i
                      class="fa-solid fa-qrcode text-3xl text-gray-800 dark:text-white opacity-80"
                    ></i>
                  </div>
                </div>
              </div>
            </div>

            <!-- BACK SIDE -->
            <div class="card-face card-back bg-zinc-900 text-white rounded-2xl border border-zinc-700 p-6 sm:p-8 flex flex-col">
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-zinc-800 rounded-tr-full opacity-50"></div>
                <div class="relative z-10 h-full flex flex-col">
                    <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
                        <span class="w-1.5 h-6 bg-yellow-400 rounded-full"></span> Contact Info
                    </h3>
                    <div class="space-y-4 flex-1 text-sm text-gray-300">
                         <div class="flex items-center gap-3"><i class="fa-solid fa-phone w-5"></i> 010-1234-5678</div>
                         <div class="flex items-center gap-3"><i class="fa-solid fa-location-dot w-5"></i> Seoul, Korea</div>
                         <div class="flex items-center gap-3"><i class="fa-solid fa-link w-5"></i> kimpoti.design</div>
                    </div>
                    <div class="text-right mt-auto">
                        <span class="text-[10px] font-bold tracking-widest opacity-40">POTICARD</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section>
        <div class="flex items-center gap-3 mb-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Featured Projects</h3>
          <div class="h-px flex-1 bg-gray-200 dark:bg-zinc-800"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Project Card 1 -->
          <article
            class="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-yellow-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div class="w-full h-48 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
              <!-- Placeholder Image -->
              <div
                class="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-zinc-700"
              >
                <i class="fa-regular fa-image text-4xl"></i>
              </div>
              <!-- Overlay -->
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span
                  class="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-full text-sm font-bold border border-white/30"
                  >View Details</span
                >
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <span
                  class="text-[10px] font-bold text-point-yellow bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded uppercase tracking-wide"
                  >App Redesign</span
                >
                <span class="text-xs text-gray-400">2023.01</span>
              </div>
              <h4
                class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-point-yellow transition-colors"
              >
                E-commerce Mobile App
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                기존 쇼핑몰 앱의 복잡한 결제 프로세스를 개선하여 구매 전환율을 15% 상승시킨 리디자인
                프로젝트입니다.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs text-gray-400">#UX_Research</span>
                <span class="text-xs text-gray-400">#Figma</span>
              </div>
            </div>
          </article>

          <!-- Project Card 2 -->
          <article
            class="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-yellow-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div class="w-full h-48 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
              <div
                class="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-zinc-700"
              >
                <i class="fa-solid fa-chart-pie text-4xl"></i>
              </div>
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span
                  class="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-full text-sm font-bold border border-white/30"
                  >View Details</span
                >
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <span
                  class="text-[10px] font-bold text-point-yellow bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded uppercase tracking-wide"
                  >Web Dashboard</span
                >
                <span class="text-xs text-gray-400">2023.05</span>
              </div>
              <h4
                class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-point-yellow transition-colors"
              >
                Finance Admin Dashboard
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                복잡한 금융 데이터를 직관적인 차트와 그래프로 시각화하여 관리자 업무 효율을 높인
                대시보드입니다.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs text-gray-400">#Data_Viz</span>
                <span class="text-xs text-gray-400">#React</span>
              </div>
            </div>
          </article>

          <!-- Project Card 3 -->
          <article
            class="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-yellow-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div class="w-full h-48 bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
              <div
                class="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-zinc-700"
              >
                <i class="fa-solid fa-swatchbook text-4xl"></i>
              </div>
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span
                  class="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-full text-sm font-bold border border-white/30"
                  >View Details</span
                >
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <span
                  class="text-[10px] font-bold text-point-yellow bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded uppercase tracking-wide"
                  >Design System</span
                >
                <span class="text-xs text-gray-400">2023.08</span>
              </div>
              <h4
                class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-point-yellow transition-colors"
              >
                Enterprise Design System
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                전사 프로덕트의 일관성을 위한 디자인 시스템 구축 프로젝트. 컴포넌트 라이브러리와
                가이드라인을 제작했습니다.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="text-xs text-gray-400">#System_Design</span>
                <span class="text-xs text-gray-400">#Documentation</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* 3D Flip Animation Styles */
.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Safari Support */
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.flipped {
  transform: rotateY(180deg);
}

/* Card transition */
#card-inner {
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}

/* Background Pattern */
.bg-pattern {
  background-color: #f8fafc;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
}
.dark .bg-pattern {
  background-color: #09090b;
  background-image: radial-gradient(#27272a 1px, transparent 1px);
}

/* ★★★ 3D 플립 핵심 CSS (Tailwind 대신 사용) ★★★ 
  이 스타일이 있어야 앞/뒷면 간섭 없이 완벽하게 동작합니다.
*/

/* 1. 무대 (원근감) */
.scene {
  perspective: 1000px;
}

/* 2. 회전하는 물체 */
.card-object {
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 부드러운 회전 효과 */
  transform-style: preserve-3d; /* 3D 공간 유지 필수 */
}

/* 3. 뒤집혔을 때 상태 */
.card-object.is-flipped {
  transform: rotateY(180deg);
}

/* 4. 앞면과 뒷면 공통 설정 */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  /* 뒷면 숨기기: 브라우저 호환성을 위해 webkit 접두사 포함 */
  -webkit-backface-visibility: hidden; 
  backface-visibility: hidden;
  overflow: hidden; /* 둥근 모서리 밖으로 내용 삐져나감 방지 */
}

/* 5. 뒷면은 처음부터 180도 돌려놓기 */
.card-back {
  transform: rotateY(180deg);
}

/* 6. 앞면 (특별한 설정 없음, 기본 0도) */
.card-front {
  transform: rotateY(0deg);
  /* z-index 싸움을 방지하기 위해 명시적으로 0도 지정 */
}
</style>
