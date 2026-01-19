<script setup>
import { ref, computed } from "vue";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();

// 공고 상태 필터
const currentFilter = ref("ALL"); // ALL, RECRUITING, CLOSED

// 공고 목록 데이터 (샘플)
const jobs = ref([
  {
    id: 1,
    title: "[플랫폼본부] 프렌차이즈시너지그룹 AI 에이전트 엔지니어 (AI 어시스턴트)",
    category: "AI",
    employmentType: "정규직",
    applicants: 42,
    newApplicants: 8,
    deadline: "2026-03-31",
    status: "RECRUITING",
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    title: "[메이플스토리 PC] 2D 애니메이션 아티스트",
    category: "Adobe",
    employmentType: "계약직",
    applicants: 15,
    newApplicants: 3,
    deadline: "2026-02-15",
    status: "RECRUITING",
    createdAt: "2026-01-12",
  },
  {
    id: 3,
    title: "[기술본부] DATABASE 엔지니어",
    category: "Database",
    employmentType: "정규직",
    applicants: 28,
    newApplicants: 1,
    deadline: "2026-01-20",
    status: "RECRUITING",
    createdAt: "2026-01-05",
  },
  {
    id: 4,
    title: "백엔드 개발자 인턴십 (Spring Boot)",
    category: "Backend",
    employmentType: "인턴",
    applicants: 156,
    newApplicants: 0,
    deadline: "2025-12-31",
    status: "CLOSED",
    createdAt: "2025-12-01",
  },
]);

// 통계 데이터
const stats = computed(() => {
  return {
    total: jobs.value.length,
    active: jobs.value.filter(j => j.status === 'RECRUITING').length,
    totalApplicants: jobs.value.reduce((acc, cur) => acc + cur.applicants, 0)
  };
});

// 필터링된 목록
const filteredJobs = computed(() => {
  if (currentFilter.value === "ALL") return jobs.value;
  return jobs.value.filter(j => j.status === currentFilter.value);
});

const getStatusLabel = (status) => status === "RECRUITING" ? "채용 중" : "마감됨";
</script>

<template>
  <div class="bg-[#fcfcfd] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen font-sans">
    <main class="max-w-7xl mx-auto px-6 py-10">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">공고 관리 현황</h1>
        </div>
        <RouterLink 
          to="/company/jobcreate" 
          class="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all gap-2"
        >
          <span>➕ 새 공고 등록하기</span>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p class="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-2">전체 공고</p>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-zinc-900 dark:text-white">{{ stats.total }}</span>
            <span class="text-zinc-400 font-medium">건</span>
          </div>
        </div>
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p class="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-2">채용 중</p>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-indigo-600">{{ stats.active }}</span>
            <span class="text-zinc-400 font-medium">건</span>
          </div>
        </div>
        <div class="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p class="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-2">누적 지원자</p>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-black text-zinc-900 dark:text-white">{{ stats.totalApplicants }}</span>
            <span class="text-zinc-400 font-medium">명</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div class="px-8 pt-8 flex items-center gap-6 border-b border-zinc-50 dark:border-zinc-800">
          <button 
            @click="currentFilter = 'ALL'"
            :class="currentFilter === 'ALL' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-4 font-bold' : 'text-zinc-400 pb-4 font-medium hover:text-zinc-600 transition-colors'"
          >
            전체 보기
          </button>
          <button 
            @click="currentFilter = 'RECRUITING'"
            :class="currentFilter === 'RECRUITING' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-4 font-bold' : 'text-zinc-400 pb-4 font-medium hover:text-zinc-600 transition-colors'"
          >
            채용 중
          </button>
          <button 
            @click="currentFilter = 'CLOSED'"
            :class="currentFilter === 'CLOSED' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-4 font-bold' : 'text-zinc-400 pb-4 font-medium hover:text-zinc-600 transition-colors'"
          >
            마감됨
          </button>
        </div>

        <div class="divide-y divide-zinc-50 dark:divide-zinc-800">
          <div v-for="job in filteredJobs" :key="job.id" class="p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-950 transition-colors group">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <span 
                    :class="[
                      'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
                      job.status === 'RECRUITING' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    ]"
                  >
                    {{ getStatusLabel(job.status) }}
                  </span>
                  <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">{{ job.category }}</span>
                  <span v-if="job.newApplicants > 0" class="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-900/20 text-rose-600 text-[10px] font-bold animate-bounce">
                    NEW {{ job.newApplicants }}
                  </span>
                </div>
                <h3 class="text-xl font-bold group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                  {{ job.title }}
                </h3>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                  <span class="flex items-center gap-1.5">📅 등록일: {{ job.createdAt }}</span>
                  <span class="flex items-center gap-1.5">⏳ 마감일: <span :class="job.status === 'RECRUITING' ? 'text-indigo-600 font-semibold' : ''">{{ job.deadline }}</span></span>
                  <span class="flex items-center gap-1.5">👤 고용형태: {{ job.employmentType }}</span>
                </div>
              </div>

              <div class="flex items-center gap-8 lg:border-l lg:dark:border-zinc-800 lg:pl-10">
                <div class="text-center">
                  <p class="text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Applicants</p>
                  <p class="text-2xl font-black text-zinc-900 dark:text-white">{{ job.applicants }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button class="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <RouterLink
                  :to="`/company/applicantlist`" 
                  class="inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition shadow-md">
                  지원자 보기
                </RouterLink>
                </div>
              </div>

            </div>
          </div>

          <div v-if="filteredJobs.length === 0" class="py-20 text-center">
            <div class="text-4xl mb-4 text-zinc-300">🔍</div>
            <p class="text-zinc-500 font-medium">해당 조건에 맞는 공고가 없습니다.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 일관된 부드러운 전환 효과 */
button, a, div {
  transition: all 0.2s ease-in-out;
}
.rounded-\[2\.5rem\] { border-radius: 2.5rem; }
.rounded-\[2rem\] { border-radius: 2rem; }
</style>