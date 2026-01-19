<script setup>
import { computed, ref } from "vue";

/** =========================
 *  DEMO DATA
 *  ========================= */
const companies = ref([
  {
    id: 1,
    name: "DevOops Labs",
    role: "Backend Engineer",
    category: "Backend",
    location: "Seoul",
    exp: "신입/주니어",
    skills: ["Spring", "JPA", "MySQL", "Redis"],
    badges: ["추천", "빠른채용"],
    likes: 112,
    views: 1840,
    updatedAt: "2026-01-12",
  },
  {
    id: 2,
    name: "Poticard",
    role: "Fullstack Engineer",
    category: "Fullstack",
    location: "Remote",
    exp: "주니어",
    skills: ["Vue", "Spring", "MySQL", "Nginx"],
    badges: ["인기"],
    likes: 98,
    views: 1522,
    updatedAt: "2026-01-10",
  },
  {
    id: 3,
    name: "Ssam Platform",
    role: "Frontend Engineer",
    category: "Frontend",
    location: "Seoul",
    exp: "신입",
    skills: ["Vue", "Tailwind", "TypeScript"],
    badges: ["신규"],
    likes: 44,
    views: 630,
    updatedAt: "2026-01-14",
  },
  {
    id: 4,
    name: "CloudNine",
    role: "DevOps Engineer",
    category: "DevOps",
    location: "Seoul",
    exp: "주니어/미들",
    skills: ["AWS", "Docker", "Nginx", "Linux"],
    badges: ["추천"],
    likes: 77,
    views: 990,
    updatedAt: "2026-01-09",
  },
  {
    id: 5,
    name: "DataWave",
    role: "Backend Engineer",
    category: "Backend",
    location: "Gyeonggi",
    exp: "신입",
    skills: ["Java", "Spring", "MySQL"],
    badges: [],
    likes: 21,
    views: 320,
    updatedAt: "2026-01-07",
  },
  {
    id: 6,
    name: "BlueOrbit",
    role: "Fullstack Engineer",
    category: "Fullstack",
    location: "Seoul",
    exp: "주니어",
    skills: ["React", "Node", "MySQL"],
    badges: ["인기"],
    likes: 65,
    views: 780,
    updatedAt: "2026-01-05",
  },
]);

/** =========================
 *  UI STATE
 *  ========================= */
const q = ref("");
const sort = ref("popular"); // popular | newest | views
const category = ref("ALL"); // ALL | Backend | Frontend | Fullstack | DevOps
const selectedSkills = ref([]); // ["Spring", ...]
const page = ref(1);
const pageSize = 6;

