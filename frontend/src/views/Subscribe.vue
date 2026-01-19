<template>
  <div class="page">
    <div class="container">
      <header class="top">
        <h1 class="title">Poticard</h1>
      </header>

      <div class="grid">
        <!-- Left: Plans -->
        <section class="card">
          <div class="cardHead">
            <h2 class="cardTitle">요금제</h2>
            <div class="pill">
              <button
                type="button"
                class="pillBtn"
                :class="{ on: billingCycle === 'monthly' }"
                @click="billingCycle = 'monthly'"
              >
                월간
              </button>
              <button
                type="button"
                class="pillBtn"
                :class="{ on: billingCycle === 'yearly' }"
                @click="billingCycle = 'yearly'"
              >
                연간 <span class="badge">할인</span>
              </button>
            </div>
          </div>

          <div class="plans">
            <button
              v-for="p in displayPlans"
              :key="p.id"
              type="button"
              class="plan"
              :class="{ selected: planId === p.id }"
              @click="planId = p.id"
            >
              <div class="planTop">
                <div>
                  <div class="planName">{{ p.name }}</div>
                  <div class="planDesc">{{ p.desc }}</div>
                </div>
                <div class="price">
                  <div class="priceMain">{{ formatWon(p.price) }}</div>
                  <div class="priceSub">/ {{ billingCycle === 'monthly' ? '월' : '년' }}</div>
                </div>
              </div>

              <ul class="benefits">
                <li v-for="b in p.benefits" :key="b">✔ {{ b }}</li>
              </ul>
            </button>
          </div>
        </section>

        <!-- Right: Payment -->
        <section class="card">
          <h2 class="cardTitle">결제 정보</h2>

          <div class="field">
            <label class="label">이메일</label>
            <input class="input" type="email" v-model.trim="email" placeholder="example@poticard.com" />
          </div>

          <div class="field">
            <label class="label">결제수단</label>
            <div class="payMethods">
              <button
                v-for="m in payMethods"
                :key="m.key"
                type="button"
                class="payBtn"
                :class="{ on: payMethod === m.key }"
                @click="payMethod = m.key"
              >
                {{ m.label }}
              </button>
            </div>
            <p class="hint">※ 실제 결제 연동(토스/카카오/스트라이프 등)은 “결제하기” 클릭 시 처리</p>
          </div>

          <div class="line"></div>

          <div class="summary">
            <div class="row">
              <span>선택 요금제</span>
              <b>{{ selectedPlan?.name || '-' }}</b>
            </div>
            <div class="row">
              <span>청구 주기</span>
              <b>{{ billingCycle === 'monthly' ? '월간' : '연간' }}</b>
            </div>
            <div class="row">
              <span>소계</span>
              <b>{{ formatWon(selectedPlan?.price ?? 0) }}</b>
            </div>

            <div class="row">
              <span>할인</span>
              <b>- {{ formatWon(discount) }}</b>
            </div>

            <div class="row total">
              <span>결제 금액</span>
              <b>{{ formatWon(total) }}</b>
            </div>
          </div>

          <div class="line"></div>

          <div class="agreements">
            <label class="chk">
              <input type="checkbox" v-model="agreeTerms" />
              <span>이용약관 및 결제/환불 정책에 동의합니다.</span>
            </label>
            <label class="chk">
              <input type="checkbox" v-model="agreeAutoRenew" />
              <span>정기결제(자동 갱신)에 동의합니다.</span>
            </label>
          </div>

          <button
            class="cta"
            type="button"
            :disabled="!canPay"
            @click="onPay"
          >
            {{ payButtonText }}
          </button>

          <p class="fine">
            결제 후 언제든지 구독을 해지할 수 있어요. (다음 결제일부터 적용)
          </p>
        </section>
      </div>
    </div>

    <!-- Fake modal -->
    <div v-if="modal.open" class="modal" @click.self="modal.open=false">
      <div class="modalBox">
        <h3 class="modalTitle">결제 요청</h3>
        <p class="modalDesc">
          지금은 UI만 구현된 상태야.<br />
          여기서 실제 PG 결제창을 띄우거나(redirect/SDK) 결제 API를 호출하면 돼.
        </p>
        <pre class="code">{{ modal.payload }}</pre>
        <button class="modalBtn" type="button" @click="modal.open=false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const billingCycle = ref("monthly"); // 'monthly' | 'yearly'
const planId = ref("pro");
const email = ref("");
const payMethod = ref("card"); // card | kakaopay | toss | bank
const agreeTerms = ref(false);
const agreeAutoRenew = ref(false);

const payMethods = [
  { key: "card", label: "카드" },
  { key: "kakaopay", label: "카카오페이" },
  { key: "toss", label: "토스페이" },
  { key: "bank", label: "계좌이체" },
];

