/**
 * Hand-written GLSL for the Synthesis Core.
 *
 * Everything here animates in the vertex/fragment stage from a single `uTime`
 * and `uPhase` uniform. No per-frame CPU work touches geometry, which is what
 * keeps a 24k-particle field at 60fps on a mid-range laptop.
 */

/* -------------------------------------------------------------------------- */
/* Shared noise                                                                */
/* -------------------------------------------------------------------------- */

/** Simplex 3D noise (Ashima/Gustavson, public domain). Used for curl and fbm. */
export const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
    + i.y+vec4(0.0,i1.y,i2.y,1.0))
    + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

/* Curl of the noise field — divergence-free, so particles swirl like air
   instead of collapsing into sinks. This is the whole "pawan" idea. */
vec3 curlNoise(vec3 p){
  const float e = 0.12;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));
  float x = (n2 - n1) - (n4 - n3);
  float y = (n4 - n3) - (n6 - n5);
  float z = (n6 - n5) - (n2 - n1);
  return normalize(vec3(x, y, z) + 1e-6);
}
`;

/* -------------------------------------------------------------------------- */
/* Wind field — the particle system                                            */
/* -------------------------------------------------------------------------- */

/**
 * Each particle carries a home position on a sphere shell and a random seed.
 * `uCondense` (0 = free wind, 1 = locked to the core surface) is driven by
 * scroll, so the same buffer renders both the dispersed and condensed states.
 */
export const WIND_VERT = /* glsl */ `
uniform float uTime;
uniform float uCondense;
uniform float uSize;
uniform float uVelocity;
uniform vec3  uPointer;
uniform float uIntro;

attribute vec3  aTarget;
attribute float aSeed;
attribute float aScale;

varying float vAlpha;
varying float vMix;

${NOISE_GLSL}

void main(){
  float t = uTime * 0.11;
  vec3 home = position;

  /* Free state: drift along the curl field, orbiting slowly. */
  vec3 drift = curlNoise(home * 0.22 + vec3(0.0, t, aSeed * 0.4));
  float amp = 1.35 + sin(aSeed * 6.283 + uTime * 0.35) * 0.45;
  vec3 wind = home + drift * amp;

  /* Scroll velocity smears the field along the axis of travel. */
  wind.y -= uVelocity * (0.5 + aSeed * 0.9);

  /* Condensed state: snap toward the crystalline shell, with a little jitter
     left in so it never looks mechanically perfect. */
  vec3 locked = aTarget + drift * 0.075;

  float e = uCondense * uCondense * (3.0 - 2.0 * uCondense);
  vec3 pos = mix(wind, locked, e);

  /* Pointer pushes the field away, like a hand through smoke. */
  vec3 toPointer = pos - uPointer;
  float d = length(toPointer);
  pos += normalize(toPointer + 1e-5) * (1.6 / (1.0 + d * d * 2.2)) * (1.0 - e * 0.65);

  /* Intro: the field arrives from far out along its own radius. */
  pos = mix(pos * 2.6, pos, uIntro);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float depthFade = smoothstep(-30.0, -3.0, mv.z);
  gl_PointSize = uSize * aScale * (46.0 / -mv.z) * (1.0 - e * 0.3);

  vMix = e;
  vAlpha = depthFade * (0.03 + aScale * 0.15) * uIntro;
}
`;

export const WIND_FRAG = /* glsl */ `
precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorWarm;
uniform float uWarmth;

varying float vAlpha;
varying float vMix;

void main(){
  /* Two gaussians rather than one hard disc: a tight hot centre inside a wide
     soft halo. That falloff is what reads as a light source instead of a dot,
     and it is why this needs no bloom pass to glow. */
  vec2 uv = (gl_PointCoord - 0.5) * 2.0;
  float d2 = dot(uv, uv);
  if (d2 > 1.0) discard;

  float halo = exp(-d2 * 3.4);
  float core = exp(-d2 * 15.0);
  float mask = halo * 0.16 + core * 0.85;

  vec3 col = mix(uColorA, uColorB, vMix);
  col = mix(col, uColorWarm, uWarmth * 0.55);

  /* The centre lifts toward white the way a real highlight does — but only
     just. A field that all reads at full brightness looks like falling snow. */
  col = mix(col, vec3(0.9, 0.96, 1.0), core * 0.3);

  gl_FragColor = vec4(col, mask * vAlpha);
}
`;

/* -------------------------------------------------------------------------- */
/* The Core — a refractive crystal without the cost of real transmission       */
/* -------------------------------------------------------------------------- */

export const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uIntro;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vNoise;
varying vec3 vPos;

${NOISE_GLSL}

void main(){
  vec3 p = position;

  /* Slow surface displacement — the crystal breathes rather than pulses. */
  float n = snoise(normal * 1.5 + vec3(0.0, uTime * 0.14, 0.0));
  float shard = snoise(normal * 4.2 + uTime * 0.06);

  /* uMorph blends a smooth breathing sphere into a faceted shard form. */
  p += normal * (n * 0.13 * (1.0 - uMorph) + shard * 0.3 * uMorph);
  p *= mix(0.86, 1.0, uIntro);

  vec4 world = modelMatrix * vec4(p, 1.0);
  vec4 mv = viewMatrix * world;

  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - world.xyz);
  vNoise = n;
  vPos = p;

  gl_Position = projectionMatrix * mv;
}
`;

