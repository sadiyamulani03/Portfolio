/* 3d-engine.js — Sadiya Mulani Portfolio | Per-Page 3D Scenes */
(function(){
'use strict';
var page=(function(){
  var p=location.pathname.toLowerCase();
  if(p.includes('about'))return'about';
  if(p.includes('skill'))return'skills';
  if(p.includes('project'))return'projects';
  if(p.includes('achievement'))return'achievements';
  if(p.includes('education'))return'education';
  if(p.includes('contact'))return'contact';
  return'home';
})();

function waitThree(cb){if(window.THREE){cb();return;}var t=setInterval(function(){if(window.THREE){clearInterval(t);cb();}},40);}
function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}

ready(function(){waitThree(function(){
  var map={home:initHome,about:initAbout,skills:initSkills,projects:initProjects,achievements:initAchievements,education:initEducation,contact:initContact};
  if(map[page])map[page]();
});});

/* ── HELPERS ── */
function makeRenderer(canvas,w,h,alpha){
  var T=window.THREE;
  var r=new T.WebGLRenderer({canvas:canvas,antialias:true,alpha:!!alpha});
  r.setSize(w,h);r.setPixelRatio(Math.min(devicePixelRatio,1.5));
  r.setClearColor(0x000000,alpha?0:1);
  return r;
}
function onResize(renderer,camera){
  window.addEventListener('resize',function(){
    var w=innerWidth,h=innerHeight;
    renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
  });
}

/* ================================================================
   HOME — 3D Floating Blockchain Network
================================================================ */
function initHome(){
  var T=window.THREE;
  var cv=document.getElementById('canvas-bg');if(!cv)return;
  var W=innerWidth,H=innerHeight;
  var rend=makeRenderer(cv,W,H,true);
  var scene=new T.Scene();
  var cam=new T.PerspectiveCamera(60,W/H,.1,500);
  cam.position.z=16;
  onResize(rend,cam);

  var COLORS=[0x00f5ff,0xff006e,0xbf00ff,0x00ff88];
  var nodes=[],nPos=[];
  for(var i=0;i<20;i++){
    var eg=new T.EdgesGeometry(new T.IcosahedronGeometry(.22+Math.random()*.14,0));
    var col=COLORS[i%COLORS.length];
    var m=new T.LineSegments(eg,new T.LineBasicMaterial({color:col,transparent:true,opacity:.4+Math.random()*.5,blending:T.AdditiveBlending}));
    var x=(Math.random()-.5)*28,y=(Math.random()-.5)*18,z=(Math.random()-.5)*10;
    m.position.set(x,y,z);nPos.push([x,y,z]);
    m.userData={bx:x,by:y,bz:z,rs:[(Math.random()-.5)*.012,(Math.random()-.5)*.012],fo:Math.random()*Math.PI*2,fs:.35+Math.random()*.3};
    scene.add(m);nodes.push(m);
  }

  // Connection lines
  for(var i=0;i<nPos.length;i++){
    for(var j=i+1;j<nPos.length;j++){
      var dx=nPos[i][0]-nPos[j][0],dy=nPos[i][1]-nPos[j][1],dz=nPos[i][2]-nPos[j][2];
      var d=Math.sqrt(dx*dx+dy*dy+dz*dz);
      if(d<9.5){
        var pts=[new T.Vector3(...nPos[i]),new T.Vector3(...nPos[j])];
        var lg=new T.BufferGeometry().setFromPoints(pts);
        var lm=new T.LineBasicMaterial({color:0x00f5ff,transparent:true,opacity:(1-d/9.5)*.12,blending:T.AdditiveBlending});
        scene.add(new T.Line(lg,lm));
      }
    }
  }

  // Glowing rings
  [[3.5,.002,0x00f5ff,Math.PI/3],[4.8,-.003,0xbf00ff,Math.PI/4]].forEach(function(d){
    var m=new T.Mesh(new T.TorusGeometry(d[0],.018,8,80),new T.MeshBasicMaterial({color:d[2],transparent:true,opacity:.1,blending:T.AdditiveBlending,wireframe:true}));
    m.rotation.x=d[3];m.userData.rs=d[1];scene.add(m);nodes.push(m);
  });

  // Flying "transaction" particles
  var txCount=60,txG=new T.BufferGeometry();
  var txP=new Float32Array(txCount*3),txV=new Float32Array(txCount*3);
  for(var i=0;i<txCount;i++){
    txP[i*3]=(Math.random()-.5)*30;txP[i*3+1]=(Math.random()-.5)*20;txP[i*3+2]=(Math.random()-.5)*10;
    txV[i*3]=(Math.random()-.5)*.06;txV[i*3+1]=(Math.random()-.5)*.06;txV[i*3+2]=(Math.random()-.5)*.04;
  }
  txG.setAttribute('position',new T.BufferAttribute(txP,3));
  scene.add(new T.Points(txG,new T.PointsMaterial({color:0x00ff88,size:.055,transparent:true,opacity:.65,blending:T.AdditiveBlending})));

  var mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',function(e){mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2;});

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.011;
    tx+=(mx-tx)*.04;ty+=(my-ty)*.04;
    scene.rotation.y=tx*.16;scene.rotation.x=-ty*.09;
    nodes.forEach(function(n){
      if(n.userData.rs&&Array.isArray(n.userData.rs)){
        n.rotation.x+=n.userData.rs[0];n.rotation.y+=n.userData.rs[1];
        var ft=t*n.userData.fs+n.userData.fo;
        n.position.y=n.userData.by+Math.sin(ft)*.45;
        n.position.x=n.userData.bx+Math.cos(ft*.7)*.22;
      } else if(n.userData.rs){
        n.rotation.z+=n.userData.rs;n.rotation.y+=n.userData.rs*.5;
      }
    });
    var tp=txG.attributes.position.array;
    for(var i=0;i<txCount;i++){
      tp[i*3]+=txV[i*3];tp[i*3+1]+=txV[i*3+1];tp[i*3+2]+=txV[i*3+2];
      if(Math.abs(tp[i*3])>15){txV[i*3]*=-1;}
      if(Math.abs(tp[i*3+1])>10){txV[i*3+1]*=-1;}
    }
    txG.attributes.position.needsUpdate=true;
    rend.render(scene,cam);
  })();
}

