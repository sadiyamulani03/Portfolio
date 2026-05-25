/* cursor-ultra.js — Premium cursor with glow trail */
(function(){
'use strict';
if(!window.matchMedia('(pointer:fine)').matches)return;

function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
ready(function(){
  var dot=document.getElementById('cursor');
  var ring=document.getElementById('cursor-ring');
  if(!dot||!ring)return;

  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;

  // Smooth cursor movement
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';
    dot.style.top=my+'px';
  },{passive:true});

  // Ring lerps behind with spring
  (function lerpRing(){
    rx+=(mx-rx)*0.12;
    ry+=(my-ry)*0.12;
    ring.style.left=rx+'px';
    ring.style.top=ry+'px';
    requestAnimationFrame(lerpRing);
  })();

  // Hover states
  var hoverSel='a,button,.project-card,.skill-category,.achievement-card,.stat-card,.social-link,.nav-toggle,.nav-drawer-close,.form-btn,.btn-primary,.btn-secondary,.tag,.skill-tag,.ach-tag,.f-btn,.soc-link';
  document.querySelectorAll(hoverSel).forEach(function(el){
    el.addEventListener('mouseenter',function(){document.body.classList.add('cursor-hover');});
    el.addEventListener('mouseleave',function(){document.body.classList.remove('cursor-hover');});
  });

  // Text cursor on inputs
  document.querySelectorAll('input,textarea').forEach(function(el){
    el.addEventListener('mouseenter',function(){document.body.classList.add('cursor-text');});
    el.addEventListener('mouseleave',function(){document.body.classList.remove('cursor-text');});
  });

  // Hide when leaving window
  document.addEventListener('mouseleave',function(){document.body.classList.add('cursor-hidden');});
  document.addEventListener('mouseenter',function(){document.body.classList.remove('cursor-hidden');});

  // === CURSOR TRAIL ===
  var canvas=document.createElement('canvas');
  canvas.id='cursor-trail';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');

  function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
  resize();
  window.addEventListener('resize',resize,{passive:true});

  var trails=[];
  var COLORS=['#00f5ff','#bf00ff','#ff006e','#00ff88'];

  document.addEventListener('mousemove',function(e){
    if(Math.random()>0.5)return;
    for(var i=0;i<2;i++){
      trails.push({
        x:e.clientX+(Math.random()-0.5)*6,
        y:e.clientY+(Math.random()-0.5)*6,
        vx:(Math.random()-0.5)*1.5,
        vy:(Math.random()-0.5)*1.5-0.5,
        life:1,
        r:1+Math.random()*2,
        c:COLORS[Math.floor(Math.random()*COLORS.length)]
      });
    }
  },{passive:true});

  (function drawTrail(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=trails.length-1;i>=0;i--){
      var p=trails[i];
      p.x+=p.vx;
      p.y+=p.vy;
      p.vy+=0.03;
      p.life-=0.025;
      if(p.life<=0){trails.splice(i,1);continue;}
      ctx.save();
      ctx.globalAlpha=p.life*0.6;
      ctx.shadowBlur=8;
      ctx.shadowColor=p.c;
      ctx.fillStyle=p.c;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
    // Keep array manageable
    if(trails.length>150)trails.splice(0,50);
    requestAnimationFrame(drawTrail);
  })();
});
})();
