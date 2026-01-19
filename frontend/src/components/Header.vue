<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initHeader } from '@/assets/js/Header.js'
import useAuthStore from '@/stores/useAuthStore'
import '@/assets/css/Header.css'

const authStore = useAuthStore()
const router = useRouter()

// 상태 관리
const showAuthModal = ref(false)
const showNotiPopup = ref(false)

// 모달 제어
const openAuthModal = () => {
  showAuthModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeAuthModal = () => {
  showAuthModal.value = false
  document.body.style.overflow = 'auto'
}

const selectAuthType = (type) => {
  closeAuthModal()
  router.push(`/login?type=${type}`)
}

// 로그아웃
const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    authStore.logout() // store에 logout 메서드가 있다고 가정
    router.push('/')
  }
}

onMounted(() => {
  initHeader()
})
</script>

<template>
  <header
  class="sticky top-0 z-[1000] w-full border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm"
>
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
      
      <div class="flex items-center gap-10">
        <router-link to="/" class="group flex items-center gap-2">
          <div class="w-10 h-10 bg-point-yellow rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-yellow-500/40 border border-yellow-600/10">
            <span class="text-zinc-800 text-xl font-black">P</span>
          </div>
          <h1 class="text-2xl font-black tracking-tighter text-point-yellow">
            Poticard
          </h1>
        </router-link>
        
        <nav class="hidden lg:flex items-center gap-1">
          <div class="relative group/nav py-2 px-4">
            <button class="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover/nav:text-point-yellow transition-colors">명함</button>
            <div class="absolute top-full left-0 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 translate-y-2 group-hover/nav:translate-y-0">
              <div class="w-48 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl p-2">
                <router-link to="/namecard-search" class="block px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition">명함 검색</router-link>
                <router-link to="/namecard-modify" class="block px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition">명함 관리</router-link>
              </div>
            </div>
          </div>

          <div class="relative group/nav py-2 px-4">
            <button class="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover/nav:text-point-yellow transition-colors">포트폴리오</button>
            <div class="absolute top-full left-0 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 translate-y-2 group-hover/nav:translate-y-0">
              <div class="w-48 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl p-2">
                <router-link to="/portfolio-project" class="block px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition">포트폴리오 작성</router-link>
                <router-link to="/portfolio-view" class="block px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition">포트폴리오 목록</router-link>
              </div>
            </div>
          </div>

          <router-link to="/matching" class="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-point-yellow transition-colors">채용</router-link>
          
          <router-link to="/community" class="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-point-yellow transition-colors">커뮤니티</router-link>
        </nav>
      </div>

      <div class="hidden md:flex flex-1 max-w-md group">
        <div class="relative w-full">
          <input
            type="text"
            placeholder="기술 스택, 이름, 회사 검색..."
            class="w-full h-11 pl-12 pr-4 bg-gray-100 dark:bg-zinc-800/50 border-transparent focus:border-point-yellow/50 focus:bg-white dark:focus:bg-zinc-900 border-2 rounded-2xl text-sm transition-all outline-none"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg group-focus-within:scale-110 transition-transform">🔍</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="!authStore.isLogin" class="flex items-center">
          <button
            @click="openAuthModal"
            class="h-11 px-6 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-900/10 dark:shadow-white/5"
          >
            시작하기
          </button>
        </div>

        <div v-else class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col items-end mr-2">
            <span class="text-xs font-bold text-gray-400">Welcome!</span>
            <span class="text-sm font-black text-gray-900 dark:text-white">{{ authStore.userInfo?.userName }}님</span>
          </div>
          <button @click="handleLogout" class="p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-red-500 transition-colors" title="로그아웃">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <div class="h-6 w-[1px] bg-gray-200 dark:border-zinc-800 mx-1"></div>

        <div class="flex items-center gap-1">
          <button id="themeBtn" class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-lg">🌓</button>
          
          <router-link 
  to="/chat" 
  class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
  title="채팅"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
</router-link>

<div class="relative">
  <button 
    @click="showNotiPopup = !showNotiPopup"
    class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors relative"
  >
    <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  </button>
  
  </div>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div v-if="showNotiPopup" class="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[110]">
                <div class="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                  <span class="font-bold">알림</span>
                  <button class="text-xs text-point-yellow font-bold">모두 읽음</button>
                </div>
                <div class="max-h-80 overflow-y-auto">
                  <div class="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition border-b border-gray-50 dark:border-zinc-800/50">
                    <p class="text-sm font-bold">💬 새 메시지</p>
                    <p class="text-xs text-gray-500 mt-1">김채용님이 메시지를 보냈습니다.</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
  </header>

  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showAuthModal" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" @click="closeAuthModal"></div>
      
      <div class="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-zinc-800">
        <button @click="closeAuthModal" class="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-xl">✕</button>
        
        <div class="text-center mb-8">
          <h2 class="text-2xl font-black text-gray-900 dark:text-white">회원 선택</h2>
          <p class="text-sm text-gray-500 mt-2">Poticard의 서비스를 이용할 유형을 선택하세요.</p>
        </div>

        <div class="space-y-3">
          <button
            @click="selectAuthType('personal')"
            class="w-full group p-5 rounded-3xl border-2 border-gray-100 dark:border-zinc-800 hover:border-point-yellow transition-all text-left flex items-center gap-4"
          >
            <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👤</div>
            <div>
              <span class="block text-lg font-bold text-gray-900 dark:text-white">개인 회원</span>
              <span class="text-xs text-gray-500">포트폴리오 및 명함 관리</span>
            </div>
          </button>

          <button
            @click="selectAuthType('business')"
            class="w-full group p-5 rounded-3xl border-2 border-gray-100 dark:border-zinc-800 hover:border-point-yellow transition-all text-left flex items-center gap-4"
          >
            <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏢</div>
            <div>
              <span class="block text-lg font-bold text-gray-900 dark:text-white">기업 계정</span>
              <span class="text-xs text-gray-500">채용 및 인재 검색</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 필요한 경우만 CSS 사용 (이미지/애니메이션 등) */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}
</style>