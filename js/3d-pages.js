/* 3d-pages.js — Immersive 3D Scenes for Sub-Pages */
(function(){
'use strict';
var p=location.pathname.toLowerCase();
function getPage(){
  if(p.includes('about'))return'about';
  if(p.includes('skill'))return'skills';
  if(p.includes('project'))return'projects';
  if(p.includes('achievement'))return'achievements';
  if(p.includes('education'))return'education';
  if(p.includes('contact'))return'contact';
  return null;
}
var page=getPage();if(!page)return;

function waitThree(cb){if(window.THREE){cb();return;}var t=setInterval(function(){if(window.THREE){clearInterval(t);cb();}},40);}
function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}

ready(function(){waitThree(function(){
  var map={about:initAbout,skills:initSkills,projects:initProjects,achievements:initAchievements,education:initEducation,contact:initContact};
  if(map[page])map[page]();
});});

function mkCanvas(opacity,zIndex){
  var cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:'+(zIndex||0)+';opacity:'+(opacity||0.4)+';';
  document.body.insertBefore(cv,document.body.firstChild);
  return cv;
}
function mkRenderer(cv,w,h){
  var T=window.THREE;
  var r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  r.setSize(w,h);r.setPixelRatio(Math.min(devicePixelRatio,1.5));
  r.setClearColor(0x000000,0);return r;
}
function onResize(r,c){window.addEventListener('resize',function(){var w=innerWidth,h=innerHeight;r.setSize(w,h);c.aspect=w/h;c.updateProjectionMatrix();});}

/* ═══ ABOUT — Holographic Identity Sphere ═══ */
function initAbout(){
  var T=window.THREE,cv=mkCanvas(0.45),W=innerWidth,H=innerHeight;
  var rend=mkRenderer(cv,W,H);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(55,W/H,.1,200);
  cam.position.z=13;onResize(rend,cam);

  // Central sphere
  var s1=new T.Mesh(new T.SphereGeometry(2,32,32),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.06,wireframe:true}));
  scene.add(s1);
  var s2=new T.Mesh(new T.IcosahedronGeometry(1.6,1),new T.MeshBasicMaterial({color:0xbf00ff,transparent:true,opacity:0.05,wireframe:true,blending:T.AdditiveBlending}));
  scene.add(s2);

  // Orbit rings + racing dots
  var dots=[];
  [[3,0.6,0x00f5ff,0.4],[4.2,-0.4,0xff006e,0.6],[5.5,0.2,0xbf00ff,0.85]].forEach(function(d){
    var ring=new T.Mesh(new T.TorusGeometry(d[0],0.012,6,80),new T.MeshBasicMaterial({color:d[2],transparent:true,opacity:0.12,blending:T.AdditiveBlending}));
    ring.rotation.x=d[3];scene.add(ring);
    var dot=new T.Mesh(new T.SphereGeometry(0.1,8,8),new T.MeshBasicMaterial({color:d[2],blending:T.AdditiveBlending}));
    scene.add(dot);
    dot.userData={r:d[0],spd:d[1],tilt:d[3],ang:Math.random()*Math.PI*2,ringMesh:ring};
    dots.push(dot);
  });

  // Data cubes
  var cubes=[];
  for(var i=0;i<16;i++){
    var c=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.12,0.12,0.12)),new T.LineBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.3,blending:T.AdditiveBlending}));
    var ang=i/16*Math.PI*2,rad=6.5+Math.random()*2;
    c.position.set(Math.cos(ang)*rad,Math.sin(ang)*rad*0.5,(Math.random()-0.5)*4);
    c.userData={ang:ang,rad:rad,spd:0.006+Math.random()*0.008,yo:Math.random()*Math.PI*2};
    scene.add(c);cubes.push(c);
  }

  var mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-0.5)*2;my=(e.clientY/innerHeight-0.5)*2;},{passive:true});

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=0.008;
    tx+=(mx-tx)*0.03;ty+=(my-ty)*0.03;
    scene.rotation.y=tx*0.12;scene.rotation.x=-ty*0.08;
    s1.rotation.y+=0.004;s1.rotation.x+=0.002;
    s2.rotation.y-=0.006;s2.rotation.z+=0.003;
    dots.forEach(function(d){
      d.userData.ang+=d.userData.spd*0.02;
      var a=d.userData.ang;
      d.position.set(Math.cos(a)*d.userData.r,Math.sin(a)*d.userData.r*Math.cos(d.userData.tilt),Math.sin(a)*d.userData.r*Math.sin(d.userData.tilt));
      d.userData.ringMesh.rotation.y+=d.userData.spd*0.005;
    });
    cubes.forEach(function(c){
      c.userData.ang+=c.userData.spd;
      c.position.x=Math.cos(c.userData.ang)*c.userData.rad;
      c.position.y=Math.sin(c.userData.ang)*c.userData.rad*0.5+Math.sin(t*1.5+c.userData.yo)*0.4;
      c.rotation.x+=0.02;c.rotation.y+=0.015;
    });
    rend.render(scene,cam);
  })();
}

