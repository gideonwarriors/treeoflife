// Cached pages also retire event promotions at their explicit Taiwan deadline.
let promotionTimer;
function retireExpiredPromotions(){
  clearTimeout(promotionTimer);
  const now=Date.now();let next=Infinity;
  document.querySelectorAll('[data-expires]').forEach(element=>{
    const deadline=Date.parse(element.dataset.expires);
    if(!Number.isFinite(deadline))return;
    if(now>=deadline)element.remove();else next=Math.min(next,deadline);
  });
  if(Number.isFinite(next))promotionTimer=setTimeout(retireExpiredPromotions,Math.min(next-now+20,86400000));
}
retireExpiredPromotions();
window.addEventListener('pageshow',retireExpiredPromotions);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)retireExpiredPromotions();});
'use strict';
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='選單 ☰';}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'關閉 ×':'選單 ☰';nav.classList.toggle('is-open',open);});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menuButton.focus();}});
const desktopQuery=window.matchMedia('(min-width:901px)');desktopQuery.addEventListener('change',event=>{if(event.matches)closeMenu();});
const dialog=document.querySelector('.org-dialog');
let activeImageButton=null;
const zoomButton=document.querySelector('#zoom-button');
const imageScroll=document.querySelector('.org-image-scroll');
document.querySelectorAll('.org-trigger,.invitation-trigger').forEach(button=>button.addEventListener('click',()=>{activeImageButton=button;const source=button.querySelector('img');const target=document.querySelector('#dialog-image');target.src=button.dataset.full||source.currentSrc||source.src;target.alt=source.alt;document.querySelector('#dialog-title').textContent=button.classList.contains('invitation-trigger')?'獻堂感恩禮拜邀請卡':'生命樹教會總會組織圖';document.querySelector('#close-dialog').setAttribute('aria-label','關閉圖片');imageScroll.scrollTop=0;imageScroll.scrollLeft=0;dialog.showModal();document.body.classList.add('modal-open');}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');imageScroll.classList.remove('is-zoomed');zoomButton.setAttribute('aria-pressed','false');zoomButton.textContent='放大';activeImageButton?.focus({preventScroll:true});});
zoomButton.addEventListener('click',()=>{const zoomed=imageScroll.classList.toggle('is-zoomed');zoomButton.setAttribute('aria-pressed',String(zoomed));zoomButton.textContent=zoomed?'符合視窗':'放大';});
document.querySelectorAll('.youtube-thumbnail').forEach(image=>{const showFallback=()=>{image.hidden=true;};image.addEventListener('error',showFallback);if(image.complete&&image.currentSrc&&image.naturalWidth===0)showFallback();});
document.querySelector('#year').textContent=String(new Date().getFullYear());

// One shared counter for the public site, independent of release/query/hash.
// Keep local previews out of the production total. Count visits even without scrolling to the footer.
function loadVisitorCounter(){
  const badge=document.querySelector('#visitor-badge');
  const status=document.querySelector('#visitor-status');
  if(location.hostname!=='gideonwarriors.github.io'||!/^\/treeoflife(?:\/|$)/.test(location.pathname)){
    status.textContent='本機預覽不計數';return;
  }
  let timeout;
  const unavailable=()=>{badge.hidden=true;status.hidden=false;status.textContent='統計暫時無法讀取';};
  badge.addEventListener('load',()=>{clearTimeout(timeout);status.hidden=true;badge.hidden=false;},{once:true});
  badge.addEventListener('error',()=>{clearTimeout(timeout);unavailable();},{once:true});
  timeout=setTimeout(unavailable,10000);
  badge.src='https://hits.sh/gideonwarriors.github.io/treeoflife.svg?view=total&style=flat&label=VIEWS&color=174d8a&labelColor=e9f1f9';
}
if(document.readyState==='complete')loadVisitorCounter();
else window.addEventListener('load',loadVisitorCounter,{once:true});