export const CORE_FRAG = /* glsl */ `
precision highp float;

uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorWarm;
uniform float uTime;
uniform float uIntro;
uniform float uWarmth;

varying vec3  vNormalW;
varying vec3  vViewDir;
varying float vNoise;
varying vec3  vPos;

void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);

  /* Fresnel: the edge of glass is where all the light is. */
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

  /* Thin-film iridescence approximated by shifting hue with view angle. */
  float band = dot(N, V) * 3.4 + uTime * 0.12 + vNoise * 1.4;
  vec3 iri = 0.5 + 0.5 * cos(6.28318 * (band + vec3(0.0, 0.33, 0.67)));

  /* Two key lights, warm rim and cool key, so the form reads in the round. */
  vec3 keyDir = normalize(vec3(-0.5, 0.85, 0.55));
  vec3 rimDir = normalize(vec3(0.8, -0.25, -0.4));
  float key = max(dot(N, keyDir), 0.0);
  float warmRim = pow(max(dot(N, rimDir), 0.0), 2.2);

  /* Everything is driven by this one mask. Glass is not a lit surface with a
     bright edge — it is an almost invisible surface that is *only* an edge, and
     treating it that way is what stops it reading as a frosted marble. */
  float rim = pow(fres, 1.15);

  vec3 col = mix(uColorA, uColorB, clamp(key * 0.9 + vNoise * 0.35, 0.0, 1.0));
  col = mix(col, iri * uColorB, fres * 0.55);
  col += uColorWarm * warmRim * (0.2 + uWarmth * 0.35);
  col += vec3(0.85, 0.94, 1.0) * pow(fres, 2.2) * 0.55;

  /* The interior is dimmed hard, so type layered over the core keeps contrast. */
  col *= 0.16 + rim * 2.3;

  /* A trace of interior light so it is never a hollow outline. */
  col += uColorA * (0.02 + 0.012 * sin(uTime * 0.4 + vPos.y * 2.0));

  float alpha = clamp(0.018 + rim * 1.2, 0.0, 1.0) * uIntro;
  gl_FragColor = vec4(col, alpha);
}
`;

/* -------------------------------------------------------------------------- */
/* Atmosphere — the volumetric backdrop                                        */
/* -------------------------------------------------------------------------- */

/**
 * A full-screen gradient with fbm-driven aurora bands. Rendered on a plane
 * locked to the camera so it costs exactly one fullscreen pass.
 */
export const ATMOS_FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;
uniform vec2  uResolution;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorWarm;
uniform float uIntro;

varying vec2 vUv;

${NOISE_GLSL}

float fbm(vec3 p){
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++){
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

  float t = uTime * 0.035;

  /* Two slow aurora sheets moving at different rates. */
  float n1 = fbm(vec3(p * 1.15, t));
  float n2 = fbm(vec3(p * 2.1 + 4.0, t * 1.5));

  /* Bands tighten and drift as the page progresses. */
  float band = smoothstep(0.15, 0.95, n1 * 0.7 + n2 * 0.45 + uProgress * 0.35);

  float r = length(p);

  vec3 col = vec3(0.02, 0.023, 0.043);
  col = mix(col, uColorA * 0.34, band * 0.34);
  col = mix(col, uColorB * 0.5, smoothstep(0.35, 1.0, n2) * 0.34);

  /* The warm note only surfaces deep in the page, near the contact section. */
  col = mix(col, uColorWarm * 0.55, smoothstep(0.7, 1.0, uProgress) * band * 0.42);

  /* A broad halo centred behind the core, so the crystal always sits on a
     pool of light rather than on flat black. */
  float halo = exp(-r * r * 1.6);
  col += mix(uColorA, uColorB, 0.5) * halo * 0.14;

  /* Vignette keeps the eye centred, holds contrast for the text on top, and
     hides the edges of the plane. */
  float vig = 1.0 - smoothstep(0.3, 1.25, r);
  col *= 0.2 + vig * 1.0;

  /* Ordered dither — kills banding in the dark gradient without a texture. */
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dither - 0.5) * 0.006;

  gl_FragColor = vec4(col * uIntro, 1.0);
}
`;

export const ATMOS_VERT = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/* -------------------------------------------------------------------------- */
/* Lattice — the network edges                                                 */
/* -------------------------------------------------------------------------- */

export const LATTICE_VERT = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uIntro;

attribute float aSeed;
attribute float aOrder;

varying float vFade;
varying float vSeed;

void main(){
  vec3 p = position;

  /* Edges drift gently so the graph never looks like a static wireframe. */
  p.x += sin(uTime * 0.3 + aSeed * 6.28) * 0.09;
  p.y += cos(uTime * 0.26 + aSeed * 4.71) * 0.09;
  p.z += sin(uTime * 0.21 + aSeed * 2.14) * 0.09;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  /* Edges light up in sequence as the section reveals. */
  float gate = smoothstep(aOrder - 0.25, aOrder + 0.08, uReveal);
  vFade = gate * smoothstep(-30.0, -4.0, mv.z) * uIntro;
  vSeed = aSeed;
}
`;

export const LATTICE_FRAG = /* glsl */ `
precision highp float;

uniform vec3  uColorA;
uniform vec3  uColorB;
uniform float uTime;

varying float vFade;
varying float vSeed;

void main(){
  /* A slow pulse travelling along the graph, offset per edge. */
  float pulse = 0.55 + 0.45 * sin(uTime * 1.4 + vSeed * 12.0);
  vec3 col = mix(uColorA, uColorB, vSeed);
  /* Deliberately faint. The lattice is atmosphere behind the copy, and a
     crisp wireframe crossing a paragraph is unreadable. */
  gl_FragColor = vec4(col, vFade * 0.16 * pulse);
}
`;
