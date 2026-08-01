"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Atmosphere } from "./Atmosphere";
import { Core } from "./Core";
import { Lattice } from "./Lattice";
import { WindField } from "./WindField";
import { createMaterials, disposeMaterials } from "./materials";
import { damp, mapRange, scrollState, smoothstep } from "@/lib/scroll-store";
import type { Tier } from "@/lib/hooks";

/**
 * Camera waypoints along the scroll.
 *
 * The rig does not orbit — it travels. Each waypoint is a position plus the
 * point it looks at, and the camera eases between them on a smoothstep so the
 * transitions read as deliberate moves rather than a linear dolly.
 */
const WAYPOINTS: { at: number; pos: [number, number, number]; look: [number, number, number]; fov: number }[] = [
  { at: 0.0, pos: [0, 0, 9.2], look: [0, 0, 0], fov: 38 },        // hero — close on the core
  { at: 0.16, pos: [3.4, 1.2, 11.5], look: [0, 0.2, 0], fov: 42 }, // studio — pull back and off-axis
  { at: 0.36, pos: [-4.2, -0.8, 10.2], look: [0, 0, 0], fov: 46 }, // capabilities — swing across
  { at: 0.54, pos: [0.8, 2.6, 13.5], look: [0, -0.4, 0], fov: 44 },// method — rise above
  { at: 0.7, pos: [-2.2, 0.4, 8.4], look: [0, 0, 0], fov: 40 },    // work — drop back in
  { at: 0.86, pos: [4.6, -1.4, 12.0], look: [0, 0, 0], fov: 45 },  // stack — orbit wide
  { at: 1.0, pos: [0, 0.6, 15.5], look: [0, 0, 0], fov: 40 },      // contact — recede
];

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _pointer = new THREE.Vector3();

function sampleWaypoints(p: number) {
  let i = 0;
  while (i < WAYPOINTS.length - 2 && p > WAYPOINTS[i + 1].at) i++;
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const t = smoothstep(mapRange(p, a.at, b.at, 0, 1));

  _pos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], t),
  );
  _look.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], t),
    THREE.MathUtils.lerp(a.look[1], b.look[1], t),
    THREE.MathUtils.lerp(a.look[2], b.look[2], t),
  );
  return THREE.MathUtils.lerp(a.fov, b.fov, t);
}

