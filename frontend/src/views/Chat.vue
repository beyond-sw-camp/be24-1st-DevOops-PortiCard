<script setup>
import { onMounted } from 'vue'
onMounted(() => {
    /* ========= Theme Toggle ========= */
    (function initTheme(){
      const saved = localStorage.getItem("theme"); // dark|light|null
      const root = document.documentElement;
      if (saved === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
    })();

    function toggleTheme(){
      const root = document.documentElement;
      const nextDark = !root.classList.contains("dark");
      root.classList.toggle("dark", nextDark);
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    }

    /* ========= Demo Data ========= */
    const rooms = [
      { id: 1, name: "김채용", company: "DevOps Inc.", role: "HR", unread: 2, last: "포트폴리오 잘 봤습니다!", tags:["Hiring","Backend"] },
      { id: 2, name: "이민수", company: "Side Project", role: "Dev", unread: 0, last: "DB 설계 같이 보자", tags:["Study","DB"] },
      { id: 3, name: "박지영", company: "Design Lab", role: "PM", unread: 5, last: "일정 가능하실까요?", tags:["PM","Project"] },
      { id: 4, name: "익명", company: "Community", role: "User", unread: 0, last: "좋은 글 감사합니다!", tags:["Free"] }
    ];

    const messagesByRoom = {
      1: [
        { who:"them", text:"안녕하세요! 포트폴리오 잘 봤습니다. 백엔드 쪽 지원 맞으신가요?", time:"오후 2:03" },
        { who:"me", text:"네 맞아요! 백엔드/풀스택 관심 있어요. 어떤 포지션인지 궁금합니다.", time:"오후 2:04" },
        { who:"them", text:"Spring 기반 서비스 운영 경험 있으시면 좋을 것 같아요. 간단히 통화 가능하실까요?", time:"오후 2:05" },
      ],
      2: [
        { who:"them", text:"ERD 그린 거 봤는데 notification 테이블 FK 구성 괜찮아 보여.", time:"어제" },
        { who:"me", text:"오 고마워. 인덱스도 같이 잡아볼까?", time:"어제" },
      ],
      3: [
        { who:"them", text:"포티카드 커뮤니티 UI 너무 깔끔하네요.", time:"오전 11:10" },
        { who:"them", text:"글쓰기 페이지도 연결하면 완성도 더 올라갈 것 같아요.", time:"오전 11:11" },
        { who:"me", text:"맞아요. 지금 채팅 페이지도 작업 중이에요.", time:"오전 11:12" },
      ],
      4: [
        { who:"them", text:"오늘 글 도움 됐어요!", time:"3일 전" },
        { who:"me", text:"감사합니다 🙂", time:"3일 전" },
      ],
    };

    let activeRoomId = null;

    const $ = (s) => document.querySelector(s);


    function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
    const scheme = (location.protocol === 'https:') ? 'wss' : 'ws';
    const WS_URL = `${scheme}://${location.host}/chat-ws`;
    const myUserId =
  localStorage.getItem("chatUserId") ||
  (crypto.randomUUID ? crypto.randomUUID() : generateUUID());

localStorage.setItem("chatUserId", myUserId);

   const myUserName =
   sessionStorage.getItem("chatUserName") || ("Guest-" + Math.floor(1000 + Math.random() * 9000));
   sessionStorage.setItem("chatUserName", myUserName);

    let ws = null;

    function wsConnect(){
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("WS OPEN", WS_URL, myUserName);
        if (activeRoomId) wsJoin(activeRoomId);
      };

      ws.onmessage = (e) => {
        let msg;
        try { msg = JSON.parse(e.data); } catch { return; }

        if (msg.type === "chat") {
          const roomId = Number(msg.roomId);
          const isMe = String(msg.userId) === String(myUserId);
          messagesByRoom[roomId] ||= [];
          messagesByRoom[roomId].push({
            who: isMe ? "me" : "them",
            text: msg.text,
            time: "방금"
          });

          const r = rooms.find(x => x.id === roomId);
          if (r) r.last = msg.text.length > 30 ? msg.text.slice(0,30) + "..." : msg.text;
          if (roomId === activeRoomId) {renderMessages(activeRoomId);}
          renderRooms(filterRooms($("#roomSearch").value));
        }
      };

      ws.onclose = () => setTimeout(wsConnect, 800);
    }

    function wsJoin(roomId){
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({
        type: "join",
        roomId,
        userId: myUserId,
        userName: myUserName
      }));
    }

    function wsSendChat(roomId, text){
      console.log("SEND CHAT", roomId, text);
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      ws.send(JSON.stringify({
        type: "chat",
        roomId,
        userId: myUserId,
        userName: myUserName,
        text
      }));
    }

    function renderRooms(list){
      $("#roomCount").textContent = `${list.length}개`;
      $("#roomList").innerHTML = list.map(r => `
        <button class="chat-room w-full text-left card soft-shadow p-4 hover:opacity-95 transition"
          data-room="${r.id}" aria-selected="${r.id===activeRoomId}">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <div class="font-extrabold truncate">${r.name}</div>
                ${r.unread ? `<span class="text-xs font-extrabold px-2 py-0.5 rounded-full"
                  style="background: rgba(250,204,21,.18); border:1px solid rgba(250,204,21,.55);">${r.unread}</span>` : ""}
              </div>
              <div class="text-sm text-zinc-500 dark:text-zinc-400 truncate mt-1">
                ${r.company} · ${r.role}
              </div>
              <div class="text-sm mt-2 truncate" style="color: var(--muted);">${r.last}</div>

              <div class="mt-3 flex flex-wrap gap-2">
                ${r.tags.map(t => `<span class="text-xs font-bold px-2 py-1 rounded-full"
                  style="background: rgba(250,204,21,.12); border:1px solid rgba(250,204,21,.35); color: var(--text);">${t}</span>`).join("")}
              </div>
            </div>
            <i class="fa-solid fa-chevron-right opacity-40 mt-1"></i>
          </div>
        </button>
      `).join("");
    }

    function renderMessages(roomId){
  const msgs = messagesByRoom[roomId] || [];
  const area = $("#messageArea");

  area.innerHTML = msgs.map(m => `
    <div class="mb-3 w-full flex">
      <div class="msg-wrap ${m.who==="me" ? "me ml-auto" : "them mr-auto"}">
        <div class="chat-bubble ${m.who==="me" ? "chat-bubble-me" : "chat-bubble-them"}">
          ${escapeHtml(m.text)}
        </div>
        <div class="text-xs mt-1 ${m.who==="me" ? "text-right" : "text-left"}"
          style="color: var(--muted);">${m.time}</div>
      </div>
    </div>
  `).join("") || `
    <div class="text-zinc-500 dark:text-zinc-400 text-sm">대화를 시작해보세요.</div>
  `;

  area.scrollTop = area.scrollHeight;
}


    function setActiveRoom(roomId){
      activeRoomId = roomId;
      const room = rooms.find(r => r.id === roomId);
      $("#chatTitle").textContent = room ? room.name : "대화";
      $("#chatSub").textContent = room ? `${room.company} · ${room.role}` : "";

      // 읽음 처리(데모)
      if (room) room.unread = 0;

      renderRooms(filterRooms($("#roomSearch").value));
      bindRoomClicks();
      renderMessages(roomId);
      wsJoin(roomId);

    }

    function filterRooms(q){
      const s = (q || "").trim().toLowerCase();
      if (!s) return rooms;
      return rooms.filter(r =>
        (r.name + " " + r.company + " " + r.role + " " + r.tags.join(" ")).toLowerCase().includes(s)
      );
    }
    function sendMessage(){
      const input = $("#messageInput");
      const text = input.value.replace(/\r?\n/g, " ").trim();

      if (!activeRoomId){
        alert("왼쪽에서 채팅방을 먼저 선택해줘!");
        return;
      }
      if (!text) return;

      // ✅ 입력창만 정리
      input.value = "";
      autosizeTextarea(input);

      // ✅ WS로 전송만 (UI 반영은 ws.onmessage에서만!)
      wsSendChat(activeRoomId, text);
    }

    function quick(text){
      $("#messageInput").value = text;
      autosizeTextarea($("#messageInput"));
      $("#messageInput").focus();
    }

    function escapeHtml(str){
      return str
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
    }

    function autosizeTextarea(el){
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }

    /* ========= Events ========= */
    $("#roomSearch").addEventListener("input", (e) => {
      renderRooms(filterRooms(e.target.value));
      bindRoomClicks();
    });

    function bindRoomClicks(){
      document.querySelectorAll("[data-room]").forEach(btn => {
        btn.addEventListener("click", () => setActiveRoom(Number(btn.dataset.room)));
      });
    }

    $("#sendBtn").addEventListener("click", sendMessage);

    $("#messageInput").addEventListener("input", (e) => autosizeTextarea(e.target));

    $("#messageInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey){
        e.preventDefault();
        sendMessage();
      }
    });

    $("#btnNewVideoChat").addEventListener("click", () => {
      // 새 화상 채팅: 대상이 없으면 그냥 새 방으로 이동(파라미터 없이)
      window.location.href = "/video-chat";
    });

    $("#btnNewChat").addEventListener("click", () => {
      alert("새 채팅 시작(검색/유저 선택) UI는 다음 단계에서 연결하면 됨!");
    });

    $("#btnVideoCall").addEventListener("click", () => {
    if (!activeRoomId) return alert("대상을 선택해주세요.");

    // 1. 현재 선택된 채팅방 정보 가져오기
    const room = rooms.find(r => r.id === activeRoomId);

    // 2. 유저 이름과 ID를 쿼리 스트링으로 구성
    // encodeURIComponent는 이름에 특수문자나 공백이 있을 경우를 대비해 안전하게 변환해줍니다.
    const userName = encodeURIComponent(room.name);
    const url = `/video-chat?id=${room.id}&name=${userName}`;

    // 3. 페이지 이동
    window.location.href = url;
    });

    $("#btnViewCard").addEventListener("click", () => {
      if (!activeRoomId) return alert("채팅방을 먼저 선택해줘!");
      alert("명함 보기(프로필/명함 상세 페이지로 이동) 연결하면 됨!");
    });

    $("#btnMore").addEventListener("click", () => alert("차단/신고/나가기 메뉴(데모)"));

    $("#btnAttach").addEventListener("click", () => alert("파일/이미지 첨부(데모)"));

    /* ========= Init ========= */
    renderRooms(rooms);
    bindRoomClicks();
    autosizeTextarea($("#messageInput"));
    wsConnect();
});
</script>

