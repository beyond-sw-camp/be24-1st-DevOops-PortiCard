<template>
  <div class="min-h-screen bg-[#f8fafc] p-10 font-sans text-[#333] overflow-x-hidden">
    <div class="max-w-[1280px] mx-auto">
      
      <div class="grid grid-cols-12 gap-8 items-start">
        
        <div class="col-span-4 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 p-10 flex flex-col relative overflow-hidden h-[750px]">
          
          <div class="absolute top-10 right-10 z-30">
            <h3 class="text-xl font-black text-gray-900">오늘의 명함</h3>
          </div>

          <div class="flex-1 relative flex items-center justify-center" @wheel.prevent="handleScroll">
            <div class="stack-wrapper">
              <div 
                v-for="(card, idx) in userCards" 
                :key="card.id"
                class="mini-card-container transition-all duration-700 ease-out"
                :style="getMiniCardStyle(idx)"
              >
                <div class="w-full h-full bg-white rounded-2xl border border-slate-100 shadow-xl p-5 flex flex-col justify-between relative overflow-hidden"
                     :class="{'ring-2 ring-yellow-400': idx === selectedIdx}">
                  <div class="absolute top-0 right-0 w-12 h-12 bg-yellow-400/10 rounded-bl-full"></div>
                  <div class="relative z-10">
                    <p class="text-[8px] font-bold text-yellow-600 uppercase">{{ card.role }}</p>
                    <h4 class="text-sm font-black text-gray-900">{{ card.name }}</h4>
                    <p class="mt-1 text-[10px] text-gray-400 font-semibold truncate">
                      {{ card.tags.join('  ') }}
                    </p>
                  </div>
                  <div class="flex justify-between items-end">
                    <div class="w-8 h-8 rounded-full border border-slate-100 overflow-hidden shadow-sm">
                      <img :src="card.avatar" class="w-full h-full object-cover">
                    </div>
                    <i class="fa-solid fa-qrcode text-xs text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

        <div class="col-span-8 grid grid-cols-8 gap-8">
          
          <div class="col-span-5 bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col items-center justify-center relative h-[480px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div class="absolute top-8">
              <span class="text-[10px] font-black bg-slate-50 border border-slate-100 shadow-sm text-gray-400 px-5 py-2 rounded-full uppercase tracking-[0.3em]">Business Card View</span>
            </div>

            <transition name="card-switch" mode="out-in">
              <div :key="selectedIdx" class="relative w-full max-w-md aspect-[1.58/1] cursor-pointer perspective-1000" @click="isFlipped = !isFlipped">
                <div :class="['relative w-full h-full transform-style-3d shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl duration-700', isFlipped ? 'flipped' : '']">
                  <div class="absolute inset-0 w-full h-full bg-white rounded-2xl border border-slate-100 p-8 backface-hidden overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-bl-full"></div>
                    <div class="flex flex-col justify-between h-full relative z-10">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">{{ userCards[selectedIdx].role }}</p>
                          <h2 class="text-3xl font-black text-gray-900 tracking-tight mb-2">{{ userCards[selectedIdx].name }}</h2>
                          <p class="text-sm text-gray-500 leading-relaxed">사용자 경험을 디자인하는<br>디자이너 {{ userCards[selectedIdx].name }}입니다.</p>
                        </div>
                        <div class="w-20 h-20 rounded-full border-4 border-slate-50 shadow-md overflow-hidden bg-gray-100">
                          <img :src="userCards[selectedIdx].avatar" class="w-full h-full object-cover">
                        </div>
                      </div>
                      <div class="space-y-4">
                        <div class="flex gap-2">
                          <span v-for="tag in userCards[selectedIdx].tags" :key="tag" class="px-2.5 py-1 bg-slate-50 border border-slate-100 text-gray-600 text-[10px] font-bold rounded-md">{{ tag }}</span>
                        </div>
                        <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
                          <div class="flex gap-3 text-gray-400">
                            <i class="fa-brands fa-github text-xl"></i>
                            <i class="fa-solid fa-envelope text-xl"></i>
                          </div>
                          <i class="fa-solid fa-qrcode text-3xl text-gray-800 opacity-80"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="absolute inset-0 w-full h-full bg-zinc-900 rounded-2xl p-8 backface-hidden rotate-y-180 text-white">
                    <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
                      <span class="w-1.5 h-6 bg-yellow-400 rounded-full"></span> Contact Info
                    </h3>
                    <div class="space-y-4 text-sm opacity-90">
                      <div class="flex items-center gap-3"><i class="fa-solid fa-phone w-5 text-yellow-400"></i> 010-1234-567{{selectedIdx}}</div>
                      <div class="flex items-center gap-3"><i class="fa-solid fa-link w-5 text-yellow-400"></i> kimpoti.design</div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <div class="col-span-3 bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col justify-between text-white shadow-xl relative overflow-hidden h-[480px]">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <div>
              <span class="text-[10px] font-black border border-white/20 px-4 py-1.5 rounded-full uppercase tracking-widest text-white/50">Ad</span>
              <h4 class="text-2xl font-black mt-6 leading-tight">나를 위한<br><span class="text-yellow-400">완벽한</span> 명함</h4>
              <p class="text-gray-300 mt-4 text-xs leading-relaxed">상위 1% 기업의 제안을<br>지금 바로 확인해보세요.</p>
            </div>
            <button class="w-full py-4 bg-yellow-400 text-zinc-900 rounded-xl font-black text-sm hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">시작하기</button>
          </div>

          <div class="col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[240px] flex flex-col">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-black flex items-center gap-2 text-slate-800">📢 공지사항</h3>
              <button class="text-xs text-slate-400 font-bold hover:text-yellow-600 transition-colors">전체보기 +</button>
            </div>
            <div class="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-50">
              <div v-for="i in 3" :key="i" class="p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition cursor-pointer">
                <div class="flex items-center gap-4">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm"></span>
                  <span class="text-sm font-semibold text-slate-700">기업 계정 권한(멤버 초대) 기능 업데이트 안내</span>
                </div>
                <span class="text-xs text-slate-400 font-mono font-medium">2026.01.17</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="mt-16 space-y-6">
  <h3 class="text-2xl font-black px-2 text-slate-800">회원님을 위한 추천 공고</h3>
  <div class="grid grid-cols-4 gap-6">
    <div v-for="job in [
      {title: 'UI/UX 디자이너 채용', company: '잡코리아 테크랩스'},
      {title: '브랜드 디자이너', company: '포티카드 스튜디오'},
      {title: '프로덕트 디자이너', company: '토스팀'},
      {title: '콘텐츠 디자이너', company: '라인 플러스'}
    ]" :key="job.title" 
    class="bg-white p-7 rounded-[2rem] border border-slate-200 hover:border-yellow-400 hover:shadow-xl transition-all cursor-pointer shadow-sm group">
      
      <div class="flex justify-between mb-4">
        <span class="text-[10px] font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md border border-yellow-100">HOT</span>
        <i class="fa-regular fa-bookmark text-slate-300 group-hover:text-yellow-400"></i>
      </div>
      
      <h4 class="font-bold text-slate-800 line-clamp-1 group-hover:text-yellow-600">{{ job.title }}</h4>
      <p class="text-xs text-slate-400 mt-1 font-medium">{{ job.company }}</p>
      
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userCards = ref([
  { id: 1, name: "Kim Poti", role: "UX/UI Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", tags: ["#Figma", "#Prototyping", "#Problem_Solver"] },
  { id: 2, name: "Park Job", role: "Frontend Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", tags: ["#VueJS", "#Tailwind", "#Creative"] },
  { id: 3, name: "Lee Card", role: "Product Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Boo", tags: ["#Strategy", "#Planning", "#Leader"] },
  { id: 4, name: "Choi Dev", role: "Backend Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb", tags: ["#NodeJS", "#Architecture", "#Cloud"] },
  { id: 5, name: "Jung UI", role: "Visual Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy", tags: ["#Branding", "#Motion", "#Typography"] },
]);