/* ================================================================
   ABOUT — 3D Orbit + Data Fragments
================================================================ */
function initAbout(){
  var T=window.THREE;
  var cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.4;';
  document.body.insertBefore(cv,document.body.firstChild);
  var W=innerWidth,H=innerHeight;
  var rend=makeRenderer(cv,W,H,true);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(55,W/H,.1,200);
  cam.position.z=12;onResize(rend,cam);

  // Central wireframe sphere
  var csm=new T.Mesh(new T.SphereGeometry(1.5,24,24),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:.06,wireframe:true}));
  scene.add(csm);

  // Orbit rings + dots
  [[2.8,.5,0x00f5ff,.4],[3.8,-.3,0xff006e,.6],[5,0.18,0xbf00ff,.85]].forEach(function(d){
    var ring=new T.Mesh(new T.TorusGeometry(d[0],.012,6,72),new T.MeshBasicMaterial({color:d[2],transparent:true,opacity:.14,blending:T.AdditiveBlending}));
    ring.rotation.x=d[3];scene.add(ring);
    var dot=new T.Mesh(new T.SphereGeometry(.09,8,8),new T.MeshBasicMaterial({color:d[2],blending:T.AdditiveBlending}));
    scene.add(dot);dot.userData={r:d[0],spd:d[1],tilt:d[3],ang:Math.random()*Math.PI*2,ring:ring};
  });

  // Floating mini cubes (data packets)
  var cubes=[];
  for(var i=0;i<12;i++){
    var c=new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(.1,.1,.1)),new T.LineBasicMaterial({color:0x00f5ff,transparent:true,opacity:.35,blending:T.AdditiveBlending}));
    var ang=i/12*Math.PI*2,rad=6+Math.random()*2;
    c.position.set(Math.cos(ang)*rad,Math.sin(ang)*rad*0.6,(Math.random()-.5)*4);
    c.userData={ang:ang,rad:rad,spd:.008+Math.random()*.006,yo:Math.random()*Math.PI*2};
    scene.add(c);cubes.push(c);
  }

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.009;
    csm.rotation.y+=.004;csm.rotation.x+=.002;
    scene.children.forEach(function(o){
      if(o.userData&&o.userData.spd&&o.userData.r){
        o.userData.ang+=o.userData.spd;
        var x=Math.cos(o.userData.ang)*o.userData.r;
        var y=Math.sin(o.userData.ang)*o.userData.r*Math.cos(o.userData.tilt);
        var z=Math.sin(o.userData.ang)*o.userData.r*Math.sin(o.userData.tilt);
        o.position.set(x,y,z);
        if(o.userData.ring)o.userData.ring.rotation.y+=o.userData.spd*.3;
      }
    });
    cubes.forEach(function(c){
      c.userData.ang+=c.userData.spd;
      c.position.x=Math.cos(c.userData.ang)*c.userData.rad;
      c.position.y=Math.sin(c.userData.ang)*c.userData.rad*0.6+Math.sin(t+c.userData.yo)*.3;
      c.rotation.x+=.02;c.rotation.y+=.015;
    });
    rend.render(scene,cam);
  })();
}

