<script setup>
import { computed } from "vue";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();
const userInfo = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("USERINFO") || "null");
  } catch {
    return null;
  }
});

function logout() {
  // 로컬 유저정보 삭제
  localStorage.removeItem("USERINFO");

  // 쿠키 ATOKEN 만료 시도(Non-HttpOnly일 때만 제거됨)
  document.cookie = "ATOKEN=; Max-Age=0; path=/";

  router.push("/login");
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/70 backdrop-blur border-b border-zinc-100 dark:border-zinc-900">
    <div class="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
      <!-- Left -->
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-extrabold text-amber-400">Poticard</span>
          <span class="text-xs font-extrabold px-2 py-1 rounded-full border border-amber-200 dark:border-amber-500/30
                       bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">
            기업
          </span>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-300">
          <RouterLink to="/company" class="px-3 py-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900">기업 홈</RouterLink>
          <RouterLink to="/company/joblist" class="px-3 py-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900">공고</RouterLink>
          <RouterLink to="/namecard-search" class="px-3 py-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900">인재검색</RouterLink>
          <RouterLink to="/company/applicants" class="px-3 py-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900">지원자</RouterLink>
        </nav>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <RouterLink
          to="/company/jobcreate"
          class="hidden sm:inline-flex px-4 py-2.5 rounded-2xl font-extrabold bg-amber-400 text-zinc-900 hover:bg-amber-300"
        >
          공고 등록
        </RouterLink>

        <div class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <div class="leading-tight">
            <div class="text-xs text-zinc-500 dark:text-zinc-400">기업계정</div>
            <div class="text-sm font-extrabold">
              {{ userInfo?.userName ?? "Demo" }}
            </div>
          </div>
        </div>

        <button
          @click="logout"
          class="px-3 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold text-sm"
        >
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>