/** 기술칩 후보(데모에서는 companies에서 유니크로 뽑음) */
const skillOptions = computed(() => {
  const set = new Set();
  companies.value.forEach((c) => c.skills.forEach((s) => set.add(s)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

const categoryOptions = [
  { value: "ALL", label: "전체" },
  { value: "Backend", label: "Backend" },
  { value: "Frontend", label: "Frontend" },
  { value: "Fullstack", label: "Fullstack" },
  { value: "DevOps", label: "DevOps" },
];

function toggleSkill(skill) {
  const idx = selectedSkills.value.indexOf(skill);
  if (idx >= 0) selectedSkills.value.splice(idx, 1);
  else selectedSkills.value.push(skill);
  page.value = 1;
}

function resetFilters() {
  q.value = "";
  sort.value = "popular";
  category.value = "ALL";
  selectedSkills.value = [];
  page.value = 1;
}

/** =========================
 *  FILTER + SORT + PAGING
 *  ========================= */
const filteredCompanies = computed(() => {
  const keyword = q.value.trim().toLowerCase();

  let list = companies.value.filter((c) => {
    const matchKeyword =
      !keyword ||
      c.name.toLowerCase().includes(keyword) ||
      c.role.toLowerCase().includes(keyword) ||
      c.skills.some((s) => s.toLowerCase().includes(keyword)) ||
      c.location.toLowerCase().includes(keyword);

    const matchCategory = category.value === "ALL" || c.category === category.value;

    const matchSkills =
      selectedSkills.value.length === 0 ||
      selectedSkills.value.every((s) => c.skills.includes(s));

    return matchKeyword && matchCategory && matchSkills;
  });

  // sort
  list = [...list].sort((a, b) => {
    if (sort.value === "popular") return b.likes - a.likes;
    if (sort.value === "views") return b.views - a.views;
    // newest
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCompanies.value.length / pageSize)));

const pagedCompanies = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredCompanies.value.slice(start, start + pageSize);
});

function goPrev() {
  page.value = Math.max(1, page.value - 1);
}
function goNext() {
  page.value = Math.min(totalPages.value, page.value + 1);
}
</script>

<template>
  <div class="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
    <main class="max-w-7xl mx-auto px-5 pt-10 pb-16">
      <!-- Header -->
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">채용 공고</h1>
        </div>

        <button
          @click="resetFilters"
          class="self-start md:self-auto px-4 py-2.5 rounded-2xl font-bold
                 border border-zinc-200 dark:border-zinc-800
                 hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          초기화
        </button>
      </div>
      <!-- Filters -->
      <section class="mt-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-col md:flex-row gap-3 md:items-center w-full">
            <!-- Search -->
            <div class="relative w-full md:max-w-md">
              <input
                v-model="q"
                type="text"
                placeholder="회사/직무/스킬/지역 검색"
                class="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950
                       border border-zinc-200 dark:border-zinc-800 outline-none
                       focus:ring-2 ring-amber-300"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                ⌘K
              </div>
            </div>

            <!-- Category -->
            <select
              v-model="category"
              class="w-full md:w-44 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950
                     border border-zinc-200 dark:border-zinc-800"
            >
              <option v-for="c in categoryOptions" :key="c.value" :value="c.value">
                {{ c.label }}
              </option>
            </select>

            <!-- Sort -->
            <select
              v-model="sort"
              class="w-full md:w-44 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950
                     border border-zinc-200 dark:border-zinc-800"
            >
              <option value="popular">인기순</option>
              <option value="newest">최신순</option>
              <option value="views">조회순</option>
            </select>
          </div>

          <div class="text-sm text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
            결과 <span class="font-extrabold text-zinc-900 dark:text-zinc-100">{{ filteredCompanies.length }}</span>개
          </div>
        </div>

        <!-- Skill chips -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="s in skillOptions"
            :key="s"
            @click="toggleSkill(s)"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-extrabold border transition',
              selectedSkills.includes(s)
                ? 'bg-amber-400 text-zinc-900 border-amber-300'
                : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            ]"
          >
            {{ s }}
          </button>
        </div>

        <div v-if="selectedSkills.length" class="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          선택된 스킬:
          <span class="font-bold text-zinc-700 dark:text-zinc-200">
            {{ selectedSkills.join(", ") }}
          </span>
        </div>
      </section>

      <!-- List -->
      <section class="mt-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div
          v-for="c in pagedCompanies"
          :key="c.id"
          class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5
                 hover:shadow-sm transition"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
                {{ c.category }} · {{ c.location }}
              </div>
              <div class="mt-1 text-lg font-extrabold">{{ c.name }}</div>
              <div class="mt-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">
                {{ c.role }}
              </div>
              <div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{{ c.exp }}</div>
            </div>

            <div class="text-right text-xs text-zinc-500 dark:text-zinc-400">
              <div>❤ {{ c.likes }}</div>
              <div class="mt-1">👁 {{ c.views }}</div>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="b in c.badges"
              :key="b"
              class="px-2.5 py-1 rounded-full text-xs font-extrabold
                     border border-amber-200 dark:border-amber-500/30
                     bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
            >
              {{ b }}
            </span>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="s in c.skills"
              :key="s"
              class="px-2.5 py-1 rounded-full text-xs font-bold
                     border border-zinc-200 dark:border-zinc-800"
            >
              {{ s }}
            </span>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-xs text-zinc-500 dark:text-zinc-400">
              업데이트: {{ c.updatedAt }}
            </div>

            <button
              class="px-3 py-2 rounded-2xl font-extrabold
                     bg-amber-400 text-zinc-900 hover:bg-amber-300"
              @click="() => alert(`(데모) ${c.name} 상세/지원 페이지로 연결하면 됨`) "
            >
              보기
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-if="pagedCompanies.length === 0"
          class="col-span-full rounded-3xl border border-zinc-200 dark:border-zinc-800
                 bg-white dark:bg-zinc-900 p-10 text-center"
        >
          <div class="text-lg font-extrabold">검색 결과가 없어요.</div>
          <div class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            검색어/카테고리/스킬 선택을 바꿔보세요.
          </div>
          <button
            class="mt-5 px-4 py-2.5 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950"
            @click="resetFilters"
          >
            필터 초기화
          </button>
        </div>
      </section>

      <!-- Pagination -->
      <div class="mt-10 flex items-center justify-center gap-3">
        <button
          @click="goPrev"
          :disabled="page <= 1"
          class="px-4 py-2.5 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-800
                 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40"
        >
          이전
        </button>

        <div class="text-sm font-extrabold">
          {{ page }} / {{ totalPages }}
        </div>

        <button
          @click="goNext"
          :disabled="page >= totalPages"
          class="px-4 py-2.5 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-800
                 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </main>
  </div>
</template>
