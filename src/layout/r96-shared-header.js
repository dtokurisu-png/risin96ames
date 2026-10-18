(() => {
 "use strict";
 if (window.R96_SHARED_HEADER) return;
 const RUNTIME="https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/global-header-runtime.js?v=20261014-13";
 const FRAME_ORIGIN="https://dtokurisu-png.github.io";
 const ITEMS=[
  ["explore","Explorar","Explore"],["games","Juegos","Games"],
  ["reviews","Reseñas","Reviews"],["community","Comunidad","Community"],
  ["invite","Invitar desarrollador","Invite developer"],
  ["add","Agregar juego","Add game"],["mine","Mis juegos","My games"]
 ];
 let frame=null,member=null,status="connecting",active="explore",theme="dark",language="es",mounted=false,stopped=false;
 try{theme=sessionStorage.getItem("nexo-rising-display-theme")==="light"?"light":"dark";
     language=String(localStorage.getItem("nexoLanguage:v1")||"es").startsWith("en")?"en":"es"}catch(_){}
 function ensureStyle(){
  if(document.getElementById("r96-shared-header-style"))return;
  const style=document.createElement("style");
  style.id="r96-shared-header-style";
  style.textContent=`
#nexo-global-header-runtime-host[data-variant="r96"],
#nexo-global-header-runtime-host[data-variant="r96"][data-theme="night"]{--ngh-bg:#090F20;--ngh-border:#273048;--ngh-text:#F4F7FF;--ngh-muted:#A5B2CC;--ngh-active:#75F4DF;--ngh-interaction:#75F4DF;--ngh-interaction-contrast:#05121D;--ngh-surface:#111A2C;--ngh-surface2:#1C2640;--ngh-panel-text:#F4F7FF;--ngh-panel-muted:#A5B2CC;--ngh-panel-border:#303D58;--ngh-panel-border-strong:#596887;--ngh-role:#C8A1FF;--ngh-shadow:rgba(0,0,0,.38)}
#nexo-global-header-runtime-host[data-variant="r96"][data-theme="day"]{--ngh-bg:#E9F5FF;--ngh-border:#AAC7E3;--ngh-text:#172440;--ngh-muted:#4E6480;--ngh-active:#8900BA;--ngh-interaction:#8900BA;--ngh-interaction-contrast:#FFFFFF;--ngh-surface:#FFFFFF;--ngh-surface2:#E5F0FF;--ngh-panel-text:#14213D;--ngh-panel-muted:#546A89;--ngh-panel-border:#C1D6E9;--ngh-panel-border-strong:#91AEC9;--ngh-role:#8900BA;--ngh-shadow:rgba(26,46,84,.16)}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-bar{gap:12px;padding:0 14px}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-product-mark{font-size:13px;background:linear-gradient(130deg,#6FFCE5,#BB93FF)}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-brand{min-width:104px}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-nav{gap:7px;min-width:0}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-product-nav{gap:12px;min-width:0}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-nav-btn{font-size:11px}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-utils{gap:4px}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-direct-setting{padding:0 7px}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-mobile-r96{display:none;position:relative}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-r96-menu-btn{height:38px;padding:0 12px;display:flex;align-items:center;gap:8px;border:1px solid var(--ngh-panel-border);border-radius:11px;color:var(--ngh-text);background:transparent;font:800 11px Inter,Arial,sans-serif;cursor:pointer}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-r96-panel{display:none;position:absolute;top:calc(100% + 10px);left:0;width:min(310px,calc(100vw - 20px));max-height:70dvh;overflow:auto;padding:8px;background:var(--ngh-surface);border:1px solid var(--ngh-panel-border);border-radius:14px;box-shadow:0 14px 40px var(--ngh-shadow)}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-r96-panel.open{display:grid;gap:4px}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-r96-panel button{min-height:42px;text-align:left;border:0;background:transparent;color:var(--ngh-panel-text);font:750 12px Inter,Arial,sans-serif;padding:9px 12px;border-radius:9px;cursor:pointer}
#nexo-global-header-runtime-host[data-variant="r96"] .ngh-r96-panel button:hover{background:var(--ngh-surface2)}
@media(max-width:1350px){#nexo-global-header-runtime-host[data-variant="r96"] .ngh-product-nav{gap:8px}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-nav-btn{font-size:10px}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-bar{gap:8px}}
@media(max-width:1130px){#nexo-global-header-runtime-host[data-variant="r96"] .ngh-product-nav{display:none}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-mobile-r96{display:block}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-nav{flex:0 0 auto}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-brand{margin-right:auto}}
@media(max-width:760px){#nexo-global-header-runtime-host[data-variant="r96"] .ngh-nav{overflow:visible!important}}
@media(max-width:560px){#nexo-global-header-runtime-host[data-variant="r96"] .ngh-brand-copy{display:none}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-user{display:none}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-account{min-height:38px}#nexo-global-header-runtime-host[data-variant="r96"] .ngh-r96-menu-btn{padding:0 9px}}
`;
  document.head.appendChild(style);
 }
 function send(type,value){
  frame?.contentWindow?.postMessage({source:"r96-global-header",protocol:1,type,value},FRAME_ORIGIN);
 }
 function navigate(key){
  if(!ITEMS.some(x=>x[0]===key))return;
  active=key;send("navigate",key);mount();
 }
 function accountAction(action){
  if(action==="profile"){location.assign("/my-site-1/blank-8?nxoProfile=settings");return}
  const url=new URL(location.href);
  ["nexoAuth","nexoAction","nexoCommandId","nxa","nxb","nxav"].forEach(k=>url.searchParams.delete(k));
  if(action==="login")url.searchParams.set("nexoAuth","login");
  else url.searchParams.set("nexoAction",action);
  url.searchParams.set("nexoCommandId",Date.now().toString(36));
  location.assign(url.href);
 }
 function mobileNav(header){
  const nav=header.querySelector(".ngh-nav");if(!nav)return;
  const wrap=document.createElement("div");wrap.className="ngh-mobile-r96";
  const trigger=document.createElement("button");trigger.type="button";trigger.className="ngh-r96-menu-btn";
  trigger.textContent="☰ "+(language==="en"?"Menu":"Menú");
  trigger.setAttribute("aria-expanded","false");
  const panel=document.createElement("div");panel.className="ngh-r96-panel";
  header.querySelectorAll(".ngh-product-nav [data-product-nav]").forEach(button=>{
   const key=button.dataset.productNav,item=document.createElement("button");
   item.type="button";item.textContent=button.textContent||key;
   item.addEventListener("click",event=>{event.stopPropagation();panel.classList.remove("open");trigger.setAttribute("aria-expanded","false");navigate(key)});
   panel.appendChild(item);
  });
  trigger.addEventListener("click",event=>{event.stopPropagation();let open=panel.classList.toggle("open");trigger.setAttribute("aria-expanded",String(open))});
  wrap.append(trigger,panel);nav.prepend(wrap);
 }
 function mount(){
  if(stopped||!frame||!window.NEXO_GLOBAL_HEADER)return false;
  ensureStyle();
  const signedIn=status==="signedIn"&&!!member?.id,lang=language;
  const header=window.NEXO_GLOBAL_HEADER.mount(document.body,{
   variant:"r96",brand:{mark:"R96",title:"Risin9 6ames",subtitle:"Nexo Group"},
   productNavigation:ITEMS.map(item=>({key:item[0],label:lang==="en"?item[2]:item[1]})),
   productActive:active,hideGlobalNavigation:true,
   theme:theme==="light"?"day":"night",language:lang,contextLabel:"Risin9 6ames",
   navigation:{personal:{name:"Mi espacio",tools:[]},workspaces:[]},
   profile:{displayName:signedIn?(member.displayName||"Usuario Nexo"):"Iniciar sesión",email:""},
   roleLabel:signedIn?"Miembro":"Público",
   onHome:()=>{navigate("explore");return false},
   onProductNav:key=>{navigate(key);return false},
   onTheme:()=>{theme=theme==="light"?"dark":"light";try{sessionStorage.setItem("nexo-rising-display-theme",theme)}catch(_){}send("theme",theme);mount()},
   onLanguage:()=>{language=language==="en"?"es":"en";try{localStorage.setItem("nexoLanguage:v1",language)}catch(_){}send("language",language);mount()},
   onProfileSettings:()=>accountAction(signedIn?"profile":"login"),
   onSwitchAccount:()=>accountAction(signedIn?"switch":"login"),
   onLogout:()=>accountAction(signedIn?"logout":"login")
  });
  if (!signedIn) {
   header.querySelector("[data-switch]")?.remove();
   header.querySelector("[data-logout]")?.remove();
   const accountButton=header.querySelector("[data-account]");
   accountButton?.addEventListener("click",event=>{
    event.preventDefault();event.stopImmediatePropagation();accountAction("login");
   },{capture:true});
  }
  mobileNav(header);mounted=true;
  document.documentElement.style.setProperty("--nexo-global-header-height","68px");
  send("ready",true);
  return true;
 }
 function position(bannerOffset){
  const offset=Math.max(0,Math.round(Number(bannerOffset)||0));
  document.documentElement.style.setProperty("--nexo-global-header-top",offset+"px");
  return mounted?68:0;
 }
 function setAccount(newStatus,newMember){
  const changed=status!==newStatus||String(member?.id||"")!==String(newMember?.id||"");
  status=newStatus;member=newMember;if(changed)mount();
 }
 function handleFrameMessage(message){
  if(message?.source==="r96-visual"&&message.type==="r96-theme"){
   const next=message.theme==="light"?"light":"dark";
   if(theme!==next){theme=next;try{sessionStorage.setItem("nexo-rising-display-theme",theme)}catch(_){}mount()}
  }
  if(message?.source==="r96-header-state"&&message.type==="section"){
   const next=String(message.section||"");
   if(ITEMS.some(x=>x[0]===next)&&active!==next){active=next;mount()}
  }
 }
 async function bootstrap(target){
  frame=target;
  if(!frame||!document.body)return false;
  if(!window.NEXO_GLOBAL_HEADER){
   await new Promise((resolve,reject)=>{
    const existing=document.getElementById("nexo-global-header-runtime-script");
    if(existing&&window.NEXO_GLOBAL_HEADER){resolve();return}
    const script=existing||document.createElement("script");
    script.addEventListener("load",resolve,{once:true});
    script.addEventListener("error",reject,{once:true});
    if(!existing){script.id="nexo-global-header-runtime-script";script.src=RUNTIME;document.head.appendChild(script)}
   });
  }
  return mount();
 }
 function destroy(){
  stopped=true;
  window.NEXO_GLOBAL_HEADER?.unmount();
  document.getElementById("r96-shared-header-style")?.remove();
  mounted=false;frame=null;
 }
 window.R96_SHARED_HEADER={bootstrap,position,setAccount,handleFrameMessage,destroy,get mounted(){return mounted},height:68};
})();