export function Scene({ tier }: { tier: Tier }) {
  const { camera } = useThree();
  const core = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.Group>(null);

  const low = tier === "low";
  const particleCount = low ? 4500 : 13000;
  const latticeNodes = low ? 42 : 90;
  const coreDetail = low ? 3 : 6;

  /* Materials are created once and owned here, so the uniform objects written
     every frame below are provably the ones the renderer uploads. */
  const mats = useMemo(() => createMaterials(low), [low]);
  useEffect(() => () => disposeMaterials(mats), [mats]);

  const u = useMemo(
    () => ({
      wind: mats.wind.uniforms,
      core: mats.core.uniforms,
      lattice: mats.lattice.uniforms,
      atmos: mats.atmosphere.uniforms,
    }),
    [mats],
  );

  /* Smoothed values — scroll input is stepped, the scene must not be. */
  const s = useRef({ progress: 0, velocity: 0, px: 0, py: 0, intro: 0 });

  useFrame((state, rawDelta) => {
    /* Clamp delta so a dropped frame or a backgrounded tab cannot teleport
       the camera when the loop resumes. */
    const dt = Math.min(rawDelta, 1 / 30);
    const t = state.clock.elapsedTime;
    const c = s.current;

    c.progress = damp(c.progress, scrollState.progress, 6, dt);
    c.velocity = damp(c.velocity, scrollState.velocity, 5, dt);
    c.px = damp(c.px, scrollState.pointerX, 3.2, dt);
    c.py = damp(c.py, scrollState.pointerY, 3.2, dt);
    c.intro = damp(c.intro, scrollState.intro, 3, dt);

    const p = c.progress;

    /* ---- Camera rig ---------------------------------------------------- */
    const fov = sampleWaypoints(p);

    /* A tall, narrow viewport frames far less horizontally at the same
       distance, so the core would fill a phone screen edge to edge. Pull the
       camera back in proportion to how portrait the viewport is. */
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const pullback = THREE.MathUtils.clamp(1.62 - aspect * 0.56, 1, 1.62);

    /* Pointer parallax, scaled down as the camera travels further out so the
       effect stays proportional rather than swinging wildly at distance. */
    const parallax = 0.9;
    camera.position.set(
      _pos.x + c.px * parallax,
      _pos.y + -c.py * parallax * 0.6,
      _pos.z * pullback + Math.abs(c.velocity) * 0.35,
    );
    camera.lookAt(_look);

    const persp = camera as THREE.PerspectiveCamera;
    if (Math.abs(persp.fov - fov) > 0.01) {
      persp.fov = fov;
      persp.updateProjectionMatrix();
    }

    /* ---- Stage machine ------------------------------------------------- */

    /* Condense: the wind gathers into the crystal early, then releases as the
       lattice takes over. It must be fully released well before the work
       section, or the locked shell reads as a bright clump over the copy. */
    const condense =
      smoothstep(mapRange(p, 0.03, 0.17, 0, 1)) - smoothstep(mapRange(p, 0.26, 0.46, 0, 1));

    /* The lattice is the shattered state — it owns the middle of the page. */
    const reveal = smoothstep(mapRange(p, 0.26, 0.62, 0, 1));

    /* Morph from breathing sphere to faceted shard across the method section. */
    const morph = smoothstep(mapRange(p, 0.3, 0.72, 0, 1));

    /* The warm note only enters near contact — the palette's one human beat. */
    const warmth = smoothstep(mapRange(p, 0.76, 0.99, 0, 1));

    /* Write to every uniform family. */
    for (const family of [u.wind, u.core, u.lattice, u.atmos]) {
      family.uTime.value = t;
      family.uIntro.value = c.intro;
      family.uWarmth.value = warmth;
    }

    u.wind.uCondense.value = THREE.MathUtils.clamp(condense, 0, 1);
    u.wind.uVelocity.value = c.velocity * 0.8;
    _pointer.set(c.px * 4.5, -c.py * 3.2, 2.2);
    (u.wind.uPointer.value as THREE.Vector3).copy(_pointer);

    u.core.uMorph.value = morph;
    u.lattice.uReveal.value = reveal;
    u.atmos.uProgress.value = p;
    (u.atmos.uResolution.value as THREE.Vector2).set(state.size.width, state.size.height);

    /* ---- Object choreography ------------------------------------------- */
    if (core.current) {
      /* The core recedes and shrinks as the lattice takes over, then returns.
         On a phone it is also scaled down outright: pulling the camera back
         alone still leaves the rim cutting straight through the copy. */
      const fit = THREE.MathUtils.clamp(aspect * 0.55 + 0.34, 0.58, 1);
      /* Past the lattice the core keeps receding, so the stack orbit and the
         contact form own their sections instead of competing with it. */
      const recede = 1 - smoothstep(mapRange(p, 0.7, 0.95, 0, 1)) * 0.55;
      const scale =
        THREE.MathUtils.lerp(1, 0.22, reveal) *
        THREE.MathUtils.lerp(0.7, 1, c.intro) *
        fit *
        recede;
      core.current.scale.setScalar(scale);

      /* Past the hero the core drifts out of the text column. Every section
         below the fold sets its copy left-of-centre, so parking the brightest
         object in the scene dead centre puts its rim straight through a
         paragraph. */
      core.current.position.x = smoothstep(mapRange(p, 0.06, 0.26, 0, 1)) * 2.1;
      core.current.position.y = Math.sin(t * 0.4) * 0.12 - p * 0.5;
    }

    if (lattice.current) {
      lattice.current.rotation.y = t * 0.028 + p * 1.4;
      lattice.current.rotation.z = Math.sin(t * 0.13) * 0.06;
      lattice.current.scale.setScalar(THREE.MathUtils.lerp(0.75, 1.05, reveal));
    }
  });

  return (
    <>
      <Atmosphere material={mats.atmosphere} />

      <group ref={core}>
        <Core material={mats.core} detail={coreDetail} />
      </group>

      <WindField count={particleCount} material={mats.wind} />

      <group ref={lattice}>
        <Lattice material={mats.lattice} nodes={latticeNodes} />
      </group>
    </>
  );
}
