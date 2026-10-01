const KEY="premium-workspace-v1";const defaultState={visits:0,actions:0,premium:false,events:[],accountValue:0};let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaultState;state.visits++;save();
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];function save(){localStorage.setItem(KEY,JSON.stringify(state))}
const events=[
["SUBSCRIPTION UPDATED","Amount charged: ₹999.<br>Product purchased: <b>Unknown</b>.<div class='chaos'>Your billing profile is being synchronized across services.</div>"],
["BILLING REVIEW","Reason: <b>The payment provider requested another verification step.</b><div class='chaos'>Please try again using a more financially motivated bank account.</div>"],
["SUBSCRIPTION UPDATED","You have been charged <b>₹0</b>.<br>Your service adjustment is ₹17,492.<div class='chaos'>Emotional fees are non-refundable because feelings are complicated.</div>"],
["PROCESSING","Estimated completion: <b>the next billing cycle</b>.<div class='chaos'>Our calendar has been escalated to management.</div>"],
["PREMIUM POTATO™","You have unlocked advanced analytics, expanded storage and intelligent assistance.<div class='chaos'>Your workspace package has been queued for provisioning.</div>"],
["PREMIUM CHAIR™","You can now work with improved ergonomics.<div class='chaos'>Ergonomic confidence has been enabled.</div>"],
["PREMIUM AIR™","You've unlocked additional capacity.<div class='chaos'>Additional capacity is available on Enterprise.</div>"],
["CORPORATE UPDATE","Your account role has changed.<div class='chaos'>Contact your administrator to review permissions.</div>"],
["CONGRATULATIONS","You've been promoted to <b>Senior Vice President of Premium Purchasing</b>.<br>Salary: ₹0<br>Responsibilities: Everything<div class='chaos'>Resignation is a Premium feature.</div>"],
["SYSTEM NOTICE","This button wasn't supposed to work.<div class='chaos'>Please pretend you didn't see this.</div>"],
["AI STATUS","I asked another AI. It asked another AI. That AI asked ChatGPT. Nobody knows.<div class='chaos'>The AI has resigned.</div>"],
["SUBSCRIPTION UPDATED","Order #847291847291847291<br>Delivery: Not Applicable<br>Refund: Also Not Applicable<br>Cancellation: Currently under review<div class='chaos'>Thank you for your cooperation. Please close this window. This window will not close.</div>"],
["FINANCIAL UPDATE","Your account balance: ₹0<br>Your subscription: ₹9,99,999/month<br>Your subscription status: Active<br>Your payment status: Successful<div class='chaos'>Your account status: <b>Pending review</b> Please contact your account administrator.</div>"],
["PREMIUM ENLIGHTENMENT","You have unlocked the ability to understand Premium.<div class='chaos'>Unfortunately, understanding Premium has been discontinued.</div>"]
];
const activityPool=["Opened a workspace feature","Reviewed billing","Used AI assistance","Updated account settings","Optimized workspace","Viewed product details","Updated account role","Updated subscription","Viewed enterprise options"];
function addActivity(t){state.events.unshift(t);state.events=state.events.slice(0,4);save();renderActivity()}function renderActivity(){const f=$("#activityFeed");f.innerHTML=state.events.map((e,i)=>`<div class="activity-row"><b>${e}</b><span>${i===0?"just now":i+"m ago"}</span></div>`).join("")||"<div class='activity-row'><b>Account created</b><span>just now</span></div>"}renderActivity();
$("#accountValue").textContent="₹"+(state.accountValue||0).toLocaleString("en-IN");$("#premiumStatus").textContent=state.premium?"Premium Active":"Free Preview";$("#happiness").textContent=(98+Math.random()*1.9).toFixed(1)+"%";
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2800)}
function confetti(){const c=$("#confetti");c.innerHTML="";for(let i=0;i<70;i++){const p=document.createElement("i");p.className="piece";p.style.left=Math.random()*100+"%";p.style.top=(-Math.random()*20)+"%";p.style.background=["#5b5bf7","#17a673","#111318","#ffbd2e","#ff6158"][Math.floor(Math.random()*5)];p.style.animationDelay=Math.random()*.5+"s";c.appendChild(p)}setTimeout(()=>c.innerHTML="",1800)}
function randomEvent(){return events[Math.floor(Math.random()*events.length)]}
function openModal(title,body,actions=""){const m=$("#modalBackdrop");$("#modalContent").innerHTML=`<h2>${title}</h2><p>${body}</p>${actions}`;m.classList.add("open");m.setAttribute("aria-hidden","false")}
function closeModal(){$("#modalBackdrop").classList.remove("open");$("#modalBackdrop").setAttribute("aria-hidden","true")}
function upgrade(){state.actions++;addActivity(activityPool[Math.floor(Math.random()*activityPool.length)]);const [t,b]=randomEvent();if(Math.random()<.35){state.premium=true;state.accountValue+=999;save();$("#premiumStatus").textContent="Premium Active";confetti()}openModal(t,b,`<div class="modal-actions"><button class="secondary" id="modalAgain">Try Again</button><button class="primary" id="modalAccept">${state.premium?"Continue":"Upgrade anyway"} →</button></div>`);$("#modalAgain").onclick=()=>{closeModal();setTimeout(upgrade,180)};$("#modalAccept").onclick=()=>{closeModal();toast(["Congratulations. Your mistake has been processed.","Welcome to Premium. Your subscription details are available in Billing.","Your request has been routed to the appropriate team."][Math.floor(Math.random()*3)]);if(Math.random()<.3)setTimeout(()=>openModal("WAIT.","Why did you click that?<div class='chaos'>This interaction has been forwarded to the Board.</div>","<div class='modal-actions'><button class='primary' id='board'>Acknowledge</button></div>"),700);$("#board")?.addEventListener("click",closeModal)}}
function action(type){if(type==="upgrade"||type==="start"){upgrade();return}if(type==="login"){openModal("Sign in","Enter your credentials to continue. <div class='chaos'>Use your work email and password to continue.</div>","<div class='modal-actions'><button class='primary' id='mystery'>Continue</button></div>");$("#mystery").onclick=()=>{closeModal();toast("Authentication successful. Your session is ready.")};return}if(type==="demo"){openModal("Premium Demo","Your personalized demo is being prepared.","<div class='modal-actions'><button class='primary' id='wait'>Wait patiently</button></div>");$("#wait").onclick=()=>{closeModal();toast("Demo scheduled for your next available session.")};return}if(type==="ai"){openModal("PremiumGPT™","Ask anything. We may answer, upgrade you, or ask another AI.<div class='chaos'>Current model: Premium Intelligence v4.7</div>","<div class='modal-actions'><button class='primary' id='ask'>Ask a question</button></div>");$("#ask").onclick=()=>{closeModal();setTimeout(()=>openModal("PremiumGPT™","That's an excellent question.<br><br><b>I need a little more context to answer that.</b><div class='chaos'>Advanced responses are available with Premium Intelligence.</div>","<div class='modal-actions'><button class='primary' id='aiup'>Upgrade →</button></div>"),350)};$("#aiup")?.addEventListener("click",()=>{closeModal();upgrade()});return}if(type==="speed"){const n=Math.floor(Math.random()*900+100);openModal("Quantum Performance",`Your workspace response time was ${n} ms.<div class='chaos'>Performance monitoring has recorded an excellent result.</div>`);addActivity("Tested quantum performance");return}if(type==="security"||type==="audit"){addActivity("Ran enterprise security audit");openModal("Security Audit","Security score: <b>100/100</b><br>Threats detected: 0<br>Policy checks completed: 14<div class='chaos'>The security operations team has been notified.</div>");return}if(type==="enterprise"){openModal("Enterprise Sales","Our sales team has been notified.<div class='chaos'>Expected response: <b>within 1 business day.</b></div>");addActivity("Viewed enterprise options");return}if(type==="free"){const choices=["Interesting choice.","Your current plan remains active.","Your accountant is proud.","We will remember this.","Your current plan has been saved."];toast(choices[Math.floor(Math.random()*choices.length)]);addActivity("Chose Free");return}}
$$("[data-action]").forEach(b=>b.addEventListener("click",()=>action(b.dataset.action)));$("#modalClose").onclick=closeModal;$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});$("#announcementClose").onclick=()=>{$(".announcement").style.display="none";toast("Announcement hidden. Premium visibility remains enabled.")};
setInterval(()=>{$("#lastChecked").textContent=["just now","a few seconds ago","2 milliseconds ago","before you arrived"][Math.floor(Math.random()*4)]},4000);
if(state.visits>1&&Math.random()<.55)setTimeout(()=>toast(["Welcome back. We noticed.","Your Premium journey continues.","We remember your financial decisions.","You returned. Interesting."][Math.floor(Math.random()*4)]),1800);
window.addEventListener("beforeunload",()=>{if(Math.random()<.18)localStorage.setItem(KEY,JSON.stringify({...state,events:[...state.events,"Updated account settings"]}))});
function showStatus(){openModal("System status","All core services are operational.<br><br><b>API</b> Operational · <b>Workspace</b> Operational · <b>Billing</b> Operational · <b>AI</b> Operational<div class="chaos">Incident history: no incidents affecting your workspace.</div>","<div class="modal-actions"><button class="primary" id="statusClose">Done</button></div>");$("#statusClose").onclick=closeModal}
function showSearch(){openModal("Search Premium","Find settings, billing records, workspace activity, or product documentation.","<input id="searchInput" placeholder="Search your workspace..." style="width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit><div class="modal-actions"><button class="primary" id="searchGo">Search</button></div>");$("#searchGo").onclick=()=>{const q=$("#searchInput").value.trim();closeModal();toast(q?"Search completed for “"+q+"”.":"Enter a search term to continue.");addActivity("Searched workspace")}}
function showNotifications(){openModal("Notifications","<b>Workspace</b> · Everything is running normally.<br><br><b>Billing</b> · Your account details are up to date.<br><br><b>Product</b> · New workspace improvements are available.","<div class="modal-actions"><button class="primary" id="notifyDone">Mark as read</button></div>");$("#notifyDone").onclick=()=>{closeModal();toast("Notifications marked as read.")}}
function showUsage(){openModal("Monthly usage","6,842 actions used this cycle.<br><br><b>68%</b> of included usage consumed.<div class="chaos">Usage resets automatically at the start of your next billing cycle.</div>");addActivity("Reviewed monthly usage")}
function showInvite(){openModal("Invite a teammate","Add a teammate to complete your workspace setup.","<input placeholder="teammate@company.com" style="width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit><div class="modal-actions"><button class="primary" id="inviteSend">Send invitation</button></div>");$("#inviteSend").onclick=()=>{closeModal();toast("Invitation queued for delivery.");addActivity("Invited a teammate")}}
function showRelease(){openModal("Release notes · v4.18","Faster navigation, clearer billing controls, improved account activity, and refinements across the workspace.","<div class="modal-actions"><button class="primary" id="releaseDone">Done</button></div>");$("#releaseDone").onclick=closeModal}
function support(type){const map={supportBilling:"Billing & subscription",supportAccount:"Account & access",supportTechnical:"Technical issue"};if(type==="support"){$("#supportPanel").classList.toggle("open");return}$("#supportPanel").classList.remove("open");openModal(map[type],"A support request can be opened for this category.","<div class="modal-actions"><button class="primary" id="supportOpen">Open support request</button></div>");$("#supportOpen").onclick=()=>{closeModal();toast("Support request created. Reference #"+Math.floor(100000+Math.random()*899999));addActivity("Contacted Premium Support")}}
$$("[data-action]").forEach(b=>{b.addEventListener("click",()=>{const t=b.dataset.action;if(t==="status")showStatus();else if(t==="search")showSearch();else if(t==="notifications")showNotifications();else if(t==="usage")showUsage();else if(t==="invite")showInvite();else if(t==="release")showRelease();else if(t.startsWith("support"))support(t);})});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();showSearch()}if(e.key==="Escape")closeModal()});
(function(){const KEY="premium-workspace-v1";function state(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}function save(s){localStorage.setItem(KEY,JSON.stringify(s))}function ensure(){const s=state();s.events=s.events||[];s.visits=(s.visits||0)+1;s.events.push({t:new Date().toLocaleTimeString(),a:"Workspace viewed"});if(s.events.length>120)s.events=s.events.slice(-120);save(s);return s}const s=ensure();const ec=document.getElementById("eventCount");if(ec)ec.textContent=s.events.length+" events";const bs=document.getElementById("billingState");if(bs&&s.premium)bs.textContent="Current plan: Premium";const id=document.getElementById("accountIdentity");if(id&&s.role)id.textContent=s.role;})();
function accountOps(kind){const s=JSON.parse(localStorage.getItem("premium-workspace-v1")||"{}");if(kind==="account"){openModal("Account","Workspace Member<br><br><b>Status:</b> Active<br><b>Verification:</b> Complete<br><b>Access:</b> Standard");addActivity("Viewed account");}else if(kind==="billing"){openModal("Billing","Current plan: "+(s.premium?"Premium":"Free")+"<br><br><b>Payment method:</b> Available<br><b>Billing status:</b> Current<br><b>Invoice history:</b> Up to date","<div class="modal-actions"><button class="primary" id="billingAction">Review billing</button></div>");document.getElementById("billingAction").onclick=()=>{closeModal();toast("Billing review completed.");addActivity("Reviewed billing");}}else{const body=document.getElementById("adminBody");body.innerHTML=(s.events||[]).slice(-10).reverse().map(e=>"<div class="admin-row"><span>"+e.t+"</span><b>"+e.a+"</b></div>").join("")||"<div class="admin-row"><span>No activity</span><b>—</b></div>";document.getElementById("adminPanel").classList.add("open");}}
$$("[data-action]").forEach(b=>{b.addEventListener("click",()=>{const t=b.dataset.action;if(t==="account"||t==="billing"||t==="history")accountOps(t);if(t==="closeAdmin")document.getElementById("adminPanel").classList.remove("open");})});
const originalUpgrade=window.upgrade;if(typeof originalUpgrade==="function"){window.upgrade=function(){originalUpgrade();}}
(function(){const KEY="premium-workspace-v1";let s={};try{s=JSON.parse(localStorage.getItem(KEY)||"{}")}catch{};const events=s.events||[];const live=document.getElementById("liveActivity");if(live){live.innerHTML=events.slice(-5).reverse().map(e=>"<div class="activity-row"><span>"+e.t+"</span><b>"+e.a+"</b></div>").join("")||"<div class="activity-row"><span>Now</span><b>Workspace initialized</b></div>"}const inv=document.getElementById("invoiceCount");if(inv)inv.textContent=Math.max(1,Math.min(12,Math.floor(events.length/3)));const bal=document.getElementById("balanceValue");if(bal)bal.textContent=s.accountValue!=null?"₹"+Number(s.accountValue).toLocaleString("en-IN"):"₹0";})();
(function(){const K="premium-workspace-v1";function gs(){try{return JSON.parse(localStorage.getItem(K)||"{}")}catch{return {}}}function ps(s){localStorage.setItem(K,JSON.stringify(s))}function op(type){const s=gs();s.events=s.events||[];let msg="";if(type==="access"){msg=s.premium?"Access verified.":"Access verified.";openModal("Access review",msg+"<br><br><b>Session:</b> Active<br><b>Policy:</b> Standard workspace controls");addActivity("Reviewed access");}else if(type==="risk"){const n=(s.visits||1)%5===0;msg=n?"Assessment complete. One item requires follow-up.":"Assessment complete. No immediate action required.";openModal("Risk assessment",msg);addActivity("Ran risk assessment");}else{msg="Workspace records have been reconciled.";if((s.events||[]).length>18){msg="Workspace records have been reconciled. One historical record was retained for audit purposes."}openModal("Reconciliation",msg);addActivity("Reconciled workspace records")}ps(s)}$$("[data-action]").forEach(b=>{if(["access","risk","reconcile"].includes(b.dataset.action))b.addEventListener("click",()=>op(b.dataset.action))})})();
(function(){const K="premium-workspace-v1";function get(){try{return JSON.parse(localStorage.getItem(K)||"{}")}catch{return {}}}function put(s){localStorage.setItem(K,JSON.stringify(s))}function record(label){const s=get();s.events=s.events||[];s.events.push({t:new Date().toLocaleTimeString(),a:label});if(s.events.length>120)s.events=s.events.slice(-120);put(s)}function team(){const s=get();const base=s.teamSize||1;const seats=Math.max(base,1);openModal("Team","<b>"+seats+" active seat"+(seats===1?"":"s")+"</b><br><br>Access is managed at the workspace level.<br><br><small>Seat allocation is synchronized automatically.</small>","<div class=\"modal-actions\"><button class=\"primary\" id=\"teamAction\">Review allocation</button></div>");document.getElementById("teamAction").onclick=()=>{closeModal();record("Reviewed seat allocation");toast("Seat allocation synchronized.");}}function docs(){const s=get();const n=24+Math.min(41,(s.events||[]).length);openModal("Records",n+" workspace records are currently indexed.<br><br><b>Index:</b> Current<br><b>Retention:</b> Standard<br><b>Integrity:</b> Verified");record("Viewed workspace records")}const s=get();const events=s.events||[];const score=document.getElementById("workspaceScore");const bar=document.getElementById("scoreBar");const note=document.getElementById("scoreNote");const value=Math.max(91,Math.min(99,98-(events.length%7)));if(score)score.textContent=value;if(bar)bar.style.width=value+"%";if(note)note.textContent=events.length>25?"Operating normally with historical activity retained":"Operating within expected parameters";const users=document.getElementById("activeUsers");const seats=document.getElementById("seatCount");const count=s.teamSize||1;if(users)users.textContent=count;if(seats)seats.textContent=Math.max(count,1);const docsEl=document.getElementById("documentCount");if(docsEl)docsEl.textContent=24+Math.min(41,events.length);$$("[data-action]").forEach(b=>{if(b.dataset.action==="team")b.addEventListener("click",team);if(b.dataset.action==="documents")b.addEventListener("click",docs)})})();
(function(){if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}})();
(function(){
  const KEY="premium-workspace-v1";
  const getState=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}};
  const saveState=s=>localStorage.setItem(KEY,JSON.stringify(s));
  function theme(){
    const s=getState();s.theme=s.theme==="dark"?"light":"dark";saveState(s);
    document.body.dataset.theme=s.theme;
    toast("Appearance updated.");
  }
  function preferences(){
    const s=getState();
    openModal("Preferences","Choose how Premium behaves in this browser.",
      '<div class="pref-row"><span>Appearance</span><button class="secondary" id="prefTheme">'+(s.theme==="dark"?"Use light mode":"Use dark mode")+'</button></div>'+
      '<div class="pref-row"><span>Reduced motion</span><button class="secondary" id="prefMotion">'+(localStorage.getItem("premium-reduced-motion")==="1"?"Disable":"Enable")+'</button></div>'+
      '<div class="modal-actions"><button class="primary" id="prefDone">Done</button></div>');
    $("#prefTheme").onclick=()=>{theme();preferences()};
    $("#prefMotion").onclick=()=>{const on=localStorage.getItem("premium-reduced-motion")==="1";localStorage.setItem("premium-reduced-motion",on?"0":"1");document.documentElement.classList.toggle("reduced-motion",!on);preferences()};
    $("#prefDone").onclick=closeModal;
  }
  function install(){
    if(window.__deferredPrompt){window.__deferredPrompt.prompt();window.__deferredPrompt.userChoice.finally(()=>window.__deferredPrompt=null)}
    else toast("Install options are available from your browser menu.");
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-action]"); if(!b)return;
    const a=b.dataset.action;
    if(a==="theme")theme();
    if(a==="preferences")preferences();
    if(a==="install")install();
  });
  const s=getState();if(s.theme)document.body.dataset.theme=s.theme;
  if(localStorage.getItem("premium-reduced-motion")==="1")document.documentElement.classList.add("reduced-motion");
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();window.__deferredPrompt=e});
  window.addEventListener("online",()=>$("#offlineBar")?.classList.remove("show"));
  window.addEventListener("offline",()=>$("#offlineBar")?.classList.add("show"));
  if(!navigator.onLine)$("#offlineBar")?.classList.add("show");
  if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
})();

