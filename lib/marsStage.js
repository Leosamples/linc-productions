var VS = '#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

var COMMON = [
'float hash13(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}',
'vec3 hash33(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.xxy+p.yxx)*p.zyx);}',
'float vnoise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);',
' return mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x),mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x),f.y),',
'            mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x),mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x),f.y),f.z);}',
'float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+vec3(11.7,3.1,7.9);a*=.5;}return s;}'
].join('\n');

var BAKE_FS = '#version 300 es\nprecision highp float;\nout vec4 o;\nuniform vec2 uRes;\nuniform vec4 uHero[6];\nuniform int uHeroN;\nuniform float uEps;\n' + COMMON + '\n' + [
'float crater(float d,float depth,float peak){',
' float bowl=-depth*(1.-smoothstep(.35,1.,d));',
' float rim=depth*.34*exp(-pow((d-1.)/.15,2.));',
' float eje=d>1.?depth*.12*exp(-(d-1.)*3.):0.;',
' float pk=peak*depth*.5*exp(-pow(d/.13,2.));',
' return bowl+rim+eje+pk;}',
'float craterField(vec3 p,float sc,float seed,float dk,float pres,float peak){',
' vec3 x=p*sc;vec3 b=floor(x-.5);float h=0.;',
' for(int i=0;i<2;i++)for(int j=0;j<2;j++)for(int k=0;k<2;k++){',
'  vec3 c=b+vec3(float(i),float(j),float(k));',
'  if(hash13(c+seed*7.1)>pres)continue;',
'  vec3 ctr=c+.25+.5*hash33(c+seed);',
'  float rad=mix(.15,.4,hash13(c*1.3+seed+3.3));',
'  float d=length(x-ctr)/rad;',
'  if(d<2.4)h+=crater(d,rad/sc*dk,peak);}',
' return h;}',
'float hf(vec3 p){',
' float h=.020*(fbm(p*1.7+3.)-.5)+.006*(fbm(p*6.+9.)-.5);',
' h+=craterField(p,4.,1.,.17,.8,1.);',
' h+=craterField(p,9.,2.,.16,.85,.6);',
' h+=craterField(p,20.,3.,.15,.85,.2);',
' h+=craterField(p,44.,4.,.14,.9,0.);',
' h+=craterField(p,90.,5.,.13,.95,0.);',
' for(int i=0;i<6;i++){if(i>=uHeroN)break;',
'  float d=acos(clamp(dot(p,uHero[i].xyz),-1.,1.))/uHero[i].w;',
'  if(d<2.6){h+=crater(d,uHero[i].w*.17,1.);',
'   h+=uHero[i].w*.17*.06*sin(d*22.)*smoothstep(.35,.7,d)*(1.-smoothstep(.85,1.,d));}}',
' return h;}',
'void main(){',
' vec2 uv=gl_FragCoord.xy/uRes;',
' float lon=(uv.x-.5)*6.2831853;float lat=(uv.y-.5)*3.14159265;',
' vec3 p=vec3(cos(lat)*sin(lon),sin(lat),cos(lat)*cos(lon));',
' vec3 east=vec3(p.z,0.,-p.x);float el=length(east);east=el>1e-4?east/el:vec3(1.,0.,0.);',
' vec3 north=cross(p,east);',
' float h0=hf(p);',
' float he=hf(normalize(p+east*uEps));',
' float hn=hf(normalize(p+north*uEps));',
' float se=(he-h0)/uEps,sn=(hn-h0)/uEps;',
' float big=fbm(p*2.2+17.);',
' float tint=smoothstep(.34,.68,big);',
' tint+=clamp(h0*16.,-.3,.3);',
' float ice=smoothstep(1.2,1.42,abs(lat)+.12*(fbm(p*5.)-.5));',
' o=vec4(clamp(se/.8*.5+.5,0.,1.),clamp(sn/.8*.5+.5,0.,1.),clamp(tint,0.,1.),ice);}'
].join('\n');

