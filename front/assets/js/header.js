// front/assets/js/header.js
document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("app-header") || document.getElementById("header-placeholder");
  if (!mount) return;

  try {
    const res = await fetch("components/header.html");
    if (!res.ok) throw new Error("header.html fetch failed");
    mount.innerHTML = await res.text();

    // ====== 여기부터 "헤더 기능"만 바인딩 ======
    const nav = document.getElementById("mainNav");
    const btn = document.getElementById("menuBtn");

    const flyouts = Array.from(document.querySelectorAll("#mainNav .nav-item"));
    const namecardFlyout = document.getElementById("flyout-namecard");
    const namecardLink = namecardFlyout
      ? namecardFlyout.querySelector('.nav-title a[href="#namecard"]')
      : null;
    const namecardPanel = namecardFlyout ? namecardFlyout.querySelector(".nav-panel") : null;

    let namecardOpen = false;
    function setNamecard(open) {
      namecardOpen = open;
      document.documentElement.classList.toggle("namecard-open", open);
      // 인라인 스타일을 건드렸던 흔적이 있어서, 열고 닫을 때 원복도 같이
      if (namecardPanel) {
        namecardPanel.style.opacity = "";
        namecardPanel.style.visibility = "";
        namecardPanel.style.pointerEvents = "";
      }
    }

    let forcedOpen = false;
    function setForced(open) {
      forcedOpen = open;
      if (btn) btn.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("menu-open", open);

      flyouts.forEach((f) => {
        if (!f) return;
        if (open) f.classList.add("force-open");
        else f.classList.remove("force-open");
      });

      if (open) setNamecard(false);
    }

    // ✅ 명함 클릭 토글
    if (namecardLink) {
      namecardLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (forcedOpen) setForced(false);
        setNamecard(!namecardOpen);
      });
    }

    // ✅ 명함 바깥 클릭/ESC 닫기
    document.addEventListener("click", (e) => {
      if (!namecardOpen) return;
      if (namecardFlyout && namecardFlyout.contains(e.target)) return;
      setNamecard(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNamecard(false);
    });

    // ✅ 전체 메뉴(📋) 토글
    if (btn && nav) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setNamecard(false);
        setForced(!forcedOpen);
      });

      // 바깥 클릭 닫기
      document.addEventListener("click", (e) => {
        if (!forcedOpen) return;
        if (nav.contains(e.target) || btn.contains(e.target)) return;
        setForced(false);
      });

      // ESC 닫기
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setForced(false);
      });

      // ✅ “📋 버튼 hover로 패널 뜨는 현상” 방지용 원복 로직
      btn.addEventListener("mouseenter", () => {
        const panel = document.querySelector("#flyout-namecard > .nav-panel");
        if (!forcedOpen && !namecardOpen && panel) {
          panel.style.opacity = "0";
          panel.style.visibility = "hidden";
          panel.style.pointerEvents = "none";
        }
      });
      btn.addEventListener("mouseleave", () => {
        const panel = document.querySelector("#flyout-namecard > .nav-panel");
        if (panel) {
          panel.style.opacity = "";
          panel.style.visibility = "";
          panel.style.pointerEvents = "";
        }
      });
    }

    // ✅ 로그인/회원가입(개인/법인) 모달
    const authBtn = document.getElementById("authBtn");
    const modal = document.getElementById("authModal");
    const closeBtn = document.getElementById("authClose");

    function openModal() {
      document.documentElement.classList.add("modal-open");
      if (modal) modal.setAttribute("aria-hidden", "false");
    }
    function closeModal() {
      document.documentElement.classList.remove("modal-open");
      if (modal) modal.setAttribute("aria-hidden", "true");
    }

    if (authBtn && modal) {
      authBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });

      closeBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });

      modal.addEventListener("click", (e) => {
        // backdrop 클릭이면 닫기
        if (e.target === modal) closeModal();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
    }

    // ✅ 테마 토글(기존 index의 toggleTheme() 그대로 쓰고 싶으면 유지 가능)
    const themeBtn = document.getElementById("themeBtn");
    themeBtn?.addEventListener("click", () => {
      if (typeof window.toggleTheme === "function") window.toggleTheme();
      else document.documentElement.classList.toggle("dark");
    });
  } catch (e) {
    console.error(e);
  }
});