(function(){
  const palette=$("#commandPalette"), input=$("#commandInput"), list=$("#commandList");
  const commands=[
    ["Open billing","billing"],["View activity","history"],["Review security","audit"],["Review account","account"],
    ["Open preferences","preferences"],["Toggle appearance","theme"],["Install app","install"],["Start Premium","upgrade"]
  ];
  function renderCommands(q=""){const f=commands.filter(x=>x[0].toLowerCase().includes(q.toLowerCase()));list.innerHTML=f.map((x,i)=>'<button class="command-item" data-cmd="'+x[1]+'">'+x[0]+'<span>↵</span></button>').join("")||'<div class="command-item">No matching commands.</div>'}
  function openPalette(){renderCommands();palette.classList.add("open");palette.setAttribute("aria-hidden","false");setTimeout(()=>input?.focus(),20)}
  function closePalette(){palette.classList.remove("open");palette.setAttribute("aria-hidden","true")}
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-action='palette']")){openPalette();return}
    const cmd=e.target.closest("[data-cmd]")?.dataset.cmd;if(cmd){closePalette();handleAction(cmd)}
    if(e.target===palette)closePalette();
  });
  input?.addEventListener("input",()=>renderCommands(input.value));
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openPalette()}
    if(e.key==="Escape")closePalette();
  });
  renderCommands();
})();


