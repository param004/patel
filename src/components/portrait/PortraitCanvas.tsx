"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { loadPointCloud, type PointCloud } from "./loadPointCloud";

/*
 * The portrait is drawn as a point cloud rather than a mesh because the
 * source is a depth prediction, not a scanned model. Points keep that
 * uncertainty visible and cost one draw call.
 *
 * Colour runs from a dim slate on the far plane to the single copper accent
 * on the near plane. That is the Color Consistency Lock applied inside the
 * canvas: one accent, no second hue, no additive glow.
 */

const MAX_SWAY = THREE.MathUtils.degToRad(17);

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;

  attribute float aDepth;

  varying float vDepth;
  varying float vFade;

  void main() {
    vDepth = aDepth;

    vec3 pos = position;

    // Slow drift so the cloud does not read as a frozen scan.
    pos.z += sin(uTime * 0.35 + position.y * 2.4) * 0.006;
    pos.x += cos(uTime * 0.27 + position.y * 1.7) * 0.004;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    /*
     * Point size in world units projected to the drawing buffer. uScale is
     * drawingBufferHeight / (2 * tan(fov / 2)), so this stays a constant
     * physical size across DPRs and window sizes instead of the usual
     * screen-space constant that makes points vanish on high-DPR displays.
     */
    gl_PointSize = uSize * uScale / -mvPosition.z;

    // Fade toward the frame edge. Written with rising edges so the result is
    // defined by the GLSL spec rather than relying on a reversed smoothstep.
    vFade = 1.0 - smoothstep(0.55, 1.15, length(vec2(position.x, position.y * 0.85)));

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorFar;
  uniform vec3 uColorNear;
  uniform float uOpacity;

  varying float vDepth;
  varying float vFade;

  void main() {
    // Round each point by discarding outside the inscribed circle.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // Near-solid core with a short falloff. A wide falloff leaves only the
    // middle of each point opaque, and the cloud stops reading as a surface.
    float edge = 1.0 - smoothstep(0.34, 0.5, d);

    /*
     * vDepth is a normalised Z, but its distribution is heavily weighted to
     * the far end (median around 0.22 on a real face). A straight pow() crushes
     * almost every point toward the far colour, so smoothstep remaps the band
     * that actually carries the geometry and lets the accent reach the face.
     */
    float ramp = smoothstep(0.15, 0.75, vDepth);
    vec3 color = mix(uColorFar, uColorNear, ramp);

    gl_FragColor = vec4(color, edge * uOpacity * vFade);
  }
`;

/** Pointer position, normalised to -1..1. Written to a ref, never to state. */
function usePointerSway(active: boolean) {
  const sway = useRef(0);

  useEffect(() => {
    if (!active) return;

    const handle = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      // Weighted toward horizontal, which is where the parallax reads best.
      sway.current = THREE.MathUtils.clamp(x * 0.75 + y * 0.25, -1, 1);
    };

    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [active]);

  return sway;
}

type PointCloudProps = {
  cloud: PointCloud;
  sway: React.RefObject<number>;
  interactive: boolean;
};

function PointCloud({ cloud, sway, interactive }: PointCloudProps) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const damped = useRef(0);
  const { camera, gl, size } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(cloud.positions, 3));

    // Per-point normalised depth. The writer emitted Z in a known range, so
    // the local min and max give the near and far planes for free.
    let zMin = Infinity;
    let zMax = -Infinity;
    for (let i = 2; i < cloud.positions.length; i += 3) {
      const z = cloud.positions[i];
      if (z < zMin) zMin = z;
      if (z > zMax) zMax = z;
    }
    const span = zMax - zMin || 1;

    const depths = new Float32Array(cloud.count);
    for (let p = 0; p < cloud.count; p++) {
      depths[p] = (cloud.positions[p * 3 + 2] - zMin) / span;
    }

    g.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));
    g.computeBoundingSphere();
    return g;
  }, [cloud]);

  /*
   * drawingBufferHeight / (2 * tan(fov / 2)). Derived during render so the
   * uniforms object is never mutated after the fact, which the React
   * Compiler rightly rejects.
   */
  const projectionScale = useMemo(() => {
    const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    return (size.height * gl.getPixelRatio()) / (2 * Math.tan(fov / 2));
  }, [camera, gl, size.height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      /** Point diameter in world units. */
      uSize: { value: 0.015 },
      uScale: { value: projectionScale },
      uColorFar: { value: new THREE.Color("#3b4453") },
      uColorNear: { value: new THREE.Color("#f0ae4a") },
      uOpacity: { value: 1 },
    }),
    [projectionScale],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const mat = material.current;

    if (interactive && group.current) {
      // Damped follow. Snapping straight to the pointer reads as jittery.
      damped.current = THREE.MathUtils.damp(
        damped.current,
        sway.current,
        3.5,
        delta,
      );

      // Rotation is deliberately capped. The depth prediction only observed
      // the front of the face, so a wide turn would expose that the back of
      // the head was never reconstructed.
      group.current.rotation.y = damped.current * MAX_SWAY;
      group.current.rotation.x = damped.current * MAX_SWAY * 0.3;
    }

    if (mat) mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </points>
    </group>
  );
}

export type PortraitCanvasProps = {
  /** Reduced motion and narrow viewports get a single static frame. */
  interactive: boolean;
  className?: string;
  /** Fires once the point cloud is in the scene and safe to reveal. */
  onReady?: () => void;
};

export default function PortraitCanvas({
  interactive,
  className,
  onReady,
}: PortraitCanvasProps) {
  const [cloud, setCloud] = useState<PointCloud | null>(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.25);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sway = usePointerSway(interactive);

  useEffect(() => {
    const controller = new AbortController();

    loadPointCloud("/portrait/points.bin", controller.signal)
      .then((loaded) => {
        setCloud(loaded);
        onReady?.();
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });

    return () => controller.abort();
    // onReady is intentionally not a dependency: it is a parent callback and
    // re-running the fetch on every parent render would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop the render loop entirely once the hero scrolls away.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // No WebGL, or the buffer failed to load: the poster stands alone.
  if (failed) return null;

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <Canvas
        dpr={dpr}
        frameloop={visible && interactive ? "always" : "demand"}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 2.7], fov: 40 }}
        style={{ pointerEvents: "none" }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.75)}
        />
        <AdaptiveDpr pixelated={false} />
        {cloud ? (
          <PointCloud cloud={cloud} sway={sway} interactive={interactive} />
        ) : null}
      </Canvas>
    </div>
  );
}