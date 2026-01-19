function initIndex() {
  ;(function () {
    // ✅ 메뉴 토글: "명함 옆 📋 버튼"
    const btn = document.getElementById('menuBtn')
    const nav = document.getElementById('mainNav')

    const flyouts = [
      document.getElementById('flyout-namecard'),
      document.getElementById('flyout-portfolio'),
      document.getElementById('flyout-jobs'),
      document.getElementById('flyout-community'),
    ].filter(Boolean)

    // ✅ 명함(탭)만 클릭 드롭다운 토글
    const namecardFlyout = document.getElementById('flyout-namecard')
    const namecardLink = namecardFlyout
      ? namecardFlyout.querySelector('.nav-title a[href="#namecard"]')
      : null
    const namecardPanel = namecardFlyout ? namecardFlyout.querySelector('.nav-panel') : null
    let namecardOpen = false

    function setNamecard(open) {
      namecardOpen = open
      document.documentElement.classList.toggle('namecard-open', open)
      if (namecardPanel) {
        namecardPanel.style.opacity = ''
        namecardPanel.style.visibility = ''
        namecardPanel.style.pointerEvents = ''
      }
    }

    let forcedOpen = false
    function setForced(open) {
      forcedOpen = open
      if (btn) btn.setAttribute('aria-expanded', String(open))
      document.documentElement.classList.toggle('menu-open', open)
      flyouts.forEach((f) => {
        if (!f) return
        if (open) f.classList.add('force-open')
        else f.classList.remove('force-open')
      })
      if (open) setNamecard(false)
    }

    if (namecardLink) {
      namecardLink.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (forcedOpen) setForced(false)
        setNamecard(!namecardOpen)
      })
    }

    document.addEventListener('click', (e) => {
      if (!namecardOpen) return
      if (namecardFlyout && namecardFlyout.contains(e.target)) return
      setNamecard(false)
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setNamecard(false)
    })

    if (btn && nav) {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        setNamecard(false)
        setForced(!forcedOpen)
      })

      document.addEventListener('click', (e) => {
        if (!forcedOpen) return
        if (nav.contains(e.target) || btn.contains(e.target)) return
        setForced(false)
      })

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setForced(false)
      })

      btn.addEventListener('mouseenter', () => {
        const panel = document.querySelector('#flyout-namecard > .nav-panel')
        if (!forcedOpen && !namecardOpen && panel) {
          panel.style.opacity = '0'
          panel.style.visibility = 'hidden'
          panel.style.pointerEvents = 'none'
        }
      })
      btn.addEventListener('mouseleave', () => {
        const panel = document.querySelector('#flyout-namecard > .nav-panel')
        if (panel) {
          panel.style.opacity = ''
          panel.style.visibility = ''
          panel.style.pointerEvents = ''
        }
      })
    }

    // ✅ 카드 Hover 미리보기 + Click 상세 팝업 (유지)
    const preview = document.getElementById('cardPreview')
    const pvIcon = document.getElementById('pvIcon')
    const pvTitle = document.getElementById('pvTitle')
    const pvSub = document.getElementById('pvSub')
    const pvBadge = document.getElementById('pvBadge')
    const pvDesc = document.getElementById('pvDesc')
    const pvTags = document.getElementById('pvTags')

    const cardModal = document.getElementById('cardModal')
    const cardClose = document.getElementById('cardClose')
    const cmIcon = document.getElementById('cmIcon')
    const cmTitle = document.getElementById('cmTitle')
    const cmSub = document.getElementById('cmSub')
    const cmOne = document.getElementById('cmOne')
    const cmDesc = document.getElementById('cmDesc')
    const cmTags = document.getElementById('cmTags')

    let previewLocked = false

    function setTags(container, tagsCSV, cls) {
      const tags = (tagsCSV || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      container.innerHTML = ''
      tags.slice(0, 8).forEach((t) => {
        const span = document.createElement('span')
        span.className = cls
        span.textContent = t
        container.appendChild(span)
      })
    }

    function showPreview(el) {
      if (!preview || previewLocked) return
      pvIcon.textContent = el.dataset.icon || '🃏'
      pvTitle.textContent = el.dataset.title || '카드'
      pvSub.textContent = el.dataset.sub || ''
      pvBadge.textContent = el.dataset.badge || '정보'
      pvDesc.textContent = el.dataset.desc || ''
      setTags(
        pvTags,
        el.dataset.tags || '',
        'text-[11px] font-bold bg-gray-50 dark:bg-zinc-800/60 px-2 py-1 rounded-full',
      )
      preview.classList.add('show')
      preview.setAttribute('aria-hidden', 'false')
    }
    function hidePreview() {
      if (!preview || previewLocked) return
      preview.classList.remove('show')
      preview.setAttribute('aria-hidden', 'true')
    }

    function openCardModal(el) {
      if (!cardModal) return
      cmIcon.textContent = el.dataset.icon || '🃏'
      cmTitle.textContent = el.dataset.title || '카드 상세'
      cmSub.textContent = el.dataset.sub || ''
      cmOne.textContent = el.dataset.one || ''
      cmDesc.textContent = el.dataset.desc || ''
      setTags(
        cmTags,
        el.dataset.tags || '',
        'text-[11px] font-bold bg-yellow-50 dark:bg-yellow-900/30 text-orange-600 dark:text-yellow-300 px-2 py-1 rounded-full',
      )

      document.documentElement.classList.add('cardModal-open')
      cardModal.setAttribute('aria-hidden', 'false')
    }
    function closeCardModal() {
      if (!cardModal) return
      document.documentElement.classList.remove('cardModal-open')
      cardModal.setAttribute('aria-hidden', 'true')
    }

    // 카드 이벤트 바인딩(유지)
    document.querySelectorAll('.card-item').forEach((el) => {
      el.addEventListener('mouseenter', () => showPreview(el))
      el.addEventListener('mouseleave', () => hidePreview())
      el.addEventListener('click', (e) => {
        e.preventDefault()
        openCardModal(el)
      })
    })

    if (preview) {
      preview.addEventListener('mouseenter', () => {
        previewLocked = true
      })
      preview.addEventListener('mouseleave', () => {
        previewLocked = false
        hidePreview()
      })
    }

    if (cardModal) {
      cardModal.addEventListener('click', (e) => {
        const inner = cardModal.querySelector('.inner')
        if (inner && !inner.contains(e.target)) closeCardModal()
      })
    }
    if (cardClose)
      cardClose.addEventListener('click', (e) => {
        e.preventDefault()
        closeCardModal()
      })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCardModal()
    })

    // ==========================================================
    // ✅ (핵심) 카드 덱 슬라이더: 화살표/촤라락/겹침/반응형/스와이프
    // ==========================================================
    const deck = document.getElementById('deck')
    if (!deck) return

    const prevBtn = document.getElementById('deckPrev')
    const nextBtn = document.getElementById('deckNext')
    const dotsWrap = document.getElementById('deckDots')
    const cards = Array.from(deck.querySelectorAll('.deck-card'))

    let current = 1 // 가운데 카드부터 시작(UX/UI가 중앙)
    let animLock = false

    function clampIndex(i) {
      const n = cards.length
      return ((i % n) + n) % n
    }

    function isMobile() {
      return window.matchMedia('(max-width: 640px)').matches
    }

    function renderDots() {
      if (!dotsWrap) return
      dotsWrap.innerHTML = ''
      cards.forEach((_, i) => {
        const d = document.createElement('span')
        d.className = 'dot' + (i === current ? ' active' : '')
        d.addEventListener('click', (e) => {
          e.preventDefault()
          if (animLock) return
          // 가까운 방향으로 이동
          const diff = i - current
          if (diff === 0) return
          if (Math.abs(diff) <= Math.floor(cards.length / 2)) current = i
          else current = i // 단순 이동
          renderDeck()
        })
        dotsWrap.appendChild(d)
      })
    }

    function renderDeck() {
      const n = cards.length

      // 반응형 파라미터
      const mobile = isMobile()

      const visibleRange = mobile ? 4 : 5 // 뒤에 보이는 카드 수(좌/우)
      const angleStep = mobile ? 10 : 9 // 부채꼴 벌어짐(각도)
      const radius = mobile ? 260 : 360 // 부채꼴 반지름(클수록 완만)
      const depthStep = mobile ? 28 : 34 // 뒤로 갈수록 z축(원근)
      const scaleStep = mobile ? 0.045 : 0.05

      cards.forEach((card, i) => {
        let offset = i - current

        // ✅ 순환 덱처럼: 가장 가까운 offset으로 정규화
        if (offset > n / 2) offset -= n
        if (offset < -n / 2) offset += n

        const abs = Math.abs(offset)

        // ✅ 보여줄 범위 밖은 숨김
        if (abs > visibleRange) {
          card.classList.add('is-far')
          card.style.opacity = '0'
          card.style.pointerEvents = 'none'
          return
        } else {
          card.classList.remove('is-far')
        }

        const isFront = offset === 0
        card.classList.toggle('is-front', isFront)
        card.classList.toggle('is-back', !isFront)

        // ✅ 부채꼴 배치 핵심: offset → angle → (x,y)
        // angle: 왼쪽(음수), 오른쪽(양수)
        const angle = offset * angleStep // deg
        const rad = (angle * Math.PI) / 180

        // x: 원호를 따라 이동
        const x = Math.sin(rad) * radius

        // y: 원호를 따라 아래로 내려가며 펼쳐짐(그림처럼 아래쪽이 퍼짐)
        // (1 - cos) 형태가 "부채꼴" 느낌 좋음
        const y = (1 - Math.cos(rad)) * (radius * 0.55)

        // 뒤로 갈수록 살짝 작고, 더 뒤로 들어가게
        const z = -abs * depthStep // translateZ
        const s = 1 - abs * scaleStep // scale

        // 카드 자체 회전(부채꼴 느낌)
        // 중앙은 거의 0도, 좌우는 각도에 비례해서 회전
        const rotateZ = angle * 0.85

        // 아주 약한 Y 기울임으로 입체감
        const rotateY = offset === 0 ? 0 : offset > 0 ? -6 : 6

        // z-index는 중앙이 최상단
        card.style.zIndex = String(100 - abs)

        // ✅ "중앙 카드"는 더 앞/더 또렷하게
        const extraLift = isFront ? -8 : 0 // 살짝 위로
        const extraZ = isFront ? 40 : 0 // 살짝 더 앞으로

        card.style.opacity = isFront ? '1' : mobile ? '0.92' : '0.94'

        card.style.transform = `translateX(${x}px) translateY(${y + extraLift}px) translateZ(${z + extraZ}px)
       rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${s})`
      })

      renderDots()
    }

    function animateClass(dir) {
      if (!deck) return
      deck.classList.remove('deck-anim-left', 'deck-anim-right')
      void deck.offsetWidth // reflow
      deck.classList.add(dir === 'left' ? 'deck-anim-left' : 'deck-anim-right')
      setTimeout(() => {
        deck.classList.remove('deck-anim-left', 'deck-anim-right')
      }, 520)
    }

    function goNext() {
      if (animLock) return
      animLock = true
      animateClass('right')
      current = clampIndex(current + 1)
      renderDeck()
      setTimeout(() => (animLock = false), 520)
    }

    function goPrev() {
      if (animLock) return
      animLock = true
      animateClass('left')
      current = clampIndex(current - 1)
      renderDeck()
      setTimeout(() => (animLock = false), 520)
    }

    if (nextBtn)
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        goNext()
      })
    if (prevBtn)
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        goPrev()
      })

    // 키보드 ← →
    document.addEventListener('keydown', (e) => {
      if (document.documentElement.classList.contains('modal-open')) return
      if (document.documentElement.classList.contains('cardModal-open')) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    })

    // 모바일 스와이프
    let sx = 0,
      sy = 0,
      moved = false
    if (deck) {
      deck.addEventListener(
        'touchstart',
        (e) => {
          if (!e.touches || !e.touches[0]) return
          sx = e.touches[0].clientX
          sy = e.touches[0].clientY
          moved = false
        },
        { passive: true },
      )

      deck.addEventListener(
        'touchmove',
        (e) => {
          moved = true
        },
        { passive: true },
      )

      deck.addEventListener(
        'touchend',
        (e) => {
          if (!moved) return
          const t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : null
          if (!t) return
          const dx = t.clientX - sx
          const dy = t.clientY - sy

          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) goNext()
            else goPrev()
          }
        },
        { passive: true },
      )
    }

    window.addEventListener('resize', () => renderDeck())

    // 초기 렌더
    renderDeck()
  })()
}

export { initIndex }