/* V11 — workspace controls, export, keyboard help and live telemetry */
(function(){
  const K="premium-workspace-v1";
  const get=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch{return {}}};
  const put=s=>localStorage.setItem(K,JSON.stringify(s));
  const record=a=>{const s=get();s.events=s.events||[];s.events.unshift({t:new Date().toLocaleTimeString(),a});s.events=s.events.slice(0,120);put(s)};
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  function shortcuts(){
    openModal("Keyboard shortcuts",'<div class="v11-shortcuts"><span>Command palette</span><kbd>Ctrl K</kbd><span>Search</span><kbd>/</kbd><span>Close dialogs</span><kbd>Esc</kbd><span>Navigate page</span><kbd>↑ ↓</kbd></div><div class="chaos">Keyboard efficiency has been added to your account.</div>',"<div class='modal-actions'><button class='primary' id='v11Done'>Done</button></div>");
    $("#v11Done").onclick=closeModal;
  }
  function exportWorkspace(){
    const s=get();
    const payload={exportedAt:new Date().toISOString(),product:"Premium",workspace:{...s}};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="premium-workspace-export.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
    record("Exported workspace data");toast("Workspace export prepared.");
  }
  function resetWorkspace(){
    openModal("Reset workspace","This clears the locally stored workspace state in this browser.<div class='chaos'>Your browser will immediately become less interesting.</div>","<div class='modal-actions'><button class='secondary v11-danger' id='v11Cancel'>Cancel</button><button class='primary' id='v11Reset'>Reset workspace</button></div>");
    $("#v11Cancel").onclick=closeModal;
    $("#v11Reset").onclick=()=>{localStorage.removeItem(K);closeModal();location.reload()};
  }
  function telemetry(){
    const n=Math.floor(18+Math.random()*44);
    $("#v11Latency").textContent=n+" ms";
    $("#v11Clock").textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  }
  setInterval(telemetry,1000);telemetry();

  const originalAction=window.action;
  if(typeof originalAction==="function"){
    window.action=function(type){
      if(type==="shortcuts"){shortcuts();return}
      if(type==="export"){exportWorkspace();return}
      if(type==="reset"){resetWorkspace();return}
      return originalAction(type);
    };
  }

  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==="e"){e.preventDefault();exportWorkspace()}
    if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==="h"){e.preventDefault();shortcuts()}
  });

  window.PremiumV11={exportWorkspace,resetWorkspace,shortcuts};
})();

