"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  count: number;
  /** Owned by the Scene so the uniforms it mutates are the ones uploaded. */
  material: THREE.ShaderMaterial;
};

/**
 * The wind field: `count` points that drift along a curl-noise field in their
 * free state and lock onto an icosahedral shell when the scene condenses.
 *
 * Both states live in the same buffers. The vertex shader blends between them,
 * so condensing costs nothing on the CPU.
 */
export function WindField({ count, material }: Props) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const position = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const scale = new Float32Array(count);

    /* Condensed targets are sampled from a real icosahedron surface so the
       locked state reads as a faceted crystal rather than a fuzzy ball. */
    const shell = new THREE.IcosahedronGeometry(2.05, 3);
    const shellPos = shell.attributes.position.array as Float32Array;
    const shellCount = shellPos.length / 3;

    for (let i = 0; i < count; i++) {
      /* Free state: an even shell using the golden-angle spiral, then pushed
         out to a random radius so the cloud has genuine volume. */
      const t = (i + 0.5) / count;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 3.1 + Math.pow(Math.random(), 0.7) * 5.4;

      position[i * 3] = Math.cos(theta) * Math.sin(phi) * radius;
      position[i * 3 + 1] = Math.cos(phi) * radius * 0.82;
      position[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius;

      const s = Math.floor(Math.random() * shellCount) * 3;
      target[i * 3] = shellPos[s];
      target[i * 3 + 1] = shellPos[s + 1];
      target[i * 3 + 2] = shellPos[s + 2];

      seed[i] = Math.random();
      /* Weighted small: a few bright large motes, mostly fine dust. */
      scale[i] = 0.35 + Math.pow(Math.random(), 2.4) * 1.5;
    }

    shell.dispose();

    geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 26);

    return geo;
  }, [count]);

  /* Geometry is rebuilt when the particle budget changes, so it owns its own
     disposal rather than leaking buffers on a device-tier switch. */
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </points>
  );
}