var DRAW_FS = '#version 300 es\nprecision highp float;\nout vec4 o;\nuniform sampler2D uTex;\nuniform vec2 uCenter;\nuniform float uRpx;\nuniform mat3 uM;\nuniform vec3 uL;\nuniform float uBump;\n' + COMMON + '\n' + [
'void main(){',
' vec2 q=(gl_FragCoord.xy-uCenter)/uRpx;',
' float d2=dot(q,q);',
' vec3 n=vec3(q,sqrt(max(1.-d2,0.)));',
' vec3 p=transpose(uM)*n;',
' float lat=asin(clamp(p.y,-1.,1.));float lon=atan(p.x,p.z);',
' float ua=lon/6.2831853+.5;float ub=fract(ua+.5)-.5;float vv=.5+lat/3.14159265;',
' float fa=fwidth(ua),fb=fwidth(ub);',
' vec2 gx,gy;',
' if(fa<=fb){gx=vec2(dFdx(ua),dFdx(vv));gy=vec2(dFdy(ua),dFdy(vv));}else{gx=vec2(dFdx(ub),dFdx(vv));gy=vec2(dFdy(ub),dFdy(vv));}',
' vec4 t=textureGrad(uTex,vec2(ua,vv),gx,gy);',
' vec3 L=normalize(uL);',
' vec3 haze=vec3(1.,.5,.26);',
' if(d2>1.){',
'  float r=sqrt(d2);',
'  vec2 dir=q/max(r,1e-4);',
'  float lit=smoothstep(-.5,.9,dot(dir,L.xy));',
'  float a=(exp(-(r-1.)*42.)*.85+exp(-(r-1.)*9.)*.14)*(.25+.75*lit);',
'  o=vec4(haze*a,a*.9);return;}',
' vec3 east=vec3(p.z,0.,-p.x);east=normalize(east+vec3(1e-5,0.,0.));',
' vec3 north=cross(p,east);',
' float se=(t.r*2.-1.)*.8*uBump,sn=(t.g*2.-1.)*.8*uBump;',
' vec3 nb=normalize(p-se*east-sn*north);',
' vec3 nv=uM*nb;',
' float g1=vnoise(p*640.),g2=vnoise(p*1500.),g3=vnoise(p*980.);',
' nv=normalize(nv+(vec3(g1,g2,g3)-.5)*.09);',
' float diff=max(dot(nv,L),0.);',
' float geo=max(dot(n,L),0.);',
' float lightAmt=mix(diff,geo,.2);',
' vec3 rock=vec3(.16,.075,.05),mid=vec3(.55,.26,.13),dust=vec3(.86,.53,.31);',
' float tint=t.b+(g1-.5)*.14+(g2-.5)*.06;',
' vec3 base=mix(rock,mid,smoothstep(0.,.5,tint));',
' base=mix(base,dust,smoothstep(.5,1.,tint));',
' base=mix(base,vec3(.93,.9,.87),t.a*.85);',
' vec3 col=base*(.06+1.2*lightAmt);',
' float fr=pow(1.-n.z,2.4);',
' col+=haze*fr*(.25+.9*max(dot(n,L)+.3,0.))*.6;',
' col*=mix(1.,.62,pow(1.-n.z,2.));',
' col=col/(1.+col*.12);',
' float ea=1.-smoothstep(.9925,1.,d2);',
' o=vec4(col*ea,ea);}'
].join('\n');

