(function(){
document.documentElement.classList.remove('no-js');
// mobile nav
var t=document.querySelector('.menu-toggle');
if(t){t.addEventListener('click',function(){var o=document.body.classList.toggle('nav-open');t.setAttribute('aria-expanded',o?'true':'false');});}
document.querySelectorAll('.folder-toggle').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode;var o=li.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});});
// forms: thank-you redirect back to this site
document.querySelectorAll('form.bjc-form').forEach(function(f){var n=f.querySelector('input[name=_next]');if(n){n.value=location.origin+'/thanks/';}});
// slideshow galleries
document.querySelectorAll('.gallery-slideshow').forEach(function(g){
 var imgs=g.querySelectorAll('img');if(!imgs.length)return;var i=0;imgs[0].classList.add('on');imgs[0].loading='eager';
 function show(n){imgs[i].classList.remove('on');i=(n+imgs.length)%imgs.length;imgs[i].loading='eager';imgs[i].classList.add('on');var nx=imgs[(i+1)%imgs.length];nx.loading='eager';}
 var p=document.createElement('button');p.className='gnav gprev';p.type='button';p.setAttribute('aria-label','Previous photo');p.textContent='‹';
 var n=document.createElement('button');n.className='gnav gnext';n.type='button';n.setAttribute('aria-label','Next photo');n.textContent='›';
 g.appendChild(p);g.appendChild(n);p.onclick=function(){show(i-1);reset();};n.onclick=function(){show(i+1);reset();};
 var sec=parseInt(g.getAttribute('data-autoplay')||'0',10),tm=null;function reset(){if(tm)clearInterval(tm);if(sec>0)tm=setInterval(function(){show(i+1);},sec*1000);}reset();
});
var EV=window.BJC_EVENTS||[];var now=Date.now();
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
// home: upcoming events summary
document.querySelectorAll('.summary').forEach(function(box){
 var up=EV.filter(function(e){return (e.e||e.s)>=now;}).sort(function(a,b){return a.s-b.s;}).slice(0,parseInt(box.getAttribute('data-upcoming')||'3',10));
 if(!up.length){box.innerHTML='<p class="none" style="text-align:center">No upcoming events right now. <a href="/bjc-events/">See all events →</a></p>';return;}
 box.innerHTML='<div class="sumgrid">'+up.map(function(e){return '<a class="sumitem" href="'+e.u+'">'+(e.img?'<img src="'+e.img+'" alt="" loading="lazy">':'')+'<h3>'+esc(e.t)+'</h3><p>'+esc(e.date)+' · '+esc(e.time)+'</p></a>';}).join('')+'</div>';
});
// events page: move upcoming to top
var upSec=document.getElementById('upcoming');
if(upSec){var list=upSec.querySelector('.list');var cards=Array.prototype.slice.call(document.querySelectorAll('.past .ev'));var fut=cards.filter(function(c){return parseInt(c.getAttribute('data-start'),10)>=now-6*3600e3;});
 fut.reverse().forEach(function(c){list.appendChild(c);});if(fut.length)upSec.hidden=false;}
// calendar page
var cal=document.getElementById('calendar');
if(cal){
 var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
 var D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
 function ny(ms){var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date(ms));var o={};p.forEach(function(x){o[x.type]=x.value;});return {y:+o.year,m:+o.month-1,d:+o.day};}
 var t0=ny(now),cur={y:t0.y,m:t0.m};
 function render(){
  var first=new Date(cur.y,cur.m,1),start=first.getDay(),days=new Date(cur.y,cur.m+1,0).getDate();
  var evs=EV.filter(function(e){var k=ny(e.s);return k.y===cur.y&&k.m===cur.m;}).sort(function(a,b){return a.s-b.s;});
  var h='<div class="cal-head"><button type="button" data-d="-1" aria-label="Previous month">‹ Prev</button><h2>'+M[cur.m]+' '+cur.y+'</h2><button type="button" data-d="1" aria-label="Next month">Next ›</button></div><div class="cal-grid" role="grid">';
  D.forEach(function(d){h+='<div class="dow">'+d+'</div>';});
  for(var i=0;i<start;i++)h+='<div class="out"></div>';
  for(var d=1;d<=days;d++){var isT=(t0.y===cur.y&&t0.m===cur.m&&t0.d===d);h+='<div class="'+(isT?'today':'')+'"><span class="num">'+d+'</span>';
   evs.forEach(function(e){if(ny(e.s).d===d)h+='<a href="'+e.u+'">'+esc(e.t)+'</a>';});h+='</div>';}
  var tail=(7-((start+days)%7))%7;for(i=0;i<tail;i++)h+='<div class="out"></div>';
  h+='</div><div class="cal-list">'+(evs.length?'<ul>'+evs.map(function(e){return '<li><span class="d">'+esc(e.date)+' · '+esc(e.time)+'</span><a href="'+e.u+'">'+esc(e.t)+'</a></li>';}).join('')+'</ul>':'<p>No events this month.</p>')+'</div>';
  cal.innerHTML=h;
  cal.querySelectorAll('.cal-head button').forEach(function(b){b.onclick=function(){cur.m+=parseInt(b.getAttribute('data-d'),10);if(cur.m<0){cur.m=11;cur.y--;}if(cur.m>11){cur.m=0;cur.y++;}render();};});
 }
 render();
}
})();
