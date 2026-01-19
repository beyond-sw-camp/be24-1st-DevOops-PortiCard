<script setup>

</script>

<template>
<div class="bg-pattern text-gray-800 dark:text-gray-100 transition-colors duration-300 flex flex-col min-h-screen">

<main class="flex-1 pt-24 pb-20 px-4">
    <div class="max-w-4xl mx-auto">
        
        <!-- 단계 표시기 (Progress Bar) - 1단계 활성화 -->
        <div class="mb-10 max-w-3xl mx-auto">
            <div class="flex justify-between text-sm font-bold text-gray-400 mb-2 px-1">
                <span class="text-point-yellow">01. 프로젝트 작성</span>
                <span>02. 프로젝트 확인/수정</span>
                <span>03. 스타일</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div class="w-1/3 h-full bg-point-yellow rounded-full shadow-[0_0_10px_#FACC15] transition-all duration-500"></div>
            </div>
        </div>

        <!-- 메인 카드 -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 p-8 md:p-10 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-point-yellow to-orange-300"></div>

            <div class="mb-10 text-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">프로젝트 & 경험</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">가장 돋보이고 싶은 프로젝트를 골라 자유롭게 구성해보세요.</p>
            </div>

            <form class="space-y-12">

                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                            <i class="fa-solid fa-pen-to-square"></i> 프로젝트 속성
                        </label>
                    </div>
                </div>
                <!-- 섹션 1: 프로젝트 공통 속성 -->
                    <div class="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 space-y-5">
                        <!-- 프로젝트 제목 -->
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 dark:text-gray-400">프로젝트 제목</label>
                            <input type="text" placeholder="예: E-commerce 모바일 앱 리디자인" class="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:border-point-yellow focus:ring-1 focus:ring-point-yellow outline-none transition-all text-gray-900 dark:text-white">
                        </div>

                        <!-- 기간 및 역할 -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400">진행 기간</label>
                                <input type="text" placeholder="2023.01 - 2023.06" class="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:border-point-yellow outline-none text-gray-900 dark:text-white">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400">참여도 / 역할</label>
                                <input type="text" placeholder="기여도 100% (Solo)" class="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:border-point-yellow outline-none text-gray-900 dark:text-white">
                            </div>
                        </div>
                    </div>

                <!-- 섹션 2 : 프로젝트 세부 내용 -->
                    <div class="flex justify-between items-center">
                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                            <i class="fa-solid fa-pen-to-square"></i> 프로젝트 상세
                        </label>
                    </div>

                    <div class="prj_detail bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 space-y-5">
                        <sidebar>
                            <label class="section text-xs font-bold text-gray-500 dark:text-gray-400">섹션</label>
                            <a hrf="#" class="prj_select bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-6 border border-gray-100 dark:border-zinc-800 space-y-5">
                                1
                            </a>
                            <a hrf="#" class="prj_select bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-6 border border-gray-100 dark:border-zinc-800 space-y-5">
                                2
                            </a>
                            <a hrf="#" class="prj_select bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 p-6 border border-gray-100 dark:border-zinc-800 space-y-5">
                                +
                            </a>                                
                        </sidebar>
                        <main class="prj_content">
                            <!-- 미디어 업로드 (Drag & Drop) -->
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400">대표 이미지 / 영상</label>
                                <div class="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-600 hover:border-point-yellow hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10 transition-all flex flex-col items-center justify-center cursor-pointer group bg-white dark:bg-zinc-800">
                                    <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <i class="fa-solid fa-cloud-arrow-up text-gray-400 dark:text-gray-300 text-xl group-hover:text-point-yellow"></i>
                                    </div>
                                    <p class="text-sm font-bold text-gray-600 dark:text-gray-300">클릭 또는 파일을 이곳에 드래그하세요</p>
                                    <p class="text-[10px] text-gray-400 mt-1">JPG, PNG, GIF, MP4 (Max 10MB)</p>
                                </div>
                            </div>

                            <!-- 상세 설명 -->
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400">설명 (Markdown 지원)</label>
                                <textarea placeholder="프로젝트의 주요 성과와 해결 과정을 작성해주세요..." class="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:border-point-yellow focus:ring-1 focus:ring-point-yellow outline-none transition-all text-gray-900 dark:text-white h-64 resize-none"></textarea>
                            </div>

                        </main>
                    </div>

                <!-- 하단 액션 버튼 -->
                <div class="pt-6 flex justify-end items-center">
                    <a href="portfolio-update-n-check"
                    class="px-8 py-3 bg-point-yellow text-gray-900 rounded-xl font-bold shadow-lg shadow-yellow-200/50 dark:shadow-none hover:bg-yellow-300 transform hover:-translate-y-0.5 transition-all inline-flex items-center">
                        다음 단계 <i class="fa-solid fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </form>
        </div>
    </div>
</main>
</div>
</template>

<style scoped>
:deep(body) { font-family: 'Noto Sans KR', sans-serif; }
        .font-poppins { font-family: 'Poppins', sans-serif; }
        
        .bg-pattern {
            background-color: #f8fafc;
            background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .dark .bg-pattern {
            background-color: #18181b;
            background-image: radial-gradient(#3f3f46 1px, transparent 1px);
        }
        .prj_detail {
            display:flex;
            flex-direction: row;
            gap : 20px;
        }
        .prj_content{
            flex : 1;
        }
        sidebar {
            display : flex;
            flex-direction : column;
            flex : 0 0 auto;
            width : 50px;
            align-items: center;
            gap : 10px;
        }
        .section {
            display : flex;
            width : 45px;
            height : 10px;
            justify-content : center;
            align-items: center;
            margin-top : 29px;           
        }
        .prj_select {
            width : 45px;
            height : 45px;
            border-radius :100%;
            display:flex;
            justify-content : center;
            align-items: center;
            cursor : pointer;
            box-shadow : 0px 4px 4px rgba(0,0,0,0.1);
        }
</style>