<template>
<div class="font-sans">
  <main class="max-w-7xl mx-auto px-5 pt-10 pb-14">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">채팅</h1>
      </div>

      <div class="flex items-center gap-2">
        <button id="btnNewVideoChat" class="btn-accent">
          <i class="fa-solid fa-video"></i>
          <span class="hidden sm:inline ml-2">새 화상 채팅</span>
        </button>
        <button id="btnNewChat" class="btn-accent">
          <i class="fa-solid fa-pen-to-square"></i>
          <span class="hidden sm:inline ml-2">새 채팅</span>
        </button>
      </div>
    </div>

    <!-- 2컬럼: 채팅방 리스트 / 대화창 -->
    <section class="mt-8 grid grid-cols-12 gap-6">
      <!-- 왼쪽: 채팅방 리스트 -->
      <aside class="col-span-12 lg:col-span-4">
        <div class="card soft-shadow p-5">
          <div class="flex items-center justify-between">
            <div class="font-extrabold">채팅 목록</div>
            <span id="roomCount" class="text-sm font-bold text-zinc-500 dark:text-zinc-400">0</span>
          </div>

          <div class="mt-4">
            <input id="roomSearch" class="ui-input" placeholder="이름/회사/키워드 검색" />
          </div>

          <div id="roomList" class="mt-4 space-y-3 max-h-[520px] overflow-auto thin-scroll pr-1"></div>
        </div>
      </aside>

      <!-- 오른쪽: 대화 -->
      <section class="col-span-12 lg:col-span-8">
        <div class="card soft-shadow overflow-hidden">
          <!-- 상단 헤더 -->
          <div class="px-5 py-4 border-b" style="border-color: var(--border);">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <div class="dot"></div>
                  <div id="chatTitle" class="font-extrabold truncate">대화를 선택하세요</div>
                </div>
                <div id="chatSub" class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  채팅방을 클릭하면 메시지가 표시됩니다.
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button id="btnVideoCall" class="btn" title="화상 채팅 시작">
                  <i class="fa-solid fa-video"></i>
                  <span class="hidden sm:inline ml-2">화상 채팅</span>
                </button>
                <button id="btnViewCard" class="btn">
                  <i class="fa-regular fa-id-card"></i>
                  <span class="hidden sm:inline ml-2">명함</span>
                </button>
                <button id="btnMore" class="btn">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 메시지 영역 -->
          <div id="messageArea" class="px-5 py-5 h-[520px] overflow-auto thin-scroll">
            <!-- empty state -->
            <div class="text-zinc-500 dark:text-zinc-400 text-sm">
              왼쪽에서 채팅방을 선택해 주세요.
            </div>
          </div>

          <!-- 입력 영역 -->
          <div class="px-5 py-4 border-t" style="border-color: var(--border);">
            <div class="flex items-end gap-3">
              <button id="btnAttach" class="btn" type="button" title="첨부(데모)">
                <i class="fa-solid fa-paperclip"></i>
              </button>

              <div class="flex-1">
                <textarea id="messageInput" rows="1"
                  class="ui-input resize-none"
                  placeholder="메시지를 입력하세요 (Enter 전송 / Shift+Enter 줄바꿈)"></textarea>
                <div class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  빠른 답장: <button class="underline font-bold" type="button" onclick="quick('안녕하세요! 포트폴리오 보고 연락드려요 🙂')">인사</button> ·
                  <button class="underline font-bold" type="button" onclick="quick('혹시 프로젝트에서 맡으신 역할을 더 설명해주실 수 있을까요?')">질문</button> ·
                  <button class="underline font-bold" type="button" onclick="quick('내일 오후에 10분 정도 통화 가능하실까요?')">일정</button>
                </div>
              </div>

              <button id="sendBtn" class="btn-accent" type="button">
                <i class="fa-solid fa-paper-plane"></i>
                <span class="hidden sm:inline ml-2">전송</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</div>
