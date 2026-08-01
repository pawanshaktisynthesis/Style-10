"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AdditiveBlending } from "three";

type Props = {
  /** Owned by the Scene so the uniforms it mutates are the ones uploaded. */
  material: THREE.ShaderMaterial;
  detail: number;
};

/**
 * The Synthesis Core.
 *
 * Two layers do the work of a transmission material at a fraction of the cost:
 * a displaced refractive shell whose light lives almost entirely in its
 * fresnel rim, and a coarse wireframe cage that survives at any distance.
 *
 * The interior is deliberately left dark. A filled centre reads as a pearl,
 * not as glass, and it destroys the contrast of any type layered over it.
 */
export function Core({ material, detail }: Props) {
  const group = useRef<THREE.Group>(null);
  const cage = useRef<THREE.LineSegments>(null);

  const shellGeo = useMemo(() => new THREE.IcosahedronGeometry(2, detail), [detail]);

  /* A low-poly cage, deliberately coarser than the shell — the facet lines
     should read as structure, not as a mesh dump. */
  const cageGeo = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(2.24, 1);
    const edges = new THREE.EdgesGeometry(base, 1);
    base.dispose();
    return edges;
  }, []);

  useEffect(
    () => () => {
      shellGeo.dispose();
      cageGeo.dispose();
    },
    [shellGeo, cageGeo],
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    /* Rotation is intentionally slow and on two axes at incommensurate rates,
       so the silhouette never repeats within a scroll. */
    group.current.rotation.y += delta * 0.055;
    group.current.rotation.x += delta * 0.021;
    if (cage.current) cage.current.rotation.y -= delta * 0.09;
  });

  return (
    <group ref={group}>
      {/* Refractive outer shell */}
      <mesh geometry={shellGeo}>
        <primitive object={material} attach="material" />
      </mesh>

      {/* Facet cage */}
      <lineSegments ref={cage} geometry={cageGeo}>
        <lineBasicMaterial
          color="#7fe8dd"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
