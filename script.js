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

/* V13 — real browser-local account session, search, demo and responsive navigation */
(function(){
 const S="premium-session-v1", q=s=>document.querySelector(s);
 const read=()=>{try{return JSON.parse(localStorage.getItem(S)||"null")}catch{return null}};
 const write=v=>localStorage.setItem(S,JSON.stringify(v));
 const session=q("#v13Session");
 function showSession(){const a=read();if(!session)return;if(a){session.textContent="Signed in · "+a.email;session.classList.add("show")}else session.classList.remove("show")}
 function signin(e){
   e.preventDefault();const email=q("#v13Email").value.trim(),name=q("#v13Name").value.trim();
   if(!email||!email.includes("@")){toast("Enter a valid work email.");return}
   write({email,name:name||email.split("@")[0],signedInAt:new Date().toISOString()});showSession();closeModal();toast("Signed in on this browser.");addActivity("Signed in to workspace");
 }
 function login(){
   const a=read();
   if(a){openModal("Account session","Signed in as <b>"+a.email+"</b>.","<div class='modal-actions'><button class='secondary' id='v13SignOut'>Sign out</button><button class='primary' id='v13Account'>Open account</button></div>");q("#v13SignOut").onclick=()=>{localStorage.removeItem(S);showSession();closeModal();toast("Signed out.")};q("#v13Account").onclick=()=>{closeModal();accountOps("account")};return}
   openModal("Sign in","Use a browser-local workspace session. No server credentials are required for this static workspace.","<label style='display:block;margin:12px 0 6px;font-size:12px'>Name</label><input id='v13Name' placeholder='Your name' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit'><label style='display:block;margin:12px 0 6px;font-size:12px'>Work email</label><input id='v13Email' type='email' placeholder='you@company.com' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit'><div class='modal-actions'><button class='primary' id='v13SignIn'>Continue</button></div>");q("#v13SignIn").onclick=signin;
 }
 function search(){
   openModal("Search Premium","Search the sections and workspace controls available on this page.","<input id='v13Search' placeholder='Try: security, billing, AI, pricing...' style='width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit><div id='v13Results' style='margin-top:12px'></div>");
   const input=q("#v13Search"),out=q("#v13Results");const items=[...document.querySelectorAll("main section[id]")].map(x=>({id:x.id,text:(x.innerText||"").replace(/\\s+/g," ").slice(0,180)}));
   const run=()=>{const term=input.value.trim().toLowerCase();const hits=term?items.filter(x=>(x.id+" "+x.text).toLowerCase().includes(term)):items.slice(0,5);out.innerHTML=hits.map(x=>'<button class="secondary v13-result" data-jump="'+x.id+'" style="display:block;width:100%;text-align:left;margin:6px 0">'+x.id+' · '+x.text.slice(0,90)+'</button>').join("")||"<small>No matching workspace section.</small>"};
   input.oninput=run;run();out.onclick=e=>{const b=e.target.closest("[data-jump]");if(!b)return;closeModal();document.getElementById(b.dataset.jump)?.scrollIntoView({behavior:"smooth",block:"start"});addActivity("Searched workspace")};
 }
 function demo(){openModal("Interactive demo","Explore the workspace directly. Choose a section to jump into it.","<div class='modal-actions'><button class='secondary' id='v13DemoFeatures'>Features</button><button class='secondary' id='v13DemoBilling'>Billing</button><button class='primary' id='v13DemoSecurity'>Security</button></div>");q("#v13DemoFeatures").onclick=()=>{closeModal();document.getElementById("features")?.scrollIntoView({behavior:"smooth"})};q("#v13DemoBilling").onclick=()=>{closeModal();accountOps("billing")};q("#v13DemoSecurity").onclick=()=>{closeModal();document.getElementById("security")?.scrollIntoView({behavior:"smooth"})}}
 document.addEventListener("click",e=>{
   const b=e.target.closest("[data-action]");if(!b)return;const a=b.dataset.action;
   if(a==="login"){e.preventDefault();e.stopImmediatePropagation();login()}
   if(a==="search"){e.preventDefault();e.stopImmediatePropagation();search()}
   if(a==="demo"){e.preventDefault();e.stopImmediatePropagation();demo()}
 });
 const mm=q("#mobileMenu"),nav=q("#mainNav");mm?.addEventListener("click",()=>{const open=nav.classList.toggle("open");mm.setAttribute("aria-expanded",String(open))});nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");mm?.setAttribute("aria-expanded","false")}));
 document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll("#mainNav a").forEach(x=>x.removeAttribute("aria-current"));a.setAttribute("aria-current","page")}));
 showSession();
})();

