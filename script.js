/* Premium™ — unified client runtime
   Static/PWA build: in-memory state only. No browser storage, database, or backend.
*/
(() => {
  "use strict";

  // App data exists only in this page's memory and resets on refresh/close.
  // This in-memory adapter deliberately avoids browser storage APIs.
  const memory = new Map();
  const volatileStorage = {
    getItem(key) { return memory.has(key) ? memory.get(key) : null; },
    setItem(key, value) { memory.set(key, String(value)); },
    removeItem(key) { memory.delete(key); }
  };
  const STORE = "premium-workspace-v1";
  const SESSION = "premium-session-v1";
  const PURCHASE = "premium-purchased-plan-v1";
  const PROMO_PREF = "premium-hide-promotions-v1";
  const QUIET_PREF = "premium-quiet-mode-v1";
  const REDUCED = "premium-reduced-motion";

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const defaults = {
    visits: 0,
    actions: 0,
    plan: "Free",
    premium: false,
    accountValue: 0,
    events: [],
    theme: "light",
    teamSize: 1,
    notificationsRead: false
  };

  function normalizePlan(plan) {
    return plan === "Premium" || plan === "Ultra Max Pro+" || plan === "Free" ? plan : "Free";
  }

  // Keep the demo plan only for this browsing session; closing the site resets it.
  function readPurchasedPlan() {
    try { return normalizePlan(volatileStorage.getItem(PURCHASE) || "Free"); }
    catch { return "Free"; }
  }

  let sessionPlan = readPurchasedPlan();
  let selectedPlan = sessionPlan;
  let sessionPurchaseValue = 0;

  function isPaidPlan(plan) {
    return normalizePlan(plan) !== "Free";
  }

  function readState() {
    try {
      const raw = JSON.parse(volatileStorage.getItem(STORE) || "{}");
      return {
        ...defaults,
        ...raw,
        plan: sessionPlan,
        premium: isPaidPlan(sessionPlan),
        events: Array.isArray(raw.events) ? raw.events : []
      };
    } catch {
      return { ...defaults, plan: sessionPlan, premium: isPaidPlan(sessionPlan) };
    }
  }

  function writeState(nextState) {
    try {
      // Never persist the selected plan. It must reset to Free on refresh.
      const { plan, premium, ...persisted } = nextState;
      volatileStorage.setItem(STORE, JSON.stringify(persisted));
      return true;
    } catch {
      return false;
    }
  }

  // The dashboard shows the exact active plan.
  function displayPlan(plan) {
    return normalizePlan(plan);
  }

  let state = readState();

  // A demo plan remains active on reloads in this tab, but not after the browsing session ends.
  state.plan = sessionPlan;
  state.premium = isPaidPlan(sessionPlan);
  sessionPurchaseValue = isPaidPlan(sessionPlan) ? (sessionPlan === "Premium" ? 999 : 49999) : 0;
  state.accountValue = 0;
  state.visits = Number(state.visits || 0) + 1;
  writeState(state);

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__premiumToast);
    window.__premiumToast = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function record(label) {
    state = readState();
    state.events.unshift({ t: new Date().toLocaleTimeString(), a: label });
    state.events = state.events.slice(0, 120);
    writeState(state);
    renderState();
  }

  function syncPlanUI() {
    state.plan = normalizePlan(sessionPlan);
    state.premium = isPaidPlan(sessionPlan);
    const paid = isPaidPlan(sessionPlan);
    const headerUpgrade = $("#headerUpgrade");
    if (headerUpgrade) {
      headerUpgrade.textContent = paid ? (sessionPlan + " · Purchased ✓") : "Get Premium";
      headerUpgrade.classList.toggle("is-active", paid);
      headerUpgrade.setAttribute("aria-label", paid ? (sessionPlan + " purchased in this demo and active until reload") : "Get Premium");
    }
    // No ad network is connected. Plan state only suppresses on-page upgrade marketing.
    const promosMuted = paid || volatileStorage.getItem(PROMO_PREF) === "1";
    const quietMode = volatileStorage.getItem(QUIET_PREF) === "1";
    document.body.classList.toggle("has-paid-plan", paid);
    document.body.classList.toggle("promotions-muted", promosMuted);
    document.body.classList.toggle("quiet-workspace", quietMode);
    $$("[data-action=\"upgrade\"]").forEach(el => { el.hidden = promosMuted; });
    const pricingNav = $('#mainNav a[href="#pricing"]');
    if (pricingNav) pricingNav.hidden = promosMuted;

    $$("[data-plan-status]").forEach(el => {
      const plan = el.dataset.plan || "";
      const current = plan === sessionPlan;
      el.textContent = current ? "Current" : (plan === "Free" ? "Free" : plan);
      el.classList.toggle("is-active", current);
    });

    const premiumButton = $("#planPremium");
    const ultraButton = $("#planUltra");
    const freeButton = $("#planFree");
    if (premiumButton) premiumButton.textContent = sessionPlan === "Premium" ? "✓ Premium · Purchased" : "Premium · ₹999/month";
    if (ultraButton) ultraButton.textContent = sessionPlan === "Ultra Max Pro+" ? "✓ Ultra Max Pro+ · Purchased" : "Ultra Max Pro+ · ₹49,999/month";
    if (freeButton) freeButton.textContent = sessionPlan === "Free" ? "Free · Current" : "Stay Free";
  }

  function renderState() {
    const activePlan = sessionPlan;
    state = readState();
    state.plan = activePlan;
    state.premium = isPaidPlan(activePlan);

    const accountValue = $("#accountValue");
    const premiumStatus = $("#premiumStatus");
    const billingState = $("#billingState");
    const balanceValue = $("#balanceValue");
    const eventCount = $("#eventCount");
    const invoiceCount = $("#invoiceCount");
    const workspaceScore = $("#workspaceScore");
    const scoreBar = $("#scoreBar");
    const scoreNote = $("#scoreNote");
    const activeUsers = $("#activeUsers");
    const seatCount = $("#seatCount");
    const documentCount = $("#documentCount");
    const identity = $("#accountIdentity");
    const notifyDot = $("#notifyDot");

    // Account value is strictly tied to the currently active paid plan.
    // Free always displays ₹0, including after a fresh page load.
    const activeValue = sessionPlan === "Premium" ? 999 : sessionPlan === "Ultra Max Pro+" ? 49999 : 0;
    sessionPurchaseValue = activeValue;
    if (accountValue) accountValue.textContent = "₹" + activeValue.toLocaleString("en-IN");
    const accountTrend = accountValue?.parentElement?.querySelector(".up");
    if (accountTrend) {
      accountTrend.textContent = activeValue > 0 ? "↑ active plan value" : "↑ 0.00%";
      accountTrend.classList.toggle("muted", activeValue === 0);
      accountTrend.classList.toggle("up", activeValue > 0);
    }
    if (premiumStatus) premiumStatus.textContent = displayPlan(sessionPlan);
    if (billingState) billingState.textContent = "Current plan: " + sessionPlan;
    if (balanceValue) balanceValue.textContent = "₹" + activeValue.toLocaleString("en-IN");
    if (eventCount) eventCount.textContent = state.events.length + " events";
    if (invoiceCount) invoiceCount.textContent = Math.max(1, Math.min(12, Math.ceil(state.events.length / 3)));
    if (identity) {
      try {
        const session = JSON.parse(volatileStorage.getItem(SESSION) || "null");
        identity.textContent = session?.name || session?.email || "Workspace Member";
      } catch {
        identity.textContent = "Workspace Member";
      }
    }

    const score = Math.max(91, Math.min(99, 98 - (state.events.length % 7)));
    if (workspaceScore) workspaceScore.textContent = String(score);
    if (scoreBar) scoreBar.style.width = score + "%";
    if (scoreNote) scoreNote.textContent = state.events.length > 25
      ? "Operating normally with historical activity retained"
      : "Operating within expected parameters";
    if (activeUsers) activeUsers.textContent = String(Math.max(1, state.teamSize || 1));
    if (seatCount) seatCount.textContent = String(Math.max(1, state.teamSize || 1));
    if (documentCount) documentCount.textContent = String(24 + Math.min(41, state.events.length));
    if (notifyDot) notifyDot.style.display = state.notificationsRead ? "none" : "";

    const feed = $("#activityFeed");
    if (feed) {
      feed.innerHTML = state.events.slice(0, 5).map((event, index) => {
        const label = typeof event === "string" ? event : (event?.a || "Workspace activity");
        return '<div class="activity-row"><b>' + escapeHtml(label) + '</b><span>' +
          (index === 0 ? "just now" : index + "m ago") + "</span></div>";
      }).join("") || '<div class="activity-row"><b>Workspace initialized</b><span>just now</span></div>';
    }

    const live = $("#liveActivity");
    if (live) {
      live.innerHTML = state.events.slice(0, 5).map(event => {
        const time = typeof event === "string" ? "—" : (event?.t || "—");
        const label = typeof event === "string" ? event : (event?.a || "Workspace activity");
        return '<div class="activity-row"><span>' + escapeHtml(time) + '</span><b>' + escapeHtml(label) + "</b></div>";
      }).join("") || '<div class="activity-row"><span>Now</span><b>Workspace initialized</b></div>';
    }

    const status = $("#srStatus");
    if (status) status.textContent = state.premium ? "Premium is active." : "Free plan is active.";
    syncPlanUI();
  }

  function confetti() {
    const container = $("#confetti");
    if (!container || document.documentElement.classList.contains("reduced-motion")) return;
    container.innerHTML = "";
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement("i");
      piece.className = "piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = (-Math.random() * 15) + "%";
      piece.style.animationDelay = Math.random() * 0.45 + "s";
      container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ""; }, 1800);
  }

  function openModal(title, body, actions = "") {
    const backdrop = $("#modalBackdrop");
    const content = $("#modalContent");
    if (!backdrop || !content) return;
    const renderedActions = Array.isArray(actions)
      ? '<div class="modal-actions">' + actions.map(item =>
          '<button class="' + (item?.primary === false ? "secondary" : "primary") + '" data-modal-action="' +
          escapeHtml(item?.label || "Continue") + '">' + escapeHtml(item?.label || "Continue") + "</button>"
        ).join("") + "</div>"
      : actions;
    content.innerHTML = "<h2>" + title + "</h2><p>" + body + "</p>" + renderedActions;
    if (Array.isArray(actions)) {
      actions.forEach((item, index) => {
        const button = content.querySelectorAll("[data-modal-action]")[index];
        if (button && typeof item?.action === "function") button.addEventListener("click", item.action);
      });
    }
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    const backdrop = $("#modalBackdrop");
    if (!backdrop) return;
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
  }

  function jump(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function choosePlan() {
    selectedPlan = sessionPlan;
    const priceFor = p => p === "Premium" ? 999 : p === "Ultra Max Pro+" ? 49999 : 0;
    const money = n => "₹" + Math.round(n).toLocaleString("en-IN");
    let coupon = false, receiptEmail = "";
    const card = (p,desc,perks) => '<button type="button" class="checkout-plan '+(selectedPlan===p?'is-selected':'')+'" data-pick="'+escapeHtml(p)+'" aria-pressed="'+(selectedPlan===p)+'"><span class="checkout-plan-top"><b>'+escapeHtml(p)+'</b><span class="checkout-radio"></span></span><strong>'+money(priceFor(p))+'<small>'+(priceFor(p)?' / month':' forever')+'</small></strong><span class="checkout-plan-desc">'+desc+'</span><span class="checkout-perks">'+perks+'</span></button>';
    function chooseView(){
      openModal("Your upgrade starts here",'<div class="checkout-shell"><div class="checkout-progress"><span class="is-current"><i>1</i> Choose</span><span><i>2</i> Checkout</span><span><i>3</i> Receipt</span></div><div class="checkout-trust"><span>✦ CURATED FOR YOUR WORKFLOW</span><span>LOCAL DEMO · NO CHARGE</span></div><h3 class="checkout-title">Pick your power level.</h3><p class="checkout-subtitle">A premium purchase experience, without the real-world payment.</p><div class="checkout-plans">'+card("Free","The essentials, no commitment.","✓ Core workspace")+card("Premium","More room to do your best work.","✓ AI tools · Priority support")+card("Ultra Max Pro+","A comically powerful control room.","✓ Advanced controls · Dedicated support")+'</div><div class="checkout-reassurance"><span>⌑</span><div><b>Transparent checkout</b><small>No card details are collected. Nothing is charged.</small></div></div><div class="checkout-sticky-total"><div><small>YOUR SELECTION</small><b>'+escapeHtml(selectedPlan)+'</b></div><div class="checkout-total"><b>'+money(priceFor(selectedPlan))+'</b><small>'+(priceFor(selectedPlan)?"monthly demo price":"no recurring charge")+'</small></div></div><button type="button" class="checkout-continue" id="checkoutContinue">'+(selectedPlan===sessionPlan?'Review current plan':selectedPlan==="Free"?'Continue with Free':'Continue to secure checkout')+' <span>→</span></button><p class="checkout-fineprint">Demo purchase only · No payment processor connected</p></div>',"");
      $("#modalContent").querySelectorAll("[data-pick]").forEach(x=>x.onclick=()=>{selectedPlan=x.dataset.pick;chooseView()});
      $("#checkoutContinue").onclick=()=>{if(selectedPlan===sessionPlan){closeModal();toast(selectedPlan+" is already active.");}else if(selectedPlan==="Free"){finish();}else checkoutView();};
    }
    function checkoutView(){
      const price=priceFor(selectedPlan);
      openModal("Secure checkout",'<div class="checkout-shell"><div class="checkout-progress"><span class="is-done"><i>✓</i> Choose</span><span class="is-current"><i>2</i> Checkout</span><span><i>3</i> Receipt</span></div><div class="checkout-secure"><span class="checkout-lock">♙</span><div><b>You’re in the secure zone</b><small>Simulated checkout. No real payment is taken.</small></div><span class="checkout-lock-label">DEMO</span></div><h3 class="checkout-title">One last tiny detail.</h3><p class="checkout-subtitle">Add a receipt email if you like, apply a demo code, then place your pretend order.</p><label class="checkout-label" for="checkoutEmail">Receipt email <span>optional</span></label><input class="checkout-input" id="checkoutEmail" type="email" placeholder="you@company.com" autocomplete="email"><label class="checkout-label">Payment method</label><div class="checkout-method"><span class="checkout-card-icon">▤</span><span><b>Demo card</b><small>Test ending in 4242 · no card details needed</small></span><span class="checkout-method-check">✓</span></div><label class="checkout-label" for="checkoutCoupon">Promo code <span>try DEMO10</span></label><div class="checkout-coupon"><input class="checkout-input" id="checkoutCoupon" placeholder="Enter a code"><button type="button" id="checkoutApplyCoupon">Apply</button></div><p id="checkoutCouponMessage" class="checkout-coupon-message" aria-live="polite">A little discount-shaped magic, perhaps?</p><div class="checkout-order"><div class="checkout-order-head"><b>Order summary</b><span>ORDER PREVIEW</span></div><div class="checkout-order-line"><span>'+escapeHtml(selectedPlan)+' subscription</span><b>'+money(price)+'</b></div><div class="checkout-order-line"><span>Taxes</span><b>₹0</b></div><div class="checkout-order-line checkout-discount" id="checkoutDiscountRow" style="display:none"><span>Demo discount (10%)</span><b>−'+money(price*.1)+'</b></div><div class="checkout-order-total"><span>Today’s demo total</span><b id="checkoutFinalTotal">'+money(price)+'</b></div><small>Monthly price is illustrative. No real charge.</small></div><button type="button" class="checkout-continue" id="checkoutPlaceOrder">Place demo order <span>↗</span></button><button type="button" class="checkout-back" id="checkoutBack">← Back to plans</button><p class="checkout-fineprint">🔒 Email stays in memory until you reload or close this page.</p></div>',"");
      $("#checkoutApplyCoupon").onclick=()=>{coupon=($("#checkoutCoupon").value||"").trim().toUpperCase()==="DEMO10";$("#checkoutCouponMessage").textContent=coupon?"✓ DEMO10 applied — 10% off your demo total.":"That code didn’t work. Try DEMO10.";$("#checkoutCouponMessage").classList.toggle("is-success",coupon);$("#checkoutDiscountRow").style.display=coupon?"flex":"none";$("#checkoutFinalTotal").textContent=money(price*(coupon?.9:1));};
      $("#checkoutBack").onclick=chooseView;
      $("#checkoutPlaceOrder").onclick=()=>{
        const input=$("#checkoutEmail");receiptEmail=(input.value||"").trim();
        if(receiptEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiptEmail)){input.setCustomValidity("Enter a valid email or leave this blank.");input.reportValidity();input.addEventListener("input",()=>input.setCustomValidity(""),{once:true});return;}
        const button=$("#checkoutPlaceOrder");button.disabled=true;button.innerHTML='<span class="checkout-spinner"></span> Preparing your demo order…';
        const messages=["Reserving your imaginary upgrade…","Polishing the digital paperwork…","Making it feel official…"];let i=0;
        const note=document.createElement("p");note.className="checkout-processing-message";note.setAttribute("role","status");note.textContent=messages[0];button.insertAdjacentElement("afterend",note);
        const tick=()=>{if(++i<messages.length){note.textContent=messages[i];setTimeout(tick,500);}else finish();};setTimeout(tick,500);
      };
    }
    function finish(){
      const previous=sessionPlan, price=priceFor(selectedPlan);
      sessionPlan=selectedPlan;state=readState();state.plan=sessionPlan;state.premium=isPaidPlan(sessionPlan);
      if(isPaidPlan(sessionPlan)) { try { volatileStorage.setItem(PURCHASE, sessionPlan); } catch {} }
      else { try { volatileStorage.removeItem(PURCHASE); } catch {} }
      if(isPaidPlan(sessionPlan)&&previous!==sessionPlan)sessionPurchaseValue+=price;
      writeState(state);record(sessionPlan==="Free"?"Selected Free plan":"Purchased "+sessionPlan+" plan (demo)");
      if(!isPaidPlan(sessionPlan)){closeModal();toast("Free plan is active.");return;}
      const order="PR-"+Math.random().toString(36).slice(2,8).toUpperCase();
      openModal("Order complete ✦",'<div class="checkout-shell checkout-receipt"><div class="checkout-progress"><span class="is-done"><i>✓</i> Choose</span><span class="is-done"><i>✓</i> Checkout</span><span class="is-current"><i>3</i> Receipt</span></div><div class="receipt-confetti" aria-hidden="true">✦ ✧ ✦</div><div class="receipt-stamp">DEMO ORDER · CONFIRMED</div><h3 class="checkout-title">A premium moment.</h3><p class="checkout-subtitle">Your demo plan is active on this browser, and upgrade promotions are now hidden.</p><div class="receipt-ticket"><div><small>ORDER REFERENCE</small><b>'+order+'</b></div><div><small>PLAN ACTIVATED</small><b>'+escapeHtml(sessionPlan)+'</b></div><div><small>DEMO TOTAL</small><b>'+money(price*(coupon?.9:1))+'</b></div>'+(receiptEmail?'<div><small>RECEIPT FOR</small><b>'+escapeHtml(receiptEmail)+'</b></div>':'')+'</div><div class="receipt-notice"><span>✓</span><p><b>No payment was processed.</b><br>This is a front-end demo with no payment gateway.</p></div><button type="button" class="checkout-continue" id="receiptDone">Enter your upgraded workspace <span>→</span></button></div>',"");
      $("#receiptDone").onclick=()=>{closeModal();toast(sessionPlan+" demo plan is active.");jump("top");};confetti();
    }
    chooseView();
  }

  function startWorkspace() {
    state = readState();
    if (!sessionPlan) {
      sessionPlan = "Free";
      state.plan = "Free";
      state.premium = false;
    }
    record("Opened workspace");
    toast("Workspace ready.");
  }

  function signIn() {
    let session = null;
    try { session = JSON.parse(volatileStorage.getItem(SESSION) || "null"); } catch {}

    if (session) {
      openModal(
        "Account session",
        "Signed in as <b>" + escapeHtml(session.email) + "</b>.<br><br>Your in-memory workspace session is active.",
        '<div class="modal-actions"><button class="secondary" id="signOut">Sign out</button><button class="primary" id="openAccount">Open account</button></div>'
      );
      $("#signOut").onclick = () => {
        volatileStorage.removeItem(SESSION);
        closeModal();
        record("Signed out");
        toast("Signed out.");
      };
      $("#openAccount").onclick = () => { closeModal(); account("account"); };
      return;
    }

    openModal(
      "Sign in",
      "Create an in-memory workspace session.",
      '<label style="display:block;margin:10px 0 6px">Name</label>' +
      '<input id="loginName" placeholder="Your name" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit">' +
      '<label style="display:block;margin:10px 0 6px">Work email</label>' +
      '<input id="loginEmail" type="email" placeholder="you@company.com" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit">' +
      '<div class="modal-actions"><button class="primary" id="signIn">Continue</button></div>'
    );

    $("#signIn").onclick = () => {
      const name = $("#loginName").value.trim();
      const email = $("#loginEmail").value.trim();
      if (!email || !email.includes("@")) {
        toast("Enter a valid work email.");
        return;
      }
      volatileStorage.setItem(SESSION, JSON.stringify({
        name: name || email.split("@")[0],
        email,
        signedInAt: new Date().toISOString()
      }));
      closeModal();
      record("Signed in");
      toast("Signed in on this browser.");
    };
  }

  function search() {
    const sections = $$("main section[id]").map(section => ({
      id: section.id,
      text: (section.innerText || "").replace(/\s+/g, " ").trim()
    }));

    openModal(
      "Search Premium",
      "Search sections and workspace controls.",
      '<input id="searchInput" placeholder="Try: security, pricing, billing..." style="width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit">' +
      '<div id="searchResults" style="margin-top:12px"></div>'
    );

    const input = $("#searchInput");
    const results = $("#searchResults");

    const render = () => {
      const query = input.value.trim().toLowerCase();
      const hits = query
        ? sections.filter(item => (item.id + " " + item.text).toLowerCase().includes(query))
        : sections.slice(0, 6);

      results.innerHTML = hits.map(item =>
        '<button class="secondary search-result" data-jump="' + escapeHtml(item.id) +
        '" style="display:block;width:100%;text-align:left;margin:6px 0">' +
        escapeHtml(item.id) + " · " + escapeHtml(item.text.slice(0, 90)) + "</button>"
      ).join("") || "<small>No matching section.</small>";
    };

    input.oninput = render;
    results.onclick = event => {
      const button = event.target.closest("[data-jump]");
      if (!button) return;
      closeModal();
      jump(button.dataset.jump);
      record("Searched workspace");
    };
    render();
  }

  function notifications() {
    openModal(
      "Notifications",
      "<b>Workspace</b> · Everything is running normally.<br><br>" +
      "<b>Billing</b> · Your account details are up to date.<br><br>" +
      "<b>Product</b> · New workspace improvements are available.",
      '<div class="modal-actions"><button class="primary" id="markRead">Mark as read</button></div>'
    );
    $("#markRead").onclick = () => {
      state = readState();
      state.notificationsRead = true;
      writeState(state);
      renderState();
      closeModal();
      toast("Notifications marked as read.");
    };
  }

  function status() {
    openModal(
      "System status",
      "<b>API</b> Operational · <b>Workspace</b> Operational · <b>Billing</b> Operational · <b>AI</b> Operational",
      '<div class="modal-actions"><button class="primary" id="statusDone">Done</button></div>'
    );
    $("#statusDone").onclick = closeModal;
  }

  function demo() {
    openModal(
      "Interactive demo",
      "Choose an area to explore.",
      '<div class="modal-actions">' +
        '<button class="secondary" id="demoFeatures">Features</button>' +
        '<button class="secondary" id="demoBilling">Billing</button>' +
        '<button class="primary" id="demoSecurity">Security</button>' +
      "</div>"
    );
    $("#demoFeatures").onclick = () => { closeModal(); jump("features"); };
    $("#demoBilling").onclick = () => { closeModal(); account("billing"); };
    $("#demoSecurity").onclick = () => { closeModal(); jump("security"); };
  }

  function ai() {
    openModal(
      "Premium AI",
      "Explore the workspace AI experience.",
      '<div class="modal-actions"><button class="primary" id="aiContinue">Continue</button></div>'
    );
    $("#aiContinue").onclick = () => {
      closeModal();
      record("Opened Premium AI");
      toast("Premium AI workspace ready.");
    };
  }

  function speed() {
    const latency = Math.floor(Math.random() * 120) + 80;
    openModal(
      "Performance",
      "Workspace response time: <b>" + latency + " ms</b>.<br><br>Performance monitoring is active."
    );
    record("Tested workspace performance");
  }

  function security() {
    record("Ran security review");
    openModal(
      "Security review",
      "Security checks completed.<br><br><b>Threats detected:</b> 0<br><b>Policy checks:</b> 14<br><b>Workspace protection:</b> Active"
    );
  }

  function enterprise() {
    openModal(
      "Enterprise",
      "Tell us about your organization and a sales representative can follow up.",
      '<input id="enterpriseEmail" type="email" placeholder="work@company.com" style="width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit">' +
      '<div class="modal-actions"><button class="primary" id="enterpriseSend">Contact sales</button></div>'
    );
    $("#enterpriseSend").onclick = () => {
      const email = $("#enterpriseEmail").value.trim();
      if (!email.includes("@")) { toast("Enter a valid work email."); return; }
      closeModal();
      record("Requested enterprise contact");
      toast("Enterprise request saved on this browser.");
    };
  }

  function usage() {
    const used = Math.min(100, 42 + state.events.length);
    openModal("Monthly usage", "Usage this cycle: <b>" + used + "%</b> of included workspace activity.<br><br>Usage resets at the start of the next billing cycle.");
    record("Reviewed monthly usage");
  }

  function invite() {
    openModal(
      "Invite a teammate",
      "Add a teammate to your workspace.",
      '<input id="inviteEmail" type="email" placeholder="teammate@company.com" style="width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit">' +
      '<div class="modal-actions"><button class="primary" id="inviteSend">Send invitation</button></div>'
    );
    $("#inviteSend").onclick = () => {
      const email = $("#inviteEmail").value.trim();
      if (!email.includes("@")) { toast("Enter a valid email."); return; }
      closeModal();
      record("Invited a teammate");
      toast("Invitation queued.");
    };
  }

  function releaseNotes() {
    openModal("Release notes · v4.18", "Faster navigation, clearer billing controls, improved account activity, and refinements across the workspace.");
  }

  function account(kind) {
    state = readState();

    if (kind === "account") {
      openModal(
        "Account",
        "Workspace Member<br><br><b>Status:</b> Active<br><b>Verification:</b> Complete<br><b>Access:</b> Standard"
      );
      record("Viewed account");
      return;
    }

    if (kind === "billing") {
      openModal(
        "Billing",
        "Current plan: <b>" + escapeHtml(state.plan) + "</b><br><br><b>Billing status:</b> Current<br><b>Invoice history:</b> Up to date",
        '<div class="modal-actions"><button class="primary" id="billingDone">Done</button></div>'
      );
      $("#billingDone").onclick = closeModal;
      record("Reviewed billing");
      return;
    }

    const history = state.events.slice(0, 12).map(event => {
      const time = typeof event === "string" ? "—" : (event?.t || "—");
      const label = typeof event === "string" ? event : (event?.a || "Workspace activity");
      return '<div class="admin-row"><span>' + escapeHtml(time) + "</span><b>" + escapeHtml(label) + "</b></div>";
    }).join("");

    const body = $("#adminBody");
    if (body) body.innerHTML = history || '<div class="admin-row"><span>No activity</span><b>—</b></div>';
    $("#adminPanel")?.classList.add("open");
    record("Viewed account history");
  }

  function review(type) {
    const titles = {
      access: "Access review",
      risk: "Risk assessment",
      reconcile: "Workspace reconciliation"
    };
    const labels = {
      access: "Reviewed access",
      risk: "Ran risk assessment",
      reconcile: "Reconciled workspace records"
    };
    openModal(titles[type] || "Workspace review", "The requested review is complete.<br><br><b>Status:</b> Current");
    record(labels[type] || "Completed workspace review");
  }

  function team() {
    state = readState();
    openModal(
      "Team",
      "<b>" + Math.max(1, state.teamSize || 1) + " active seat" + (state.teamSize === 1 ? "" : "s") + "</b><br><br>Seat allocation is managed at the workspace level.",
      '<div class="modal-actions"><button class="primary" id="teamDone">Done</button></div>'
    );
    $("#teamDone").onclick = closeModal;
    record("Reviewed team");
  }

  function documents() {
    state = readState();
    openModal("Records", (24 + Math.min(41, state.events.length)) + " workspace records are currently indexed.<br><br><b>Index:</b> Current<br><b>Integrity:</b> Verified");
    record("Viewed workspace records");
  }

  function preferences() {
    const dark = document.body.dataset.theme === "dark";
    const reduced = volatileStorage.getItem(REDUCED) === "1";
    const quiet = volatileStorage.getItem(QUIET_PREF) === "1";
    const paid = isPaidPlan(sessionPlan);
    const promosMuted = paid || volatileStorage.getItem(PROMO_PREF) === "1";
    openModal(
      "Experience controls",
      '<p class="pref-intro">Tune the workspace to your taste. Your choices stay in this browser.</p>' +
      '<div class="pref-row"><span><b>Appearance</b><small>Choose a comfortable theme</small></span><button class="secondary" id="prefTheme">' + (dark ? "Light" : "Dark") + " appearance</button></div>" +
      '<div class="pref-row"><span><b>Reduced motion</b><small>Limit decorative animation</small></span><button class="secondary" id="prefMotion">' + (reduced ? "Disable" : "Enable") + " reduced motion</button></div>" +
      '<div class="pref-row"><span><b>Quiet workspace</b><small>Hide live ticker and announcement bar</small></span><button class="secondary" id="prefQuiet" aria-pressed="' + quiet + '">' + (quiet ? "Turn off" : "Turn on") + '</button></div>' +
      '<div class="pref-row"><span><b>Upgrade promotions</b><small>' + (paid ? "Disabled because a paid demo plan is active" : "Hide pricing and upgrade marketing") + '</small></span><button class="secondary" id="prefPromos" aria-pressed="' + promosMuted + '"' + (paid ? " disabled" : "") + '>' + (promosMuted ? "Hidden" : "Visible") + '</button></div>' +
      '<p class="pref-footnote">' + (paid ? "Your " + escapeHtml(sessionPlan) + " demo plan stays promotion-free. Reset workspace clears the in-memory purchase state." : "No ad network is connected. This controls on-page upgrade marketing only.") + '</p>' +
      '<div class="modal-actions"><button class="primary" id="prefDone">Done</button></div>'
    );
    $("#prefTheme").onclick = () => { toggleTheme(); preferences(); };
    $("#prefMotion").onclick = () => {
      const next = volatileStorage.getItem(REDUCED) !== "1";
      volatileStorage.setItem(REDUCED, next ? "1" : "0");
      document.documentElement.classList.toggle("reduced-motion", next);
      preferences();
    };
    $("#prefQuiet").onclick = () => {
      const next = volatileStorage.getItem(QUIET_PREF) !== "1";
      volatileStorage.setItem(QUIET_PREF, next ? "1" : "0");
      syncPlanUI();
      preferences();
    };
    $("#prefPromos").onclick = () => {
      if (paid) return;
      const next = volatileStorage.getItem(PROMO_PREF) !== "1";
      volatileStorage.setItem(PROMO_PREF, next ? "1" : "0");
      syncPlanUI();
      preferences();
    };
    $("#prefDone").onclick = closeModal;
  }

  function applyTheme(theme, announce = false) {
    const next = theme === "dark" ? "dark" : "light";
    document.body.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    const button = document.getElementById("headerTheme");
    if (button) {
      const dark = next === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      button.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
      const icon = button.querySelector(".theme-icon");
      if (icon) icon.textContent = dark ? "☀" : "◐";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#0b0d11" : "#ffffff");
  }

  function toggleTheme() {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    state = readState();
    state.theme = next;
    writeState(state);
    toast(next === "dark" ? "Dark mode enabled." : "Light mode enabled.");
  }

  function install() {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    if (standalone) {
      toast("Premium is already installed.");
      return;
    }
    if (window.__deferredPrompt) {
      window.__deferredPrompt.prompt();
      window.__deferredPrompt.userChoice.finally(() => {
        window.__deferredPrompt = null;
        updatePwaInstallButton();
      });
      return;
    }
    openModal(
      "Install Premium",
      "Your browser has not exposed the install prompt yet. Use the browser menu and choose <b>Install app</b> or <b>Add to Home Screen</b> when available."
    );
  }

  function support(type) {
    const map = {
      supportBilling: "Billing & subscription",
      supportAccount: "Account & access",
      supportTechnical: "Technical issue"
    };
    if (type === "support") {
      $("#supportPanel")?.classList.toggle("open");
      return;
    }
    openModal(
      map[type] || "Support",
      "A support request can be opened for this category.",
      '<div class="modal-actions"><button class="primary" id="supportOpen">Open support request</button></div>'
    );
    $("#supportOpen").onclick = () => {
      closeModal();
      record("Contacted Premium Support");
      toast("Support request saved on this browser.");
    };
  }

  function shortcuts() {
    openModal(
      "Keyboard shortcuts",
      '<div class="v11-shortcuts"><span>Command palette</span><kbd>Ctrl K</kbd><span>Search</span><kbd>/</kbd><span>Close dialogs</span><kbd>Esc</kbd><span>Export workspace</span><kbd>Ctrl Shift E</kbd><span>Shortcuts</span><kbd>Ctrl Shift H</kbd></div>'
    );
  }

  function exportWorkspace() {
    const payload = {
      exportedAt: new Date().toISOString(),
      plan: sessionPlan,
      accountValue: sessionPurchaseValue,
      events: state.events
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "premium-workspace.json";
    link.click();
    URL.revokeObjectURL(url);
    record("Exported workspace");
    toast("Workspace export created.");
  }

  function resetWorkspace() {
    openModal(
      "Reset workspace",
      "Reset in-memory workspace data and return to the Free plan?",
      '<div class="modal-actions"><button class="secondary" id="resetCancel">Cancel</button><button class="primary" id="resetConfirm">Reset workspace</button></div>'
    );
    $("#resetCancel").onclick = closeModal;
    $("#resetConfirm").onclick = () => {
      volatileStorage.removeItem(STORE);
      volatileStorage.removeItem(SESSION);
      volatileStorage.removeItem(PURCHASE);
      volatileStorage.removeItem(PROMO_PREF);
      volatileStorage.removeItem(QUIET_PREF);
      sessionPlan = "Free";
      selectedPlan = "Free";
      sessionPurchaseValue = 0;
      state = { ...defaults, plan: "Free", premium: false };
      writeState(state);
      renderState();
      closeModal();
      toast("Workspace reset.");
    };
  }

  const commands = [
    ["Open billing", "billing"],
    ["View account", "account"],
    ["View history", "history"],
    ["Review security", "security"],
    ["Open preferences", "preferences"],
    ["Install app", "install"],
    ["Export workspace", "export"],
    ["Reset workspace", "reset"],
    ["Keyboard shortcuts", "shortcuts"]
  ];

  function palette() {
    const panel = $("#commandPalette");
    const input = $("#commandInput");
    const list = $("#commandList");
    if (!panel || !input || !list) return;

    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    input.focus();

    const render = () => {
      const q = input.value.trim().toLowerCase();
      const filtered = commands.filter(([label]) => label.toLowerCase().includes(q));
      list.innerHTML = filtered.map(([label, action]) =>
        '<button class="palette-item" data-command="' + escapeHtml(action) + '">' + escapeHtml(label) + "</button>"
      ).join("") || "<small>No commands found.</small>";
    };

    input.oninput = render;
    list.onclick = event => {
      const button = event.target.closest("[data-command]");
      if (!button) return;
      closePalette();
      route(button.dataset.command);
    };
    render();
  }

  function closePalette() {
    const panel = $("#commandPalette");
    if (!panel) return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }

  function route(type) {
    switch (type) {
      case "palette": return palette();
      case "start": return startWorkspace();
      case "upgrade":
      case "free": return choosePlan();
      case "login": return signIn();
      case "search": return search();
      case "notifications": return notifications();
      case "theme": return toggleTheme();
      case "mobileMenu": {
        const nav = $("#mainNav");
        const button = $("#mobileMenu");
        const open = nav?.classList.toggle("open");
        button?.setAttribute("aria-expanded", String(Boolean(open)));
        return;
      }
      case "demo": return demo();
      case "status": return status();
      case "ai": return ai();
      case "speed": return speed();
      case "security":
      case "audit": return security();
      case "enterprise": return enterprise();
      case "usage": return usage();
      case "invite": return invite();
      case "release": return releaseNotes();
      case "account":
      case "billing":
      case "history": return account(type);
      case "access":
      case "risk":
      case "reconcile": return review(type);
      case "team": return team();
      case "documents": return documents();
      case "preferences": return preferences();
      case "install": return install();
      case "support":
      case "supportBilling":
      case "supportAccount":
      case "supportTechnical": return support(type);
      case "closeAdmin": $("#adminPanel")?.classList.remove("open"); return;
      case "export": return exportWorkspace();
      case "reset": return resetWorkspace();
      case "shortcuts": return shortcuts();
      case "applyUpdate":
        return navigator.serviceWorker?.getRegistration().then(reg => {
          if (reg?.waiting) reg.waiting.postMessage("SKIP_WAITING");
          else location.reload();
        });
      default: return;
    }
  }

  window.__premiumRoute = route;
  window.PremiumV11 = {
    exportWorkspace,
    resetWorkspace,
    shortcuts
  };

  // V20 click engine: direct listeners + delegated fallback.
  // Direct listeners are intentionally attached to every control so a browser
  // or nested SVG/text target cannot prevent an action from firing.
  
// V22 — high-feedback interactions for primary header controls.
function premiumActionFeedback(kind) {
  const states = {
    search: ["SEARCH INDEX", "Indexing workspace…", "18,402 records checked"],
    notifications: ["NOTIFICATIONS", "Synchronizing activity…", "3 new events detected"],
    login: ["SECURE SIGN-IN", "Opening secure session…", "Session handshake complete"],
    theme: ["APPEARANCE", "Recalibrating interface…", "Display preferences applied"],
    upgrade: ["PREMIUM ACCESS", "Preparing upgrade flow…", "Plan comparison unlocked"],
    mobileMenu: ["NAVIGATION", "Rebuilding workspace navigation…", "Navigation ready"]
  };
  const s = states[kind];
  if (!s) return;
  const title = s[0], step = s[1], done = s[2];
  openModal(title, `
    <div class="receipt">
      <b>${title}</b><br>
      STATUS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PROCESSING<br>
      REQUEST&nbsp;&nbsp;&nbsp;LOCAL WORKSPACE<br>
      <span id="premiumProgressText">${step}</span><br>
      NODE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PREM-${Math.floor(1000 + Math.random()*8999)}
    </div>
    <div class="chaos">System response: ${step} <span aria-hidden="true">▰▰▰</span></div>
  `, [{
    label: "Continue",
    action: () => {
      openModal(title, `
        <div class="receipt">
          <b>✓ ${done}</b><br>
          REQUEST ID&nbsp;PRM-${Date.now().toString().slice(-8)}<br>
          LATENCY&nbsp;&nbsp;&nbsp;&nbsp;0.${Math.floor(100+Math.random()*899)}s<br>
          STATE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY
        </div>
        <div class="chaos">Workspace services are responding normally. Your request has been queued locally.</div>
      `);
    }
  }]);
}

function bindActions() {
    document.querySelectorAll("[data-action]").forEach(button => {
      if (button.dataset.boundPremium === "1") return;
      button.dataset.boundPremium = "1";
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        route(button.getAttribute("data-action"));
      });
      if (button.tagName === "BUTTON") {
        button.type = "button";
      }
    });
  }

  bindActions();

  // Wire legacy/header controls that predate data-action attributes.
  const legacyActions = {
    headerSearch: "search",
    headerNotifications: "notifications",
    headerLogin: "login",
    headerTheme: "theme",
    headerUpgrade: "upgrade",
    mobileMenu: "mobileMenu"
  };
  Object.entries(legacyActions).forEach(([id, action]) => {
    const element = document.getElementById(id);
    if (!element || element.dataset.boundPremium === "1") return;
    element.dataset.boundPremium = "1";
    element.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      route(action);
    });
  });

  document.addEventListener("click", event => {
    const element = event.target instanceof Element ? event.target : null;
    const target = element?.closest("[data-action]");
    if (!target || target.dataset.boundPremium === "1") return;
    event.preventDefault();
    route(target.getAttribute("data-action"));
  }, true);

  $("#modalClose")?.addEventListener("click", closeModal);
  $("#modalBackdrop")?.addEventListener("click", event => {
    if (event.target === event.currentTarget) closeModal();
  });
  $("#commandPalette")?.addEventListener("click", event => {
    if (event.target === event.currentTarget) closePalette();
  });
  $("#announcementClose")?.addEventListener("click", () => {
    $(".announcement")?.style.setProperty("display", "none");
    toast("Announcement hidden.");
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      closePalette();
      $("#mainNav")?.classList.remove("open");
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      palette();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "e") {
      event.preventDefault();
      exportWorkspace();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "h") {
      event.preventDefault();
      shortcuts();
      return;
    }

    if (event.key === "/" && !/input|textarea|select/i.test(document.activeElement?.tagName || "")) {
      event.preventDefault();
      search();
    }
  });

  function updatePwaInstallButton() {
    const button = $("#pwaInstallButton");
    if (!button) return;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const ready = Boolean(window.__deferredPrompt);
    button.hidden = standalone || !ready;
    button.classList.toggle("ready", ready);
  }

  window.addEventListener("beforeinstallprompt", event => {
    // Let the browser handle its native install banner. We no longer suppress
    // the event, which removes the "Banner not shown" console warning.
    window.__deferredPrompt = event;
    updatePwaInstallButton();
  });

  window.addEventListener("DOMContentLoaded", updatePwaInstallButton);
  window.matchMedia("(display-mode: standalone)").addEventListener?.("change", updatePwaInstallButton);

  window.addEventListener("appinstalled", () => {
    window.__deferredPrompt = null;
    updatePwaInstallButton();
  });

  window.addEventListener("online", () => $("#offlineBar")?.classList.remove("show"));
  window.addEventListener("offline", () => $("#offlineBar")?.classList.add("show"));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (window.__premiumReloading) return;
      window.__premiumReloading = true;
      window.location.reload();
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js?v=53", { updateViaCache: "none" }).catch(() => {});
    });
  }

  // V30 live command rail: small, useful motion without distracting from the workspace.
  (() => {
    const clock = document.getElementById("heroClock");
    const latency = document.getElementById("heroLatency");
    const ticker = document.getElementById("tickerMessage");
    const messages = [
      "All systems responding normally",
      "Workspace index synchronized",
      "Security controls verified",
      "Automation queue operating normally",
      "Account activity synchronized"
    ];
    let tick = 0;
    const paint = () => {
      const now = new Date();
      if (clock) clock.textContent = now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"});
      if (latency) latency.textContent = (21 + Math.floor(Math.random()*11)) + " ms";
      if (ticker) ticker.textContent = messages[tick++ % messages.length];
    };
    paint();
    setInterval(paint, 5000);
  })();

  const savedTheme = readState().theme;
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  document.documentElement.classList.toggle("reduced-motion", volatileStorage.getItem(REDUCED) === "1");

  renderState();

  const checked = $("#lastChecked");
  if (checked) {
    setInterval(() => {
      checked.textContent = "just now";
    }, 4000);
  }
})();
