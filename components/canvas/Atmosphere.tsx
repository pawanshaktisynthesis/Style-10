"use client";

import type * as THREE from "three";

/**
 * The volumetric backdrop.
 *
 * A single quad drawn in clip space — the vertex shader ignores the camera
 * entirely, so it always fills the viewport for exactly one fullscreen pass
 * regardless of where the camera rig has travelled.
 */
export function Atmosphere({ material }: { material: THREE.ShaderMaterial }) {
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