/* V14 — hardening layer: make core controls work even if older handlers are present */
(function(){
 const $id=id=>document.getElementById(id);
 const safe=(fn)=>{try{fn()}catch(e){console.error("Premium control error",e);toast("This action could not be completed.")}};
 $id("headerSearch")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();safe(()=>showSearch())},true);
 $id("headerNotifications")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();safe(()=>showNotifications())},true);
 $id("headerLogin")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();safe(()=>window.__premiumV13Login?window.__premiumV13Login():action("login"))},true);
 $id("headerTheme")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();safe(()=>{const d=document.body;d.dataset.theme=d.dataset.theme==="dark"?"light":"dark";const x=JSON.parse(localStorage.getItem("premium-workspace-v1")||"{}");x.theme=d.dataset.theme;localStorage.setItem("premium-workspace-v1",JSON.stringify(x));toast("Appearance updated.")})},true);
 $id("headerUpgrade")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();safe(()=>action("upgrade"))},true);
 $id("mobileMenu")?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const n=$id("mainNav");const open=n?.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(!!open))},true);
 document.querySelectorAll("[data-action='demo']").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();safe(()=>window.__premiumV13Demo?window.__premiumV13Demo():action("demo"))},true));
 document.addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea/i.test(document.activeElement?.tagName||"")){e.preventDefault();safe(()=>showSearch())}},true);
})();

