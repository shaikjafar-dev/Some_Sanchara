(function(){
'use strict';
var root=document.documentElement;
root.classList.add('js');

/* ---------- data ---------- */
var IG='https://www.instagram.com/some_sanchara/';
var CITIES={
  hampi:['Bengaluru','Mysuru','Tumakuru','Chitradurga'],
  gokarna:['Bengaluru','Mysuru','Tumakuru','Chitradurga','Davanagere']
};
var TRIPS={
  hampi:{
    name:'Hampi',kn:'ಹಂಪಿ',price:4599,dur:'2 Days · 1 Night',
    tag:'Come, experience Hampi with us.',
    departs:'Every Friday',kw:'HAMPI',badge:'',
    extra:[],
    days:[
      {label:'Day 1',sub:'Temples and ruins',stops:[
        ['Day start','Reach Hampi and check in','Freshen up and meet your group before the walk through the ruins begins.'],
        ['Morning','Virupaksha Temple and Hampi Bazaar','The temple still in daily worship, and the old market street that leads up to it.'],
        ['Late morning','Vittala Temple and the Stone Chariot','Carved halls and the stone chariot, the landmark most people come to Hampi to see.'],
        ['Afternoon','Lotus Mahal and Elephant Stables','The royal enclosure, with its Indo-Islamic arches and the long domed stables.'],
        ['Evening','Sunset at Hemakuta Hill','Early temples and a wide view over the boulder-covered land.'],
        ['Night','Stay in Hampi','Rest up before the sunrise climb.']
      ]},
      {label:'Day 2',sub:'Sunrise and send-off',stops:[
        ['Sunrise','Matanga Hill','A short climb for first light over the boulders, the river and the temple towers.'],
        ['Morning','Breakfast and the Tungabhadra riverside','Slow time by the river and a last walk through the bazaar.'],
        ['Afternoon','Check out and head home','Return to your pickup city.']
      ]}
    ]
  },
  gokarna:{
    name:'Gokarna',kn:'ಗೋಕರ್ಣ',price:3499,dur:'2 Days · 1 Night',
    tag:'Not just a beach trip. Experience Gokarna beyond the beaches!',
    departs:'Weekend departures',kw:'GOKARNA',badge:'Launch offer',
    extra:['Weekday trips available','Custom group trips available'],
    days:[
      {label:'Day 1',sub:'Coast and backwaters',stops:[
        ['Morning','Murudeshwara','The coastal temple town, with the giant Shiva statue facing the Arabian Sea.'],
        ['Midday','Honnavara Mangrove Forest','Walk into the mangroves at Honnavara.'],
        ['Afternoon','Boating in the Sharavathi backwaters','Glide across the calm backwaters where the river nears the sea.'],
        ['Evening','Beachside stay and campfire','Check in by the beach and gather around the campfire.']
      ]},
      {label:'Day 2',sub:'Trails, falls and caves',stops:[
        ['Morning','Beach trek','Trek along the Gokarna coast from one beach to the next.'],
        ['Late morning','Vibhuti Falls','A forest waterfall, reached on foot.'],
        ['Afternoon','Yana Caves','Towering black rock formations in the forest at Yana.'],
        ['Evening','Head home','Return to your pickup city.']
      ]}
    ]
  }
};
var PACK={
  common:['Government photo ID','Comfortable walking shoes','Water bottle','Sunscreen and a cap','Power bank','Light jacket for the night','Personal medicines'],
  hampi:['Sunglasses','Scarf or stole for sun and temples','Some cash for small shops'],
  gokarna:['Swimwear and a quick-dry towel','Slippers for the beach','Dry bag for your phone']
};
var state={trip:'hampi',day:0,date:0,city:0,n:2};

/* ---------- helpers ---------- */
var $=function(id){return document.getElementById(id)};
var inr=function(v){return '₹'+new Intl.NumberFormat('en-IN').format(v)};
var fmt=function(d){return new Intl.DateTimeFormat('en-IN',{weekday:'short',day:'numeric',month:'short'}).format(d)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function nextDays(weekday,count){
  var d=new Date();d.setHours(0,0,0,0);var out=[];
  while(out.length<count){d.setDate(d.getDate()+1);if(d.getDay()===weekday)out.push(new Date(d))}
  return out;
}
function departures(key){
  if(key==='hampi')return nextDays(5,4).map(function(d){return fmt(d)});
  return nextDays(6,4).map(function(d){var e=new Date(d);e.setDate(e.getDate()+1);return fmt(d)+' to '+fmt(e)});
}
var DEPS={hampi:departures('hampi'),gokarna:departures('gokarna')};

/* ---------- render ---------- */
function renderTicket(){
  var t=TRIPS[state.trip];
  var rows=[['Duration',t.dur],['Departs',t.departs],['Pickup',CITIES[state.trip].join(' · ')]];
  t.extra.forEach(function(x){rows.push(['Also',x])});
  rows.push(['To book','DM @some_sanchara with “'+t.kw+'”']);
  $('ticket').innerHTML=
    '<div class="ticket-top swap"><p class="kicker"><span>'+esc(t.dur)+'</span>'+(t.badge?'<span class="pill">'+esc(t.badge)+'</span>':'')+'</p>'+
    '<h3>'+esc(t.name)+' <span class="kn" lang="kn">'+t.kn+'</span></h3>'+
    '<p class="tag">'+esc(t.tag)+'</p>'+
    '<p class="price"><b>'+inr(t.price)+'</b><span>per person</span></p></div>'+
    '<div class="perf" aria-hidden="true"><i></i><i></i></div>'+
    '<div class="ticket-bot swap"><dl class="meta">'+rows.map(function(r){return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'}).join('')+'</dl>'+
    '<div class="cta-row"><a class="btn trip" href="#book" id="plan-btn">Plan this trip</a>'+
    '<a class="btn sec" href="'+IG+'" target="_blank" rel="noopener">DM on Instagram</a></div></div>';
}
function renderDays(){
  var t=TRIPS[state.trip];
  $('days').innerHTML=t.days.map(function(d,i){
    return '<button type="button" role="tab" data-day="'+i+'" aria-selected="'+(i===state.day)+'"><b>'+d.label+'</b><span>'+esc(d.sub)+'</span></button>';
  }).join('');
}
function renderTimeline(){
  var d=TRIPS[state.trip].days[state.day];
  $('tl-wrap').innerHTML='<ol class="tl">'+d.stops.map(function(s,i){
    return '<li style="--i:'+i+'"><span class="slot">'+esc(s[0])+'</span><h4>'+esc(s[1])+'</h4><p>'+esc(s[2])+'</p></li>';
  }).join('')+'</ol>';
}
function renderChips(){
  $('dep-h').textContent=state.trip==='hampi'?'Upcoming Fridays':'Upcoming weekends';
  $('chips').innerHTML=DEPS[state.trip].map(function(l,i){
    return '<button type="button" class="chip" data-date="'+i+'" aria-pressed="'+(i===state.date)+'">'+esc(l)+'</button>';
  }).join('');
}
function renderBuilder(){
  var t=TRIPS[state.trip];
  $('b-trip').value=state.trip;
  $('b-date').innerHTML=DEPS[state.trip].map(function(l,i){return '<option value="'+i+'"'+(i===state.date?' selected':'')+'>'+esc(l)+'</option>'}).join('');
  $('b-city').innerHTML=CITIES[state.trip].map(function(c,i){return '<option value="'+i+'"'+(i===state.city?' selected':'')+'>'+esc(c)+'</option>'}).join('');
  $('b-n').textContent=state.n;
  $('b-calc').textContent=state.n+' × '+inr(t.price);
  $('b-total').textContent=inr(t.price*state.n);
  $('b-msg').value=
    'Hi Some Sanchara! I would like to book the '+t.name+' trip ('+t.dur+').\n'+
    'Departure: '+DEPS[state.trip][state.date]+'\n'+
    'Pickup city: '+CITIES[state.trip][state.city]+'\n'+
    'Travellers: '+state.n+'\n'+
    'Price: '+inr(t.price)+' per person, '+inr(t.price*state.n)+' in total.\n'+
    'Please share availability and payment details.';
}
function loadPack(){try{return JSON.parse(localStorage.getItem('ss-pack-v1')||'{}')}catch(e){return {}}}
function savePack(o){try{localStorage.setItem('ss-pack-v1',JSON.stringify(o))}catch(e){}}
function renderPack(){
  var items=PACK.common.concat(PACK[state.trip]);var saved=loadPack();var done=0;
  $('packs').innerHTML=items.map(function(x,i){
    var id=state.trip+'-'+i;var on=!!saved[id];if(on)done++;
    return '<li><label><input type="checkbox" id="pk-'+id+'" data-pk="'+id+'"'+(on?' checked':'')+'><span>'+esc(x)+'</span></label></li>';
  }).join('');
  $('pack-count').textContent=done+' of '+items.length+' packed';
  $('pack-bar').style.width=Math.round(done/items.length*100)+'%';
}
function setTrip(k,fromUser){
  state.trip=k;state.day=0;state.date=0;state.city=0;
  document.querySelectorAll('[data-scope]').forEach(function(el){el.setAttribute('data-trip',k)});
  document.querySelectorAll('[data-pick]').forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-pick')===k)});
  renderTicket();renderDays();renderTimeline();renderChips();renderBuilder();renderPack();
}

/* ---------- events ---------- */
document.querySelectorAll('[data-pick]').forEach(function(b){b.addEventListener('click',function(){setTrip(b.getAttribute('data-pick'))})});
$('b-trip').addEventListener('change',function(e){setTrip(e.target.value)});
$('b-date').addEventListener('change',function(e){state.date=+e.target.value;renderChips();renderBuilder()});
$('b-city').addEventListener('change',function(e){state.city=+e.target.value;renderBuilder()});
$('minus').addEventListener('click',function(){state.n=Math.max(1,state.n-1);renderBuilder()});
$('plus').addEventListener('click',function(){state.n=Math.min(20,state.n+1);renderBuilder()});
$('days').addEventListener('click',function(e){
  var b=e.target.closest('[data-day]');if(!b)return;
  state.day=+b.getAttribute('data-day');renderDays();renderTimeline();
});
$('chips').addEventListener('click',function(e){
  var b=e.target.closest('[data-date]');if(!b)return;
  state.date=+b.getAttribute('data-date');renderChips();renderBuilder();
});
$('packs').addEventListener('change',function(e){
  var c=e.target.closest('[data-pk]');if(!c)return;
  var s=loadPack();if(c.checked)s[c.getAttribute('data-pk')]=1;else delete s[c.getAttribute('data-pk')];
  savePack(s);renderPack();
  var again=$('pk-'+c.getAttribute('data-pk'));if(again)again.focus();
});

/* copy helper with selection fallback */
function copyText(text,btn,fallbackEl){
  var label=btn.textContent;
  function ok(){btn.textContent='Copied';setTimeout(function(){btn.textContent=label},1600)}
  function fallback(){
    try{
      var el=fallbackEl;var r=document.createRange();r.selectNodeContents(el);
      var s=window.getSelection();s.removeAllRanges();s.addRange(r);
      if(el.select)el.select();
      btn.textContent='Selected, press copy';setTimeout(function(){btn.textContent=label},2200);
    }catch(e){}
  }
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(ok,fallback);
  }else fallback();
}
$('b-copy').addEventListener('click',function(){copyText($('b-msg').value,this,$('b-msg'))});
document.querySelectorAll('[data-copy]').forEach(function(b){
  b.addEventListener('click',function(){copyText(b.getAttribute('data-copy'),b,b.parentNode.querySelector('.num'))});
});

/* marquee */
(function(){
  var items=['Bengaluru','Mysuru','Tumakuru','Chitradurga','Davanagere','Hampi','Gokarna','Murudeshwara','Vibhuti Falls','Yana Caves','Karnataka to the world'];
  var one=items.map(function(x){return '<span>'+x+'</span>'}).join('');
  $('marq').innerHTML=one+one;
})();

/* theme toggle */
(function(){
  var mq=window.matchMedia('(prefers-color-scheme: light)');
  function current(){return root.getAttribute('data-theme')||(mq.matches?'light':'dark')}
  try{var s=localStorage.getItem('ss-theme');if(s==='light'||s==='dark')root.setAttribute('data-theme',s)}catch(e){}
  $('theme').addEventListener('click',function(){
    var next=current()==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('ss-theme',next)}catch(e){}
    window.dispatchEvent(new Event('ss-theme'));
  });
  mq.addEventListener('change',function(){window.dispatchEvent(new Event('ss-theme'))});
})();

/* reveal on scroll */
(function(){
  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}});
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e)});
})();

