<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 데이터 리스트 (기존 유지)
const categories = [
  { value: "Backend", label: "Backend" }, { value: "Frontend", label: "Frontend" },
  { value: "Fullstack", label: "Fullstack" }, { value: "DevOps", label: "DevOps" },
  { value: "Database", label: "Database" }, { value: "AI", label: "AI" },
];
const employmentTypes = [
  { value: "FULL_TIME", label: "정규직" }, { value: "CONTRACT", label: "계약직" },
  { value: "INTERN", label: "인턴" }, { value: "PART_TIME", label: "파트타임" },
];
const experiences = [
  { value: "NEW", label: "신입" }, { value: "JUNIOR", label: "주니어(1~3)" },
  { value: "MID", label: "미들(4~7)" }, { value: "SENIOR", label: "시니어(8+)" },
  { value: "ANY", label: "무관" },
];
const locations = ["Seoul", "Gyeonggi", "Incheon", "Busan", "Daejeon", "Daegu", "Remote"];

const form = ref({
  title: "", category: "Backend", employmentType: "FULL_TIME",
  experience: "NEW", location: "Seoul", salaryMin: "", salaryMax: "",
  deadline: "", headcount: "1", workStart: "", skills: "",
  intro: "", description: "", requirements: "", preferred: "",
  process: "", contactEmail: "", contactPhone: "",
  isRemotePossible: false, isPublic: true,
});

const skillList = computed(() =>
  form.value.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10)
);

const errors = computed(() => {
  const e = {};
  const f = form.value;
  if (f.title.trim().length < 2) e.title = "제목을 입력해주세요";
  if (!f.deadline) e.deadline = "마감일을 선택하세요";
  if (!f.contactEmail.trim()) e.contactEmail = "이메일은 필수입니다";
  return e;
});

const canSubmit = computed(() => Object.keys(errors.value).length === 0);
const goBack = () => router.push("/company");
const submit = () => {
  if (!canSubmit.value) return;
  alert("공고 등록이 완료되었습니다!");
  router.push("/company");
};
</script>

<template>
  <div class="bg-[#fcfcfd] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen font-sans">
    <main class="max-w-7xl mx-auto px-6 py-10">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">공고 등록</h1>
        </div>
        <div class="flex items-center gap-3">
          <button @click="goBack" class="px-5 py-2.5 rounded-2xl font-semibold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 transition">
            취소
          </button>
          <button @click="submit" :disabled="!canSubmit" class="px-8 py-2.5 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
            등록하기
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div class="lg:col-span-8 space-y-8">
          
          <section class="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div class="flex items-center gap-2 mb-8">
              <span class="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-sm">01</span>
              <h2 class="text-xl font-bold">핵심 정보</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">공고 제목</label>
                <input v-model="form.title" type="text" placeholder="예) 시니어 자바스크립트 개발자 채용"
                  class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20 outline-none transition-all" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">직무 카테고리</label>
                <select v-model="form.category" class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none">
                  <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">고용 형태</label>
                <select v-model="form.employmentType" class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none">
                  <option v-for="t in employmentTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">경력 조건</label>
                <select v-model="form.experience" class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none">
                  <option v-for="x in experiences" :key="x.value" :value="x.value">{{ x.label }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">모집 인원</label>
                <div class="relative">
                  <input v-model="form.headcount" type="number" class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400">명</span>
                </div>
              </div>
            </div>
          </section>

          <section class="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div class="flex items-center gap-2 mb-8">
              <span class="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-sm">02</span>
              <h2 class="text-xl font-bold">업무 상세 및 기술</h2>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">기술 스택 <span class="text-[10px] text-zinc-400 font-normal">쉼표(,)로 구분</span></label>
                <input v-model="form.skills" type="text" placeholder="Java, Spring Boot, MySQL"
                  class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none" />
                <div class="mt-3 flex flex-wrap gap-2">
                  <span v-for="s in skillList" :key="s" class="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border border-indigo-100 dark:border-indigo-800"># {{ s }}</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">상세 업무 설명</label>
                <textarea v-model="form.description" rows="6" class="w-full px-5 py-4 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none resize-none" placeholder="지원자들이 맡게 될 업무를 자세히 적어주세요."></textarea>
              </div>
            </div>
          </section>

          <section class="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div class="flex items-center gap-2 mb-8">
              <span class="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 text-sm">03</span>
              <h2 class="text-xl font-bold">지원 및 연락처</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">마감일</label>
                <input v-model="form.deadline" type="date" class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2 ml-1">담당자 이메일</label>
                <input v-model="form.contactEmail" type="email" placeholder="hr@company.com" class="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none" />
              </div>
            </div>

            <div class="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <div class="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                <div class="flex items-center gap-3">
                  <input id="public" type="checkbox" v-model="form.isPublic" class="w-5 h-5 rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                  <label for="public" class="text-sm font-bold">작성 완료 후 바로 공개</label>
                </div>
                <span class="text-xs text-zinc-400">체크 해제 시 임시저장 상태로 보관됩니다.</span>
              </div>
            </div>
          </section>
        </div>

        <aside class="lg:col-span-4">
          <div class="sticky top-10">
            <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-sm font-bold uppercase tracking-widest text-zinc-400">Live Preview</h2>
              <span v-if="canSubmit" class="text-[10px] font-bold text-green-500 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Validated
              </span>
            </div>

            <div class="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
              <div class="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-end">
                <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                  {{ form.category }}
                </div>
              </div>
              
              <div class="p-8">
                <h3 class="text-xl font-bold leading-tight mb-4 break-words">
                  {{ form.title || '공고 제목을 입력해주세요' }}
                </h3>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  <span class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold">
                    {{ employmentTypes.find(x => x.value === form.employmentType)?.label }}
                  </span>
                  <span class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold">
                    {{ experiences.find(x => x.value === form.experience)?.label }}
                  </span>
                  <span class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold">
                    {{ form.location }}
                  </span>
                </div>

                <div class="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-zinc-400 font-medium">모집 인원</span>
                    <span class="text-sm font-bold">{{ form.headcount }}명</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-zinc-400 font-medium">마감일</span>
                    <span class="text-sm font-bold text-indigo-600">{{ form.deadline || '-' }}</span>
                  </div>
                </div>

                <div class="mt-8 flex flex-wrap gap-1.5">
                  <span v-for="s in (skillList.length ? skillList : ['Skill'])" :key="s" 
                    class="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">#{{ s }}</span>
                </div>
              </div>

              <div class="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full border-2 border-white bg-zinc-200"></div>
                  <div class="w-8 h-8 rounded-full border-2 border-white bg-zinc-300"></div>
                </div>
                <span class="text-[10px] text-zinc-400 font-medium">공고 등록 시 실시간 노출</span>
              </div>
            </div>

            <div class="mt-6 p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
              <p class="text-xs text-amber-800/70 dark:text-amber-400/60 leading-relaxed italic">
                💡 공고 제목에 **주요 기술 스택**이나 **핵심 혜택**을 포함하면 지원율이 최대 30% 상승합니다!
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 더 부드러운 전환 효과 */
input, select, textarea, button {
  transition: all 0.2s ease-in-out;
}
.rounded-\[2\.5rem\] { border-radius: 2.5rem; }
</style>