/* V15 — unified interaction router: every primary control performs a real local action */
(function(){
  const SESSION="premium-session-v1", STORE="premium-workspace-v1";
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||"{}")}catch{return {}}};
  const write=s=>localStorage.setItem(STORE,JSON.stringify(s));
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\\"":"&quot;","'":"&#39;"}[m]||m));
  const record=label=>{const s=read();s.events=s.events||[];s.events.unshift({t:new Date().toLocaleTimeString(),a:label});s.events=s.events.slice(0,120);write(s);if(typeof renderActivity==="function")renderActivity();const n=document.getElementById("eventCount");if(n)n.textContent=s.events.length+" events";};
  const jump=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  function localLogin(){
    const existing=(()=>{try{return JSON.parse(localStorage.getItem(SESSION)||"null")}catch{return null}})();
    if(existing){openModal("Account session","Signed in as <b>"+esc(existing.email)+"</b>.<br><br>Your browser-local workspace session is active.","<div class='modal-actions'><button class='secondary' id='v15SignOut'>Sign out</button><button class='primary' id='v15Account'>Open account</button></div>");
      document.getElementById("v15SignOut").onclick=()=>{localStorage.removeItem(SESSION);document.getElementById("v13Session")?.classList.remove("show");closeModal();toast("Signed out.");record("Signed out")};
      document.getElementById("v15Account").onclick=()=>{closeModal();accountOps("account")}; return;
    }
    openModal("Sign in","Create a browser-local workspace session. Your session stays on this device.","<label style='display:block;margin:12px 0 6px;font-size:12px'>Name</label><input id='v15Name' placeholder='Your name' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit'><label style='display:block;margin:12px 0 6px;font-size:12px'>Work email</label><input id='v15Email' type='email' placeholder='you@company.com' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit'><div class='modal-actions'><button class='primary' id='v15SignIn'>Continue</button></div>");
    document.getElementById("v15SignIn").onclick=()=>{const email=document.getElementById("v15Email").value.trim(),name=document.getElementById("v15Name").value.trim();if(!email||!email.includes("@")){toast("Enter a valid work email.");return}localStorage.setItem(SESSION,JSON.stringify({email,name:name||email.split("@")[0],signedInAt:new Date().toISOString()}));const pill=document.getElementById("v13Session");if(pill){pill.textContent="Signed in · "+email;pill.classList.add("show")}closeModal();toast("Signed in on this browser.");record("Signed in to workspace")};
  }
  function search(){
    openModal("Search Premium","Search the sections and controls available in this workspace.","<input id='v15Search' placeholder='Try: security, billing, AI, pricing...' style='width:100%;padding:13px;border:1px solid #ddd;border-radius:10px;font:inherit><div id='v15Results' style='margin-top:12px'></div>");
    const input=document.getElementById("v15Search"),out=document.getElementById("v15Results");const items=[...document.querySelectorAll("main section[id]")].map(x=>({id:x.id,text:(x.innerText||"").replace(/\\s+/g," ").slice(0,180)}));
    const run=()=>{const q=input.value.trim().toLowerCase();const hits=q?items.filter(x=>(x.id+" "+x.text).toLowerCase().includes(q)):items.slice(0,6);out.innerHTML=hits.map(x=>"<button class='secondary' data-v15jump='"+esc(x.id)+"' style='display:block;width:100%;text-align:left;margin:6px 0'>"+esc(x.id)+" · "+esc(x.text.slice(0,90))+"</button>").join("")||"<small>No matching workspace section.</small>"};input.oninput=run;run();out.onclick=e=>{const b=e.target.closest("[data-v15jump]");if(!b)return;closeModal();jump(b.dataset.v15jump);record("Searched workspace")};
  }
  function demo(){openModal("Interactive demo","Choose a workspace area to open.","<div class='modal-actions'><button class='secondary' id='v15Features'>Features</button><button class='secondary' id='v15Billing'>Billing</button><button class='primary' id='v15Security'>Security</button></div>");document.getElementById("v15Features").onclick=()=>{closeModal();jump("features")};document.getElementById("v15Billing").onclick=()=>{closeModal();accountOps("billing")};document.getElementById("v15Security").onclick=()=>{closeModal();jump("security")}}
  function theme(){const s=read();s.theme=s.theme==="dark"?"light":"dark";write(s);document.body.dataset.theme=s.theme;toast(s.theme==="dark"?"Dark appearance enabled.":"Light appearance enabled.")}
  function route(type){
    if(type==="start"||type==="upgrade"){upgrade();return} if(type==="login"){localLogin();return} if(type==="search"){search();return} if(type==="demo"){demo();return}
    if(type==="theme"){theme();return} if(type==="palette"){document.getElementById("commandPalette")?.classList.add("open");document.getElementById("commandPalette")?.setAttribute("aria-hidden","false");document.getElementById("commandInput")?.focus();return}
    if(type==="status"){showStatus();return} if(type==="notifications"){showNotifications();document.getElementById("notifyDot")?.style.setProperty("display","none");return}
    if(type==="ai"||type==="speed"||type==="security"||type==="audit"||type==="enterprise"||type==="free"){action(type);return}
    if(type==="usage"){showUsage();return} if(type==="invite"){showInvite();return} if(type==="release"){showRelease();return}
    if(type==="account"||type==="billing"||type==="history"){accountOps(type);return} if(type==="access"||type==="risk"||type==="reconcile"||type==="team"||type==="documents"){document.querySelectorAll("[data-action='"+type+"']").forEach(()=>{});if(type==="team"){const n=read().teamSize||1;openModal("Team","<b>"+n+" active seat"+(n===1?"":"s")+"</b><br><br>Seat allocation is synchronized locally.","<div class='modal-actions'><button class='primary' id='v15TeamDone'>Done</button></div>");document.getElementById("v15TeamDone").onclick=()=>{closeModal();record("Reviewed seat allocation")}}else if(type==="documents"){const n=24+Math.min(41,(read().events||[]).length);openModal("Records",n+" workspace records are currently indexed.<br><br><b>Index:</b> Current<br><b>Integrity:</b> Verified");record("Viewed workspace records")}else{const title={access:"Access review",risk:"Risk assessment",reconcile:"Workspace reconciliation"}[type];openModal(title,"The requested review has completed successfully.<br><br><b>Status:</b> Current");record(type==="access"?"Reviewed access":type==="risk"?"Ran risk assessment":"Reconciled workspace records")}return}
    if(type.startsWith("support")){support(type);return}
    if(type==="preferences"){openModal("Preferences","Choose how Premium behaves in this browser.","<div class='pref-row'><span>Appearance</span><button class='secondary' id='v15PrefTheme'>Toggle appearance</button></div><div class='pref-row'><span>Reduced motion</span><button class='secondary' id='v15PrefMotion'>Toggle reduced motion</button></div><div class='modal-actions'><button class='primary' id='v15PrefDone'>Done</button></div>");document.getElementById("v15PrefTheme").onclick=()=>{theme();route("preferences")};document.getElementById("v15PrefMotion").onclick=()=>{const on=localStorage.getItem("premium-reduced-motion")==="1";localStorage.setItem("premium-reduced-motion",on?"0":"1");document.documentElement.classList.toggle("reduced-motion",!on);toast(on?"Reduced motion disabled.":"Reduced motion enabled.");route("preferences")};document.getElementById("v15PrefDone").onclick=closeModal;return}
    if(type==="install"){if(window.__deferredPrompt){window.__deferredPrompt.prompt();window.__deferredPrompt.userChoice.finally(()=>window.__deferredPrompt=null)}else toast("Install options are available from your browser menu.");return}
    if(type==="shortcuts"){window.PremiumV11?.shortcuts();return} if(type==="export"){window.PremiumV11?.exportWorkspace();return} if(type==="reset"){window.PremiumV11?.resetWorkspace();return}
    if(type==="applyUpdate"){navigator.serviceWorker?.getRegistration().then(r=>{if(r?.waiting)r.waiting.postMessage("SKIP_WAITING");else location.reload()});return}
    if(type==="closeAdmin"){document.getElementById("adminPanel")?.classList.remove("open");return}
  }
  window.__premiumV15Route=route;window.__premiumV13Login=localLogin;window.__premiumV13Demo=demo;
  document.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{route(b.dataset.action)}catch(err){console.error(err);toast("This action could not be completed.")}},true);
  ["headerSearch","headerNotifications","headerLogin","headerTheme","headerUpgrade","mobileMenu"].forEach(id=>document.getElementById(id)?.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{if(id==="headerSearch")search();else if(id==="headerNotifications")route("notifications");else if(id==="headerLogin")localLogin();else if(id==="headerTheme")theme();else if(id==="headerUpgrade")upgrade();else{const n=document.getElementById("mainNav"),open=n?.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(!!open))}}catch(err){console.error(err);toast("This action could not be completed.")}},true));
})();