/* ═══ SKILLS — 3D Rotating Skill Galaxy ═══ */
function initSkills(){
  var T=window.THREE,cv=mkCanvas(0.55),W=innerWidth,H=innerHeight;
  var rend=mkRenderer(cv,W,H);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(55,W/H,.1,200);
  cam.position.z=10;onResize(rend,cam);

  var COLS=[0x00f5ff,0xff006e,0xbf00ff,0x00ff88,0xffd700];
  var skills=['Solidity','Smart Contracts','ERC-20','Polygon','MetaMask','OpenZeppelin','Web3','Python','Data Science','MySQL','Power BI','HTML','CSS','Networking','TCP/UDP','OSI Model','Cryptography','Encryption','Remix IDE','Blockchain'];
  var orbs=[];

  // Skill orbs on Fibonacci sphere
  skills.forEach(function(sk,i){
    var phi=Math.acos(-1+2*i/skills.length);
    var theta=Math.sqrt(skills.length*Math.PI)*phi;
    var R=3.5;
    var x=R*Math.sin(phi)*Math.cos(theta),y=R*Math.sin(phi)*Math.sin(theta),z=R*Math.cos(phi);
    var dot=new T.Mesh(new T.SphereGeometry(0.09,8,8),new T.MeshBasicMaterial({color:COLS[i%COLS.length],transparent:true,opacity:0.85,blending:T.AdditiveBlending}));
    dot.position.set(x,y,z);scene.add(dot);orbs.push(dot);
    // Tiny connecting lines to center
    var lg=new T.BufferGeometry().setFromPoints([new T.Vector3(0,0,0),new T.Vector3(x,y,z)]);
    scene.add(new T.Line(lg,new T.LineBasicMaterial({color:COLS[i%COLS.length],transparent:true,opacity:0.04,blending:T.AdditiveBlending})));
  });

  // Cage + core
  scene.add(new T.Mesh(new T.SphereGeometry(3.5,20,20),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.035,wireframe:true})));
  var core=new T.Mesh(new T.IcosahedronGeometry(0.7,1),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.12,wireframe:true,blending:T.AdditiveBlending}));
  scene.add(core);

  // Outer ring
  var ring=new T.Mesh(new T.TorusGeometry(4.2,0.012,6,80),new T.MeshBasicMaterial({color:0xbf00ff,transparent:true,opacity:0.1,blending:T.AdditiveBlending}));
  ring.rotation.x=Math.PI/3;scene.add(ring);

  var mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-0.5)*2;my=(e.clientY/innerHeight-0.5)*2;},{passive:true});

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=0.006;
    tx+=(mx-tx)*0.03;ty+=(my-ty)*0.03;
    scene.rotation.y=0.005*t+tx*0.15;
    scene.rotation.x=ty*-0.1;
    core.rotation.y-=0.012;core.rotation.x+=0.008;
    ring.rotation.z+=0.003;
    orbs.forEach(function(d,i){d.material.opacity=0.5+Math.sin(t*2.5+i*0.4)*0.4;});
    rend.render(scene,cam);
  })();
}

