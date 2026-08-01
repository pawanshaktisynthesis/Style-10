"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { AdditiveBlending } from "three";

type Props = {
  /** Owned by the Scene so the uniforms it mutates are the ones uploaded. */
  material: THREE.ShaderMaterial;
  nodes: number;
};

/**
 * The network lattice — the Core's shattered state.
 *
 * Nodes are distributed on a flattened shell and connected to their nearest
 * neighbours, so the graph looks organised rather than randomly strung. Edges
 * illuminate in radial order as `uReveal` climbs, which reads as the network
 * assembling outward from the centre.
 */
export function Lattice({ material, nodes }: Props) {
  const { edgeGeo, nodeGeo } = useMemo(() => {
    const pts: THREE.Vector3[] = [];

    for (let i = 0; i < nodes; i++) {
      const t = (i + 0.5) / nodes;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 4.6 + Math.random() * 2.3;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * r,
          Math.cos(phi) * r * 0.62,
          Math.sin(theta) * Math.sin(phi) * r,
        ),
      );
    }

    const maxRadius = Math.max(...pts.map((p) => p.length()));

    /* Connect each node to its two nearest neighbours. O(n^2) but n is small
       and this runs once, at mount. */
    const positions: number[] = [];
    const seeds: number[] = [];
    const orders: number[] = [];

    const linked = new Set<string>();

    for (let i = 0; i < pts.length; i++) {
      const distances = pts
        .map((p, j) => ({ j, d: pts[i].distanceTo(p) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);

      for (const { j } of distances) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (linked.has(key)) continue;
        linked.add(key);

        const a = pts[i];
        const b = pts[j];
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);

        const seed = Math.random();
        seeds.push(seed, seed);

        /* Reveal order follows distance from the centre. */
        const order = ((a.length() + b.length()) * 0.5) / maxRadius;
        orders.push(order, order);
      }
    }

    const edges = new THREE.BufferGeometry();
    edges.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    edges.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
    edges.setAttribute("aOrder", new THREE.Float32BufferAttribute(orders, 1));
    edges.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    const nodeVerts: number[] = [];
    const nodeSeeds: number[] = [];
    const nodeOrders: number[] = [];
    for (const p of pts) {
      nodeVerts.push(p.x, p.y, p.z);
      nodeSeeds.push(Math.random());
      nodeOrders.push(p.length() / maxRadius);
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(nodeVerts, 3));
    nodeGeometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(nodeSeeds, 1));
    nodeGeometry.setAttribute("aOrder", new THREE.Float32BufferAttribute(nodeOrders, 1));
    nodeGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    return { edgeGeo: edges, nodeGeo: nodeGeometry };
  }, [nodes]);

  useEffect(
    () => () => {
      edgeGeo.dispose();
      nodeGeo.dispose();
    },
    [edgeGeo, nodeGeo],
  );

  return (
    <group>
      <lineSegments geometry={edgeGeo} frustumCulled={false}>
        <primitive object={material} attach="material" />
      </lineSegments>

      <points geometry={nodeGeo} frustumCulled={false}>
        <pointsMaterial
          size={0.07}
          color="#a8f0e4"
          transparent
          opacity={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}
