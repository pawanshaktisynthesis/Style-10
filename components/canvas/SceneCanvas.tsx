"use client";

import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "./Scene";
import { AtmosphereFallback } from "./AtmosphereFallback";
import { useDeviceTier, usePageVisible, useReducedMotion } from "@/lib/hooks";

/**
 * WebGL is the one part of this page allowed to fail. A driver crash, a lost
 * context, or a headless browser must degrade to the CSS atmosphere rather
 * than taking the document down with it.
 */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("[scene] WebGL scene failed, falling back to CSS atmosphere:", error);
  }

  render() {
    if (this.state.failed) return <AtmosphereFallback />;
    return this.props.children;
  }
}

export default function SceneCanvas() {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const visible = usePageVisible();
  const [supported, setSupported] = useState<boolean | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  /* Probe for a real WebGL2 context before mounting the renderer. Cheaper than
     catching a throw, and it lets the fallback render on the first paint. */
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);

  if (reduced || supported === false) return <AtmosphereFallback />;
  if (supported === null) return <AtmosphereFallback />;

  return (
    <CanvasBoundary>
      <div ref={hostRef} aria-hidden className="fixed inset-0 -z-10">
        <Canvas
          /* Cap DPR: above ~1.75 the particle field costs real frames and
             nobody can see the difference. */
          dpr={[1, tier === "low" ? 1.35 : 1.75]}
          /* Parked entirely when the tab is hidden — no wasted battery. */
          frameloop={visible ? "always" : "never"}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 0, 9.2], fov: 38, near: 0.1, far: 120 }}
          onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color("#05060b"), 1);
            /* No tone mapping. Every colour in these shaders is authored
               directly in display space, and ACES crushes exactly the additive
               highlights the scene is built out of. */
            gl.toneMapping = THREE.NoToneMapping;
          }}
        >
          <Scene tier={tier} />
        </Canvas>
      </div>
    </CanvasBoundary>
  );
}
