import * as THREE from "three";
import {
  ATMOS_FRAG,
  ATMOS_VERT,
  CORE_FRAG,
  CORE_VERT,
  LATTICE_FRAG,
  LATTICE_VERT,
  WIND_FRAG,
  WIND_VERT,
} from "./shaders";

/**
 * Materials are constructed here rather than declared as `<shaderMaterial>`
 * elements with a `uniforms` prop.
 *
 * That distinction matters: React Three Fiber does not guarantee it will bind
 * the exact `uniforms` object you pass — it can end up cloned onto the
 * material, in which case the object you mutate each frame is no longer the one
 * the renderer uploads, and every uniform silently stays at its initial value.
 * Owning the material means `material.uniforms` is unambiguously the object the
 * render loop writes to.
 */

export type SceneMaterials = ReturnType<typeof createMaterials>;

const PRANA = "#56e8cf";
const SHAKTI = "#7a5cff";
const EMBER = "#f2a65a";

function sharedUniforms() {
  return {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uWarmth: { value: 0 },
    uColorA: { value: new THREE.Color(PRANA) },
    uColorB: { value: new THREE.Color(SHAKTI) },
    uColorWarm: { value: new THREE.Color(EMBER) },
  };
}

export function createMaterials(low: boolean) {
  const atmosphere = new THREE.ShaderMaterial({
    vertexShader: ATMOS_VERT,
    fragmentShader: ATMOS_FRAG,
    uniforms: {
      ...sharedUniforms(),
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    },
    depthTest: false,
    depthWrite: false,
  });

  const wind = new THREE.ShaderMaterial({
    vertexShader: WIND_VERT,
    fragmentShader: WIND_FRAG,
    uniforms: {
      ...sharedUniforms(),
      uCondense: { value: 0 },
      uSize: { value: low ? 2.8 : 2.3 },
      uVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector3() },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  /* The shell and the inner solid share one material: identical shader, one
     program, one set of uniforms to keep in sync. */
  const core = new THREE.ShaderMaterial({
    vertexShader: CORE_VERT,
    fragmentShader: CORE_FRAG,
    uniforms: { ...sharedUniforms(), uMorph: { value: 0 } },
    transparent: true,
    /* Front faces only. With additive blending, drawing both sides doubles
       every contribution and fills the silhouette. */
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const lattice = new THREE.ShaderMaterial({
    vertexShader: LATTICE_VERT,
    fragmentShader: LATTICE_FRAG,
    uniforms: { ...sharedUniforms(), uReveal: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { atmosphere, wind, core, lattice };
}

export function disposeMaterials(materials: SceneMaterials) {
  Object.values(materials).forEach((material) => material.dispose());
}