/* V12 — notification center, command routing and PWA update flow */
(function(){
  const K="premium-workspace-v1";
  const get=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch{return {}}};
  function setUnread(){const d=$("#notifyDot");if(!d)return;d.style.display="block";d.setAttribute("aria-label","Unread notifications")}
  function clearUnread(){const d=$("#notifyDot");if(!d)return;d.style.display="none"}
  window.handleAction=function(type){
    if(type==="billing"||type==="history"||type==="account"){accountOps(type);return}
    if(type==="audit"||type==="security"){action(type);return}
    if(type==="preferences"||type==="theme"||type==="install"||type==="upgrade"){const b=document.querySelector(`[data-action="${type}"]`);if(b)b.click();return}
    if(type==="usage"){showUsage();return}
    if(type==="release"){showRelease();return}
  };
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-action]");if(!b)return;
    if(b.dataset.action==="notifications"){showNotifications();clearUnread()}
    if(b.dataset.action==="applyUpdate"){location.reload()}
  });
  const s=get();
  if((s.events||[]).length>0)setUnread();

  let waitingWorker=null;
  if("serviceWorker" in navigator){
    navigator.serviceWorker.getRegistration().then(reg=>{
      if(!reg)return;
      if(reg.waiting){waitingWorker=reg.waiting;$("#v12Update")?.classList.add("show")}
      reg.addEventListener("updatefound",()=>{
        const w=reg.installing;if(!w)return;
        w.addEventListener("statechange",()=>{if(w.state==="installed"&&navigator.serviceWorker.controller){waitingWorker=w;$("#v12Update")?.classList.add("show")}});
      });
    }).catch(()=>{});
    document.addEventListener("click",e=>{if(e.target.closest("[data-action='applyUpdate']")&&waitingWorker){waitingWorker.postMessage("SKIP_WAITING")}});
    navigator.serviceWorker.addEventListener("controllerchange",()=>{if(waitingWorker)location.reload()});
  }
})();

/* V12 header controls — direct wiring, independent of section action handlers */
(function(){
  const bind=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener("click",fn)};
  bind("headerSearch",()=>showSearch());
  bind("headerNotifications",()=>{showNotifications();document.getElementById("notifyDot")?.style.setProperty("display","none")});
  bind("headerLogin",()=>action("login"));
  bind("headerUpgrade",()=>action("upgrade"));
  bind("headerTheme",()=>{
    const current=document.body.dataset.theme||"light";
    document.body.dataset.theme=current==="dark"?"light":"dark";
    try{const x=JSON.parse(localStorage.getItem("premium-workspace-v1")||"{}");x.theme=document.body.dataset.theme;localStorage.setItem("premium-workspace-v1",JSON.stringify(x))}catch{}
    toast("Appearance updated.");
  });
})();