const initialCenter = Math.floor(userCards.value.length / 2);
const selectedIdx = ref(initialCenter);
const scrollOffset = ref(initialCenter);
const isFlipped = ref(false);

const handleScroll = (e) => {
  const delta = e.deltaY > 0 ? 1 : -1;
  const nextIdx = Math.max(0, Math.min(scrollOffset.value + delta, userCards.value.length - 1));
  if (scrollOffset.value !== nextIdx) {
    scrollOffset.value = nextIdx;
    selectedIdx.value = nextIdx;
    isFlipped.value = false;
  }
};

const getMiniCardStyle = (idx) => {
  const diff = idx - scrollOffset.value;
  const absDiff = Math.abs(diff);
  const isSelected = idx === selectedIdx.value;

  const translateY = diff * 110; 
  const translateX = diff * 45; 
  const rotateZ = diff * 15; 
  const translateZ = -absDiff * 60;
  const rotateX = diff * -12; 

  const opacity = isSelected ? 1 : Math.max(0.3, 1 - absDiff * 0.25);

  return {
    transform: `
      translateY(${translateY}px) 
      translateX(${translateX}px) 
      translateZ(${translateZ}px) 
      rotateZ(${rotateZ}deg)
      rotateX(${rotateX}deg) 
      scale(${isSelected ? 1.1 : 0.95})
    `,
    zIndex: 100 - absDiff,
    opacity: opacity,
    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    filter: isSelected ? 'none' : `blur(${absDiff * 0.3}px)`,
    pointerEvents: isSelected ? 'auto' : 'none'
  };
};
</script>

<style scoped>
.perspective-1000 { perspective: 1200px; }
.transform-style-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
.flipped { transform: rotateY(180deg); }

.stack-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-card-container {
  position: absolute;
  width: 280px; 
  height: 175px; 
  transform-origin: center center;
  backface-visibility: hidden;
}

.card-switch-enter-active, .card-switch-leave-active {
  transition: all 0.4s ease-out;
}
.card-switch-enter-from { opacity: 0; transform: translateY(15px); }
.card-switch-leave-to { opacity: 0; transform: translateY(-15px); }
</style>