/* ================================================================
   SKILLS — 3D Tag Sphere
================================================================ */
function initSkills(){
  var T=window.THREE;
  var section=document.getElementById('skills')||document.querySelector('section');if(!section)return;
  var wrap=document.createElement('div');
  wrap.id='skills-3d';
  wrap.style.cssText='position:fixed;top:0;right:0;width:340px;height:100vh;pointer-events:none;z-index:0;opacity:.6;';
  document.body.appendChild(wrap);
  var cv=document.createElement('canvas');wrap.appendChild(cv);
  var rend=makeRenderer(cv,340,innerHeight,true);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,340/innerHeight,.1,100);
  cam.position.z=8;

  var skills=['Solidity','Smart Contracts','ERC-20','Polygon','MetaMask','OpenZeppelin','Web3','Python','Data Science','MySQL','Power BI','HTML','CSS','Networking','TCP/UDP','OSI Model','Cryptography','Encryption','Remix IDE','Blockchain Arch.'];
  var COLORS=[0x00f5ff,0xff006e,0xbf00ff,0x00ff88];
  var sphereNodes=[];

  skills.forEach(function(sk,i){
    var phi=Math.acos(-1+2*i/skills.length);
    var theta=Math.sqrt(skills.length*Math.PI)*phi;
    var R=3.2;
    var x=R*Math.sin(phi)*Math.cos(theta);
    var y=R*Math.sin(phi)*Math.sin(theta);
    var z=R*Math.cos(phi);
    var dot=new T.Mesh(new T.SphereGeometry(.07,8,8),new T.MeshBasicMaterial({color:COLORS[i%COLORS.length],transparent:true,opacity:.85,blending:T.AdditiveBlending}));
    dot.position.set(x,y,z);
    scene.add(dot);sphereNodes.push(dot);
  });

  // Wireframe sphere cage
  scene.add(new T.Mesh(new T.SphereGeometry(3.2,18,18),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:.04,wireframe:true})));

  // Inner glowing core
  var core=new T.Mesh(new T.SphereGeometry(.6,16,16),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:.15,wireframe:true}));
  scene.add(core);

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.006;
    scene.rotation.y+=.005;scene.rotation.x+=.002;
    core.rotation.y-=.01;
    sphereNodes.forEach(function(d,i){
      d.material.opacity=.5+Math.sin(t*2+i*.4)*.35;
    });
    rend.render(scene,cam);
  })();
}

