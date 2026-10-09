"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

// Animated Sun: draws the sun image in WebGL with a slowly churning surface,
// shimmering granules and flares licking off the edge. Falls back to the still
// image when WebGL is unavailable or the visitor prefers reduced motion.
// Only renders while the Sun layer is visible (opacity from the scroll fade).

const VS = `attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;

const FS = `precision highp float;
uniform sampler2D uTex;uniform float uT;varying vec2 v;
float h(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n3(p);p=p*2.02+vec3(1.7,9.2,3.1);a*=.5;}return s;}
void main(){
 vec2 q=v-.5;float r=length(q)*2.;float t=uT;
 const float R=.765;
 float inside=1.-smoothstep(R-.02,R,r);
 float limb=smoothstep(R,R*.72,r);
 vec3 p=vec3(q*7.,t*.16);
 vec2 w=vec2(fbm(p),fbm(p+vec3(5.2,1.3,2.7)))-.5;
 vec3 p2=p*2.3+vec3(w*2.,t*.24);
 vec2 w2=vec2(fbm(p2),fbm(p2+3.1))-.5;
 vec2 uv=v+(w*.017+w2*.010)*limb*inside;
 vec3 col=texture2D(uTex,uv).rgb;
 float g=fbm(vec3(q*38.,t*.75));
 col*=mix(1.,.8+.4*g,inside);
 float hs=smoothstep(.6,.9,fbm(vec3(q*5.,t*.13+9.)));
 col+=vec3(1.,.55,.15)*hs*.2*inside;
 float ang=atan(q.y,q.x);float d=r-R;
 vec3 pc=vec3(cos(ang),sin(ang),0.);
 float burst=smoothstep(.42,.72,fbm(pc*2.9+vec3(0.,0.,t*.18)));
 float flame=fbm(vec3(pc.xy*9.,d*9.-t*.95));
 float edge=smoothstep(-.012,.02,d);
 float tendr=pow(flame,3.)*exp(-max(d,0.)*(10.-6.5*burst))*edge;
 float corona=exp(-max(d,0.)*16.)*smoothstep(-.03,.01,d)*(.55+.45*fbm(vec3(pc.xy*5.,t*.45)));
 vec3 fc=mix(vec3(1.,.32,.05),vec3(1.,.78,.4),flame);
 col+=fc*(tendr*2.8*(.25+burst)+corona*.35);
 col*=.97+.025*sin(t*1.7)+.02*sin(t*2.9+1.);
 gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
  return s;
}

export default function SunCanvas({ visibility }: { visibility: MotionValue<number> }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A fresh canvas per mount (React Strict Mode remounts in development).
    const canvas = document.createElement("canvas");
    canvas.className = "sun-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, preserveDrawingBuffer: false });
    if (!gl) return;

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FS));
      gl.bindAttribLocation(prog, 0, "a");
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
    } catch (err) {
      console.warn("[sun] WebGL animation unavailable, using the still image.", err);
      return;
    }

    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "uT");

    // Internal resolution: sharp enough for the 1600px source, capped for speed.
    const size = () => {
      // Layout width (ignores the scroll scale), at the largest scale it reaches (1.1).
      const css = (box.offsetWidth || 1) * 1.1;
      const cap = window.innerWidth < 760 ? 1024 : 1440;
      const px = Math.round(Math.min(cap, css * Math.min(window.devicePixelRatio || 1, 2)));
      if (canvas.width !== px) { canvas.width = px; canvas.height = px; gl.viewport(0, 0, px, px); }
    };

    let raf = 0, last = 0, ready = false, disposed = false;
    const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!ready || document.hidden || visibility.get() < 0.01) return;
      if (now - last < 33) return; // ~30 fps is plenty for slow plasma
      last = now;
      gl.uniform1f(uT, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      size();
      box.appendChild(canvas);
      ready = true;
      setLive(true);
    };
    const probe = document.createElement("canvas");
    const webp = probe.toDataURL && probe.toDataURL("image/webp").startsWith("data:image/webp");
    img.src = webp ? "/images/sun.webp" : "/images/sun.jpg";

    const onResize = () => size();
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setLive(false);
    };
  }, [visibility]);

  return (
    <div ref={boxRef} className={`sun-box sun-breathe${live ? " live" : ""}`}>
      <picture>
        <source srcSet="/images/sun.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/sun.jpg" alt="" width={1600} height={1600} decoding="async" className="sun-img" />
      </picture>
    </div>
  );
}
