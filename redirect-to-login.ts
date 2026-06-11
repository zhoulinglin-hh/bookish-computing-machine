import{g as M,E as z,a as G,s as W,r as m,_ as C,t as g,j as u,V as v,T as U,b as T,c as P,d as D,e as w,f as $,h as q,i as Y,k as K,l as Z,m as J,R as k,n as p,o as c,p as f}from"./vendors.aa7c65fe.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const t of r.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&a(t)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();var Q=`
/* H5 端隐藏 TabBar 空图标（只隐藏没有 src 的图标） */
.weui-tabbar__icon:not([src]),
.weui-tabbar__icon[src=''] {
  display: none !important;
}

.weui-tabbar__item:has(.weui-tabbar__icon:not([src])) .weui-tabbar__label,
.weui-tabbar__item:has(.weui-tabbar__icon[src='']) .weui-tabbar__label {
  margin-top: 0 !important;
}

/* Vite 错误覆盖层无法选择文本的问题 */
vite-error-overlay {
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-user-select: text !important;
}

vite-error-overlay::part(window) {
  max-width: 90vw;
  padding: 10px;
}

.taro_page {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* H5 顶部 navbar / 底部 tabbar 高度变量（无对应栏时为 0） */
body { --navbar-h: 0px; --tabbar-h: 0px; }
body.h5-navbar-visible { --navbar-h: 44px; }
body:not(.no-tabbar) { --tabbar-h: calc(50px + env(safe-area-inset-bottom)); }

/* 模拟真机效果 */
.taro_page {
  box-sizing: border-box;
  border-top: var(--navbar-h) solid transparent;
  border-bottom: var(--tabbar-h) solid transparent;
  transform: translateZ(0);
}

/* min-h-screen / h-screen 这类用 100vh 的内层容器：把锚点从视口换成"可见内容区"，避免被 navbar / tabbar 盖住 */
.taro_page .min-h-screen {
  min-height: calc(100vh - var(--navbar-h) - var(--tabbar-h));
}
.taro_page .h-screen {
  height: calc(100vh - var(--navbar-h) - var(--tabbar-h));
}

/*
 * H5 端 rem 适配：与小程序 rpx 缩放一致
 * 375px 屏幕：1rem = 16px，小程序 32rpx = 16px
 */
html {
    font-size: 4vw !important;
}

/* H5 端组件默认样式修复 */
taro-view-core {
    display: block;
}

taro-text-core {
    display: inline;
}

taro-input-core {
    display: block;
    width: 100%;
}

taro-input-core.taro-otp-hidden-input input {
    color: transparent;
    caret-color: transparent;
    -webkit-text-fill-color: transparent;
}

/* Textarea 关闭浏览器自带 resize 把手（移动端无意义） */
taro-textarea-core > textarea,
.taro-textarea,
textarea.taro-textarea {
    resize: none !important;
}
`;function X(){var o=document.createElement("style");o.innerHTML=Q,document.head.appendChild(o)}function ee(){var o=function(){var a=!!document.querySelector(".taro-tabbar__container");document.body.classList.toggle("no-tabbar",!a)};o();var e=new MutationObserver(o);e.observe(document.body,{childList:!0,subtree:!0})}function ne(){X(),ee()}function ae(){var o=M();if(o===z.WEAPP)try{var e=G(),n=e.miniProgram.envVersion;console.log("[Debug] envVersion:",n),n!=="release"&&W({enableDebug:!0})}catch(a){console.error("[Debug] 开启调试模式失败:",a)}}var te={title:"",bgColor:"#ffffff",textStyle:"black",navStyle:"default",transparent:"none",leftIcon:"none"},re=function(){var e,n=T();return(n==null||(e=n.config)===null||e===void 0?void 0:e.window)||{}},ie=function(){var e,n,a=(e=T())===null||e===void 0||(e=e.config)===null||e===void 0?void 0:e.tabBar;return new Set((a==null||(n=a.list)===null||n===void 0?void 0:n.map(function(i){return i.pagePath}))||[])},S=function(){var e,n=T();return(n==null||(e=n.config)===null||e===void 0||(e=e.pages)===null||e===void 0?void 0:e[0])||"pages/index/index"},x=function(e){return e.replace(/^\//,"")},oe=function(e,n,a,i){if(!e)return"none";var r=x(e),t=x(i),y=r===t,E=n.has(r)||n.has("/".concat(r)),d=a>1;return E||y?"none":d?"back":"home"},ue=function(){var e=m.useState(te),n=C(e,2),a=n[0],i=n[1],r=m.useState(0),t=C(r,2),y=t[0],E=t[1],d=m.useCallback(function(){var s=g.getCurrentPages();if(s.length!==0){var l=s[s.length-1],B=(l==null?void 0:l.route)||"";if(B){var b=(l==null?void 0:l.config)||{},h=re(),N=ie(),R=S(),I=x(B),V=x(R);i({title:document.title||b.navigationBarTitleText||h.navigationBarTitleText||"",bgColor:b.navigationBarBackgroundColor||h.navigationBarBackgroundColor||"#ffffff",textStyle:b.navigationBarTextStyle||h.navigationBarTextStyle||"black",navStyle:b.navigationStyle||h.navigationStyle||"default",transparent:b.transparentTitle||h.transparentTitle||"none",leftIcon:oe(I,N,s.length,V)})}}},[]);g.useDidShow(function(){d()}),g.usePageScroll(function(s){var l=s.scrollTop;a.transparent==="auto"&&E(Math.min(l/100,1))}),m.useEffect(function(){var s=null,l=new MutationObserver(function(){s&&clearTimeout(s),s=setTimeout(function(){d()},50)});return l.observe(document.head,{subtree:!0,childList:!0,characterData:!0}),d(),function(){l.disconnect(),s&&clearTimeout(s)}},[d]);var F=a.navStyle!=="custom";if(m.useEffect(function(){F?document.body.classList.add("h5-navbar-visible"):document.body.classList.remove("h5-navbar-visible")},[F]),!F)return u.jsx(u.Fragment,{});var A=a.textStyle==="white"?"#fff":"#333",j=a.textStyle==="white"?"text-white":"text-gray-800",O=function(){return a.transparent==="always"?{backgroundColor:"transparent"}:a.transparent==="auto"?{backgroundColor:a.bgColor,opacity:y}:{backgroundColor:a.bgColor}},L=function(){return g.navigateBack()},H=function(){var l=S();g.reLaunch({url:"/".concat(l)})};return u.jsxs(u.Fragment,{children:[u.jsxs(v,{className:"fixed top-0 left-0 right-0 h-11 flex items-center justify-center z-1000",style:O(),children:[a.leftIcon==="back"&&u.jsx(v,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:L,children:u.jsx(v,{className:"i-lucide-chevron-left w-6 h-6",style:{color:A}})}),a.leftIcon==="home"&&u.jsx(v,{className:"absolute left-2 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center",onClick:H,children:u.jsx(v,{className:"i-lucide-house w-6 h-6",style:{color:A}})}),u.jsx(U,{className:"text-base font-medium max-w-3/5 truncate ".concat(j),children:a.title})]}),u.jsx(v,{className:"h-11 shrink-0"})]})},se=function(e){var n=e.children;return u.jsxs(u.Fragment,{children:[u.jsx(ue,{}),n]})},le=function(e){var n=e.children;return g.useLaunch(function(){ae(),ne()}),u.jsx(se,{children:n})},ce=function(e){var n=e.children;return u.jsx(le,{children:n})},_=P.__taroAppConfig={router:{mode:"hash"},pages:["pages/index/index","pages/game/index","pages/level1/index","pages/level2/index","pages/level3/index","pages/result/index"],window:{backgroundTextStyle:"light",navigationBarBackgroundColor:"#FFE9C7",navigationBarTitleText:"豪士藜麦吐司",navigationBarTextStyle:"black"}};_.routes=[Object.assign({path:"pages/index/index",load:function(){var o=p(c().m(function n(a,i){var r;return c().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,f(()=>import("./index.1e682939.js"),["js/index.1e682939.js","js/vendors.aa7c65fe.js","css/vendors.8886af03.css"]);case 1:return r=t.v,t.a(2,[r,a,i])}},n)}));function e(n,a){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"首页"}),Object.assign({path:"pages/game/index",load:function(){var o=p(c().m(function n(a,i){var r;return c().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,f(()=>import("./index.66701c03.js"),["js/index.66701c03.js","js/vendors.aa7c65fe.js","css/vendors.8886af03.css"]);case 1:return r=t.v,t.a(2,[r,a,i])}},n)}));function e(n,a){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"选择关卡"}),Object.assign({path:"pages/level1/index",load:function(){var o=p(c().m(function n(a,i){var r;return c().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,f(()=>import("./index.e6299796.js"),["js/index.e6299796.js","js/vendors.aa7c65fe.js","css/vendors.8886af03.css"]);case 1:return r=t.v,t.a(2,[r,a,i])}},n)}));function e(n,a){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"原料引力场"}),Object.assign({path:"pages/level2/index",load:function(){var o=p(c().m(function n(a,i){var r;return c().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,f(()=>import("./index.c5b34db4.js"),["js/index.c5b34db4.js","js/vendors.aa7c65fe.js","css/vendors.8886af03.css"]);case 1:return r=t.v,t.a(2,[r,a,i])}},n)}));function e(n,a){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"去边魔术秀"}),Object.assign({path:"pages/level3/index",load:function(){var o=p(c().m(function n(a,i){var r;return c().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,f(()=>import("./index.9b03dca7.js"),["js/index.9b03dca7.js","js/vendors.aa7c65fe.js","css/vendors.8886af03.css"]);case 1:return r=t.v,t.a(2,[r,a,i])}},n)}));function e(n,a){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"烘焙弹跳屋"}),Object.assign({path:"pages/result/index",load:function(){var o=p(c().m(function n(a,i){var r;return c().w(function(t){for(;;)switch(t.n){case 0:return t.n=1,f(()=>import("./index.3e8698c0.js"),["js/index.3e8698c0.js","js/vendors.aa7c65fe.js","css/vendors.8886af03.css"]);case 1:return r=t.v,t.a(2,[r,a,i])}},n)}));function e(n,a){return o.apply(this,arguments)}return e}()},{navigationBarTitleText:"分享工厂狂欢"})];Object.assign(D,{findDOMNode:w.findDOMNode,render:w.render,unstable_batchedUpdates:w.unstable_batchedUpdates});$();var de=q(ce,k,D,_),ve=Y({window:P});K(_);Z(ve,de,_,k);J({designWidth:750,deviceRatio:{375:2,640:1.17,750:1,828:.905},baseFontSize:20,unitPrecision:void 0,targetUnit:void 0});