/* ================================================================
   PROJECTS — 3D Particle Field + depth effect
================================================================ */
function initProjects(){
  var T=window.THREE;
  var cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;top:0;right:0;width:220px;height:100vh;pointer-events:none;z-index:0;opacity:.07;';
  document.body.appendChild(cv);
  var rend=makeRenderer(cv,220,innerHeight,false);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,220/innerHeight,.1,100);
  cam.position.z=5;
  var cols=Math.floor(220/13),drops=Array(cols).fill(1);
  var chars='01アウカキ#$⛓ETH01ブロック'.split('');
  var ctx=document.createElement('canvas');ctx.width=220;ctx.height=innerHeight;
  var c2=ctx.getContext('2d');
  function drawMatrix(){
    c2.fillStyle='rgba(2,4,8,.05)';c2.fillRect(0,0,220,innerHeight);
    c2.fillStyle='#00f5ff';c2.font="12px 'Share Tech Mono',monospace";
    drops.forEach(function(y,i){
      c2.fillText(chars[Math.floor(Math.random()*chars.length)],i*13,y*13);
      if(y*13>innerHeight&&Math.random()>.975)drops[i]=0;
      drops[i]++;
    });
  }
  var tex=new T.CanvasTexture(ctx);
  var plane=new T.Mesh(new T.PlaneGeometry(220/50,innerHeight/50),new T.MeshBasicMaterial({map:tex,transparent:true,opacity:1}));
  scene.add(plane);
  setInterval(function(){drawMatrix();tex.needsUpdate=true;rend.render(scene,cam);},55);
}

/* ================================================================
   ACHIEVEMENTS — 3D Floating Badge Particles
================================================================ */
function initAchievements(){
  var T=window.THREE;
  var cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.35;';
  document.body.insertBefore(cv,document.body.firstChild);
  var W=innerWidth,H=innerHeight;
  var rend=makeRenderer(cv,W,H,true);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,W/H,.1,200);
  cam.position.z=14;onResize(rend,cam);

  var COLS=[0xffd700,0x00f5ff,0xff006e,0x00ff88];
  var stars=[];
  for(var i=0;i<25;i++){
    var geo=new T.OctahedronGeometry(.15+Math.random()*.12,0);
    var m=new T.LineSegments(new T.EdgesGeometry(geo),new T.LineBasicMaterial({color:COLS[i%COLS.length],transparent:true,opacity:.5+Math.random()*.4,blending:T.AdditiveBlending}));
    m.position.set((Math.random()-.5)*26,(Math.random()-.5)*16,(Math.random()-.5)*8);
    m.userData={rs:[Math.random()*.02-.01,Math.random()*.02-.01],fo:Math.random()*Math.PI*2,fy:.3+Math.random()*.25};
    scene.add(m);stars.push(m);
  }
  // Confetti ring
  var ring=new T.Mesh(new T.TorusGeometry(5,.03,8,64),new T.MeshBasicMaterial({color:0xffd700,transparent:true,opacity:.08,wireframe:true,blending:T.AdditiveBlending}));
  ring.rotation.x=Math.PI/2.5;scene.add(ring);

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.01;
    ring.rotation.z+=.003;
    stars.forEach(function(s){
      s.rotation.x+=s.userData.rs[0];s.rotation.y+=s.userData.rs[1];
      s.position.y+=Math.sin(t*s.userData.fy+s.userData.fo)*.008;
    });
    rend.render(scene,cam);
  })();
}