</template>

<style scoped>
    .card{
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--card);
    }
    .soft-shadow{ box-shadow:var(--shadow); }

    .ui-input{
      width:100%;
      background:var(--input);
      color:var(--text);
      border:1px solid var(--border);
      border-radius:16px;
      padding:12px 16px;
      outline:none;
    }
    .ui-input::placeholder{ color:var(--muted); }
    .ui-input:focus{
      box-shadow:0 0 0 3px rgba(250,204,21,.25);
      border-color:rgba(250,204,21,.55);
    }

    .btn{
      border:1px solid var(--border);
      background:transparent;
      color:var(--text);
      border-radius:16px;
      padding:10px 14px;
      font-weight:900;
    }
    .btn:hover{ background:var(--hover); }
    .btn-accent{
      border:1px solid rgba(250,204,21,.55);
      background:var(--accent);
      color:#111827;
      border-radius:16px;
      padding:10px 14px;
      font-weight:900;
    }
    /* Message Wrap  */
    .msg-wrap{
      display: inline-flex;
      flex-direction: column;
      max-width: 560px;
    }
    .msg-wrap.me{ align-items: flex-end; }
    .msg-wrap.them{ align-items: flex-start; }
    

    /* Scroll */
    .thin-scroll::-webkit-scrollbar { width: 10px; }
    .thin-scroll::-webkit-scrollbar-thumb {
      background: rgba(161,161,170,.35);
      border-radius: 999px;
      border: 3px solid transparent;
      background-clip: padding-box;
    }
    :deep(html.dark .thin-scroll::-webkit-scrollbar-thumb){ background: rgba(113,113,122,.55); }

    /* Room active */
    .room[aria-selected="true"]{
      border-color: rgba(250,204,21,.55) !important;
      background: var(--accentSoft);
    }

    /* 작은 상태 점 */
    .dot{ width:10px; height:10px; border-radius:999px; background:#22c55e; }
    :deep(html.dark .dot){ filter: brightness(1.05); }
</style>

<!-- 동적으로 생성되는 요소를 위한 전역 스타일 -->
<style>
  /* Chat 컴포넌트의 동적 요소 스타일 (scoped 없음 - 전역 적용) */
  /* 주의: 이 스타일은 애플리케이션 전체에 전역으로 적용됩니다! */
  .chat-room[aria-selected="true"] {
    border-color: rgba(250,204,21,.55) !important;
    background: var(--accentSoft);
  }
  .chat-bubble {
    display: inline-block;
    border-radius: 22px;
    max-width: 100%;
    white-space: pre-wrap;       /* 줄바꿈은 사용자가 친 것만 */
    word-break: keep-all;        /* 한글 자연스럽게 */
    overflow-wrap: break-word;   /* 너무 길면 예외적으로 줄바꿈 */
  }
  .chat-bubble-me {
    background: var(--me);
    color: var(--meText);
    border: 1px solid rgba(63,63,70,.25);
  }
  .chat-bubble-them {
    background: var(--them);
    color: var(--themText);
    border: 1px solid var(--border);
  }
</style>