/* ---------- hero sky (canvas) ---------- */
(function(){
  var cv=$('sky'),hero=$('top'),ctx=cv.getContext('2d');
  var W=0,H=0,dpr=1,sy=0,raf=0,rise=0,rayProgress=0,col={},stars=[],rocks=[],sunAnchor={x:0,y:0,r:0},raysStarted=false;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function rgba(h,a){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'}
  function mixHex(a,b,t){
    function rgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(function(c){return c+c}).join('');var n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]}
    var x=rgb(a),y=rgb(b);return '#'+x.map(function(v,i){return Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')}).join('');
  }
  function readCols(){
    var cs=getComputedStyle(root),g=function(n){return cs.getPropertyValue(n).trim()};
    col={top:g('--sky-top'),mid:g('--sky-mid'),low:g('--sky-low'),sun:g('--sun'),r1:g('--r1'),r2:g('--r2'),r3:g('--r3'),fg:g('--fg'),muted:g('--muted'),accent:g('--accent'),bg:g('--bg'),star:parseFloat(g('--star'))||0};
  }
  function seed(){
    var r=rng(7);stars=[];rocks=[];
    for(var i=0;i<70;i++)stars.push({x:r(),y:r(),r:r()<.15?2:1,a:.35+r()*.65});
    for(var c=0;c<16;c++){
      var cl={x:(c+.3+r()*.4)/16,items:[]},k=2+Math.floor(r()*3);
      for(var j=0;j<k;j++)cl.items.push({dx:(j-k/2)*(18+r()*14)+r()*10,dy:-r()*16,rx:16+r()*30,ry:12+r()*22});
      rocks.push(cl);
    }
  }
  function ridgeY(layer,x){
    var b=[.70,.80,.93][layer],a=[.06,.04,.025][layer],o=[0,1.7,3.3][layer];
    var u=x/W*Math.PI*2;
    return H*b+H*a*(Math.sin(u*1.1+o)*.6+Math.sin(u*2.7+o*2.1)*.3+Math.sin(u*5.3+o*.7)*.1);
  }
  function ridge(layer,shift,fill){
    ctx.beginPath();ctx.moveTo(0,H+300);
    for(var x=0;x<=W+8;x+=8)ctx.lineTo(x,ridgeY(layer,x)+shift);
    ctx.lineTo(W,H+300);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
  }
  function drawSun(cx,cy,r,progress){
    var glow=ctx.createRadialGradient(cx,cy,r*.65,cx,cy,r*(1.6+progress*.9));
    glow.addColorStop(0,rgba(col.sun,.28));glow.addColorStop(.45,rgba(col.sun,.12));glow.addColorStop(1,rgba(col.sun,0));
    ctx.fillStyle=glow;ctx.fillRect(cx-r*3,cy-r*3,r*6,r*6);
    if(progress>0){
      ctx.save();ctx.translate(cx,cy);
      var pulse=reduce?1:.92+.08*Math.sin(progress*Math.PI*2);
      for(var i=0;i<24;i++){
        var a=i*Math.PI/12,inner=r*.92,outer=r*(1.02+progress*.25)*(1+(i%2)*.08);
        ctx.beginPath();ctx.moveTo(Math.cos(a-.025)*inner,Math.sin(a-.025)*inner);
        ctx.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);
        ctx.lineTo(Math.cos(a+.025)*inner,Math.sin(a+.025)*inner);ctx.closePath();
        ctx.fillStyle=rgba(col.sun,.2*progress*pulse);ctx.fill();
      }
      ctx.restore();
    }
    var disc=ctx.createRadialGradient(cx-r*.3,cy-r*.35,r*.08,cx,cy,r);
    disc.addColorStop(0,'#FFF0B0');disc.addColorStop(.55,col.sun);disc.addColorStop(1,rgba(col.sun,.82));
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=disc;ctx.fill();
  }
  function draw(){
    if(!W)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    var off=Math.max(0,Math.min(sy,H));
    var day=Math.max(0,Math.min(1,rise));
    hero.style.setProperty('--hero-fg',mixHex(col.fg,'#172728',day));
    hero.style.setProperty('--hero-muted',mixHex(col.muted,'#405956',day));
    hero.style.setProperty('--hero-accent',mixHex(col.accent,'#8A3E19',day));
    hero.style.setProperty('--hero-stroke',mixHex(col.bg,'#F4C18F',day));
    hero.style.setProperty('--hero-button-bg','rgba(255,255,255,'+(day*.22)+')');
    hero.style.setProperty('--hero-button-line','rgba(23,39,40,'+(day*.35)+')');
    var g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,mixHex(col.top,'#78B9D4',day));
    g.addColorStop(.55,mixHex(col.mid,'#F4C18F',day));
    g.addColorStop(.84,mixHex(col.low,'#FFE5B5',day));
    g.addColorStop(1,mixHex(col.low,'#FFE5B5',day));
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(col.star>0){
      ctx.fillStyle='#fff';
      stars.forEach(function(s){ctx.globalAlpha=col.star*s.a*(1-day)*(1-off/H);ctx.fillRect(s.x*W,s.y*H*.5+off*.1,s.r,s.r)});
      ctx.globalAlpha=1;
    }
    var e=1-Math.pow(1-rise,3);
    var r=sunAnchor.r||Math.max(40,Math.min(92,Math.min(W,H)*.12));
    var sx=sunAnchor.x||W*(W<700?.72:.76),sunY=(sunAnchor.y||H*.52)+(1-e)*Math.max(80,r*1.25)+off*.12;
    drawSun(sx,sunY,r,rayProgress);
    ridge(0,off*.30,col.r1);
    ridge(1,off*.16,col.r2);
    var k=Math.max(.55,Math.min(1.2,W/1100));
    rocks.forEach(function(c){
      var x=c.x*W,y=ridgeY(1,x)+off*.16+6;
      c.items.forEach(function(q){
        ctx.beginPath();ctx.ellipse(x+q.dx*k,y+q.dy*k-q.ry*k*.55,q.rx*k,q.ry*k,0,0,Math.PI*2);
        ctx.fillStyle=col.r2;ctx.fill();
        ctx.lineWidth=1;ctx.strokeStyle=rgba(col.sun,.16);ctx.stroke();
      });
    });
    ridge(2,off*.05,col.r3);
  }
  function size(){
    var b=hero.getBoundingClientRect();W=b.width;H=b.height;dpr=Math.min(window.devicePixelRatio||1,2);
    var logo=hero.querySelector('.badge img'),logoBox=logo.getBoundingClientRect();
    sunAnchor={x:logoBox.left-b.left+logoBox.width/2,y:logoBox.top-b.top+logoBox.height/2,r:logoBox.width*.68};
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);draw();
  }
  function sched(){if(!raf)raf=requestAnimationFrame(function(){raf=0;draw()})}
  readCols();seed();size();
  function startRays(){
    if(raysStarted)return;raysStarted=true;
    var t0=null;
    function animateRays(ts){
      if(t0===null)t0=ts;rayProgress=Math.min(1,(ts-t0)/700);draw();
      if(rayProgress<1)requestAnimationFrame(animateRays);
    }
    requestAnimationFrame(animateRays);
  }
  if(reduce){rise=1;rayProgress=1;hero.querySelector('.badge').classList.add('logo-reveal');draw()}else{
    var t0=null;
    requestAnimationFrame(function intro(ts){
      if(t0===null)t0=ts;rise=Math.min(1,(ts-t0)/2800);
      if(rise===1&&!raysStarted){hero.querySelector('.badge').classList.add('logo-reveal');startRays()}
      draw();
      if(rise<1)requestAnimationFrame(intro);
    });
  }
  if(window.ResizeObserver)new ResizeObserver(size).observe(hero);else window.addEventListener('resize',size);
  window.addEventListener('scroll',function(){sy=window.pageYOffset;if(sy<H+80)sched()},{passive:true});
  window.addEventListener('ss-theme',function(){readCols();sched()});
})();

setTrip('hampi');
})();
