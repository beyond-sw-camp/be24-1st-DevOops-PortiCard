<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const categories = [
  { value: "QNA", label: "Q&A" },
  { value: "SHOWCASE", label: "작품/자랑" },
  { value: "CAREER", label: "취업/커리어" },
  { value: "STUDY", label: "스터디" },
  { value: "FREE", label: "자유" },
];

const form = ref({
  category: "QNA",
  title: "",
  tags: "",      // "Spring, JPA, MySQL" 같은 입력
  body: "",
  anonymous: false,
});

const tagList = computed(() =>
  form.value.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10)
);

const canSubmit = computed(() => {
  const f = form.value;
  return f.title.trim().length >= 2 && f.body.trim().length >= 10;
});

function goBack() {
  router.push("/community");
}

async function submit() {
  if (!canSubmit.value) return;

  // ✅ 여기서 백엔드 API로 POST 연결하면 됨
  // 예) await apiFetch("/api/community/posts", { method:"POST", body: JSON.stringify({...}) })

  alert("게시물을 올렸습니다.");
  router.push("/community");
}
</script>

<template>
  <div class="bg-white text-zinc-900 font-sans dark:bg-zinc-950 dark:text-zinc-100">
    <main class="max-w-7xl mx-auto px-5 pt-10 pb-14">
      <!-- 상단 -->
      <div class="flex items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight">글 작성</h1>

        </div>

        <div class="flex items-center gap-2">
          <button
            @click="goBack"
            class="px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-bold"
          >
            취소
          </button>

          <button
            :disabled="!canSubmit"
            @click="submit"
            class="px-4 py-2.5 rounded-2xl font-extrabold
                   bg-amber-400 text-zinc-900 hover:bg-amber-300
                   disabled:opacity-40 disabled:cursor-not-allowed"
          >
            등록
          </button>
        </div>
      </div>

      <!-- 본문 레이아웃 -->
      <section class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 작성 폼 -->
        <div class="lg:col-span-8">
          <div class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <!-- 카테고리 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold mb-2">카테고리</label>
                <select
                  v-model="form.category"
                  class="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                >
                  <option v-for="c in categories" :key="c.value" :value="c.value">
                    {{ c.label }}
                  </option>
                </select>
              </div>

              <div class="flex items-end justify-between gap-3">
                <div class="flex items-center gap-2">
                  <input
                    id="anon"
                    type="checkbox"
                    v-model="form.anonymous"
                    class="w-4 h-4"
                  />
                  <label for="anon" class="text-sm font-bold">익명으로 작성</label>
                </div>

                <div class="text-xs text-zinc-500 dark:text-zinc-400">
                  내용 최소 10자
                </div>
              </div>
            </div>

            <!-- 제목 -->
            <div class="mt-5">
              <label class="block text-sm font-bold mb-2">제목</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="제목을 입력하세요"
                class="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              />
            </div>

            <!-- 태그 -->
            <div class="mt-5">
              <label class="block text-sm font-bold mb-2">태그 (쉼표로 구분)</label>
              <input
                v-model="form.tags"
                type="text"
                placeholder="예) Spring, JPA, MySQL"
                class="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              />

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="t in tagList"
                  :key="t"
                  class="px-2.5 py-1 rounded-full text-xs font-bold
                         border border-amber-200 dark:border-amber-500/30
                         bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300"
                >
                  {{ t }}
                </span>
              </div>
            </div>

            <!-- 내용 -->
            <div class="mt-5">
              <label class="block text-sm font-bold mb-2">내용</label>
              <textarea
                v-model="form.body"
                rows="12"
                placeholder="내용을 입력하세요"
                class="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 resize-y"
              />
            </div>
          </div>
        </div>

        <!-- 우측 미리보기/가이드 -->
        <aside class="lg:col-span-4">
          <div class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold">미리보기</h2>
              <span class="text-xs px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500">
                Demo
              </span>
            </div>

            <div class="mt-4">
              <div class="text-xs text-zinc-500 dark:text-zinc-400">카테고리</div>
              <div class="mt-1 font-extrabold">
                {{ categories.find(c => c.value === form.category)?.label }}
              </div>
            </div>

            <div class="mt-4">
              <div class="text-xs text-zinc-500 dark:text-zinc-400">제목</div>
              <div class="mt-1 font-extrabold break-words">
                {{ form.title || "제목이 여기에 표시됩니다" }}
              </div>
            </div>

            <div class="mt-4">
              <div class="text-xs text-zinc-500 dark:text-zinc-400">태그</div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="t in (tagList.length ? tagList : ['태그'])"
                  :key="t"
                  class="px-2.5 py-1 rounded-full text-xs font-bold
                         border border-zinc-200 dark:border-zinc-800"
                >
                  {{ t }}
                </span>
              </div>
            </div>

            <div class="mt-4">
              <div class="text-xs text-zinc-500 dark:text-zinc-400">내용</div>
              <div class="mt-2 text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
                {{ form.body || "내용이 여기에 표시됩니다" }}
              </div>
            </div>

            <div class="mt-6 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              • 개인정보/비방 금지<br />
              • 포트폴리오/명함 링크 공유 환영<br />
              • 공격적/비하 표현은 삭제될 수 있음
            </div>
          </div>
        </aside>
      </section>
    </main>
  </div>
</template>