function sh(gl, type, src) {
  var s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
function prog(gl, fs) {
  var p = gl.createProgram();
  gl.attachShader(p, sh(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(p, sh(gl, gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'a');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}
function unit(lat, lon) {
  var a = lat * Math.PI / 180, b = lon * Math.PI / 180;
  return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
}
function mat(spin, tilt) {
  var cs = Math.cos(spin), ss = Math.sin(spin), ct = Math.cos(tilt), st = Math.sin(tilt);
  // M = Rx(tilt) * Ry(spin), row-major
  var r = [
    cs, 0, ss,
    st * ss, ct, -st * cs,
    -ct * ss, st, ct * cs
  ];
  // upload column-major
  return new Float32Array([r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]]);
}
function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
function smooth(e, e0, e1) { var t = Math.min(1, Math.max(0, (e - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }

export function createMars(opts) {
  var canvas = opts.canvas, markersEl = opts.markersEl, stops = opts.stops;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl;
  try { gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (e) { gl = null; }
  if (!gl) return null;
  var bakeP, drawP;
  try { bakeP = prog(gl, BAKE_FS); drawP = prog(gl, DRAW_FS); } catch (e) { if (window.console) console.warn('[mars]', e.message); return null; }

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  var small = Math.min(window.innerWidth, window.innerHeight) < 700 || (navigator.deviceMemory && navigator.deviceMemory < 4);
  var HI_W = opts.texW || (small ? 2048 : 4096), HI_H = HI_W / 2;
  var LO_W = 1024, LO_H = 512;

  var hero = new Float32Array(24);
  var P = stops.map(function (s, i) {
    var u = unit(s.lat, s.lon);
    hero[i * 4] = u[0]; hero[i * 4 + 1] = u[1]; hero[i * 4 + 2] = u[2]; hero[i * 4 + 3] = s.size || 0.06;
    return u;
  });

  function makeTex(w, h) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex: t, fbo: fbo, w: w, h: h };
  }
  var BU = {
    res: gl.getUniformLocation(bakeP, 'uRes'), hero: gl.getUniformLocation(bakeP, 'uHero'),
    heroN: gl.getUniformLocation(bakeP, 'uHeroN'), eps: gl.getUniformLocation(bakeP, 'uEps')
  };
  function bakeRows(T, y0, rows) {
    gl.useProgram(bakeP);
    gl.bindFramebuffer(gl.FRAMEBUFFER, T.fbo);
    gl.viewport(0, 0, T.w, T.h);
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(0, y0, T.w, rows);
    gl.uniform2f(BU.res, T.w, T.h);
    gl.uniform4fv(BU.hero, hero);
    gl.uniform1i(BU.heroN, stops.length);
    gl.uniform1f(BU.eps, 0.7 * 6.2831853 / T.w);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  function finishTex(T) {
    gl.bindTexture(gl.TEXTURE_2D, T.tex);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);
  }

  var lo = makeTex(LO_W, LO_H);
  bakeRows(lo, 0, LO_H);
  finishTex(lo);
  var cur = lo, hi = null, hiRow = 0, hiDone = false;
  var ROWS = opts.rowsPerFrame || 128;

  var DU = {};
  ['uTex', 'uCenter', 'uRpx', 'uM', 'uL', 'uBump'].forEach(function (n) { DU[n] = gl.getUniformLocation(drawP, n); });

  // state
  var spin = 0, tilt = 0.3, vel = 0, mode = 'focus', fIndex = 0;
  var tSpin = 0, tTilt = 0.3, drift = 0;
  var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, fy = .5, fz = Math.sqrt(.75), mobile = false;
  var paused = false, running = true, visible = true, t0 = performance.now(), last = t0, raf = 0, readyFired = false;

  function layout() {
    var r = canvas.parentElement.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    mobile = W < 760;
    if (mobile) {
      R = Math.max(W * 1.15, 380); cx = W * 0.5; cy = H * 0.36 + R; fy = 0.8;
    } else {
      R = Math.min(H * 0.9, W * 0.62); cx = W * 0.58; cy = H * 0.34 + R; fy = 0.5;
    }
    fz = Math.sqrt(1 - fy * fy);
  }
  layout();

  function stopTarget(i) {
    var p = P[i], rho = Math.hypot(p[0], p[2]);
    var s = Math.atan2(-p[0], p[2]);
    var t = Math.atan2(fz, fy) - Math.atan2(rho, p[1]);
    return { s: s, t: wrap(t) };
  }
  function focus(i) {
    fIndex = i; mode = 'focus'; vel = 0;
    var T = stopTarget(i);
    tSpin = T.s; tTilt = T.t;
    if (reduce) { spin = tSpin; tilt = tTilt; }
    markersDirty = true;
  }
  var markersDirty = true;

  // markers
  var mk = stops.map(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mars-m'; b.setAttribute('aria-label', s.title);
    b.innerHTML = '<span class="mars-m-ring"></span><span class="mars-m-num">' + String(i + 1).padStart(2, '0') + '</span><span class="mars-m-lbl">' + s.short + '</span>';
    b.addEventListener('click', function () { focus(i); if (opts.onSelect) opts.onSelect(i); });
    markersEl.appendChild(b);
    return b;
  });

  // drag to rotate
  var drag = null;
  function pd(e) {
    if (e.target.closest && e.target.closest('.mars-m')) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false, lastX: e.clientX, lastT: performance.now() };
  }
  function pm(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.lastX;
    if (!drag.moved && Math.abs(e.clientX - drag.x) < 5) return;
    if (!drag.moved) {
      drag.moved = true; mode = 'drift'; if (opts.onDrift) opts.onDrift();
      try { canvas.parentElement.setPointerCapture(e.pointerId); } catch (x) {}
    }
    var ds = dx / R * 1.1;
    spin += ds; vel = ds / Math.max(1, (performance.now() - drag.lastT)) * 16;
    drag.lastX = e.clientX; drag.lastT = performance.now();
  }
  function pu(e) { if (drag && e.pointerId === drag.id) drag = null; }
  var stage = canvas.parentElement;
  stage.addEventListener('pointerdown', pd);
  stage.addEventListener('pointermove', pm);
  stage.addEventListener('pointerup', pu);
  stage.addEventListener('pointercancel', pu);

  function placeMarkers() {
    var M = mat(spin, tilt);
    for (var i = 0; i < mk.length; i++) {
      var p = P[i];
      // M is column-major: rows are M[0],M[3],M[6] etc.
      var x = M[0] * p[0] + M[3] * p[1] + M[6] * p[2];
      var y = M[1] * p[0] + M[4] * p[1] + M[7] * p[2];
      var z = M[2] * p[0] + M[5] * p[1] + M[8] * p[2];
      var vis = smooth(z, 0.1, 0.42);
      var b = mk[i];
      b.style.transform = 'translate(' + (cx + R * x).toFixed(1) + 'px,' + (cy - R * y).toFixed(1) + 'px)';
      b.style.opacity = vis.toFixed(2);
      b.style.pointerEvents = vis > 0.5 ? 'auto' : 'none';
      b.tabIndex = vis > 0.5 ? 0 : -1;
      var sel = (i === fIndex && mode === 'focus');
      if (b.classList.contains('on') !== sel) b.classList.toggle('on', sel);
    }
  }

  function draw(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    // motion
    if (!reduce) {
      if (mode === 'focus') {
        var k = 1 - Math.exp(-dt * 2.4);
        var ds = wrap(tSpin + Math.sin((now - t0) / 1000 * 0.25) * 0.035 - spin);
        spin += ds * k; tilt += wrap(tTilt - tilt) * k;
      } else {
        spin += (vel) * (dt * 60) + 0.0 ;
        vel *= Math.pow(0.94, dt * 60);
        if (!drag) spin += dt * 0.04;
        tilt += (0.3 - tilt) * (1 - Math.exp(-dt * 1.5));
      }
    }
    // draw
    gl.useProgram(drawP);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, cur.tex);
    gl.uniform1i(DU.uTex, 0);
    gl.uniform2f(DU.uCenter, cx * dpr, (H - cy) * dpr);
    gl.uniform1f(DU.uRpx, R * dpr);
    gl.uniformMatrix3fv(DU.uM, false, mat(spin, tilt));
    gl.uniform3f(DU.uL, -0.38, 0.62, 0.5);
    gl.uniform1f(DU.uBump, 1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    placeMarkers();
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (paused || !visible || document.hidden) { last = now; return; }
    // progressive hi-res bake
    if (!hiDone) {
      if (!hi) hi = makeTex(HI_W, HI_H);
      bakeRows(hi, hiRow, Math.min(ROWS, HI_H - hiRow));
      hiRow += ROWS;
      if (hiRow >= HI_H) { finishTex(hi); cur = hi; hiDone = true; }
    }
    draw(now);
    if (!readyFired) { readyFired = true; if (opts.onReady) opts.onReady(); }
  }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0 });
    io.observe(stage);
  }
  var rt = 0;
  function onResize() { clearTimeout(rt); rt = setTimeout(function () { layout(); focusKeep(); }, 120); }
  function focusKeep() { if (mode === 'focus') { var T = stopTarget(fIndex); tSpin = T.s; tTilt = T.t; } }
  window.addEventListener('resize', onResize);

  // start with the planet turning into place
  var T0 = stopTarget(0); spin = T0.s - 1.6; tilt = T0.t; tSpin = T0.s; tTilt = T0.t; fIndex = 0;
  if (reduce) spin = T0.s;
  raf = requestAnimationFrame(frame);

  return {
    focus: focus,
    pause: function (v) { paused = v !== false; },
    snap: function () { spin = tSpin; tilt = tTilt; },
    destroy: function () {
      cancelAnimationFrame(raf); window.removeEventListener('resize', onResize);
      stage.removeEventListener('pointerdown', pd); stage.removeEventListener('pointermove', pm);
      stage.removeEventListener('pointerup', pu); stage.removeEventListener('pointercancel', pu);
      if (io) io.disconnect();
      mk.forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
      var ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
    },
    _state: function () { return { spin: spin, tilt: tilt, mode: mode, hiDone: hiDone, W: W, H: H, R: R }; }
  };
}