const plans = [
  {
    id: "basic",
    name: "Basic",
    monthly: 1900,
    yearly: 1900 * 12 * 0.85, // 20% 할인
    benefits: ["명함 생성", "명함 커스터마이징", "ㅋ"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 4900,
    yearly: 4900 * 12 * 0.8, // 20% 할인
    benefits: ["Basic 포함", "포트폴리오 프로젝트 무제한 등록", "포트폴리오 섹션/블록 무제한", "AI 첨삭(맞춤 피드백) 제공"],
    highlight: true,
  },
];

const displayPlans = computed(() =>
  plans.map((p) => ({
    ...p,
    price: billingCycle.value === "monthly" ? Math.round(p.monthly) : Math.round(p.yearly),
  }))
);

const selectedPlan = computed(() => displayPlans.value.find((p) => p.id === planId.value));

const discount = computed(() => {
  if (!selectedPlan.value) return 0;
  if (billingCycle.value === "yearly") {
    // (연간가격) = monthly*12 - discount
    const original = Math.round(selectedPlan.value.monthly * 12);
    return Math.max(0, original - selectedPlan.value.price);
  }
  return 0;
});

const total = computed(() => {
  const price = selectedPlan.value?.price ?? 0;
  return Math.max(0, price);
});

const canPay = computed(() => {
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  return !!selectedPlan.value && hasEmail && agreeTerms.value && agreeAutoRenew.value;
});

const payButtonText = computed(() => {
  if (!selectedPlan.value) return "요금제를 선택하세요";
  return `${formatWon(total.value)} 결제하고 구독 시작`;
});

function formatWon(v) {
  const n = Number(v || 0);
  return n.toLocaleString("ko-KR") + "원";
}

const modal = reactive({ open: false, payload: "" });

function onPay() {
  // 여기서 실제 결제 연동 넣으면 됨
  const payload = {
    email: email.value,
    planId: planId.value,
    billingCycle: billingCycle.value,
    amount: total.value,
    payMethod: payMethod.value,
  };

  modal.payload = JSON.stringify(payload, null, 2);
  modal.open = true;

  // 예) 결제 시작
  // await api.post('/api/billing/subscribe', payload)
  // window.location.href = redirectUrl
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f6f7fb; padding: 40px 16px; }
.container { max-width: 1100px; margin: 0 auto; }
.top { margin-bottom: 18px; }
.title { font-size: 28px; font-weight: 900; margin: 0; }
.sub { margin: 8px 0 0; color: #6b7280; font-size: 14px; }

.grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; }
@media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }

.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 18px; padding: 18px; }
.cardHead { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.cardTitle { font-size: 16px; font-weight: 900; margin: 0 0 12px; }

.pill { display: flex; background: #f3f4f6; border-radius: 999px; padding: 4px; }
.pillBtn { border: 0; background: transparent; padding: 8px 12px; border-radius: 999px; font-weight: 800; font-size: 12px; cursor: pointer; color: #6b7280; }
.pillBtn.on { background: #111827; color: #fff; }
.badge { margin-left: 6px; font-size: 10px; padding: 2px 6px; border-radius: 999px; background: #facc15; color: #111; }

.plans { display: grid; gap: 12px; }
.plan { position: relative; text-align: left; border: 1px solid #e5e7eb; border-radius: 18px; padding: 16px; background: #fff; cursor: pointer; transition: transform 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease; }
.plan:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(0,0,0,0.06); }
.plan.selected { border-color: #111827; box-shadow: 0 10px 24px rgba(17,24,39,0.12); }
.planTop { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.planName { font-size: 16px; font-weight: 900; }
.planDesc { font-size: 12px; color: #6b7280; margin-top: 4px; }
.price { text-align: right; }
.priceMain { font-weight: 900; font-size: 18px; }
.priceSub { font-size: 11px; color: #6b7280; }

.benefits { margin: 12px 0 0; padding: 0; list-style: none; display: grid; gap: 6px; font-size: 12px; color: #374151; }
.highlight { position: absolute; top: 12px; right: 12px; background: #facc15; color: #111; padding: 4px 8px; border-radius: 999px; font-size: 11px; font-weight: 900; }

.field { margin-top: 10px; }
.label { display: block; font-size: 12px; font-weight: 900; margin-bottom: 6px; color: #111827; }
.input { width: 100%; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; font-size: 14px; outline: none; }
.input:focus { border-color: #111827; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); }

.payMethods { display: flex; flex-wrap: wrap; gap: 8px; }
.payBtn { border: 1px solid #e5e7eb; background: #fff; padding: 10px 12px; border-radius: 12px; cursor: pointer; font-weight: 900; font-size: 12px; color: #374151; }
.payBtn.on { border-color: #111827; background: #111827; color: #fff; }

.hint { margin: 8px 0 0; font-size: 11px; color: #6b7280; }

.line { height: 1px; background: #e5e7eb; margin: 14px 0; }

.summary { display: grid; gap: 8px; font-size: 13px; }
.row { display: flex; justify-content: space-between; align-items: center; color: #374151; }
.total { font-size: 14px; color: #111827; }

.agreements { display: grid; gap: 8px; }
.chk { display: flex; gap: 10px; align-items: flex-start; font-size: 12px; color: #374151; }
.chk input { margin-top: 2px; }

.cta { width: 100%; margin-top: 12px; border: 0; padding: 14px 16px; border-radius: 14px; cursor: pointer; font-weight: 900; background: #facc15; color: #111; }
.cta:disabled { opacity: 0.5; cursor: not-allowed; }

.fine { margin: 10px 0 0; font-size: 11px; color: #6b7280; }

.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: grid; place-items: center; padding: 16px; }
.modalBox { width: 100%; max-width: 520px; background: #fff; border-radius: 18px; padding: 18px; border: 1px solid #e5e7eb; }
.modalTitle { margin: 0 0 6px; font-weight: 900; }
.modalDesc { margin: 0 0 12px; color: #6b7280; font-size: 13px; }
.code { background: #0b1020; color: #e5e7eb; padding: 12px; border-radius: 14px; overflow: auto; font-size: 12px; }
.modalBtn { margin-top: 12px; width: 100%; border: 0; padding: 12px; border-radius: 12px; background: #111827; color: #fff; font-weight: 900; cursor: pointer; }
</style>
