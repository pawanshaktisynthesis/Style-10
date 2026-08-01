/**
 * A CSS stand-in for the WebGL scene.
 *
 * This is not a blank box — it is the same palette and the same composition, so
 * the page has its intended atmosphere before three.js has loaded, on reduced
 * motion, on a device without WebGL, and if the context is ever lost.
 *
 * It lives in its own module on purpose: importing it from SceneCanvas would
 * drag the entire three.js chunk into the critical path, which is exactly what
 * deferring the scene is meant to avoid.
 */
export function AtmosphereFallback() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-void">
      <div
        className="absolute left-1/2 top-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle at 38% 32%, rgba(86,232,207,0.24), transparent 58%), radial-gradient(circle at 66% 66%, rgba(122,92,255,0.28), transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 20%, #05060b 78%)" }}
      />
    </div>
  );
}
