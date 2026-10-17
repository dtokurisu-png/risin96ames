(() => {
  "use strict";

  if (window.__r96GamesUi) return;
  window.__r96GamesUi = true;

  const HOST_ORIGIN = "https://dtokurisu.wixstudio.com";
  const SOURCE_BRIDGE = "r96-games-bridge";
  const SOURCE_UI = "r96-games-ui";
  const PROTOCOL = 1;

  const ADD_BUTTON_ID = "r96-add-game";
  const MODAL_ID = "r96-game-studio-modal";
  const DETAIL_MODAL_ID = "r96-game-detail-modal";
  const REVIEW_MODAL_ID = "r96-game-review-modal";

  const carousel = document.querySelector("#games .r96-carousel");
  const titleCopy = document.querySelector("#games .r96-title-row > .r96-copy");
  const gamesStat = document.querySelector(".r96-stats span:first-child strong");

  if (!carousel) return;

  let emptyNode = null;
  let studioObserver = null;
  let pending = new Map();
  let lastCatalogPayload = { games: [], count: 0 };
  let communityOverview = {
    summaries: [],
    recentActivity: []
  };

  const STAGES = [
    ["concept", "Concept"],
    ["prototype", "Prototype"],
    ["build-preview", "Build Preview"],
    ["slot", "Slot"],
    ["future-release", "Future Release"],
    ["released", "Released"]
  ];

  function lang() {
    return String(document.documentElement.lang || "es")
      .trim()
      .toLowerCase()
      .startsWith("en")
      ? "en"
      : "es";
  }

  function t(es, en) {
    return lang() === "en" ? en : es;
  }

  function clean(value) {
    return String(value || "").trim();
  }

  function ensureStyle() {
    if (document.getElementById("r96-games-ui-style")) return;

    const style = document.createElement("style");
    style.id = "r96-games-ui-style";
    style.textContent = `
      .r96-games-empty{
        margin:0;
        padding:18px 4px 4px;
        color:var(--r96-muted);
        font-size:.86rem;
        font-weight:750;
      }
      .r96-game-thumb{
        position:relative;
        background:linear-gradient(140deg,#071426,#101932);
      }
      .r96-game-thumb.r96-has-preview{
        background-position:center;
        background-size:cover;
        background-repeat:no-repeat;
      }
      .r96-game-thumb.r96-has-preview::before,
      .r96-game-thumb.r96-has-preview::after{opacity:.18}
      .r96-game-tags{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        min-height:26px;
      }
      .r96-game-tag{
        display:inline-flex;
        align-items:center;
        min-height:26px;
        padding:0 9px;
        border:1px solid color-mix(in srgb,var(--r96-accent) 35%,var(--r96-line));
        border-radius:999px;
        background:color-mix(in srgb,var(--r96-accent) 8%,var(--r96-panel));
        color:var(--r96-accent);
        font-size:.68rem;
        font-weight:850;
        white-space:nowrap;
      }
      .r96-game-desc{
        display:-webkit-box;
        overflow:hidden;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        line-clamp:2;
        min-height:2.9em;
      }
      .r96-game-meta{display:grid;gap:7px}
      .r96-game-meta span{display:block}
      #${ADD_BUTTON_ID}{
        width:100%;
        padding:11px 12px;
        border:0;
        border-radius:10px;
        background:transparent;
        color:var(--r96-muted);
        font:inherit;
        font-size:.84rem;
        font-weight:800;
        text-align:left;
        cursor:pointer;
      }
      #${ADD_BUTTON_ID}:hover{
        color:var(--r96-text);
        background:var(--r96-panel);
      }
      .r96-game-modal-backdrop{
        position:fixed;
        inset:0;
        z-index:2147482500;
        display:grid;
        place-items:center;
        padding:24px;
        background:rgba(0,0,0,.66);
        backdrop-filter:blur(8px);
      }
      .r96-game-modal{
        width:min(1040px,100%);
        max-height:min(92vh,900px);
        overflow:auto;
        border:1px solid var(--r96-line);
        border-radius:24px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:0 30px 90px rgba(0,0,0,.45);
      }
      .r96-game-modal-head{
        position:sticky;
        top:0;
        z-index:3;
        display:flex;
        justify-content:space-between;
        gap:18px;
        align-items:center;
        padding:20px 22px;
        border-bottom:1px solid var(--r96-line);
        background:color-mix(in srgb,var(--r96-bg-2) 92%,transparent);
        backdrop-filter:blur(14px);
      }
      .r96-game-modal-head h2{margin:0;font-size:1.22rem}
      .r96-game-modal-close{
        width:38px;
        height:38px;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        font-size:1.25rem;
        cursor:pointer;
      }
      .r96-game-studio-grid{
        display:grid;
        grid-template-columns:minmax(0,1.1fr) minmax(310px,.9fr);
        gap:22px;
        padding:22px;
      }
      .r96-game-form{
        display:grid;
        gap:16px;
      }
      .r96-game-field{
        display:grid;
        gap:7px;
      }
      .r96-game-field label,
      .r96-game-field .r96-field-label{
        color:var(--r96-text);
        font-size:.78rem;
        font-weight:900;
      }
      .r96-game-field small{
        color:var(--r96-muted);
        font-size:.72rem;
        line-height:1.45;
      }
      .r96-game-field input,
      .r96-game-field select,
      .r96-game-field textarea{
        width:100%;
        box-sizing:border-box;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:12px 13px;
        font:inherit;
        outline:none;
      }
      .r96-game-field textarea{min-height:120px;resize:vertical}
      .r96-game-field input:focus,
      .r96-game-field select:focus,
      .r96-game-field textarea:focus{
        border-color:var(--r96-accent);
        box-shadow:0 0 0 3px color-mix(in srgb,var(--r96-accent) 14%,transparent);
      }
      .r96-game-form-row{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
      }
      .r96-tag-editor{
        display:grid;
        gap:9px;
      }
      .r96-tag-list{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        min-height:28px;
      }
      .r96-tag-chip{
        display:inline-flex;
        align-items:center;
        gap:7px;
        min-height:28px;
        padding:0 8px 0 10px;
        border:1px solid color-mix(in srgb,var(--r96-accent) 35%,var(--r96-line));
        border-radius:999px;
        background:color-mix(in srgb,var(--r96-accent) 8%,var(--r96-panel));
        color:var(--r96-accent);
        font-size:.72rem;
        font-weight:850;
      }
      .r96-tag-chip button{
        border:0;
        background:transparent;
        color:inherit;
        padding:0;
        cursor:pointer;
      }
      .r96-tag-add{
        justify-self:start;
        min-height:34px;
        padding:0 12px;
        border:1px solid var(--r96-line);
        border-radius:999px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        font-size:.76rem;
        font-weight:850;
        cursor:pointer;
      }
      .r96-tag-entry{
        display:flex;
        gap:8px;
      }
      .r96-tag-entry[hidden]{display:none}
      .r96-tag-entry input{flex:1}
      .r96-tag-entry button{
        border:1px solid var(--r96-line);
        border-radius:10px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:0 12px;
        font:inherit;
        font-weight:850;
        cursor:pointer;
      }
      .r96-game-submit{
        min-height:48px;
        border:0;
        border-radius:13px;
        background:linear-gradient(135deg,var(--r96-accent),#d9fff9);
        color:#071017;
        font:inherit;
        font-weight:950;
        cursor:pointer;
      }
      .r96-game-submit:disabled{opacity:.58;cursor:default}
      .r96-upload-state{
        display:grid;
        gap:7px;
        margin-top:3px;
        padding:10px 11px;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:color-mix(in srgb,var(--r96-panel) 82%,transparent);
      }
      .r96-upload-state[hidden]{display:none}
      .r96-upload-top{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        color:var(--r96-muted);
        font-size:.7rem;
        font-weight:800;
      }
      .r96-upload-name{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .r96-upload-percent{flex:0 0 auto}
      .r96-upload-track{
        height:8px;
        overflow:hidden;
        border-radius:999px;
        background:color-mix(in srgb,var(--r96-line) 70%,transparent);
      }
      .r96-upload-bar{
        width:0%;
        height:100%;
        border-radius:inherit;
        background:var(--r96-accent);
        transition:width .12s linear;
      }
      .r96-upload-message{
        min-height:1.15em;
        color:var(--r96-muted);
        font-size:.7rem;
        font-weight:750;
      }
      .r96-upload-state[data-state="done"] .r96-upload-message{
        color:var(--r96-accent);
      }
      .r96-upload-state[data-state="error"] .r96-upload-message{
        color:#ffb6b6;
      }
      .r96-thumb-edit{
        position:absolute;
        right:12px;
        top:12px;
        z-index:3;
        min-height:30px;
        padding:0 10px;
        border:1px solid rgba(255,255,255,.34);
        border-radius:999px;
        background:rgba(4,8,18,.72);
        color:#fff;
        font:inherit;
        font-size:.68rem;
        font-weight:900;
        cursor:pointer;
        backdrop-filter:blur(8px);
      }
      .r96-frame-editor-backdrop{
        position:fixed;
        inset:0;
        z-index:2147483200;
        display:grid;
        place-items:center;
        padding:20px;
        background:rgba(0,0,0,.72);
        backdrop-filter:blur(10px);
      }
      .r96-frame-editor{
        width:min(720px,100%);
        border:1px solid var(--r96-line);
        border-radius:20px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        padding:18px;
        box-shadow:0 30px 90px rgba(0,0,0,.48);
      }
      .r96-frame-editor h3{margin:0 0 8px}
      .r96-frame-editor p{
        margin:0 0 14px;
        color:var(--r96-muted);
        font-size:.78rem;
      }
      .r96-frame-canvas{
        position:relative;
        width:100%;
        aspect-ratio:16/9;
        overflow:hidden;
        border:1px solid var(--r96-line);
        border-radius:16px;
        background-repeat:no-repeat;
        background-size:cover;
        cursor:grab;
        touch-action:none;
        user-select:none;
      }
      .r96-frame-canvas:active{cursor:grabbing}
      .r96-frame-crosshair{
        position:absolute;
        left:50%;
        top:50%;
        width:26px;
        height:26px;
        transform:translate(-50%,-50%);
        border:1px solid rgba(255,255,255,.72);
        border-radius:50%;
        pointer-events:none;
        box-shadow:0 0 0 9999px rgba(0,0,0,.06);
      }
      .r96-frame-controls{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:12px;
        margin-top:14px;
      }
      .r96-frame-control{
        display:grid;
        gap:6px;
        color:var(--r96-muted);
        font-size:.72rem;
        font-weight:800;
      }
      .r96-frame-actions{
        display:flex;
        justify-content:flex-end;
        gap:9px;
        margin-top:16px;
      }
      .r96-frame-actions button{
        min-height:38px;
        padding:0 14px;
        border:1px solid var(--r96-line);
        border-radius:10px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        font-weight:850;
        cursor:pointer;
      }
      .r96-frame-actions .r96-frame-apply{
        border:0;
        background:var(--r96-accent);
        color:#071017;
      }
      .r96-game-feedback{
        min-height:22px;
        color:var(--r96-muted);
        font-size:.78rem;
        line-height:1.45;
      }
      .r96-game-feedback[data-error="1"]{color:#ffb6b6}
      .r96-game-detail-backdrop{
        position:fixed;
        inset:0;
        z-index:2147482450;
        display:grid;
        place-items:center;
        padding:20px;
        background:rgba(0,0,0,.72);
        backdrop-filter:blur(10px);
      }
      .r96-game-detail{
        width:min(1180px,100%);
        max-height:92vh;
        overflow:auto;
        border:1px solid var(--r96-line);
        border-radius:26px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:0 34px 100px rgba(0,0,0,.5);
      }
      .r96-game-detail-head{
        position:sticky;
        top:0;
        z-index:5;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:16px;
        padding:17px 20px;
        border-bottom:1px solid var(--r96-line);
        background:color-mix(in srgb,var(--r96-bg-2) 92%,transparent);
        backdrop-filter:blur(14px);
      }
      .r96-game-detail-head strong{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:.88rem;
      }
      .r96-game-detail-close{
        flex:0 0 auto;
        width:38px;
        height:38px;
        border:1px solid var(--r96-line);
        border-radius:11px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        font-size:1.25rem;
        cursor:pointer;
      }
      .r96-game-detail-hero{
        position:relative;
        width:100%;
        aspect-ratio:16/7;
        min-height:290px;
        background:linear-gradient(140deg,#071426,#101932);
        background-size:cover;
        background-repeat:no-repeat;
        background-position:center;
        overflow:hidden;
      }
      .r96-game-detail-hero::after{
        content:"";
        position:absolute;
        inset:0;
        background:linear-gradient(
          180deg,
          rgba(4,8,18,.08) 12%,
          rgba(4,8,18,.25) 55%,
          rgba(4,8,18,.88) 100%
        );
        pointer-events:none;
      }
      .r96-game-detail-hero-copy{
        position:absolute;
        z-index:2;
        left:clamp(20px,4vw,46px);
        right:clamp(20px,4vw,46px);
        bottom:clamp(22px,4vw,40px);
      }
      .r96-game-detail-stage{
        display:inline-flex;
        align-items:center;
        min-height:30px;
        padding:0 11px;
        border:1px solid rgba(255,255,255,.24);
        border-radius:999px;
        background:rgba(5,10,20,.65);
        color:#fff;
        font-size:.72rem;
        font-weight:900;
        backdrop-filter:blur(8px);
      }
      .r96-game-detail-title{
        margin:10px 0 0;
        color:#fff;
        font-size:clamp(2rem,4vw,3.8rem);
        line-height:1;
        letter-spacing:-.035em;
      }
      .r96-game-detail-body{
        display:grid;
        grid-template-columns:minmax(0,1.5fr) minmax(280px,.7fr);
        gap:28px;
        padding:26px;
      }
      .r96-game-detail-main,
      .r96-game-detail-side{
        display:grid;
        align-content:start;
        gap:22px;
      }
      .r96-game-detail-section{
        display:grid;
        gap:11px;
        padding:18px;
        border:1px solid var(--r96-line);
        border-radius:17px;
        background:color-mix(in srgb,var(--r96-panel) 72%,transparent);
      }
      .r96-game-detail-section h3{
        margin:0;
        font-size:.94rem;
      }
      .r96-game-detail-description{
        margin:0;
        color:var(--r96-muted);
        font-size:.9rem;
        line-height:1.7;
        white-space:pre-wrap;
      }
      .r96-game-detail-meta{
        display:grid;
        gap:10px;
      }
      .r96-game-detail-meta-row{
        display:flex;
        justify-content:space-between;
        gap:16px;
        padding-bottom:9px;
        border-bottom:1px solid var(--r96-line);
        color:var(--r96-muted);
        font-size:.8rem;
      }
      .r96-game-detail-meta-row:last-child{
        border-bottom:0;
        padding-bottom:0;
      }
      .r96-game-detail-meta-row strong{
        color:var(--r96-text);
        text-align:right;
      }
      .r96-game-detail-tags{
        display:flex;
        flex-wrap:wrap;
        gap:7px;
      }
      .r96-game-gallery{
        display:grid;
        gap:12px;
      }
      .r96-game-gallery-main{
        width:100%;
        aspect-ratio:16/9;
        border:1px solid var(--r96-line);
        border-radius:15px;
        background:linear-gradient(140deg,#071426,#101932);
        background-size:cover;
        background-repeat:no-repeat;
        background-position:center;
      }
      .r96-game-gallery-thumbs{
        display:flex;
        gap:9px;
        overflow:auto;
        padding-bottom:2px;
      }
      .r96-game-gallery-thumb{
        flex:0 0 104px;
        aspect-ratio:16/9;
        border:1px solid var(--r96-line);
        border-radius:10px;
        background-position:center;
        background-size:cover;
        background-repeat:no-repeat;
        cursor:pointer;
      }
      .r96-game-gallery-thumb[aria-current="true"]{
        border-color:var(--r96-accent);
        box-shadow:0 0 0 2px color-mix(in srgb,var(--r96-accent) 22%,transparent);
      }
      .r96-game-play{
        width:100%;
        min-height:50px;
        border:0;
        border-radius:13px;
        background:linear-gradient(135deg,var(--r96-accent),#d9fff9);
        color:#071017;
        font:inherit;
        font-weight:950;
      }
      .r96-game-play:disabled{
        opacity:.56;
        cursor:not-allowed;
      }
      .r96-game-detail-note{
        margin:0;
        color:var(--r96-muted);
        font-size:.72rem;
        line-height:1.5;
      }
      .r96-version-current{
        display:grid;
        gap:7px;
        padding:13px;
        border:1px solid var(--r96-line);
        border-radius:13px;
        background:var(--r96-bg-2);
      }
      .r96-version-current-top{
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:center;
      }
      .r96-version-current-top strong{font-size:.9rem}
      .r96-version-current-top span{
        color:var(--r96-muted);
        font-size:.7rem;
      }
      .r96-game-preview-panel{
        position:sticky;
        top:86px;
        align-self:start;
      }
      .r96-game-preview-panel .r96-card{
        min-height:500px;
      }
      .r96-game-preview-panel .r96-card-actions .r96-primary{
        pointer-events:none;
      }
      .r96-game-rating{
        display:flex;
        align-items:center;
        gap:8px;
        min-height:30px;
        color:var(--r96-muted);
        font-size:.76rem;
        font-weight:850;
      }
      .r96-game-rating strong{
        color:var(--r96-text);
        font-size:.86rem;
      }
      .r96-game-rating-stars{
        color:var(--r96-accent);
        letter-spacing:.04em;
      }
      .r96-card-actions{
        align-self:end;
        display:flex;
        flex-wrap:wrap;
        row-gap:18px;
        column-gap:20px;
        padding-top:12px;
        margin-top:4px;
      }
      .r96-card-actions .r96-primary{
        width:100%;
        opacity:.72;
      }
      .r96-card-actions .r96-secondary{
        flex:1 1 132px;
        min-width:0;
        min-height:44px;
      }
      .r96-review-modal-backdrop{
        position:fixed;
        inset:0;
        z-index:2147482700;
        display:grid;
        place-items:center;
        padding:20px;
        background:rgba(0,0,0,.72);
        backdrop-filter:blur(10px);
      }
      .r96-review-modal{
        width:min(560px,100%);
        display:grid;
        gap:16px;
        padding:20px;
        border:1px solid var(--r96-line);
        border-radius:20px;
        background:var(--r96-bg-2);
        color:var(--r96-text);
        box-shadow:0 30px 90px rgba(0,0,0,.48);
      }
      .r96-review-modal-head{
        display:flex;
        justify-content:space-between;
        gap:16px;
        align-items:center;
      }
      .r96-review-modal-head h3{margin:0}
      .r96-review-modal-close{
        width:36px;
        height:36px;
        border:1px solid var(--r96-line);
        border-radius:10px;
        background:var(--r96-panel);
        color:var(--r96-text);
        font:inherit;
        cursor:pointer;
      }
      .r96-review-form{
        display:grid;
        gap:12px;
      }
      .r96-review-form label{
        display:grid;
        gap:7px;
        color:var(--r96-muted);
        font-size:.76rem;
        font-weight:850;
      }
      .r96-review-form select,
      .r96-review-form textarea,
      .r96-game-comment-form textarea{
        width:100%;
        box-sizing:border-box;
        border:1px solid var(--r96-line);
        border-radius:12px;
        background:var(--r96-panel);
        color:var(--r96-text);
        padding:11px 12px;
        font:inherit;
      }
      .r96-review-form textarea,
      .r96-game-comment-form textarea{
        min-height:100px;
        resize:vertical;
      }
      .r96-community-feedback{
        min-height:20px;
        color:var(--r96-muted);
        font-size:.76rem;
        line-height:1.45;
      }
      .r96-community-feedback[data-error="1"]{color:#ffb6b6}
      .r96-game-community-detail{
        display:grid;
        gap:18px;
        margin:0 26px 26px;
        padding:20px;
        border:1px solid var(--r96-line);
        border-radius:18px;
        background:color-mix(in srgb,var(--r96-panel) 74%,transparent);
      }
      .r96-game-community-head{
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        justify-content:space-between;
        gap:12px;
      }
      .r96-game-community-head h3{margin:0}
      .r96-game-community-summary{
        color:var(--r96-muted);
        font-size:.8rem;
        font-weight:800;
      }
      .r96-game-community-grid{
        display:grid;
        grid-template-columns:minmax(0,1fr) minmax(0,1fr);
        gap:18px;
      }
      .r96-game-community-column{
        display:grid;
        gap:10px;
        align-content:start;
      }
      .r96-game-community-column h4{margin:0}
      .r96-community-entry{
        display:grid;
        gap:7px;
        padding:13px;
        border:1px solid var(--r96-line);
        border-radius:13px;
        background:var(--r96-bg-2);
      }
      .r96-community-entry-head{
        display:flex;
        flex-wrap:wrap;
        justify-content:space-between;
        gap:8px 12px;
        align-items:center;
      }
      .r96-community-entry-author{
        font-weight:900;
        font-size:.82rem;
      }
      .r96-community-entry-meta{
        color:var(--r96-muted);
        font-size:.68rem;
      }
      .r96-community-entry p{
        margin:0;
        color:var(--r96-text);
        line-height:1.55;
        white-space:pre-wrap;
      }
      .r96-game-comment-form{
        display:grid;
        gap:9px;
        margin-bottom:2px;
      }
      .r96-community-empty{
        margin:0;
        padding:12px;
        border:1px dashed var(--r96-line);
        border-radius:12px;
        color:var(--r96-muted);
        font-size:.78rem;
      }
      #reviews .r96-community-feed{
        display:grid;
        gap:12px;
      }
      .r96-community-feed-item{
        display:grid;
        gap:8px;
        padding:16px;
        border:1px solid var(--r96-line);
        border-radius:16px;
        background:var(--r96-panel);
      }
      .r96-community-feed-top{
        display:flex;
        flex-wrap:wrap;
        justify-content:space-between;
        gap:10px;
        align-items:center;
      }
      .r96-community-feed-kind{
        display:inline-flex;
        align-items:center;
        min-height:26px;
        padding:0 9px;
        border:1px solid var(--r96-line);
        border-radius:999px;
        color:var(--r96-muted);
        font-size:.67rem;
        font-weight:900;
        text-transform:uppercase;
      }
      .r96-community-game-link{
        border:0;
        background:transparent;
        color:var(--r96-accent);
        padding:0;
        font:inherit;
        font-weight:900;
        cursor:pointer;
        text-align:left;
      }
      @media(max-width:820px){
        .r96-card-actions .r96-primary,
        .r96-card-actions .r96-secondary{
          width:100%;
          flex-basis:100%;
        }
        .r96-game-studio-grid{grid-template-columns:1fr}
        .r96-game-preview-panel{position:static}
        .r96-game-detail-body{grid-template-columns:1fr}
        .r96-game-community-grid{grid-template-columns:1fr}
        .r96-game-detail-hero{aspect-ratio:16/10;min-height:240px}
      }
      @media(max-width:560px){
        .r96-game-modal-backdrop{padding:10px}
        .r96-game-studio-grid{padding:16px}
        .r96-game-form-row{grid-template-columns:1fr}
      }
    `;

    document.head.appendChild(style);
  }

  function safeUrl(value) {
    const raw = clean(value);
    if (!raw) return "";
    try {
      const url = new URL(raw);
      if (
        url.protocol === "https:" ||
        url.protocol === "http:" ||
        url.protocol === "blob:"
      ) {
        return url.href;
      }
    } catch (_) {}
    return "";
  }

  function clampPercent(value, fallback = 50) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(100, number));
  }

  function stageLabel(game) {
    const explicit = clean(game.stageLabel);
    if (explicit) return explicit;
    const key = clean(game.stageKey).toLowerCase();
    const found = STAGES.find(([stageKey]) => stageKey === key);
    return found?.[1] || t("En desarrollo", "In development");
  }

  function formatDate(value) {
    const raw = clean(value);
    if (!raw) return "";
    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(
        lang() === "en" ? "en-US" : "es",
        { year:"numeric", month:"short", day:"numeric" }
      ).format(date);
    } catch (_) {
      return date.toISOString().slice(0, 10);
    }
  }

  function setEmpty(message) {
    carousel.replaceChildren();
    carousel.hidden = true;

    if (!emptyNode) {
      emptyNode = document.createElement("p");
      emptyNode.className = "r96-games-empty";
      carousel.parentElement?.appendChild(emptyNode);
    }

    emptyNode.hidden = false;
    emptyNode.textContent = message;
  }

  function clearEmpty() {
    if (emptyNode) emptyNode.hidden = true;
    carousel.hidden = false;
  }

  function tagNodes(tags) {
    const wrap = document.createElement("div");
    wrap.className = "r96-game-tags";

    const safeTags = Array.isArray(tags)
      ? tags.map(clean).filter(Boolean)
      : [];

    const visible = safeTags.slice(0, 4);

    for (const tag of visible) {
      const pill = document.createElement("span");
      pill.className = "r96-game-tag";
      pill.textContent = tag;
      wrap.appendChild(pill);
    }

    if (safeTags.length > visible.length) {
      const more = document.createElement("span");
      more.className = "r96-game-tag";
      more.textContent = "+" + (safeTags.length - visible.length);
      more.title = safeTags.slice(visible.length).join(", ");
      wrap.appendChild(more);
    }

    return wrap;
  }

  function metaRow(game) {
    const meta = document.createElement("div");
    meta.className = "r96-meta r96-game-meta";

    const genre = clean(game.genre);
    const version = clean(game.currentVersion);
    const updated = formatDate(game.versionUpdatedAt);

    if (genre) {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = t("Género: ", "Genre: ");
      row.append(strong, document.createTextNode(genre));
      meta.appendChild(row);
    }

    if (version) {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = t("Versión: ", "Version: ");
      row.append(strong, document.createTextNode(version));
      meta.appendChild(row);
    }

    if (updated) {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = t("Actualizado: ", "Updated: ");
      row.append(strong, document.createTextNode(updated));
      meta.appendChild(row);
    }

    return meta;
  }

  function signedIn() {
    return document
      .querySelector(".r96-account-visual")
      ?.dataset?.r96AuthState === "signedIn";
  }

  function communitySummaryFor(gameId) {
    const id = clean(gameId);
    const rows = Array.isArray(communityOverview?.summaries)
      ? communityOverview.summaries
      : [];

    return rows.find(row => clean(row?.gameId) === id) || {
      gameId:id,
      averageRating:0,
      reviewCount:0
    };
  }

  function gameForId(gameId) {
    const id = clean(gameId);
    const games = Array.isArray(lastCatalogPayload?.games)
      ? lastCatalogPayload.games
      : [];
    return games.find(game => clean(game?.id) === id) || null;
  }

  function ratingStars(value) {
    const rating = Math.max(
      0,
      Math.min(5, Math.round(Number(value || 0)))
    );
    return "★★★★★".slice(0, rating) +
      "☆☆☆☆☆".slice(0, 5 - rating);
  }

  function communityError(code) {
    const errors = {
      REVIEW_ENDPOINT_NOT_FOUND:t(
        "El servicio de reseñas no está publicado en Wix.",
        "The review service is not deployed on Wix."
      ),
      REVIEW_RESPONSE_INVALID:t(
        "Wix devolvió una respuesta inválida al guardar.",
        "Wix returned an invalid save response."
      ),
      REVIEW_NETWORK_FAILED:t(
        "No se pudo conectar con el servicio de reseñas.",
        "Could not connect to the review service."
      ),
      REVIEW_SAVE_TIMEOUT:t(
        "El guardado agotó el tiempo de espera.",
        "Saving the review timed out."
      ),
      FEEDBACK_SAVE_FAILED:t(
        "No se pudo guardar. Verifica que el backend actualizado esté publicado.",
        "Could not save. Verify the updated backend is published."
      ),
      FEEDBACK_NETWORK_FAILED:t(
        "No se pudo conectar al servicio.",
        "Could not connect to the service."
      ),
      REVIEW_SAVE_FAILED:t(
        "El servicio de Wix rechazó el guardado de la reseña.",
        "The Wix service failed to save the review."
      ),

      GAME_NOT_FOUND:t(
        "Este juego ya no está disponible.",
        "This game is no longer available."
      ),
      REVIEW_RATING_INVALID:t(
        "Selecciona una calificación de 1 a 5.",
        "Choose a rating from 1 to 5."
      ),
      REVIEW_BODY_REQUIRED:t(
        "Escribe una reseña de al menos 5 caracteres.",
        "Write a review of at least 5 characters."
      ),
      COMMENT_BODY_REQUIRED:t(
        "Escribe un comentario.",
        "Write a comment."
      )
    };

    // Show the actual error returned by Wix when no translation is defined.
    return errors[clean(code)] || clean(code) || "UNKNOWN_REVIEW_ERROR";
  }

  function communityDetailAction(gameId) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("GAME_COMMUNITY_TIMEOUT"));
      }, 12000);

      pending.set(id, { resolve, reject, timeout });

      window.parent.postMessage({
        source:SOURCE_UI,
        protocol:PROTOCOL,
        type:"community-detail-action",
        requestId:id,
        gameId:clean(gameId)
      }, HOST_ORIGIN);
    });
  }

  function submitReview(input = {}) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("REVIEW_SAVE_TIMEOUT"));
      }, 12000);

      pending.set(id, { resolve, reject, timeout });

      window.parent.postMessage({
        source:SOURCE_UI,
        protocol:PROTOCOL,
        type:"review-submit-action",
        requestId:id,
        input:{
          gameId:clean(input.gameId),
          rating:Number(input.rating || 0),
          body:String(input.body || ""),
          authorDisplayName:clean(input.authorDisplayName).slice(0, 100)
        }
      }, HOST_ORIGIN);
    });
  }

  function communityWriteAction(action, input = {}) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("COMMUNITY_ACTION_TIMEOUT"));
      }, 12000);

      pending.set(id, { resolve, reject, timeout });

      window.parent.postMessage({
        source:SOURCE_UI,
        protocol:PROTOCOL,
        type:"community-write-action",
        requestId:id,
        action:clean(action),
        input
      }, HOST_ORIGIN);
    });
  }

  function removeReviewModal() {
    document.getElementById(REVIEW_MODAL_ID)?.remove();
  }

  function updateOpenGameCommunity(gameId, data) {
    const section = document.querySelector(
      "#" + DETAIL_MODAL_ID + " .r96-game-community-detail"
    );

    const game = gameForId(gameId);
    if (
      section &&
      clean(section.dataset.r96CommunityGame) === clean(gameId) &&
      game &&
      data
    ) {
      renderGameCommunitySection(game, data, section);
    }
  }

  function openReviewComposer(game) {
    ensureStyle();
    removeReviewModal();

    const backdrop = document.createElement("div");
    backdrop.id = REVIEW_MODAL_ID;
    backdrop.className = "r96-review-modal-backdrop";

    const modal = document.createElement("section");
    modal.className = "r96-review-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const head = document.createElement("div");
    head.className = "r96-review-modal-head";

    const title = document.createElement("h3");
    title.textContent = t(
      "Tu reseña · " + clean(game.title),
      "Your review · " + clean(game.title)
    );

    const close = document.createElement("button");
    close.className = "r96-review-modal-close";
    close.type = "button";
    close.textContent = "×";
    close.addEventListener("click", removeReviewModal);

    head.append(title, close);
    modal.appendChild(head);

      const form = document.createElement("form");
      form.className = "r96-review-form";

      const ratingLabel = document.createElement("label");
      ratingLabel.textContent = t("Calificación", "Rating");

      const rating = document.createElement("select");
      for (let value = 5; value >= 1; value -= 1) {
        const option = document.createElement("option");
        option.value = String(value);
        option.textContent =
          value + " · " + ratingStars(value);
        rating.appendChild(option);
      }
      ratingLabel.appendChild(rating);

      const nameLabel = document.createElement("label");
      nameLabel.textContent = t("Tu nombre (opcional)", "Your name (optional)");
      const authorNameInput = document.createElement("input");
      authorNameInput.type = "text";
      authorNameInput.maxLength = 100;
      authorNameInput.placeholder = t("Invitado", "Guest");
      nameLabel.appendChild(authorNameInput);

      const bodyLabel = document.createElement("label");
      bodyLabel.textContent = t("Reseña", "Review");

      const body = document.createElement("textarea");
      body.maxLength = 2500;
      body.placeholder = t(
        "¿Qué te pareció este juego?",
        "What did you think of this game?"
      );
      bodyLabel.appendChild(body);

      const feedback = document.createElement("div");
      feedback.className = "r96-community-feedback";
      feedback.setAttribute("aria-live", "polite");

      const submit = document.createElement("button");
      submit.className = "r96-primary";
      submit.type = "submit";
      submit.textContent = t("Guardar reseña", "Save review");

      form.append(nameLabel, ratingLabel, bodyLabel, feedback, submit);

      let saving = false;
      form.addEventListener("submit", async event => {
        event.preventDefault();
        if (saving) return;
        saving = true;
        feedback.dataset.error = "0";
        feedback.textContent = t(
          "Guardando reseña…",
          "Saving review…"
        );
        submit.disabled = true;

        try {
          const data = await submitReview({
            gameId:clean(game.id),
            rating:Number(rating.value || 0),
            body:body.value,
            authorDisplayName:authorNameInput.value
          });

          feedback.textContent = t(
            "Reseña guardada.",
            "Review saved."
          );
          updateOpenGameCommunity(game.id, data);

          setTimeout(removeReviewModal, 300);
        } catch (error) {
          feedback.dataset.error = "1";
          feedback.textContent = communityError(error?.message);
          saving = false;
          submit.disabled = false;
        }
      });

      modal.appendChild(form);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) removeReviewModal();
    });
  }

  function communityEntry(item, kind) {
    const article = document.createElement("article");
    article.className = "r96-community-entry";

    const head = document.createElement("div");
    head.className = "r96-community-entry-head";

    const photoUrl = safeUrl(item?.authorPhoto);
    if (photoUrl) {
      const photo = document.createElement("img");
      photo.src = photoUrl;
      photo.alt = "";
      photo.loading = "lazy";
      photo.referrerPolicy = "no-referrer";
      photo.width = 32;
      photo.height = 32;
      photo.style.cssText = "width:32px;height:32px;object-fit:cover;border-radius:50%;flex:none";
      head.appendChild(photo);
    }

    const author = document.createElement("span");
    author.className = "r96-community-entry-author";
    author.textContent =
      clean(item?.authorDisplayName) ||
      t("Usuario Nexo", "Nexo user");

    const meta = document.createElement("span");
    meta.className = "r96-community-entry-meta";
    const pieces = [];
    if (kind === "review") {
      pieces.push(ratingStars(item?.rating));
    }
    if (clean(item?.versionLabel)) {
      pieces.push("v" + clean(item.versionLabel));
    }
    if (clean(item?.updatedAt || item?.createdAt)) {
      pieces.push(formatDate(item.updatedAt || item.createdAt));
    }
    meta.textContent = pieces.join(" · ");

    const body = document.createElement("p");
    body.textContent = clean(item?.body);

    head.append(author, meta);
    article.append(head, body);
    return article;
  }

  function renderGameCommunitySection(game, data, section) {
    section.replaceChildren();
    section.dataset.r96CommunityGame = clean(game.id);

    const summary = data?.summary || {};

    const head = document.createElement("div");
    head.className = "r96-game-community-head";

    const title = document.createElement("h3");
    title.textContent = t(
      "Reseñas y comentarios",
      "Reviews and comments"
    );

    const summaryText = document.createElement("div");
    summaryText.className = "r96-game-community-summary";
    summaryText.textContent =
      (
        Number(summary.reviewCount || 0)
          ? "★ " + Number(summary.averageRating || 0).toFixed(1)
          : t("Sin calificación", "No rating")
      ) +
      " · " +
      Number(summary.reviewCount || 0) +
      " " +
      t("reseñas", "reviews") +
      " · " +
      Number(summary.commentCount || 0) +
      " " +
      t("comentarios", "comments");

    const reviewButton = document.createElement("button");
    reviewButton.className = "r96-secondary";
    reviewButton.type = "button";
    reviewButton.textContent = t("Dar reseña", "Write review");
    reviewButton.addEventListener("click", () => {
      openReviewComposer(game);
    });

    head.append(title, summaryText, reviewButton);

    const grid = document.createElement("div");
    grid.className = "r96-game-community-grid";

    const reviewsColumn = document.createElement("div");
    reviewsColumn.className = "r96-game-community-column";

    const reviewsTitle = document.createElement("h4");
    reviewsTitle.textContent = t("Reseñas", "Reviews");
    reviewsColumn.appendChild(reviewsTitle);

    const reviews = Array.isArray(data?.reviews)
      ? data.reviews
      : [];

    if (!reviews.length) {
      const empty = document.createElement("p");
      empty.className = "r96-community-empty";
      empty.textContent = t(
        "Este juego todavía no tiene reseñas.",
        "This game has no reviews yet."
      );
      reviewsColumn.appendChild(empty);
    } else {
      reviews.forEach(review => {
        reviewsColumn.appendChild(
          communityEntry(review, "review")
        );
      });
    }

    const commentsColumn = document.createElement("div");
    commentsColumn.className = "r96-game-community-column";

    const commentsTitle = document.createElement("h4");
    commentsTitle.textContent = t("Comentarios", "Comments");
    commentsColumn.appendChild(commentsTitle);

    // Public comments, including visitors without a Nexo account.
    const form = document.createElement("form");
    form.className = "r96-game-comment-form";

    const authorLabel = document.createElement("label");
    authorLabel.textContent = t("Tu nombre (opcional)", "Your name (optional)");
    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.maxLength = 100;
    authorInput.placeholder = t("Invitado", "Guest");
    authorLabel.appendChild(authorInput);

    const textarea = document.createElement("textarea");
    textarea.maxLength = 1500;
    textarea.placeholder = t(
      "Escribe un comentario sobre este juego…",
      "Write a comment about this game…"
    );

    const feedback = document.createElement("div");
    feedback.className = "r96-community-feedback";
    feedback.setAttribute("aria-live", "polite");

    const submit = document.createElement("button");
    submit.className = "r96-secondary";
    submit.type = "submit";
    submit.textContent = t("Publicar comentario", "Post comment");

    form.append(authorLabel, textarea, feedback, submit);

    let posting = false;
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (posting) return;

      posting = true;
      feedback.dataset.error = "0";
      feedback.textContent = t("Publicando…", "Posting…");
      submit.disabled = true;

      try {
        const nextData = await communityWriteAction("comment.create", {
          gameId: clean(game.id),
          body: textarea.value,
          authorDisplayName: authorInput.value.trim()
        });
        renderGameCommunitySection(game, nextData, section);
      } catch (error) {
        feedback.dataset.error = "1";
        feedback.textContent = communityError(error?.message);
        posting = false;
        submit.disabled = false;
      }
    });

    commentsColumn.appendChild(form);

    const comments = Array.isArray(data?.comments)
      ? data.comments
      : [];

    if (!comments.length) {
      const empty = document.createElement("p");
      empty.className = "r96-community-empty";
      empty.textContent = t(
        "Este juego todavía no tiene comentarios.",
        "This game has no comments yet."
      );
      commentsColumn.appendChild(empty);
    } else {
      comments.forEach(comment => {
        commentsColumn.appendChild(
          communityEntry(comment, "comment")
        );
      });
    }

    grid.append(reviewsColumn, commentsColumn);
    section.append(head, grid);
  }

  async function loadGameCommunitySection(game, section) {
    section.replaceChildren();
    section.dataset.r96CommunityGame = clean(game.id);

    const loading = document.createElement("p");
    loading.className = "r96-community-empty";
    loading.textContent = t(
      "Cargando reseñas y comentarios…",
      "Loading reviews and comments…"
    );
    section.appendChild(loading);

    try {
      const data = await communityDetailAction(game.id);
      renderGameCommunitySection(game, data, section);
    } catch (_) {
      loading.textContent = t(
        "No se pudieron cargar las reseñas y comentarios.",
        "Reviews and comments could not be loaded."
      );
    }
  }

  function renderRecentActivity() {
    const section = document.getElementById("reviews");
    if (!section) return;

    const copy = section.querySelector(
      ".r96-title-row > .r96-copy"
    );
    if (copy) {
      copy.textContent = t(
        "Aquí aparecen las reseñas y comentarios más recientes de todos los juegos.",
        "The most recent reviews and comments from all games appear here."
      );
    }

    const current =
      section.querySelector(".r96-community-feed") ||
      section.querySelector(".r96-two");

    const feed = document.createElement("div");
    feed.className = "r96-inner r96-community-feed";

    const activity = Array.isArray(
      communityOverview?.recentActivity
    )
      ? communityOverview.recentActivity
      : [];

    if (!activity.length) {
      const empty = document.createElement("article");
      empty.className = "r96-community-feed-item";
      empty.textContent = t(
        "Todavía no hay reseñas ni comentarios publicados.",
        "No reviews or comments have been posted yet."
      );
      feed.appendChild(empty);
    } else {
      activity.forEach(item => {
        const article = document.createElement("article");
        article.className = "r96-community-feed-item";

        const top = document.createElement("div");
        top.className = "r96-community-feed-top";

        const kind = document.createElement("span");
        kind.className = "r96-community-feed-kind";
        kind.textContent =
          clean(item.type) === "review"
            ? t("Reseña", "Review")
            : t("Comentario", "Comment");

        const gameButton = document.createElement("button");
        gameButton.className = "r96-community-game-link";
        gameButton.type = "button";
        gameButton.textContent =
          clean(item.gameTitle) ||
          t("Juego", "Game");

        const game = gameForId(item.gameId);
        if (game) {
          gameButton.addEventListener("click", () => {
            openGameDetail(game);
          });
        } else {
          gameButton.disabled = true;
        }

        top.append(kind, gameButton);

        const entry = communityEntry(
          item,
          clean(item.type) === "review"
            ? "review"
            : "comment"
        );

        article.append(top, entry);
        feed.appendChild(article);
      });
    }

    if (current) {
      current.replaceWith(feed);
    } else {
      section.appendChild(feed);
    }
  }

  function gameCard(game, index, previewMode = false, onEditPreview = null) {
    const article = document.createElement("article");
    article.className = "r96-card";
    article.dataset.r96GameId = clean(game.id);

    const thumb = document.createElement("div");
    thumb.className = "r96-thumb r96-game-thumb";

    const preview = safeUrl(game.previewImage);
    if (preview) {
      thumb.classList.add("r96-has-preview");
      thumb.style.backgroundImage =
        "linear-gradient(rgba(4,8,18,.15),rgba(4,8,18,.32)),url(" +
        JSON.stringify(preview) +
        ")";
      thumb.style.backgroundPosition =
        clampPercent(game.previewPositionX) + "% " +
        clampPercent(game.previewPositionY) + "%";
    }

    const code = document.createElement("span");
    code.className = "r96-thumb-code";
    code.textContent = previewMode ? "NEW" : String(index + 1).padStart(2, "0");

    const stage = document.createElement("span");
    stage.className = "r96-thumb-label";
    stage.textContent = stageLabel(game);

    thumb.append(code, stage);

    if (
      previewMode &&
      preview &&
      typeof onEditPreview === "function"
    ) {
      const edit = document.createElement("button");
      edit.className = "r96-thumb-edit";
      edit.type = "button";
      edit.textContent = t("Editar encuadre", "Edit framing");
      edit.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        onEditPreview();
      });
      thumb.appendChild(edit);
    }

    const body = document.createElement("div");
    body.className = "r96-card-body";

    const tags = tagNodes(game.tags);

    const title = document.createElement("h3");
    title.className = "r96-h3";
    title.textContent =
      clean(game.title) ||
      t("Título del juego", "Game title");

    const desc = document.createElement("p");
    desc.className = "r96-desc r96-game-desc";
    desc.textContent =
      clean(game.description) ||
      t("La descripción aparecerá aquí.", "The description will appear here.");

    const meta = metaRow(game);

    const rating = document.createElement("div");
    rating.className = "r96-game-rating";

    if (!previewMode) {
      const summary = communitySummaryFor(game.id);

      const stars = document.createElement("span");
      stars.className = "r96-game-rating-stars";
      stars.textContent = Number(summary.reviewCount || 0)
        ? "★"
        : "☆";

      const score = document.createElement("strong");
      score.textContent = Number(summary.reviewCount || 0)
        ? Number(summary.averageRating || 0).toFixed(1)
        : "—";

      const count = document.createElement("span");
      count.textContent =
        Number(summary.reviewCount || 0) +
        " " +
        t("reseñas", "reviews");

      rating.append(stars, score, count);
    }

    const actions = document.createElement("div");
    actions.className = "r96-card-actions";

    const open = document.createElement("button");
    open.className = "r96-primary";
    open.type = "button";
    open.textContent = t("Ver juego", "View game");

    if (previewMode) {
      open.setAttribute("aria-disabled", "true");
      open.tabIndex = -1;
    } else {
      open.removeAttribute("aria-disabled");
      open.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openGameDetail(game);
      });
    }

    actions.appendChild(open);

    if (!previewMode) {
      const review = document.createElement("button");
      review.className = "r96-secondary";
      review.type = "button";
      review.textContent = t("Dar reseña", "Write review");
      review.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openReviewComposer(game);
      });
      actions.appendChild(review);
    }

    if (
      !previewMode &&
      game.hasPlayableBuild === true
    ) {
      const launch = document.createElement("button");
      launch.className = "r96-secondary";
      launch.type = "button";
      launch.textContent = launchLabel();
      launch.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        performGameLaunch(game, launch);
      });
      actions.appendChild(launch);
    }

    body.append(tags, title, desc, meta);
    if (!previewMode) body.appendChild(rating);
    body.appendChild(actions);
    article.append(thumb, body);

    return article;
  }

  function detailImages(game) {
    const result = [];
    const seen = new Set();

    const add = value => {
      const url = safeUrl(value);
      if (!url || seen.has(url)) return;
      seen.add(url);
      result.push(url);
    };

    add(game.previewImage);

    if (Array.isArray(game.galleryImages)) {
      game.galleryImages.forEach(add);
    }

    return result;
  }

  function buildTypeLabel(value) {
    const key = clean(value).toLowerCase();
    const labels = {
      windows:"Windows",
      android:"Android",
      package:t("Paquete", "Package"),
      file:t("Archivo", "File")
    };
    return labels[key] || t("No especificado", "Not specified");
  }

  function removeGameDetail() {
    document.getElementById(DETAIL_MODAL_ID)?.remove();
  }

  function detailMetaRow(labelText, value) {
    const row = document.createElement("div");
    row.className = "r96-game-detail-meta-row";

    const label = document.createElement("span");
    label.textContent = labelText;

    const strong = document.createElement("strong");
    strong.textContent = clean(value) || "—";

    row.append(label, strong);
    return row;
  }

  function openGameDetail(game) {
    ensureStyle();
    removeGameDetail();

    const backdrop = document.createElement("div");
    backdrop.id = DETAIL_MODAL_ID;
    backdrop.className = "r96-game-detail-backdrop";

    const detail = document.createElement("section");
    detail.className = "r96-game-detail";
    detail.setAttribute("role", "dialog");
    detail.setAttribute("aria-modal", "true");
    detail.setAttribute("aria-labelledby", "r96-game-detail-title");

    const head = document.createElement("div");
    head.className = "r96-game-detail-head";

    const headTitle = document.createElement("strong");
    headTitle.textContent = clean(game.title);

    const close = document.createElement("button");
    close.className = "r96-game-detail-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", t("Cerrar", "Close"));
    close.addEventListener("click", removeGameDetail);

    head.append(headTitle, close);

    const hero = document.createElement("div");
    hero.className = "r96-game-detail-hero";

    const preview = safeUrl(game.previewImage);
    if (preview) {
      hero.style.backgroundImage =
        "url(" + JSON.stringify(preview) + ")";
      hero.style.backgroundPosition =
        clampPercent(game.previewPositionX) + "% " +
        clampPercent(game.previewPositionY) + "%";
    }

    const heroCopy = document.createElement("div");
    heroCopy.className = "r96-game-detail-hero-copy";

    const stage = document.createElement("span");
    stage.className = "r96-game-detail-stage";
    stage.textContent = stageLabel(game);

    const title = document.createElement("h2");
    title.id = "r96-game-detail-title";
    title.className = "r96-game-detail-title";
    title.textContent = clean(game.title);

    heroCopy.append(stage, title);
    hero.appendChild(heroCopy);

    const body = document.createElement("div");
    body.className = "r96-game-detail-body";

    const main = document.createElement("div");
    main.className = "r96-game-detail-main";

    const descriptionSection = document.createElement("section");
    descriptionSection.className = "r96-game-detail-section";

    const descriptionTitle = document.createElement("h3");
    descriptionTitle.textContent = t("Descripción", "Description");

    const description = document.createElement("p");
    description.className = "r96-game-detail-description";
    description.textContent =
      clean(game.description) ||
      t("Sin descripción.", "No description.");

    descriptionSection.append(descriptionTitle, description);

    const images = detailImages(game);

    if (images.length) {
      const gallerySection = document.createElement("section");
      gallerySection.className = "r96-game-detail-section";

      const galleryTitle = document.createElement("h3");
      galleryTitle.textContent = t("Galería", "Gallery");

      const gallery = document.createElement("div");
      gallery.className = "r96-game-gallery";

      const galleryMain = document.createElement("div");
      galleryMain.className = "r96-game-gallery-main";
      galleryMain.style.backgroundImage =
        "url(" + JSON.stringify(images[0]) + ")";
      galleryMain.style.backgroundPosition =
        clampPercent(game.previewPositionX) + "% " +
        clampPercent(game.previewPositionY) + "%";

      const thumbs = document.createElement("div");
      thumbs.className = "r96-game-gallery-thumbs";

      images.forEach((url, index) => {
        const thumb = document.createElement("button");
        thumb.className = "r96-game-gallery-thumb";
        thumb.type = "button";
        thumb.style.backgroundImage =
          "url(" + JSON.stringify(url) + ")";
        thumb.setAttribute(
          "aria-label",
          t(
            "Ver imagen " + (index + 1),
            "View image " + (index + 1)
          )
        );
        thumb.setAttribute(
          "aria-current",
          index === 0 ? "true" : "false"
        );

        thumb.addEventListener("click", () => {
          galleryMain.style.backgroundImage =
            "url(" + JSON.stringify(url) + ")";
          galleryMain.style.backgroundPosition =
            index === 0
              ? clampPercent(game.previewPositionX) + "% " +
                clampPercent(game.previewPositionY) + "%"
              : "50% 50%";

          thumbs
            .querySelectorAll(".r96-game-gallery-thumb")
            .forEach(node => node.setAttribute("aria-current", "false"));

          thumb.setAttribute("aria-current", "true");
        });

        thumbs.appendChild(thumb);
      });

      gallery.append(galleryMain, thumbs);
      gallerySection.append(galleryTitle, gallery);
      main.append(descriptionSection, gallerySection);
    } else {
      main.appendChild(descriptionSection);
    }

    const side = document.createElement("aside");
    side.className = "r96-game-detail-side";

    const infoSection = document.createElement("section");
    infoSection.className = "r96-game-detail-section";

    const infoTitle = document.createElement("h3");
    infoTitle.textContent = t("Información", "Information");

    const meta = document.createElement("div");
    meta.className = "r96-game-detail-meta";
    meta.append(
      detailMetaRow(t("Etapa", "Stage"), stageLabel(game)),
      detailMetaRow(t("Género", "Genre"), game.genre),
      detailMetaRow(
        t("Versión", "Version"),
        game.currentVersion
      ),
      detailMetaRow(
        t("Actualizado", "Updated"),
        formatDate(game.versionUpdatedAt)
      )
    );

    if (game.hasBuild) {
      meta.append(
        detailMetaRow(
          t("Build", "Build"),
          buildTypeLabel(game.buildType)
        )
      );
    }

    const tags = document.createElement("div");
    tags.className = "r96-game-detail-tags";

    const tagValues = Array.isArray(game.tags)
      ? game.tags.map(clean).filter(Boolean)
      : [];

    tagValues.forEach(value => {
      const pill = document.createElement("span");
      pill.className = "r96-game-tag";
      pill.textContent = value;
      tags.appendChild(pill);
    });

    infoSection.append(infoTitle, meta);
    if (tagValues.length) infoSection.appendChild(tags);

    const playSection = document.createElement("section");
    playSection.className = "r96-game-detail-section";

    const playTitle = document.createElement("h3");
    playTitle.textContent = t("Jugar", "Play");

    const play = document.createElement("button");
    play.className = "r96-game-play";
    play.type = "button";

    const canLaunch = game.hasPlayableBuild === true;

    play.disabled = !canLaunch;
    play.textContent = canLaunch
      ? launchLabel()
      : t("Juego no disponible", "Game unavailable");

    const playNote = document.createElement("p");
    playNote.className = "r96-game-detail-note";
    playNote.textContent = canLaunch
      ? t(
          "Abre esta versión del juego HTML directamente en el navegador.",
          "Opens this HTML game version directly in the browser."
        )
      : t(
          "Esta versión todavía no tiene un runtime jugable publicado.",
          "This version does not have a playable runtime yet."
        );

    const launchStatus = document.createElement("div");
    launchStatus.className = "r96-game-launch-status";
    launchStatus.setAttribute("aria-live", "polite");

    if (canLaunch) {
      play.addEventListener("click", () => {
        performGameLaunch(game, play, launchStatus);
      });
    }

    playSection.append(playTitle, play, playNote, launchStatus);

    const versionSection = document.createElement("section");
    versionSection.className = "r96-game-detail-section";

    const versionTitle = document.createElement("h3");
    versionTitle.textContent = t(
      "Versiones",
      "Versions"
    );

    const currentVersion = document.createElement("div");
    currentVersion.className = "r96-version-current";

    const currentTop = document.createElement("div");
    currentTop.className = "r96-version-current-top";

    const currentName = document.createElement("strong");
    currentName.textContent =
      clean(game.currentVersion) ||
      t("Versión actual", "Current version");

    const currentDate = document.createElement("span");
    currentDate.textContent = formatDate(game.versionUpdatedAt);

    currentTop.append(currentName, currentDate);

    const versionNote = document.createElement("p");
    versionNote.className = "r96-game-detail-note";
    versionNote.textContent = t(
      "Esta es la versión publicada actualmente. El historial y las notas de cambios se habilitan cuando implementemos las actualizaciones del juego.",
      "This is the current published version. Full history and release notes are enabled when game updates are implemented."
    );

    currentVersion.append(currentTop, versionNote);
    versionSection.append(versionTitle, currentVersion);

    side.append(infoSection, playSection, versionSection);
    body.append(main, side);

    const communitySection = document.createElement("section");
    communitySection.className = "r96-game-community-detail";
    communitySection.dataset.r96CommunityGame = clean(game.id);

    detail.append(head, hero, body, communitySection);
    backdrop.appendChild(detail);
    document.body.appendChild(backdrop);
    loadGameCommunitySection(game, communitySection);

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) removeGameDetail();
    });

    const onKey = event => {
      if (event.key !== "Escape") return;
      document.removeEventListener("keydown", onKey);
      removeGameDetail();
    };
    document.addEventListener("keydown", onKey);
  }

  function renderCatalog(payload) {
    ensureStyle();
    lastCatalogPayload = payload || { games: [], count: 0 };

    const games = Array.isArray(payload?.games)
      ? payload.games.filter((game) => game && clean(game.id) && clean(game.title))
      : [];

    if (gamesStat) gamesStat.textContent = String(games.length);

    if (titleCopy) {
      titleCopy.textContent = t(
        "Aquí aparecen únicamente los juegos publicados en Rising Games.",
        "Only published Rising Games titles appear here."
      );
    }

    if (!games.length) {
      setEmpty(t(
        "Aún no hay juegos publicados.",
        "No games have been published yet."
      ));
      return;
    }

    clearEmpty();
    carousel.replaceChildren();

    games.forEach((game, index) => {
      carousel.appendChild(gameCard(game, index));
    });

    carousel.setAttribute(
      "aria-label",
      t("Juegos publicados", "Published games")
    );
  }

  function accountRole() {
    const account = document.querySelector(".r96-account-visual");
    if (account?.dataset?.r96AuthState !== "signedIn") return "";
    return clean(account?.dataset?.r96AccessRole).toLowerCase();
  }

  function canPublish() {
    const role = accountRole();
    return role === "wonder" || role === "developer";
  }

  function closeMenu() {
    const panel = document.querySelector("#r96-menu-panel");
    const menu = document.querySelector("#r96-menu");
    if (panel) panel.hidden = true;
    menu?.setAttribute("aria-expanded", "false");
  }

  function syncAddGameButton() {
    const panel = document.querySelector("#r96-menu-panel");
    if (!panel) return;

    let button = document.getElementById(ADD_BUTTON_ID);

    if (!canPublish()) {
      button?.remove();
      return;
    }

    if (button) return;

    button = document.createElement("button");
    button.id = ADD_BUTTON_ID;
    button.type = "button";
    button.textContent = t("Agregar juego", "Add game");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      openStudio();
    });

    panel.appendChild(button);
  }

  function installStudioObserver() {
    if (studioObserver) return;

    studioObserver = new MutationObserver(() => {
      syncAddGameButton();
    });

    studioObserver.observe(document.body, {
      attributes:true,
      childList:true,
      subtree:true,
      attributeFilter:[
        "data-r96-auth-state",
        "data-r96-access-role",
        "lang"
      ]
    });

    syncAddGameButton();
  }

  function requestId() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(
      bytes,
      value => value.toString(16).padStart(2, "0")
    ).join("");
  }

  function launchAction(gameId) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("GAME_LAUNCH_TIMEOUT"));
      }, 15000);

      pending.set(id, {
        resolve,
        reject,
        timeout
      });

      window.parent.postMessage({
        source: SOURCE_UI,
        protocol: PROTOCOL,
        type: "launch-action",
        requestId:id,
        gameId:clean(gameId)
      }, HOST_ORIGIN);
    });
  }

  const RUNTIME_CACHE_PREFIX = "r96-html-runtime-";
  const RUNTIME_ROOT = "/risin96ames/runtime/";
  let jsZipPromise = null;
  let runtimeWorkerPromise = null;

  function launchLabel() {
    return t("Jugar", "Play");
  }

  function ensureJsZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (jsZipPromise) return jsZipPromise;

    jsZipPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        'script[data-r96-jszip="1"]'
      );

      if (existing) {
        existing.addEventListener("load", () => {
          window.JSZip
            ? resolve(window.JSZip)
            : reject(new Error("HTML_RUNTIME_PREPARE_FAILED"));
        }, { once:true });

        existing.addEventListener("error", () => {
          reject(new Error("HTML_RUNTIME_PREPARE_FAILED"));
        }, { once:true });

        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
      script.async = true;
      script.dataset.r96Jszip = "1";

      script.onload = () => {
        window.JSZip
          ? resolve(window.JSZip)
          : reject(new Error("HTML_RUNTIME_PREPARE_FAILED"));
      };

      script.onerror = () => {
        reject(new Error("HTML_RUNTIME_PREPARE_FAILED"));
      };

      document.head.appendChild(script);
    });

    return jsZipPromise;
  }

  function ensureRuntimeWorker() {
    if (!("serviceWorker" in navigator)) {
      return Promise.reject(
        new Error("HTML_RUNTIME_UNSUPPORTED")
      );
    }

    if (runtimeWorkerPromise) return runtimeWorkerPromise;

    runtimeWorkerPromise = (async () => {
      await navigator.serviceWorker.register(
        "/risin96ames/r96-runtime-sw.js",
        {
          scope:"/risin96ames/"
        }
      );

      await navigator.serviceWorker.ready;
      return true;
    })();

    return runtimeWorkerPromise;
  }

  function cleanZipPath(value) {
    const normalized = String(value || "")
      .replace(/\\/g, "/")
      .replace(/^\.\//, "")
      .replace(/^\/+/, "");

    if (
      !normalized ||
      normalized.includes("\0") ||
      normalized.split("/").some(part => part === "..")
    ) {
      return "";
    }

    return normalized;
  }

  function encodeRuntimePath(value) {
    return cleanZipPath(value)
      .split("/")
      .filter(Boolean)
      .map(segment => encodeURIComponent(segment))
      .join("/");
  }

  function mimeTypeForPath(path) {
    const ext = clean(path)
      .toLowerCase()
      .split("?")[0]
      .split("#")[0]
      .split(".")
      .pop();

    const types = {
      html:"text/html; charset=utf-8",
      htm:"text/html; charset=utf-8",
      css:"text/css; charset=utf-8",
      js:"text/javascript; charset=utf-8",
      mjs:"text/javascript; charset=utf-8",
      json:"application/json; charset=utf-8",
      map:"application/json; charset=utf-8",
      txt:"text/plain; charset=utf-8",
      xml:"application/xml; charset=utf-8",
      svg:"image/svg+xml",
      png:"image/png",
      jpg:"image/jpeg",
      jpeg:"image/jpeg",
      webp:"image/webp",
      gif:"image/gif",
      ico:"image/x-icon",
      mp3:"audio/mpeg",
      wav:"audio/wav",
      ogg:"audio/ogg",
      m4a:"audio/mp4",
      mp4:"video/mp4",
      webm:"video/webm",
      wasm:"application/wasm",
      woff:"font/woff",
      woff2:"font/woff2",
      ttf:"font/ttf",
      otf:"font/otf"
    };

    return types[ext] || "application/octet-stream";
  }

  async function pruneRuntimeCaches(currentCacheName) {
    try {
      const keys = (await caches.keys())
        .filter(key => key.startsWith(RUNTIME_CACHE_PREFIX))
        .sort()
        .reverse();

      const keep = new Set(
        [currentCacheName, ...keys.filter(key => key !== currentCacheName)]
          .slice(0, 5)
      );

      await Promise.all(
        keys
          .filter(key => !keep.has(key))
          .map(key => caches.delete(key))
      );
    } catch (_) {}
  }

  function updateLaunchStatus(statusNode, textValue, isError = false) {
    if (!statusNode) return;
    statusNode.dataset.error = isError ? "1" : "0";
    statusNode.textContent = textValue;
  }

  async function prepareHtmlRuntime(packageUrl, game, statusNode) {
    const safePackageUrl = safeUrl(packageUrl);
    if (!safePackageUrl) {
      throw new Error("HTML_PACKAGE_PREPARE_FAILED");
    }

    await Promise.all([
      ensureRuntimeWorker(),
      ensureJsZip()
    ]);

    updateLaunchStatus(
      statusNode,
      t("Cargando paquete del juego…", "Loading game package…")
    );

    const response = await fetch(safePackageUrl, {
      method:"GET",
      mode:"cors",
      cache:"no-store",
      credentials:"omit"
    });

    if (!response.ok) {
      throw new Error("HTML_PACKAGE_FETCH_FAILED");
    }

    const buffer = await response.arrayBuffer();

    updateLaunchStatus(
      statusNode,
      t("Preparando archivos del juego…", "Preparing game files…")
    );

    const zip = await window.JSZip.loadAsync(buffer);

    const entries = Object.values(zip.files)
      .filter(entry => !entry.dir)
      .map(entry => ({
        entry,
        path:cleanZipPath(entry.name)
      }))
      .filter(item =>
        item.path &&
        !item.path.startsWith("__MACOSX/") &&
        !/(^|\/)\.DS_Store$/i.test(item.path)
      );

    const indexCandidates = entries
      .filter(item => /(^|\/)index\.html?$/i.test(item.path))
      .sort((a, b) => {
        const aDepth = a.path.split("/").length;
        const bDepth = b.path.split("/").length;
        if (aDepth !== bDepth) return aDepth - bDepth;
        return a.path.length - b.path.length;
      });

    const indexItem = indexCandidates[0];
    if (!indexItem) {
      throw new Error("HTML_INDEX_MISSING");
    }

    const session =
      Date.now().toString(36) +
      "-" +
      requestId().replace(/-/g, "").slice(0, 12);

    const cacheName = RUNTIME_CACHE_PREFIX + session;
    const cache = await caches.open(cacheName);

    const entryDir = indexItem.path.includes("/")
      ? indexItem.path.slice(0, indexItem.path.lastIndexOf("/") + 1)
      : "";

    let completed = 0;

    for (const item of entries) {
      let bytes;

      if (item.path === indexItem.path) {
        let html = await item.entry.async("string");

        const returnLink =
          '<a href="/risin96ames/" target="_self" aria-label="Rising Games" ' +
          'style="position:fixed;top:12px;left:12px;z-index:2147483647;' +
          'display:inline-flex;align-items:center;min-height:36px;padding:0 12px;' +
          'border:1px solid rgba(255,255,255,.35);border-radius:999px;' +
          'background:rgba(4,8,18,.78);color:#fff;text-decoration:none;' +
          'font:700 12px system-ui,sans-serif;backdrop-filter:blur(8px)">' +
          '← Rising Games</a>';

        if (/<body[^>]*>/i.test(html)) {
          html = html.replace(
            /<body([^>]*)>/i,
            '<body$1>' + returnLink
          );
        } else {
          html = returnLink + html;
        }

        bytes = new TextEncoder().encode(html).buffer;
      } else {
        bytes = await item.entry.async("arraybuffer");
      }

      const headers = new Headers({
        "Content-Type":mimeTypeForPath(item.path),
        "Cache-Control":"no-store",
        "Access-Control-Allow-Origin":"*",
        "Cross-Origin-Resource-Policy":"cross-origin"
      });

      const encodedPath = encodeRuntimePath(item.path);
      if (!encodedPath) continue;

      const primaryUrl =
        location.origin +
        RUNTIME_ROOT +
        encodeURIComponent(session) +
        "/" +
        encodedPath;

      await cache.put(
        primaryUrl,
        new Response(bytes.slice(0), {
          status:200,
          headers
        })
      );

      if (
        entryDir &&
        item.path.startsWith(entryDir)
      ) {
        const aliasPath = item.path.slice(entryDir.length);
        const encodedAlias = encodeRuntimePath(aliasPath);

        if (encodedAlias) {
          const aliasUrl =
            location.origin +
            RUNTIME_ROOT +
            encodeURIComponent(session) +
            "/" +
            encodedAlias;

          if (aliasUrl !== primaryUrl) {
            await cache.put(
              aliasUrl,
              new Response(bytes.slice(0), {
                status:200,
                headers
              })
            );
          }
        }
      }

      completed += 1;

      if (completed % 8 === 0 || completed === entries.length) {
        updateLaunchStatus(
          statusNode,
          t(
            "Montando juego " + completed + "/" + entries.length + "…",
            "Mounting game " + completed + "/" + entries.length + "…"
          )
        );
      }
    }

    await pruneRuntimeCaches(cacheName);

    const runtimeUrl =
      location.origin +
      RUNTIME_ROOT +
      encodeURIComponent(session) +
      "/" +
      encodeRuntimePath(indexItem.path);

    return {
      runtimeUrl,
      entryPoint:indexItem.path,
      fileCount:entries.length,
      gameTitle:clean(game?.title)
    };
  }

  async function performGameLaunch(game, button, statusNode = null) {
    if (!game || !clean(game.id)) return;

    const previousText = button?.textContent || "";

    try {
      if (button) {
        button.disabled = true;
        button.textContent = t("Preparando…", "Preparing…");
      }

      updateLaunchStatus(
        statusNode,
        t("Preparando juego…", "Preparing game…")
      );

      const data = await launchAction(game.id);

      if (data?.mode === "web") {
        const url = safeUrl(data?.url);
        if (!url) throw new Error("GAME_LAUNCH_FAILED");

        window.open(url, "_blank", "noopener,noreferrer");

        updateLaunchStatus(
          statusNode,
          t("Juego abierto.", "Game opened.")
        );

        return;
      }

      if (data?.mode !== "html-package") {
        throw new Error("PLAY_NOT_AVAILABLE");
      }

      const runtime = await prepareHtmlRuntime(
        data.packageUrl,
        game,
        statusNode
      );

      updateLaunchStatus(
        statusNode,
        t("Abriendo juego…", "Opening game…")
      );

      window.location.assign(runtime.runtimeUrl);
    } catch (error) {
      const code = clean(
        error?.message || "GAME_LAUNCH_FAILED"
      );

      const messages = {
        GAME_NOT_FOUND:t(
          "El juego ya no está disponible.",
          "The game is no longer available."
        ),
        PLAY_NOT_AVAILABLE:t(
          "Esta versión no tiene un runtime jugable disponible.",
          "This version does not have a playable runtime."
        ),
        HTML_PACKAGE_PREPARE_FAILED:t(
          "No se pudo preparar el paquete HTML.",
          "The HTML package could not be prepared."
        ),
        HTML_PACKAGE_FETCH_FAILED:t(
          "No se pudo cargar el paquete del juego.",
          "The game package could not be loaded."
        ),
        HTML_INDEX_MISSING:t(
          "El paquete no contiene un index.html jugable.",
          "The package does not contain a playable index.html."
        ),
        HTML_RUNTIME_PREPARE_FAILED:t(
          "No se pudo preparar el reproductor HTML.",
          "The HTML player could not be prepared."
        ),
        HTML_RUNTIME_UNSUPPORTED:t(
          "Este navegador no puede montar el juego HTML.",
          "This browser cannot mount the HTML game."
        ),
        GAME_LAUNCH_TIMEOUT:t(
          "La preparación del juego tardó demasiado.",
          "Preparing the game took too long."
        ),
        GAME_LAUNCH_FAILED:t(
          "No se pudo abrir el juego.",
          "The game could not be opened."
        )
      };

      updateLaunchStatus(
        statusNode,
        messages[code] || messages.GAME_LAUNCH_FAILED,
        true
      );
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = previousText;
      }
    }
  }

  function studioAction(action, input = {}) {
    const id = requestId();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("GAMES_ACTION_TIMEOUT"));
      }, 20000);

      pending.set(id, {
        resolve,
        reject,
        timeout
      });

      window.parent.postMessage({
        source: SOURCE_UI,
        protocol: PROTOCOL,
        type: "studio-action",
        requestId:id,
        action,
        input
      }, HOST_ORIGIN);
    });
  }

  function directUpload(prepared, file, onProgress, control) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      control.xhr = xhr;

      xhr.open("PUT", prepared.uploadUrl, true);
      xhr.setRequestHeader(
        "Content-Type",
        prepared.mimeType || file.type || "application/octet-stream"
      );

      xhr.upload.onprogress = event => {
        if (!event.lengthComputable) return;
        onProgress(event.loaded / event.total);
      };

      xhr.onerror = () => reject(new Error("UPLOAD_FAILED"));
      xhr.onabort = () => reject(new Error("UPLOAD_CANCELLED"));
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error("UPLOAD_FAILED"));
          return;
        }

        let payload = null;
        try { payload = JSON.parse(xhr.responseText || "{}"); } catch (_) {}

        const fileId = clean(payload?.file?.id || payload?.file?._id);
        if (!fileId) {
          reject(new Error("UPLOAD_FAILED"));
          return;
        }

        onProgress(1);

        resolve({
          ticket:prepared.ticket,
          fileId
        });
      };

      xhr.send(file);
    });
  }

  async function uploadFile(kind, file, onProgress, control) {
    const prepared = await studioAction("upload.prepare", {
      kind,
      fileName:file.name,
      mimeType:file.type || "",
      sizeInBytes:file.size
    });

    if (control.cancelled) throw new Error("UPLOAD_CANCELLED");

    const uploadUrl = clean(prepared.uploadUrl);
    if (!uploadUrl) throw new Error("UPLOAD_PREPARE_FAILED");

    return directUpload(prepared, file, onProgress, control);
  }

  function errorMessage(code) {
    const messagesEs = {
      AUTH_REQUIRED:"Inicia sesión con tu cuenta Nexo Group.",
      ACTION_CAPABILITY_MISSING:"La autorización de desarrollador no está disponible. Actualiza la página.",
      GAME_CAPABILITY_BUSY:"La autorización de publicación está ocupada. Intenta de nuevo.",
      GAME_CAPABILITY_TIMEOUT:"La autorización de publicación tardó demasiado. Intenta de nuevo.",
      GAME_CAPABILITY_CREATE_FAILED:"No se pudo preparar la autorización para publicar.",
      GAME_CAPABILITY_INVALID:"La autorización para publicar ya no es válida. Actualiza la página.",
      GAME_CAPABILITY_EXPIRED:"La autorización para publicar expiró. Actualiza la página.",
      DEVELOPER_REQUIRED:"Esta cuenta no tiene permisos de desarrollador.",
      PREVIEW_TYPE_INVALID:"La imagen debe ser PNG, JPG o WEBP.",
      PREVIEW_TOO_LARGE:"La imagen supera el límite permitido.",
      BUILD_TYPE_INVALID:"El build debe ser ZIP, APK, EXE, MSI o 7Z.",
      BUILD_TOO_LARGE:"El archivo del build es demasiado grande.",
      UPLOAD_FAILED:"No se pudo completar la subida del archivo.",
      UPLOAD_PREPARE_FAILED:"No se pudo preparar la subida.",
      UPLOAD_TICKET_INVALID:"La autorización de subida ya no es válida.",
      UPLOAD_TICKET_EXPIRED:"La autorización de subida expiró.",
      UPLOAD_FILE_NOT_READY:"Wix todavía está procesando el archivo. Intenta publicar otra vez.",
      UPLOAD_FILE_MISMATCH:"El archivo subido no coincide con la solicitud.",
      TITLE_REQUIRED:"Escribe el título del juego.",
      STAGE_INVALID:"Selecciona una etapa válida.",
      GENRE_REQUIRED:"Escribe el género.",
      DESCRIPTION_REQUIRED:"Escribe una descripción.",
      VERSION_REQUIRED:"Indica la versión inicial.",
      PREVIEW_FILE_INVALID:"La imagen de preview no quedó disponible.",
      GAMES_ACTION_TIMEOUT:"La operación tardó demasiado.",
      GAMES_ACTION_FAILED:"No se pudo guardar el juego."
    };

    const messagesEn = {
      AUTH_REQUIRED:"Sign in with your Nexo Group account.",
      ACTION_CAPABILITY_MISSING:"Developer authorization is unavailable. Refresh the page.",
      GAME_CAPABILITY_BUSY:"Publishing authorization is busy. Try again.",
      GAME_CAPABILITY_TIMEOUT:"Publishing authorization took too long. Try again.",
      GAME_CAPABILITY_CREATE_FAILED:"Publishing authorization could not be prepared.",
      GAME_CAPABILITY_INVALID:"Publishing authorization is no longer valid. Refresh the page.",
      GAME_CAPABILITY_EXPIRED:"Publishing authorization expired. Refresh the page.",
      DEVELOPER_REQUIRED:"This account does not have developer permissions.",
      PREVIEW_TYPE_INVALID:"The preview must be PNG, JPG, or WEBP.",
      PREVIEW_TOO_LARGE:"The preview image is too large.",
      BUILD_TYPE_INVALID:"The build must be ZIP, APK, EXE, MSI, or 7Z.",
      BUILD_TOO_LARGE:"The build file is too large.",
      UPLOAD_FAILED:"The file upload could not be completed.",
      UPLOAD_PREPARE_FAILED:"The upload could not be prepared.",
      UPLOAD_TICKET_INVALID:"The upload authorization is no longer valid.",
      UPLOAD_TICKET_EXPIRED:"The upload authorization expired.",
      UPLOAD_FILE_NOT_READY:"Wix is still processing the file. Try publishing again.",
      UPLOAD_FILE_MISMATCH:"The uploaded file does not match the request.",
      TITLE_REQUIRED:"Enter the game title.",
      STAGE_INVALID:"Select a valid stage.",
      GENRE_REQUIRED:"Enter a genre.",
      DESCRIPTION_REQUIRED:"Enter a description.",
      VERSION_REQUIRED:"Enter the initial version.",
      PREVIEW_FILE_INVALID:"The preview image is not available.",
      GAMES_ACTION_TIMEOUT:"The operation took too long.",
      GAMES_ACTION_FAILED:"The game could not be saved."
    };

    return (lang() === "en" ? messagesEn : messagesEs)[code] ||
      (lang() === "en" ? messagesEn.GAMES_ACTION_FAILED : messagesEs.GAMES_ACTION_FAILED);
  }

  function removeModal() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    try { modal._r96Cleanup?.(); } catch (_) {}
    modal.querySelectorAll("[data-r96-object-url]").forEach(node => {
      try { URL.revokeObjectURL(node.dataset.r96ObjectUrl); } catch (_) {}
    });
    modal.remove();
  }

  function openStudio() {
    if (!canPublish()) return;

    ensureStyle();
    removeModal();

    const backdrop = document.createElement("div");
    backdrop.id = MODAL_ID;
    backdrop.className = "r96-game-modal-backdrop";

    const modal = document.createElement("section");
    modal.className = "r96-game-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const head = document.createElement("div");
    head.className = "r96-game-modal-head";

    const title = document.createElement("h2");
    title.textContent = t("Agregar juego", "Add game");

    const close = document.createElement("button");
    close.className = "r96-game-modal-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", t("Cerrar", "Close"));
    close.addEventListener("click", removeModal);

    head.append(title, close);

    const grid = document.createElement("div");
    grid.className = "r96-game-studio-grid";

    const form = document.createElement("form");
    form.className = "r96-game-form";
    form.noValidate = true;

    const makeField = (labelText, node, smallText = "") => {
      const field = document.createElement("div");
      field.className = "r96-game-field";
      const label = document.createElement("label");
      label.textContent = labelText;
      if (node.id) label.htmlFor = node.id;
      field.append(label, node);
      if (smallText) {
        const small = document.createElement("small");
        small.textContent = smallText;
        field.appendChild(small);
      }
      return field;
    };

    const titleInput = document.createElement("input");
    titleInput.id = "r96-game-title";
    titleInput.maxLength = 100;
    titleInput.placeholder = t("Ej. Hallvalla", "e.g. Hallvalla");

    const previewInput = document.createElement("input");
    previewInput.id = "r96-game-preview";
    previewInput.type = "file";
    previewInput.accept = "image/png,image/jpeg,image/webp";

    const stageSelect = document.createElement("select");
    stageSelect.id = "r96-game-stage";
    for (const [value, label] of STAGES) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      stageSelect.appendChild(option);
    }

    const genreInput = document.createElement("input");
    genreInput.id = "r96-game-genre";
    genreInput.maxLength = 80;
    genreInput.placeholder = t("Ej. RPG táctico", "e.g. Tactical RPG");

    const row = document.createElement("div");
    row.className = "r96-game-form-row";
    row.append(
      makeField(t("Etapa", "Stage"), stageSelect),
      makeField(t("Género", "Genre"), genreInput)
    );

    const tagsField = document.createElement("div");
    tagsField.className = "r96-game-field";

    const tagsLabel = document.createElement("div");
    tagsLabel.className = "r96-field-label";
    tagsLabel.textContent = t("Etiquetas", "Tags");

    const tagEditor = document.createElement("div");
    tagEditor.className = "r96-tag-editor";

    const tagList = document.createElement("div");
    tagList.className = "r96-tag-list";

    const tagAdd = document.createElement("button");
    tagAdd.className = "r96-tag-add";
    tagAdd.type = "button";
    tagAdd.textContent = t("+ Agregar etiqueta", "+ Add tag");

    const tagEntry = document.createElement("div");
    tagEntry.className = "r96-tag-entry";
    tagEntry.hidden = true;

    const tagInput = document.createElement("input");
    tagInput.maxLength = 40;
    tagInput.placeholder = t("Escribe la etiqueta", "Enter tag");

    const tagAccept = document.createElement("button");
    tagAccept.type = "button";
    tagAccept.textContent = t("Aceptar", "Add");

    const tagCancel = document.createElement("button");
    tagCancel.type = "button";
    tagCancel.textContent = t("Cancelar", "Cancel");

    tagEntry.append(tagInput, tagAccept, tagCancel);
    tagEditor.append(tagList, tagAdd, tagEntry);
    tagsField.append(tagsLabel, tagEditor);

    const tags = [];

    function renderTags() {
      tagList.replaceChildren();
      for (const tag of tags) {
        const chip = document.createElement("span");
        chip.className = "r96-tag-chip";
        chip.appendChild(document.createTextNode(tag));

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", t("Quitar etiqueta", "Remove tag"));
        remove.addEventListener("click", () => {
          const index = tags.indexOf(tag);
          if (index >= 0) tags.splice(index, 1);
          renderTags();
          renderPreview();
        });

        chip.appendChild(remove);
        tagList.appendChild(chip);
      }
    }

    function addTag() {
      const value = clean(tagInput.value).replace(/\s+/g, " ").slice(0, 40);
      if (!value) return;
      if (!tags.some(tag => tag.toLowerCase() === value.toLowerCase())) {
        tags.push(value);
      }
      tagInput.value = "";
      tagEntry.hidden = true;
      tagAdd.hidden = false;
      renderTags();
      renderPreview();
    }

    tagAdd.addEventListener("click", () => {
      tagEntry.hidden = false;
      tagAdd.hidden = true;
      setTimeout(() => tagInput.focus(), 0);
    });

    tagAccept.addEventListener("click", addTag);
    tagCancel.addEventListener("click", () => {
      tagInput.value = "";
      tagEntry.hidden = true;
      tagAdd.hidden = false;
    });
    tagInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        addTag();
      }
    });

    const description = document.createElement("textarea");
    description.id = "r96-game-description";
    description.maxLength = 4000;
    description.placeholder = t(
      "Describe el juego. En la tarjeta se mostrarán solo dos líneas.",
      "Describe the game. Only two lines appear on the card."
    );

    const version = document.createElement("input");
    version.id = "r96-game-version";
    version.maxLength = 40;
    version.placeholder = "0.1.0";

    const build = document.createElement("input");
    build.id = "r96-game-build";
    build.type = "file";
    build.accept = ".zip,.apk,.exe,.msi,.7z";

    function makeUploadState() {
      const root = document.createElement("div");
      root.className = "r96-upload-state";
      root.hidden = true;
      root.dataset.state = "idle";

      const top = document.createElement("div");
      top.className = "r96-upload-top";

      const name = document.createElement("span");
      name.className = "r96-upload-name";

      const percent = document.createElement("span");
      percent.className = "r96-upload-percent";
      percent.textContent = "0%";

      top.append(name, percent);

      const track = document.createElement("div");
      track.className = "r96-upload-track";

      const bar = document.createElement("div");
      bar.className = "r96-upload-bar";
      track.appendChild(bar);

      const message = document.createElement("div");
      message.className = "r96-upload-message";

      root.append(top, track, message);
      return {root,name,percent,bar,message};
    }

    const previewUploadUi = makeUploadState();
    const buildUploadUi = makeUploadState();

    const previewField = makeField(
      t("Imagen de preview", "Preview image"),
      previewInput,
      t("PNG, JPG o WEBP.", "PNG, JPG, or WEBP.")
    );
    previewField.appendChild(previewUploadUi.root);

    const buildField = makeField(
      t("Build del juego", "Game build"),
      build,
      t(
        "ZIP, APK, EXE, MSI o 7Z. Es obligatorio para Prototype, Build Preview, Slot y Released.",
        "ZIP, APK, EXE, MSI, or 7Z. Required for Prototype, Build Preview, Slot, and Released."
      )
    );
    buildField.appendChild(buildUploadUi.root);

    const feedback = document.createElement("div");
    feedback.className = "r96-game-feedback";
    feedback.setAttribute("aria-live", "polite");

    const submit = document.createElement("button");
    submit.className = "r96-game-submit";
    submit.type = "submit";
    submit.textContent = t("Publicar juego", "Publish game");
    submit.disabled = true;

    form.append(
      makeField(t("Título del juego", "Game title"), titleInput),
      previewField,
      row,
      tagsField,
      makeField(t("Descripción", "Description"), description),
      makeField(t("Versión inicial", "Initial version"), version),
      buildField,
      feedback,
      submit
    );

    const previewPanel = document.createElement("div");
    previewPanel.className = "r96-game-preview-panel";

    let localPreviewUrl = "";
    let previewPositionX = 50;
    let previewPositionY = 50;

    const uploads = {
      preview:{
        generation:0,
        status:"idle",
        file:null,
        result:null,
        control:null,
        ui:previewUploadUi
      },
      build:{
        generation:0,
        status:"idle",
        file:null,
        result:null,
        control:null,
        ui:buildUploadUi
      }
    };

    function buildRequired() {
      return ["prototype","build-preview","slot","released"]
        .includes(stageSelect.value);
    }

    function cancelUpload(kind) {
      const state = uploads[kind];
      if (!state) return;

      state.generation += 1;

      if (state.control) {
        state.control.cancelled = true;
        try { state.control.xhr?.abort(); } catch (_) {}
        try { state.control.controller?.abort(); } catch (_) {}
      }

      state.control = null;
      state.status = "idle";
      state.result = null;
    }

    function setUploadVisual(kind, stateName, progress = 0, message = "") {
      const state = uploads[kind];
      const ui = state.ui;
      const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));

      ui.root.hidden = !state.file;
      ui.root.dataset.state = stateName;
      ui.name.textContent = state.file?.name || "";
      ui.percent.textContent = percent + "%";
      ui.bar.style.width = percent + "%";
      ui.message.textContent = message;
    }

    function syncSubmit() {
      const previewReady = uploads.preview.status === "done";
      const buildSelected = Boolean(uploads.build.file);
      const buildReady = uploads.build.status === "done";
      const buildOkay = buildRequired()
        ? buildReady
        : (!buildSelected || buildReady);

      submit.disabled = !(previewReady && buildOkay);

      if (!previewReady) {
        submit.title = t(
          "Espera a que termine de cargarse la imagen de preview.",
          "Wait for the preview image to finish uploading."
        );
      } else if (!buildOkay) {
        submit.title = t(
          "Espera a que termine de cargarse el juego.",
          "Wait for the game build to finish uploading."
        );
      } else {
        submit.removeAttribute("title");
      }
    }

    async function beginUpload(kind, file) {
      const state = uploads[kind];

      cancelUpload(kind);

      state.file = file;
      state.status = "preparing";
      const generation = ++state.generation;

      const control = {
        cancelled:false,
        xhr:null,
        controller:new AbortController()
      };
      state.control = control;

      setUploadVisual(
        kind,
        "uploading",
        0,
        t("Preparando carga…", "Preparing upload…")
      );
      syncSubmit();

      try {
        const result = await uploadFile(
          kind,
          file,
          progress => {
            if (
              generation !== state.generation ||
              control.cancelled
            ) return;

            state.status = "uploading";
            setUploadVisual(
              kind,
              "uploading",
              progress,
              t(
                "Cargando " + Math.round(progress * 100) + "%…",
                "Uploading " + Math.round(progress * 100) + "%…"
              )
            );
            syncSubmit();
          },
          control
        );

        if (
          generation !== state.generation ||
          control.cancelled
        ) return;

        state.status = "done";
        state.result = result;
        state.control = null;

        setUploadVisual(
          kind,
          "done",
          1,
          t("Carga completa ✓", "Upload complete ✓")
        );
      } catch (error) {
        if (
          generation !== state.generation ||
          control.cancelled ||
          clean(error?.message) === "UPLOAD_CANCELLED"
        ) {
          return;
        }

        state.status = "error";
        state.result = null;
        state.control = null;

        setUploadVisual(
          kind,
          "error",
          0,
          errorMessage(clean(error?.message || "UPLOAD_FAILED"))
        );
      } finally {
        syncSubmit();
      }
    }

    function previewData() {
      return {
        id:"preview",
        title:titleInput.value,
        stageKey:stageSelect.value,
        genre:genreInput.value,
        tags:[...tags],
        description:description.value,
        currentVersion:version.value,
        previewImage:localPreviewUrl,
        previewPositionX,
        previewPositionY
      };
    }

    function openFramingEditor() {
      if (!localPreviewUrl) return;

      const originalX = previewPositionX;
      const originalY = previewPositionY;

      const editorBackdrop = document.createElement("div");
      editorBackdrop.className = "r96-frame-editor-backdrop";

      const editor = document.createElement("div");
      editor.className = "r96-frame-editor";

      const heading = document.createElement("h3");
      heading.textContent = t("Editar encuadre", "Edit framing");

      const help = document.createElement("p");
      help.textContent = t(
        "Arrastra la imagen o usa los controles para elegir qué parte queda centrada en la tarjeta.",
        "Drag the image or use the controls to choose what stays centered in the card."
      );

      const canvas = document.createElement("div");
      canvas.className = "r96-frame-canvas";
      canvas.style.backgroundImage = "url(" + JSON.stringify(localPreviewUrl) + ")";

      const crosshair = document.createElement("div");
      crosshair.className = "r96-frame-crosshair";
      canvas.appendChild(crosshair);

      const controls = document.createElement("div");
      controls.className = "r96-frame-controls";

      const xWrap = document.createElement("label");
      xWrap.className = "r96-frame-control";
      xWrap.appendChild(document.createTextNode(t("Horizontal", "Horizontal")));
      const xRange = document.createElement("input");
      xRange.type = "range";
      xRange.min = "0";
      xRange.max = "100";
      xRange.value = String(previewPositionX);
      xWrap.appendChild(xRange);

      const yWrap = document.createElement("label");
      yWrap.className = "r96-frame-control";
      yWrap.appendChild(document.createTextNode(t("Vertical", "Vertical")));
      const yRange = document.createElement("input");
      yRange.type = "range";
      yRange.min = "0";
      yRange.max = "100";
      yRange.value = String(previewPositionY);
      yWrap.appendChild(yRange);

      controls.append(xWrap, yWrap);

      const actions = document.createElement("div");
      actions.className = "r96-frame-actions";

      const reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = t("Centrar", "Center");

      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = t("Cancelar", "Cancel");

      const apply = document.createElement("button");
      apply.className = "r96-frame-apply";
      apply.type = "button";
      apply.textContent = t("Aplicar", "Apply");

      actions.append(reset, cancel, apply);
      editor.append(heading, help, canvas, controls, actions);
      editorBackdrop.appendChild(editor);
      document.body.appendChild(editorBackdrop);

      function updateFrame() {
        previewPositionX = clampPercent(previewPositionX);
        previewPositionY = clampPercent(previewPositionY);
        canvas.style.backgroundPosition =
          previewPositionX + "% " + previewPositionY + "%";
        xRange.value = String(previewPositionX);
        yRange.value = String(previewPositionY);
      }

      xRange.addEventListener("input", () => {
        previewPositionX = Number(xRange.value);
        updateFrame();
      });
      yRange.addEventListener("input", () => {
        previewPositionY = Number(yRange.value);
        updateFrame();
      });

      let dragging = false;
      let startPointerX = 0;
      let startPointerY = 0;
      let startImageX = 50;
      let startImageY = 50;

      canvas.addEventListener("pointerdown", event => {
        dragging = true;
        startPointerX = event.clientX;
        startPointerY = event.clientY;
        startImageX = previewPositionX;
        startImageY = previewPositionY;
        canvas.setPointerCapture?.(event.pointerId);
      });

      canvas.addEventListener("pointermove", event => {
        if (!dragging) return;

        const rect = canvas.getBoundingClientRect();
        const dx = event.clientX - startPointerX;
        const dy = event.clientY - startPointerY;

        previewPositionX = clampPercent(
          startImageX - (dx / Math.max(1, rect.width)) * 100
        );
        previewPositionY = clampPercent(
          startImageY - (dy / Math.max(1, rect.height)) * 100
        );

        updateFrame();
      });

      const endDrag = () => { dragging = false; };
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);

      reset.addEventListener("click", () => {
        previewPositionX = 50;
        previewPositionY = 50;
        updateFrame();
      });

      cancel.addEventListener("click", () => {
        previewPositionX = originalX;
        previewPositionY = originalY;
        editorBackdrop.remove();
        renderPreview();
      });

      apply.addEventListener("click", () => {
        editorBackdrop.remove();
        renderPreview();
      });

      editorBackdrop.addEventListener("click", event => {
        if (event.target !== editorBackdrop) return;
        previewPositionX = originalX;
        previewPositionY = originalY;
        editorBackdrop.remove();
        renderPreview();
      });

      updateFrame();
    }

    function renderPreview() {
      previewPanel.replaceChildren(
        gameCard(previewData(), 0, true, openFramingEditor)
      );
    }

    [titleInput,genreInput,description,version].forEach(input => {
      input.addEventListener("input", renderPreview);
    });

    stageSelect.addEventListener("change", () => {
      renderPreview();
      syncSubmit();
    });

    previewInput.addEventListener("change", () => {
      cancelUpload("preview");

      if (localPreviewUrl) {
        try { URL.revokeObjectURL(localPreviewUrl); } catch (_) {}
      }

      const file = previewInput.files?.[0] || null;
      previewPositionX = 50;
      previewPositionY = 50;

      localPreviewUrl = file
        ? URL.createObjectURL(file)
        : "";

      uploads.preview.file = file;
      uploads.preview.result = null;
      uploads.preview.status = file ? "preparing" : "idle";

      renderPreview();
      syncSubmit();

      if (file) beginUpload("preview", file);
    });

    build.addEventListener("change", () => {
      cancelUpload("build");

      const file = build.files?.[0] || null;
      uploads.build.file = file;
      uploads.build.result = null;
      uploads.build.status = file ? "preparing" : "idle";

      if (!file) {
        buildUploadUi.root.hidden = true;
        syncSubmit();
        return;
      }

      beginUpload("build", file);
    });

    backdrop._r96Cleanup = () => {
      cancelUpload("preview");
      cancelUpload("build");
      if (localPreviewUrl) {
        try { URL.revokeObjectURL(localPreviewUrl); } catch (_) {}
        localPreviewUrl = "";
      }
    };

    syncSubmit();

    form.addEventListener("submit", async event => {
      event.preventDefault();

      feedback.dataset.error = "0";
      feedback.textContent = "";

      if (!canPublish()) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("DEVELOPER_REQUIRED");
        return;
      }

      if (!clean(titleInput.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("TITLE_REQUIRED");
        return;
      }
      if (!clean(genreInput.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("GENRE_REQUIRED");
        return;
      }
      if (!clean(description.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("DESCRIPTION_REQUIRED");
        return;
      }
      if (!clean(version.value)) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage("VERSION_REQUIRED");
        return;
      }
      if (uploads.preview.status !== "done" || !uploads.preview.result) {
        feedback.dataset.error = "1";
        feedback.textContent = t(
          "Espera a que termine de cargarse la imagen de preview.",
          "Wait for the preview image to finish uploading."
        );
        return;
      }
      if (
        (buildRequired() || uploads.build.file) &&
        (uploads.build.status !== "done" || !uploads.build.result)
      ) {
        feedback.dataset.error = "1";
        feedback.textContent = t(
          "Espera a que termine de cargarse el juego.",
          "Wait for the game build to finish uploading."
        );
        return;
      }

      submit.disabled = true;
      feedback.textContent = t("Publicando juego…", "Publishing game…");

      try {
        await studioAction("game.create", {
          title:titleInput.value,
          stageKey:stageSelect.value,
          genre:genreInput.value,
          tags,
          description:description.value,
          currentVersion:version.value,
          previewPositionX,
          previewPositionY,
          previewUpload:uploads.preview.result,
          buildUpload:uploads.build.result || {}
        });

        feedback.dataset.error = "0";
        feedback.textContent = t("Juego publicado.", "Game published.");

        setTimeout(() => {
          removeModal();
        }, 650);
      } catch (error) {
        feedback.dataset.error = "1";
        feedback.textContent = errorMessage(
          clean(error?.message || "GAMES_ACTION_FAILED")
        );
        syncSubmit();
      }
    });

    grid.append(form, previewPanel);
    modal.append(head, grid);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) removeModal();
    });

    renderPreview();
  }

  function postReady() {
    if (window.parent === window) return;
    window.parent.postMessage({
      source: SOURCE_UI,
      protocol: PROTOCOL,
      type: "ready"
    }, HOST_ORIGIN);
  }

  window.addEventListener("message", event => {
    if (event.origin !== HOST_ORIGIN || event.source !== window.parent) return;

    const message = event.data;
    if (
      !message ||
      message.source !== SOURCE_BRIDGE ||
      message.protocol !== PROTOCOL
    ) {
      return;
    }

    if (message.type === "catalog") {
      renderCatalog(message.data || {});
      renderRecentActivity();
      return;
    }

    if (message.type === "community-overview") {
      communityOverview = message.data || {
        summaries: [],
        recentActivity: []
      };

      if (Array.isArray(lastCatalogPayload?.games)) {
        renderCatalog(lastCatalogPayload);
      }
      renderRecentActivity();
      return;
    }

    if (message.type === "community-overview-error") {
      renderRecentActivity();
      return;
    }

    if (message.type === "catalog-error") {
      ensureStyle();
      if (gamesStat) gamesStat.textContent = "0";
      setEmpty(t(
        "No se pudo cargar el catálogo.",
        "The catalog could not be loaded."
      ));
      return;
    }

    if (
      message.type === "studio-result" ||
      message.type === "launch-result" ||
      message.type === "community-detail-result" ||
      message.type === "review-submit-result" ||
      message.type === "community-write-result"
    ) {
      const id = clean(message.requestId);
      const entry = pending.get(id);
      if (!entry) return;

      clearTimeout(entry.timeout);
      pending.delete(id);

      if (message.data?.ok === true) {
        entry.resolve(message.data.data || {});
      } else {
        entry.reject(
          new Error(
            clean(
              message.data?.error ||
              (
                message.type === "launch-result"
                  ? "GAME_LAUNCH_FAILED"
                  : message.type === "community-detail-result"
                    ? "GAME_COMMUNITY_FAILED"
                    : message.type === "review-submit-result"
                    ? "REVIEW_SAVE_FAILED"
                    : message.type === "community-write-result"
                      ? "COMMUNITY_ACTION_FAILED"
                      : "GAMES_ACTION_FAILED"
              )
            )
          )
        );
      }
    }
  });

  ensureStyle();

  carousel.replaceChildren();
  carousel.hidden = true;

  if (titleCopy) {
    titleCopy.textContent = t(
      "Cargando juegos publicados…",
      "Loading published games…"
    );
  }

  installStudioObserver();
  postReady();

  let retries = 0;
  const retry = setInterval(() => {
    retries += 1;
    postReady();
    syncAddGameButton();
    if (retries >= 8) clearInterval(retry);
  }, 1000);
})();
