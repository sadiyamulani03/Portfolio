/* 3d-home.js — Immersive Home Page 3D Blockchain Universe */
(function(){
'use strict';
var p=location.pathname.toLowerCase();
if(!p.match(/(portfolio|index)/)&&!p.endsWith('/')&&!p.endsWith('\\'))return;

function waitThree(cb){if(window.THREE){cb();return;}var t=setInterval(function(){if(window.THREE){clearInterval(t);cb();}},40);}
function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}

ready(function(){waitThree(init);});

function init(){
  var T=window.THREE;
  // Create dedicated 3D canvas (canvas-bg is used by Portfolio.js for 2D particles)
  var cv=document.createElement('canvas');
  cv.id='canvas-3d';
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.insertBefore(cv,document.body.firstChild);
  var W=innerWidth,H=innerHeight;
  var rend=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
  rend.setSize(W,H);rend.setPixelRatio(Math.min(devicePixelRatio,1.5));
  rend.setClearColor(0x000000,0);

  var scene=new T.Scene();
  var cam=new T.PerspectiveCamera(60,W/H,.1,600);
  cam.position.z=18;

  window.addEventListener('resize',function(){
    W=innerWidth;H=innerHeight;
    rend.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix();
  });

  var COLS=[0x00f5ff,0xff006e,0xbf00ff,0x00ff88,0xffd700];

  // === CENTRAL ENERGY CORE ===
  var coreGeo=new T.IcosahedronGeometry(1.2,1);
  var coreMat=new T.MeshBasicMaterial({color:0x00f5ff,transparent:true,opacity:0.08,wireframe:true,blending:T.AdditiveBlending});
  var core=new T.Mesh(coreGeo,coreMat);
  scene.add(core);
  var coreInner=new T.Mesh(new T.IcosahedronGeometry(0.6,0),new T.MeshBasicMaterial({color:0xbf00ff,transparent:true,opacity:0.12,wireframe:true,blending:T.AdditiveBlending}));
  scene.add(coreInner);

  // === BLOCKCHAIN NODES ===
  var nodes=[],nPos=[];
  var NODE_COUNT=35;
  for(var i=0;i<NODE_COUNT;i++){
    var sz=0.18+Math.random()*0.18;
    var detail=Math.random()>0.5?1:0;
    var eg=new T.EdgesGeometry(new T.IcosahedronGeometry(sz,detail));
    var col=COLS[i%COLS.length];
    var mat=new T.LineBasicMaterial({color:col,transparent:true,opacity:0.35+Math.random()*0.55,blending:T.AdditiveBlending});
    var m=new T.LineSegments(eg,mat);
    var spread=22;
    var x=(Math.random()-0.5)*spread*1.4;
    var y=(Math.random()-0.5)*spread*0.8;
    var z=(Math.random()-0.5)*spread*0.5;
    m.position.set(x,y,z);
    nPos.push([x,y,z]);
    m.userData={bx:x,by:y,bz:z,rs:[(Math.random()-0.5)*0.015,(Math.random()-0.5)*0.015],fo:Math.random()*Math.PI*2,fs:0.3+Math.random()*0.35};
    scene.add(m);nodes.push(m);
  }

  // === CONNECTION LINES ===
  var lineMeshes=[];
  for(var i=0;i<nPos.length;i++){
    for(var j=i+1;j<nPos.length;j++){
      var dx=nPos[i][0]-nPos[j][0],dy=nPos[i][1]-nPos[j][1],dz=nPos[i][2]-nPos[j][2];
      var d=Math.sqrt(dx*dx+dy*dy+dz*dz);
      if(d<10){
        var pts=[new T.Vector3(nPos[i][0],nPos[i][1],nPos[i][2]),new T.Vector3(nPos[j][0],nPos[j][1],nPos[j][2])];
        var lg=new T.BufferGeometry().setFromPoints(pts);
        var lm=new T.LineBasicMaterial({color:0x00f5ff,transparent:true,opacity:(1-d/10)*0.15,blending:T.AdditiveBlending});
        var line=new T.Line(lg,lm);
        scene.add(line);lineMeshes.push(lm);
      }
    }
  }

  // === ORBITAL RINGS ===
  var rings=[];
  [[4,0.002,0x00f5ff,Math.PI/3],[5.5,-0.003,0xbf00ff,Math.PI/4.5],[7,0.0015,0xff006e,Math.PI/2.5]].forEach(function(d){
    var rm=new T.Mesh(new T.TorusGeometry(d[0],0.015,8,100),new T.MeshBasicMaterial({color:d[2],transparent:true,opacity:0.08,blending:T.AdditiveBlending,wireframe:true}));
    rm.rotation.x=d[3];rm.userData={rs:d[1]};scene.add(rm);rings.push(rm);
    // Racing dot on ring
    var dot=new T.Mesh(new T.SphereGeometry(0.06,6,6),new T.MeshBasicMaterial({color:d[2],transparent:true,opacity:0.9,blending:T.AdditiveBlending}));
    dot.userData={ring:d[0],spd:d[1]*8,ang:0,tilt:d[3]};
    scene.add(dot);rings.push(dot);
  });

  // === PARTICLE NEBULA ===
  var pCount=Math.min(250,Math.max(100,Math.round(W/6)));
  var pGeo=new T.BufferGeometry();
  var pPos=new Float32Array(pCount*3),pVel=new Float32Array(pCount*3);
  for(var i=0;i<pCount;i++){
    pPos[i*3]=(Math.random()-0.5)*40;
    pPos[i*3+1]=(Math.random()-0.5)*28;
    pPos[i*3+2]=(Math.random()-0.5)*15;
    pVel[i*3]=(Math.random()-0.5)*0.02;
    pVel[i*3+1]=(Math.random()-0.5)*0.02;
    pVel[i*3+2]=(Math.random()-0.5)*0.015;
  }
  pGeo.setAttribute('position',new T.BufferAttribute(pPos,3));
  scene.add(new T.Points(pGeo,new T.PointsMaterial({color:0x00f5ff,size:0.04,transparent:true,opacity:0.5,blending:T.AdditiveBlending})));

  // === FLYING TRANSACTIONS ===
  var txCount=80;
  var txGeo=new T.BufferGeometry();
  var txPos=new Float32Array(txCount*3),txVel=new Float32Array(txCount*3);
  for(var i=0;i<txCount;i++){
    txPos[i*3]=(Math.random()-0.5)*35;txPos[i*3+1]=(Math.random()-0.5)*24;txPos[i*3+2]=(Math.random()-0.5)*12;
    txVel[i*3]=(Math.random()-0.5)*0.08;txVel[i*3+1]=(Math.random()-0.5)*0.08;txVel[i*3+2]=(Math.random()-0.5)*0.05;
  }
  txGeo.setAttribute('position',new T.BufferAttribute(txPos,3));
  scene.add(new T.Points(txGeo,new T.PointsMaterial({color:0x00ff88,size:0.06,transparent:true,opacity:0.7,blending:T.AdditiveBlending})));

  // === MOUSE PARALLAX ===
  var mx=0,my=0,tx=0,ty=0;
  document.addEventListener('mousemove',function(e){
    mx=(e.clientX/W-0.5)*2;
    my=(e.clientY/H-0.5)*2;
  },{passive:true});

  // === RENDER LOOP ===
  var t=0;
  (function loop(){
    requestAnimationFrame(loop);
    t+=0.01;

    // Smooth mouse follow
    tx+=(mx-tx)*0.04;ty+=(my-ty)*0.04;
    scene.rotation.y=tx*0.18;
    scene.rotation.x=-ty*0.1;

    // Core pulse
    var pulse=1+Math.sin(t*2)*0.08;
    core.scale.setScalar(pulse);
    core.rotation.y+=0.003;core.rotation.x+=0.002;
    coreMat.opacity=0.06+Math.sin(t*1.5)*0.04;
    coreInner.rotation.y-=0.008;coreInner.rotation.x+=0.005;

    // Nodes float
    nodes.forEach(function(n){
      n.rotation.x+=n.userData.rs[0];
      n.rotation.y+=n.userData.rs[1];
      var ft=t*n.userData.fs+n.userData.fo;
      n.position.y=n.userData.by+Math.sin(ft)*0.6;
      n.position.x=n.userData.bx+Math.cos(ft*0.7)*0.3;
    });

    // Rings rotate + dots race
    rings.forEach(function(r){
      if(r.userData.rs&&!r.userData.ring){
        r.rotation.z+=r.userData.rs;
        r.rotation.y+=r.userData.rs*0.5;
      }
      if(r.userData.ring){
        r.userData.ang+=r.userData.spd;
        var a=r.userData.ang;
        r.position.x=Math.cos(a)*r.userData.ring;
        r.position.y=Math.sin(a)*r.userData.ring*Math.cos(r.userData.tilt);
        r.position.z=Math.sin(a)*r.userData.ring*Math.sin(r.userData.tilt);
      }
    });

    // Nebula drift
    var pp=pGeo.attributes.position.array;
    for(var i=0;i<pCount;i++){
      pp[i*3]+=pVel[i*3];pp[i*3+1]+=pVel[i*3+1];pp[i*3+2]+=pVel[i*3+2];
      if(Math.abs(pp[i*3])>20)pVel[i*3]*=-1;
      if(Math.abs(pp[i*3+1])>14)pVel[i*3+1]*=-1;
      if(Math.abs(pp[i*3+2])>8)pVel[i*3+2]*=-1;
    }
    pGeo.attributes.position.needsUpdate=true;

    // Transactions fly
    var tp=txGeo.attributes.position.array;
    for(var i=0;i<txCount;i++){
      tp[i*3]+=txVel[i*3];tp[i*3+1]+=txVel[i*3+1];tp[i*3+2]+=txVel[i*3+2];
      if(Math.abs(tp[i*3])>18)txVel[i*3]*=-1;
      if(Math.abs(tp[i*3+1])>12)txVel[i*3+1]*=-1;
    }
    txGeo.attributes.position.needsUpdate=true;

    // Connection lines pulse
    lineMeshes.forEach(function(lm,i){
      lm.opacity=lm.opacity*0.98+(0.08+Math.sin(t*2+i*0.3)*0.06)*0.02;
    });

    rend.render(scene,cam);
  })();
}
})();
