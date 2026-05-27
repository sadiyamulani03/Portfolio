/* intro.js — INSANE Blockchain Intro Sequence */
(function(){
  var p = location.pathname.toLowerCase();
  if(!(p.match(/index\.html/) || p.match(/portfolio/) || p === '/' || p.endsWith('/'))) return;

  function waitThree(cb){ if(window.THREE){cb();return;} var t=setInterval(function(){if(window.THREE){clearInterval(t);cb();}},30); }

  function start(){
    var T=window.THREE, W=window.innerWidth, H=window.innerHeight;
    var cv=document.createElement('canvas');
    cv.id='intro-cv';
    cv.style.cssText='position:fixed;inset:0;z-index:99999;width:100%;height:100%;';
    document.body.appendChild(cv);

    var flash=document.createElement('div');
    flash.style.cssText='position:fixed;inset:0;z-index:99998;pointer-events:none;opacity:0;transition:opacity 0.08s;';
    document.body.appendChild(flash);

    var rend=new T.WebGLRenderer({canvas:cv,antialias:true});
    rend.setSize(W,H); rend.setPixelRatio(Math.min(devicePixelRatio,2));
    rend.setClearColor(0x000000,1);

    var scene=new T.Scene();
    var cam=new T.PerspectiveCamera(75,W/H,0.1,500);
    cam.position.z=12;

    // Warp particles
    var N=700, wg=new T.BufferGeometry();
    var wp=new Float32Array(N*3), wv=new Float32Array(N*3);
    for(var i=0;i<N;i++){
      var r=15+Math.random()*10, th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI;
      wp[i*3]=r*Math.sin(ph)*Math.cos(th);
      wp[i*3+1]=r*Math.sin(ph)*Math.sin(th);
      wp[i*3+2]=r*Math.cos(ph);
      wv[i*3]=-wp[i*3]*0.09; wv[i*3+1]=-wp[i*3+1]*0.09; wv[i*3+2]=-wp[i*3+2]*0.09;
    }
    wg.setAttribute('position',new T.BufferAttribute(wp,3));
    var wm=new T.PointsMaterial({color:0x00f5ff,size:0.07,transparent:true,opacity:1,blending:T.AdditiveBlending});
    var warp=new T.Points(wg,wm);
    scene.add(warp);

    // Blocks
    var bPos=[[-4.5,0,0],[-2.7,0.3,0],[-.9,-.2,0],[.9,.2,0],[2.7,-.3,0],[4.5,.1,0]];
    var bColors=[0x00f5ff,0xff006e,0xbf00ff,0x00ff88,0x00f5ff,0xff006e];
    var blocks=bPos.map(function(p,i){
      var eg=new T.EdgesGeometry(new T.BoxGeometry(.85,.85,.85));
      var m=new T.LineSegments(eg,new T.LineBasicMaterial({color:bColors[i],transparent:true,opacity:0,blending:T.AdditiveBlending}));
      m.position.set(p[0],p[1],p[2]); m.scale.setScalar(0);
      m.userData={born:null}; scene.add(m); return m;
    });

    // Chain lines
    var chains=[];
    for(var i=0;i<bPos.length-1;i++){
      var lg=new T.BufferGeometry().setFromPoints([new T.Vector3(...bPos[i]),new T.Vector3(...bPos[i+1])]);
      var lm=new T.LineBasicMaterial({color:0x00ff88,transparent:true,opacity:0,blending:T.AdditiveBlending});
      var l=new T.Line(lg,lm); scene.add(l); chains.push(lm);
    }

    // Shockwave
    var sw=new T.Mesh(new T.TorusGeometry(.1,.04,8,48),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,wireframe:true,blending:T.AdditiveBlending}));
    scene.add(sw);

    var t0=performance.now(), phase=0, spawnIdx=0, swR=0, fadeO=1, done=false, shk=0;

    function doFlash(dur,c){flash.style.background=c||'white';flash.style.opacity='1';setTimeout(function(){flash.style.opacity='0';},dur||120);}

    function tick(){
      if(done)return;
      requestAnimationFrame(tick);
      var t=(performance.now()-t0)/1000;

      // Shake
      if(shk>0){cam.position.x=(Math.random()-.5)*shk;cam.position.y=(Math.random()-.5)*shk;shk*=.82;}
      else{cam.position.x=0;cam.position.y=0;}

      // Phase 0: Warp (0-1.1s)
      if(t<1.1){
        var pos=wg.attributes.position.array;
        for(var i=0;i<N;i++){pos[i*3]+=wv[i*3]*1.6;pos[i*3+1]+=wv[i*3+1]*1.6;pos[i*3+2]+=wv[i*3+2]*1.6;}
        wg.attributes.position.needsUpdate=true;
        cam.fov=75+t*28; cam.updateProjectionMatrix();
      }

      // Transition to phase 1
      if(t>=1.1&&phase===0){phase=1;scene.remove(warp);cam.fov=75;cam.updateProjectionMatrix();doFlash(200,'#00f5ffaa');shk=.35;}

      // Phase 1: Spawn blocks (1.1-2.5s)
      if(phase===1){
        var idx=Math.floor((t-1.1)/.23);
        while(spawnIdx<=idx&&spawnIdx<blocks.length){blocks[spawnIdx].userData.born=performance.now();doFlash(70,'#00f5ff44');shk=.15;spawnIdx++;}
        blocks.forEach(function(b){
          if(b.userData.born){
            var a=(performance.now()-b.userData.born)/1000, s=Math.min(1,a*4), e=1-Math.pow(1-s,3);
            b.scale.setScalar(e); b.material.opacity=e; b.rotation.x=(1-e)*Math.PI; b.rotation.y+=.02;
          }
        });
      }

      // Phase 2: Chains (2.5-3.2s)
      if(t>=2.5&&phase===1){
        phase=2; doFlash(300,'white'); shk=.55;
        chains.forEach(function(m,i){setTimeout(function(){m.opacity=1;},i*90);});
      }
      if(phase>=2){blocks.forEach(function(b){b.rotation.y+=.014;b.rotation.x+=.007;});}

      // Phase 3: Shockwave (3.2-4s)
      if(t>=3.2&&phase===2){phase=3;doFlash(500,'white');shk=.9;}
      if(phase===3){
        swR+=.22; sw.scale.setScalar(swR); sw.material.opacity=Math.max(0,1-swR/10);
        cam.position.z=Math.max(5,12-(t-3.2)*6);
        blocks.forEach(function(b,i){var a=(i/blocks.length)*Math.PI*2;b.position.x+=Math.cos(a)*.05;b.position.y+=Math.sin(a)*.05;b.rotation.y+=.04;});
      }

      // Phase 4: Exit (4s+)
      if(t>=4.0&&phase===3){phase=4;}
      if(phase===4){fadeO-=.035;cv.style.opacity=Math.max(0,fadeO);if(fadeO<=0){done=true;cv.remove();flash.remove();rend.dispose();}}

      rend.render(scene,cam);
    }
    tick();
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){waitThree(start);});}
  else{waitThree(start);}
})();