/* ═══ PROJECTS — 3D Matrix Code Rain ═══ */
function initProjects(){
  var T=window.THREE,cv=mkCanvas(0.12),W=innerWidth,H=innerHeight;
  var rend=mkRenderer(cv,W,H);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,W/H,.1,100);
  cam.position.z=8;onResize(rend,cam);

  // Floating code blocks
  var blocks=[];
  for(var i=0;i<30;i++){
    var sz=0.1+Math.random()*0.15;
    var g=new T.EdgesGeometry(new T.BoxGeometry(sz,sz*1.6,sz*0.3));
    var col=[0x00f5ff,0x00ff88,0xbf00ff][i%3];
    var m=new T.LineSegments(g,new T.LineBasicMaterial({color:col,transparent:true,opacity:0.25+Math.random()*0.3,blending:T.AdditiveBlending}));
    m.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*14,(Math.random()-0.5)*8);
    m.userData={vy:-0.01-Math.random()*0.02,rs:[Math.random()*0.02,Math.random()*0.02]};
    scene.add(m);blocks.push(m);
  }

  // Particle field
  var pN=120,pg=new T.BufferGeometry(),pp=new Float32Array(pN*3);
  for(var i=0;i<pN;i++){pp[i*3]=(Math.random()-0.5)*25;pp[i*3+1]=(Math.random()-0.5)*18;pp[i*3+2]=(Math.random()-0.5)*10;}
  pg.setAttribute('position',new T.BufferAttribute(pp,3));
  scene.add(new T.Points(pg,new T.PointsMaterial({color:0x00f5ff,size:0.04,transparent:true,opacity:0.4,blending:T.AdditiveBlending})));

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=0.008;
    blocks.forEach(function(b){
      b.position.y+=b.userData.vy;
      b.rotation.x+=b.userData.rs[0];b.rotation.y+=b.userData.rs[1];
      if(b.position.y<-8){b.position.y=8;b.position.x=(Math.random()-0.5)*20;}
    });
    // Particles drift down
    for(var i=0;i<pN;i++){
      pp[i*3+1]-=0.008;
      if(pp[i*3+1]<-9){pp[i*3+1]=9;pp[i*3]=(Math.random()-0.5)*25;}
    }
    pg.attributes.position.needsUpdate=true;
    scene.rotation.y=Math.sin(t*0.3)*0.05;
    rend.render(scene,cam);
  })();
}

/* ═══ ACHIEVEMENTS — Trophy Constellation ═══ */
function initAchievements(){
  var T=window.THREE,cv=mkCanvas(0.4),W=innerWidth,H=innerHeight;
  var rend=mkRenderer(cv,W,H);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,W/H,.1,200);
  cam.position.z=15;onResize(rend,cam);

  var COLS=[0xffd700,0x00f5ff,0xff006e,0x00ff88,0xbf00ff];
  var stars=[];
  for(var i=0;i<30;i++){
    var geo=new T.OctahedronGeometry(0.15+Math.random()*0.15,0);
    var m=new T.LineSegments(new T.EdgesGeometry(geo),new T.LineBasicMaterial({color:COLS[i%COLS.length],transparent:true,opacity:0.4+Math.random()*0.5,blending:T.AdditiveBlending}));
    m.position.set((Math.random()-0.5)*28,(Math.random()-0.5)*18,(Math.random()-0.5)*10);
    m.userData={rs:[Math.random()*0.02-0.01,Math.random()*0.02-0.01],fo:Math.random()*Math.PI*2,fy:0.25+Math.random()*0.3};
    scene.add(m);stars.push(m);
  }

  // Gold ring
  var ring=new T.Mesh(new T.TorusGeometry(5.5,0.025,8,80),new T.MeshBasicMaterial({color:0xffd700,transparent:true,opacity:0.08,wireframe:true,blending:T.AdditiveBlending}));
  ring.rotation.x=Math.PI/2.5;scene.add(ring);
  // Second ring
  var ring2=new T.Mesh(new T.TorusGeometry(4,0.015,6,60),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.06,wireframe:true,blending:T.AdditiveBlending}));
  ring2.rotation.x=Math.PI/1.8;ring2.rotation.z=0.3;scene.add(ring2);

  var mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-0.5)*2;my=(e.clientY/innerHeight-0.5)*2;},{passive:true});

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=0.008;
    tx+=(mx-tx)*0.03;ty+=(my-ty)*0.03;
    scene.rotation.y=tx*0.1;scene.rotation.x=-ty*0.06;
    ring.rotation.z+=0.003;ring2.rotation.z-=0.004;
    stars.forEach(function(s){
      s.rotation.x+=s.userData.rs[0];s.rotation.y+=s.userData.rs[1];
      s.position.y+=Math.sin(t*s.userData.fy+s.userData.fo)*0.006;
    });
    rend.render(scene,cam);
  })();
}