/* ================================================================
   EDUCATION — DNA Helix Particles
================================================================ */
function initEducation(){
  var T=window.THREE;
  var cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.3;';
  document.body.insertBefore(cv,document.body.firstChild);
  var W=innerWidth,H=innerHeight;
  var rend=makeRenderer(cv,W,H,true);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,W/H,.1,200);
  cam.position.set(0,0,14);onResize(rend,cam);

  var N=120,helixPts=[];
  var hg=new T.BufferGeometry(),hPos=new Float32Array(N*3);
  var hg2=new T.BufferGeometry(),hPos2=new Float32Array(N*3);
  for(var i=0;i<N;i++){
    var angle=i/N*Math.PI*8,yt=(i/N-0.5)*18;
    var R=2.8;
    hPos[i*3]=Math.cos(angle)*R; hPos[i*3+1]=yt; hPos[i*3+2]=Math.sin(angle)*R;
    hPos2[i*3]=Math.cos(angle+Math.PI)*R; hPos2[i*3+1]=yt; hPos2[i*3+2]=Math.sin(angle+Math.PI)*R;
  }
  hg.setAttribute('position',new T.BufferAttribute(hPos,3));
  hg2.setAttribute('position',new T.BufferAttribute(hPos2,3));
  var pm=function(c){return new T.PointsMaterial({color:c,size:.1,transparent:true,opacity:.9,blending:T.AdditiveBlending});};
  scene.add(new T.Points(hg,pm(0x00f5ff)));
  scene.add(new T.Points(hg2,pm(0xff006e)));

  // Cross rungs every 6 points
  for(var i=0;i<N;i+=6){
    var p1=new T.Vector3(hPos[i*3],hPos[i*3+1],hPos[i*3+2]);
    var p2=new T.Vector3(hPos2[i*3],hPos2[i*3+1],hPos2[i*3+2]);
    var lg=new T.BufferGeometry().setFromPoints([p1,p2]);
    scene.add(new T.Line(lg,new T.LineBasicMaterial({color:0x00ff88,transparent:true,opacity:.25,blending:T.AdditiveBlending})));
  }

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.007;
    scene.rotation.y+=.004;
    cam.position.y=Math.sin(t*.2)*2;
    rend.render(scene,cam);
  })();
}

/* ================================================================
   CONTACT — 3D Network Globe
================================================================ */
function initContact(){
  var T=window.THREE;
  var wrap=document.createElement('div');
  wrap.style.cssText='position:fixed;top:50%;right:2%;transform:translateY(-50%);width:280px;height:280px;pointer-events:none;z-index:0;opacity:.55;';
  document.body.appendChild(wrap);
  var cv=document.createElement('canvas');wrap.appendChild(cv);
  var rend=makeRenderer(cv,280,280,true);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(60,1,.1,100);
  cam.position.z=5.5;

  // Globe wireframe
  scene.add(new T.Mesh(new T.SphereGeometry(2,18,18),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:.07,wireframe:true})));

  // Node dots on globe
  var COLS=[0x00f5ff,0xff006e,0x00ff88,0xbf00ff];
  var gNodes=[];
  for(var i=0;i<22;i++){
    var phi=Math.acos(-1+2*i/22),theta=Math.sqrt(22*Math.PI)*phi;
    var dot=new T.Mesh(new T.SphereGeometry(.065,6,6),new T.MeshBasicMaterial({color:COLS[i%COLS.length],blending:T.AdditiveBlending}));
    dot.position.setFromSphericalCoords(2,phi,theta);
    scene.add(dot);gNodes.push(dot);
  }

  // Connection arcs between random node pairs
  for(var k=0;k<14;k++){
    var a=gNodes[Math.floor(Math.random()*gNodes.length)];
    var b=gNodes[Math.floor(Math.random()*gNodes.length)];
    var mid=new T.Vector3().addVectors(a.position,b.position).normalize().multiplyScalar(2.4);
    var pts=[a.position,mid,b.position];
    var lg=new T.BufferGeometry().setFromPoints(pts);
    scene.add(new T.Line(lg,new T.LineBasicMaterial({color:0x00f5ff,transparent:true,opacity:.2,blending:T.AdditiveBlending})));
  }

  // Outer ring
  scene.add(new T.Mesh(new T.TorusGeometry(2.4,.012,6,64),new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:.12,blending:T.AdditiveBlending})));

  var t=0;
  (function loop(){
    requestAnimationFrame(loop);t+=.01;
    scene.rotation.y+=.008;scene.rotation.x+=.003;
    gNodes.forEach(function(n,i){n.material.opacity=.5+Math.sin(t*2+i*.5)*.5;});
    rend.render(scene,cam);
  })();
}

})();
