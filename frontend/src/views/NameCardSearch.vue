<script setup>
import { onMounted, ref, onUnmounted} from 'vue'
import api from '@/api/namecard/index'

const userCards = ref([]);
const isLoading = ref(false); // 로딩 상태
const loadTrigger = ref(null); // 무한 스크롤 감지용 DOM ref
let page = 1; // 페이지 번호 (API 요청용)

// 명함 정보 불러오는 함수
const getNamecards = async () => {
  // const namecards = ref([]) // { name: '', role: '', avatar: '', tags: '' }
  const res = await api.getNamecardInfo()


  return res.data.map((item) => {
    return{
      name: item.name,
      role: item.affiliation,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boo',
      tags: item.keywords,
    }
  })
}

// 2. 추가 데이터 로드 함수
const loadMoreCards = async () => {
  if (isLoading.value) return; // 이미 로딩 중이면 중복 실행 방지
  
  isLoading.value = true;
  try {
    console.log(`페이지 ${page} 로딩 중...`);
    const newItems = await getNamecards(page);
    
    // 기존 리스트에 새 데이터 추가 (무한 스크롤 핵심)
    userCards.value.push(...newItems);
    page++;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- [모달 및 플립 관련 로직] ---
const selectedCard = ref(null); // 현재 선택된 카드 데이터
const isModalCardFlipped = ref(false); // 모달 내부 카드 뒤집힘 상태

const openModal = (card) => {
  selectedCard.value = card;
  isModalCardFlipped.value = false; // 모달 열 때 항상 앞면으로 초기화
  document.body.style.overflow = 'hidden'; // 스크롤 막기
};

const closeModal = () => {
  selectedCard.value = null;
  document.body.style.overflow = ''; // 스크롤 풀기
};

// 모달 내부 카드 클릭 시 뒤집기 토글
const toggleModalCardFlip = () => {
    isModalCardFlipped.value = !isModalCardFlipped.value;
}
// -------------------------------



onMounted(async () => {
  // 초기 데이터 로드
  await loadMoreCards();

  // 감지기(Observer) 생성
  observer = new IntersectionObserver((entries) => {
    const target = entries[0];
    // 감지 대상(loadTrigger)이 화면에 보이고, 로딩 중이 아닐 때 실행
    if (target.isIntersecting && !isLoading.value) {
      loadMoreCards();
    }
  }, {
    root: null, // 뷰포트 기준
    threshold: 0.1 // 10% 정도 보일 때 트리거
  });

  // 감지 시작
  if (loadTrigger.value) {
    observer.observe(loadTrigger.value);
  }
});

onUnmounted(() => {
  // 메모리 누수 방지를 위해 해제
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="bg-pattern text-gray-800 transition-colors duration-300">
    <div class="flex pt-16 min-h-screen">
      <!-- 2. 좌측 고정 패널 (기업용 필터) -->
      <aside
        class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/90 backdrop-blur border-r border-gray-100 p-6 overflow-y-auto z-40 hidden lg:block transition-colors duration-300"
      >
        <div class="mb-8">
          <h2
            class="text-xs font-black text-point-yellow uppercase tracking-wider mb-6 flex items-center gap-2"
          >
            <span class="w-2 h-2 bg-point-yellow rounded-full"></span> Targeting
          </h2>

          <div class="space-y-6">
            <!-- 필터 그룹 1 -->
            <div>
              <h3 class="font-bold text-gray-800 d mb-3 flex justify-between items-center text-sm">
                직군 (Job Group)
              </h3>
              <div class="space-y-2.5">
                <label
                  class="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 bg-gray-100"
                  />
                  <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors"
                    >기획/PM</span
                  >
                </label>
                <label
                  class="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked
                    class="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 bg-gray-100"
                  />
                  <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors"
                    >디자인</span
                  >
                </label>
                <label
                  class="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked
                    class="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 bg-gray-100"
                  />
                  <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors"
                    >개발 (FE/BE)</span
                  >
                </label>
              </div>
            </div>

            <div class="w-full h-px bg-gray-100"></div>

            <!-- 필터 그룹 2 (태그 스타일 변경) -->
            <div>
              <h3 class="font-bold text-gray-800 mb-3 text-sm">필수 스킬</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  class="px-3 py-1.5 bg-yellow-50 dtext-yellow-700 text-xs font-bold rounded-lg cursor-pointer border border-yellow-100 hover:bg-yellow-100 transition-colors"
                  >React</span
                >
                <span
                  class="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-100 transition-colors"
                  >Figma</span
                >
                <span
                  class="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg cursor-pointer border border-gray-200 hover:bg-gray-100 transition-colors"
                  >Python</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 하단 버튼 (Yellow 포인트) -->
        <div class="absolute bottom-6 left-6 right-6">
          <button
            class="w-full py-3 bg-gray-900 text-white rounded-2xl font-black hover:bg-gray-800 shadow-lg transition-all transform hover:-translate-y-1"
          >
            필터 적용하기
          </button>
        </div>
      </aside>



  <main class="flex-1 lg:ml-64 p-8 h-screen overflow-y-auto bg-gray-50">
      
      <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 pb-10">
        <div 
          v-for="(card, idx) in userCards" 
          :key="card.id || idx"
          class="group"
          @click="openModal(card)" 
        >
          <div class="relative w-80 h-52 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between p-5 overflow-hidden transition-all duration-300 ease-out cursor-pointer hover:shadow-2xl hover:border-yellow-300 hover:scale-105 hover:-translate-y-1 z-0 hover:z-10">
            <div class="absolute top-0 right-0 w-16 h-16 bg-yellow-100 rounded-bl-full transition-colors group-hover:bg-yellow-300"></div>
            <div class="relative z-10">
                <p class="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">{{ card.role }}</p>
                <h4 class="text-lg font-black text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2">{{ card.name }}</h4>
                <div class="mt-3 flex flex-wrap gap-1">
                  <span v-for="tag in card.tags" :key="tag" class="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-medium">{{ tag }}</span>
                </div>
            </div>
            <div class="flex justify-between items-end mt-4">
                <div class="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden group-hover:border-yellow-400 transition-colors">
                  <img :src="card.avatar" class="w-full h-full object-cover">
                </div>
                <i class="fa-solid fa-arrow-right text-gray-300 group-hover:text-yellow-500 transition-colors transform group-hover:translate-x-1"></i>
            </div>
          </div>
        </div>
      </div>

      <div ref="loadTrigger" class="w-full py-10 flex justify-center items-center"></div>

      <Teleport to="body">
        <Transition name="modal-fade">
          
          <div v-if="selectedCard" class="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8">
            
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>

            <div class="absolute top-4 right-4 z-50">
              <button @click="closeModal" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                  <i class="fa-solid fa-times text-xl"></i>
              </button>
            </div>

            <div class="scene w-full max-w-md aspect-[1.58/1]">
              
              <div 
                class="card-object w-full h-full relative cursor-pointer"
                :class="{ 'is-flipped': isModalCardFlipped }"
                @click="toggleModalCardFlip"
              >
                
                <div class="card-face card-front bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-bl-full z-0"></div>
                    <div class="relative z-10">
                      <p class="text-xs font-bold text-yellow-600 uppercase mb-2">{{ selectedCard.role }}</p>
                      <h2 class="text-3xl font-black text-gray-900 leading-tight">{{ selectedCard.name }}</h2>
                      <div class="mt-4 flex flex-wrap gap-2">
                          <span v-for="tag in selectedCard.tags" :key="tag" class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{{ tag }}</span>
                      </div>
                    </div>
                    <div class="flex justify-between items-end relative z-10">
                        <img :src="selectedCard.avatar" class="w-16 h-16 rounded-full border-4 border-white shadow-sm bg-gray-50">
                        <span class="text-xs text-gray-400 animate-pulse">Click to flip <i class="fa-solid fa-rotate ml-1"></i></span>
                    </div>
                </div>

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
          </div>
        </Transition>
      </Teleport>
    </main>

    </div>
  </div>
</template>

<style scoped>
/* Vue Transition 애니메이션 정의 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 모달 컨텐츠(팝업창)가 쓱 올라오면서 커지는 효과를 위해 자식 선택자 사용 */
.modal-fade-enter-from .transform, 
.modal-fade-leave-to .transform {
  transform: scale(0.95) translateY(10px);
}

/* Tailwind 기본 유틸리티에 없는 3D 속성들을 위한 임의 클래스 정의 
  (만약 Tailwind 플러그인을 사용 중이라면 플러그인 클래스로 대체 가능)
*/
/* Transition 애니메이션 (기존 유지) */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: all 0.3s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .transform, 
.modal-fade-leave-to .transform { transform: scale(0.95) translateY(20px); }

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

/* 폰트 어썸 아이콘 정렬 문제 해결용 */
.fa-solid { display: inline-flex; justify-content: center; align-items: center; }

body {
  font-family: 'Noto Sans KR', sans-serif;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* 스크롤바 커스텀 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d4d4d8;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #52525b;
}
::-webkit-scrollbar-thumb:hover {
  background: #a1a1aa;
}

/* 카드 겹침 효과 */
.card-stack:hover .card-item {
  margin-left: -20px;
  transform: rotate(0deg) translateY(-10px);
}

.card-item {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
}

.card-item:hover {
  z-index: 50 !important;
  transform: scale(1.05) translateY(-15px) !important;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #facc15 !important;
}

/* 배경 패턴 (다크모드 대응) */
.bg-pattern {
  background-color: #f8fafc;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
}
.dark .bg-pattern {
  background-color: #18181b;
  background-image: radial-gradient(#3f3f46 1px, transparent 1px);
}
</style>