/* ═══ EDUCATION — DNA Double Helix ═══ */
function initEducation(){
  var T=window.THREE,cv=mkCanvas(0.35),W=innerWidth,H=innerHeight;
  var rend=mkRenderer(cv,W,H);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,W/H,.1,200);
  cam.position.set(0,0,15);onResize(rend,cam);

  var N=140;
  var hg=new T.BufferGeometry(),hp=new Float32Array(N*3);
  var hg2=new T.BufferGeometry(),hp2=new Float32Array(N*3);
  for(var i=0;i<N;i++){
    var angle=i/N*Math.PI*8,yt=(i/N-0.5)*20,R=3;
    hp[i*3]=Math.cos(angle)*R;hp[i*3+1]=yt;hp[i*3+2]=Math.sin(angle)*R;
    hp2[i*3]=Math.cos(angle+Math.PI)*R;hp2[i*3+1]=yt;hp2[i*3+2]=Math.sin(angle+Math.PI)*R;
  }
  hg.setAttribute('position',new T.BufferAttribute(hp,3));
  hg2.setAttribute('position',new T.BufferAttribute(hp2,3));
  var pm=function(c){return new T.PointsMaterial({color:c,size:0.1,transparent:true,opacity:0.9,blending:T.AdditiveBlending});};
  scene.add(new T.Points(hg,pm(0x00f5ff)));
  scene.add(new T.Points(hg2,pm(0xff006e)));

  // Cross rungs
  for(var i=0;i<N;i+=5){
    var p1=new T.Vector3(hp[i*3],hp[i*3+1],hp[i*3+2]);
    var p2=new T.Vector3(hp2[i*3],hp2[i*3+1],hp2[i*3+2]);
    scene.add(new T.Line(new T.BufferGeometry().setFromPoints([p1,p2]),new T.LineBasicMaterial({color:0x00ff88,transparent:true,opacity:0.2,blending:T.AdditiveBlending})));
  }

  // Outer helix ring
  var ring=new T.Mesh(new T.TorusGeometry(3.5,0.01,6,60),new T.MeshBasicMaterial({color:0xbf00ff,transparent:true,opacity:0.06,wireframe:true,blending:T.AdditiveBlending}));
  ring.rotation.x=Math.PI/2;scene.add(ring);

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=0.006;
    scene.rotation.y+=0.004;
    cam.position.y=Math.sin(t*0.25)*2.5;
    ring.rotation.z+=0.005;
    rend.render(scene,cam);
  })();
}

/* ═══ CONTACT — Interactive Network Globe ═══ */
function initContact(){
  var T=window.THREE,cv=mkCanvas(0.5),W=innerWidth,H=innerHeight;
  var rend=mkRenderer(cv,W,H);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(55,W/H,.1,200);
  cam.position.z=7;onResize(rend,cam);

  // Globe
  scene.add(new T.Mesh(new T.SphereGeometry(2.5,24,24),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.05,wireframe:true})));

  // Node dots
  var COLS=[0x00f5ff,0xff006e,0x00ff88,0xbf00ff,0xffd700];
  var gNodes=[];
  for(var i=0;i<28;i++){
    var phi=Math.acos(-1+2*i/28),theta=Math.sqrt(28*Math.PI)*phi;
    var dot=new T.Mesh(new T.SphereGeometry(0.07,6,6),new T.MeshBasicMaterial({color:COLS[i%COLS.length],transparent:true,opacity:0.8,blending:T.AdditiveBlending}));
    dot.position.setFromSphericalCoords(2.5,phi,theta);
    scene.add(dot);gNodes.push(dot);
  }

  // Connection arcs
  for(var k=0;k<18;k++){
    var a=gNodes[Math.floor(Math.random()*gNodes.length)];
    var b=gNodes[Math.floor(Math.random()*gNodes.length)];
    if(a===b)continue;
    var mid=new T.Vector3().addVectors(a.position,b.position).normalize().multiplyScalar(3);
    scene.add(new T.Line(new T.BufferGeometry().setFromPoints([a.position.clone(),mid,b.position.clone()]),new T.LineBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.15,blending:T.AdditiveBlending})));
  }

  // Rings
  var r1=new T.Mesh(new T.TorusGeometry(3,0.012,6,70),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.1,blending:T.AdditiveBlending}));
  scene.add(r1);
  var r2=new T.Mesh(new T.TorusGeometry(3.5,0.01,6,60),new T.MeshBasicMaterial({color:0xbf00ff,transparent:true,opacity:0.06,blending:T.AdditiveBlending}));
  r2.rotation.x=0.5;r2.rotation.z=0.3;scene.add(r2);

  var mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-0.5)*2;my=(e.clientY/innerHeight-0.5)*2;},{passive:true});

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=0.008;
    tx+=(mx-tx)*0.03;ty+=(my-ty)*0.03;
    scene.rotation.y=0.008*t+tx*0.15;
    scene.rotation.x=ty*-0.08;
    r1.rotation.z+=0.004;r2.rotation.z-=0.003;
    gNodes.forEach(function(n,i){n.material.opacity=0.5+Math.sin(t*2+i*0.5)*0.4;});
    rend.render(scene,cam);
  })();
}

})();