/* V17 — persistent local product state and complete control layer */
(function(){
  const STORE="premium-workspace-v1", SESSION="premium-session-v1";
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||"{}")}catch{return {}}};
  const write=s=>localStorage.setItem(STORE,JSON.stringify(s));
  const record=a=>{const s=read();s.events=s.events||[];s.events.unshift({t:new Date().toLocaleTimeString(),a});s.events=s.events.slice(0,120);write(s);if(typeof renderActivity==="function")renderActivity()};
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  const stateLabel=()=>{const s=read();return s.plan||"Free"};
  function sync(){
    const s=read();s.plan=s.plan||"Free";s.premium=s.plan==="Premium"||s.plan==="Ultra Max Pro+";
    write(s);
    document.querySelectorAll("#premiumStatus").forEach(x=>x.textContent=s.premium?"Premium Active":"Free Plan");
    document.querySelectorAll("#billingState").forEach(x=>x.textContent="Current plan: "+s.plan);
  }
  function plans(){
    const s=read();
    openModal("Choose your plan",
      "<b>Current plan:</b> "+esc(stateLabel())+"<br><br>Choose a local subscription state for this browser. No payment is processed.",
      "<div class='modal-actions'><button class='secondary' id='v17Free'>Stay Free</button><button class='primary' id='v17Premium'>Get Premium · ₹999/month</button></div>");
    document.getElementById("v17Free").onclick=()=>{const x=read();x.plan="Free";x.premium=false;write(x);sync();record("Selected Free plan");closeModal();toast("Free plan is active on this browser.")};
    document.getElementById("v17Premium").onclick=()=>{const x=read();x.plan="Premium";x.premium=true;x.accountValue=(x.accountValue||0)+999;write(x);sync();record("Activated Premium plan");closeModal();toast("Premium is now active on this browser.");if(typeof confetti==="function")confetti()};
  }
  function start(){const s=read();if(!s.plan){s.plan="Free";s.premium=false;write(s);record("Started free workspace")}else record("Opened workspace");sync();toast("Free workspace ready.") }
  function session(){
    let s=null;try{s=JSON.parse(localStorage.getItem(SESSION)||"null")}catch{}
    if(s){openModal("Account session","Signed in as <b>"+esc(s.email)+"</b><br><br>Session stored on this browser.","<div class='modal-actions'><button class='secondary' id='v17SignOut'>Sign out</button><button class='primary' id='v17Account'>Open account</button></div>");
      document.getElementById("v17SignOut").onclick=()=>{localStorage.removeItem(SESSION);document.getElementById("v13Session")?.classList.remove("show");closeModal();record("Signed out");toast("Signed out.")};
      document.getElementById("v17Account").onclick=()=>{closeModal();accountOps("account")};return}
    openModal("Sign in","Create a browser-local account session.","<input id='v17Name' placeholder='Your name' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit><input id='v17Email' type='email' placeholder='you@company.com' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:9px;font:inherit;margin-top:10px'><div class='modal-actions'><button class='primary' id='v17SignIn'>Continue</button></div>");
    document.getElementById("v17SignIn").onclick=()=>{const email=document.getElementById("v17Email").value.trim(),name=document.getElementById("v17Name").value.trim();if(!email.includes("@")){toast("Enter a valid work email.");return}localStorage.setItem(SESSION,JSON.stringify({email,name:name||email.split("@")[0],signedInAt:new Date().toISOString()}));const p=document.getElementById("v13Session");if(p){p.textContent="Signed in · "+email;p.classList.add("show")}closeModal();record("Signed in");toast("Signed in on this browser.")};
  }
  function prefs(){
    const reduced=localStorage.getItem("premium-reduced-motion")==="1",dark=document.body.dataset.theme==="dark";
    openModal("Preferences","Manage browser-local workspace preferences.","<div class='pref-row'><span>Appearance</span><button class='secondary' id='v17Theme'>"+(dark?"Light":"Dark")+" appearance</button></div><div class='pref-row'><span>Reduced motion</span><button class='secondary' id='v17Motion'>"+(reduced?"Disable":"Enable")+" reduced motion</button></div><div class='modal-actions'><button class='primary' id='v17Done'>Done</button></div>");
    document.getElementById("v17Theme").onclick=()=>{const x=read();x.theme=dark?"light":"dark";write(x);document.body.dataset.theme=x.theme;prefs()};
    document.getElementById("v17Motion").onclick=()=>{localStorage.setItem("premium-reduced-motion",reduced?"0":"1");document.documentElement.classList.toggle("reduced-motion",!reduced);prefs()};
    document.getElementById("v17Done").onclick=closeModal;
  }
  function install(){
    if(window.__deferredPrompt){const p=window.__deferredPrompt;p.prompt();p.userChoice.then(r=>toast(r.outcome==="accepted"?"Premium installed.":"Installation cancelled.")).finally(()=>window.__deferredPrompt=null);return}
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.navigator.standalone;
    openModal("Install Premium",ios?"On iPhone or iPad, use Share → Add to Home Screen.":"Use your browser's Install app or Add to Home Screen option to install Premium.","<div class='modal-actions'><button class='primary' id='v17InstallDone'>Done</button></div>");document.getElementById("v17InstallDone").onclick=closeModal;
  }
  function shortcuts(){openModal("Keyboard shortcuts","<div class='v11-shortcuts'><span>Command palette</span><kbd>Ctrl K</kbd><span>Search</span><kbd>/</kbd><span>Close dialogs</span><kbd>Esc</kbd><span>Export workspace</span><kbd>Ctrl Shift E</kbd><span>Shortcuts</span><kbd>Ctrl Shift H</kbd></div>","<div class='modal-actions'><button class='primary' id='v17ShortcutDone'>Done</button></div>");document.getElementById("v17ShortcutDone").onclick=closeModal}
  function route(a){
    if(a==="upgrade")return plans(); if(a==="start")return start(); if(a==="login")return session(); if(a==="preferences")return prefs(); if(a==="install")return install(); if(a==="shortcuts")return shortcuts();
    if(a==="theme"){const s=read();s.theme=s.theme==="dark"?"light":"dark";write(s);document.body.dataset.theme=s.theme;toast("Appearance updated.");return}
    if(a==="mobileMenu"){const n=document.getElementById("mainNav"),b=document.getElementById("mobileMenu"),o=n?.classList.toggle("open");b?.setAttribute("aria-expanded",String(!!o));return}
    if(a==="palette"){document.getElementById("commandPalette")?.classList.add("open");document.getElementById("commandPalette")?.setAttribute("aria-hidden","false");document.getElementById("commandInput")?.focus();return}
    if(a==="free")return plans();
    if(a==="demo"){if(typeof demo==="function")return demo();return}
    if(a==="search"){if(typeof showSearch==="function")return showSearch();return}
    if(a==="notifications"){if(typeof showNotifications==="function")return showNotifications();return}
    if(a==="status"){if(typeof showStatus==="function")return showStatus();return}
    if(a==="usage"){if(typeof showUsage==="function")return showUsage();return}
    if(a==="invite"){if(typeof showInvite==="function")return showInvite();return}
    if(a==="release"){if(typeof showRelease==="function")return showRelease();return}
    if(a==="account"||a==="billing"||a==="history"){return accountOps(a)}
    if(a==="support"||a.startsWith("support"))return support(a);
    if(a==="export"&&window.PremiumV11)return PremiumV11.exportWorkspace();
    if(a==="reset"&&window.PremiumV11)return PremiumV11.resetWorkspace();
    if(a==="applyUpdate"){navigator.serviceWorker?.getRegistration().then(r=>r?.waiting?r.waiting.postMessage("SKIP_WAITING"):location.reload());return}
    if(a==="closeAdmin"){document.getElementById("adminPanel")?.classList.remove("open");return}
    if(["ai","speed","security","audit","enterprise"].includes(a))return action(a);
    if(["access","risk","reconcile","team","documents"].includes(a))return window.__premiumV15Route?.(a);
  }
  window.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{route(b.dataset.action)}catch(err){console.error(err);toast("This action could not be completed.")}},true);
  window.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==="e"){e.preventDefault();PremiumV11?.exportWorkspace?.()}if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==="h"){e.preventDefault();shortcuts()}});
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();window.__deferredPrompt=e});
  window.addEventListener("appinstalled",()=>{window.__deferredPrompt=null;record("Installed Premium PWA");toast("Premium is installed.")});
  sync();
})();
