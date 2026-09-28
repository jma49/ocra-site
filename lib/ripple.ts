// Water ripples for the wordmark band: the pointer drops rings that spread
// outward and bend the letters as they pass, then fade. A WebGL canvas over
// the static SVG draws the band only while rings are alive, so the page looks
// the same without JavaScript or WebGL, and nothing runs while nothing moves.

interface Ripple {
  x: number;
  y: number;
  born: number;
  strength: number;
}

interface Surface {
  width: number;
  height: number;
  dpr: number;
  unit: number;
}

// Lengths are in band units, 1/1440 of the band's width, so the rings scale
// with the band.
const MAX_RIPPLES = 24;
const LIFE_MS = 2200;
const SPEED = 0.36; // units per millisecond
const WAVELENGTH = 44;
const WIDTH = 48; // how wide a ring is, as a Gaussian's sigma
const DAMPING = 1.8; // per second
const MAX_SHIFT = 48;
const SPACING = 24; // pointer travel between two drops

const VERTEX = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_image;
uniform vec2 u_size;
uniform float u_unit;
uniform int u_count;
uniform vec4 u_ripples[${MAX_RIPPLES}];

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);
  float width = ${WIDTH.toFixed(1)} * u_unit;
  vec2 shift = vec2(0.0);
  float shade = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    if (i >= u_count) break;
    vec4 r = u_ripples[i];
    vec2 away = p - r.xy;
    float d = length(away);
    float front = d - r.z * ${SPEED} * u_unit;
    if (abs(front) > 3.0 * width) continue;
    float phase = front / (${WAVELENGTH.toFixed(1)} * u_unit) * 6.2831853;
    float size = exp(-front * front / (2.0 * width * width))
      * exp(-r.z * ${(DAMPING / 1000).toFixed(4)})
      * smoothstep(0.0, width, d)
      * r.w;
    shift += away / max(d, 1.0) * sin(phase) * size * u_unit;
    shade += cos(phase) * size;
  }
  float amount = length(shift);
  float limit = ${MAX_SHIFT.toFixed(1)} * u_unit;
  if (amount > limit) shift *= limit / amount;
  vec4 color = texture2D(u_image, (p + shift) / u_size);
  gl_FragColor = vec4(color.rgb + clamp(shade / 20.0, -1.0, 1.0) * 0.12, 1.0);
}
`;

interface Scene {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  texture: WebGLTexture;
  size: WebGLUniformLocation | null;
  unit: WebGLUniformLocation | null;
  count: WebGLUniformLocation | null;
  ripples: WebGLUniformLocation | null;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function setup(gl: WebGLRenderingContext): Scene | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!vertex || !fragment || !program || !buffer || !texture) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);

  return {
    program,
    buffer,
    texture,
    size: gl.getUniformLocation(program, "u_size"),
    unit: gl.getUniformLocation(program, "u_unit"),
    count: gl.getUniformLocation(program, "u_count"),
    ripples: gl.getUniformLocation(program, "u_ripples"),
  };
}

// Paints the band and its letters at device resolution into the texture the
// ripples bend. Painted again for every burst of ripples, so it follows
// resizes and theme changes.
function paint(
  gl: WebGLRenderingContext,
  scene: Scene,
  band: HTMLElement,
  art: SVGSVGElement,
  canvas: HTMLCanvasElement,
): Surface | null {
  const box = band.getBoundingClientRect();
  const letters = art.getBoundingClientRect();
  const viewBox = art.viewBox.baseVal;
  if (!box.width || !box.height || !viewBox?.width) return null;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.round(box.width * dpr);
  const height = Math.round(box.height * dpr);
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = getComputedStyle(band).backgroundColor;
  ctx.fillRect(0, 0, width, height);
  const scale = (letters.width / viewBox.width) * dpr;
  ctx.setTransform(
    scale,
    0,
    0,
    scale,
    (letters.left - box.left) * dpr,
    (letters.top - box.top) * dpr,
  );
  ctx.fillStyle = getComputedStyle(art).color;
  for (const path of art.querySelectorAll("path")) {
    ctx.fill(new Path2D(path.getAttribute("d") ?? ""));
  }

  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
  gl.bindTexture(gl.TEXTURE_2D, scene.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  const unit = (box.width / 1440) * dpr;
  gl.uniform2f(scene.size, width, height);
  gl.uniform1f(scene.unit, unit);
  return { width, height, dpr, unit };
}

export function attachRipple(
  band: HTMLElement,
  canvas: HTMLCanvasElement,
  art: SVGSVGElement,
): () => void {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl || typeof Path2D === "undefined") return () => {};
  const scene = setup(gl);
  if (!scene) return () => {};
  const data = new Float32Array(MAX_RIPPLES * 4);
  let surface: Surface | null = null;
  let ripples: Ripple[] = [];
  let frame = 0;
  let pressed = false;
  let lost = false;
  let last: { x: number; y: number; t: number } | null = null;
  let travelled = 0;

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    ripples = [];
    surface = null;
    if (lost) return;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const draw = () => {
    const now = performance.now();
    ripples = ripples.filter((r) => now - r.born < LIFE_MS);
    if (!ripples.length || !surface || lost) {
      stop();
      return;
    }
    data.fill(0);
    ripples.forEach((r, i) => {
      data.set([r.x, r.y, now - r.born, r.strength], i * 4);
    });
    gl.uniform1i(scene.count, ripples.length);
    gl.uniform4fv(scene.ripples, data);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frame = requestAnimationFrame(draw);
  };

  const drop = (x: number, y: number, strength: number) => {
    if (lost) return;
    surface ??= paint(gl, scene, band, art, canvas);
    if (!surface) return;
    ripples.push({ x, y, born: performance.now(), strength });
    if (ripples.length > MAX_RIPPLES) ripples = ripples.slice(-MAX_RIPPLES);
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const locate = (event: PointerEvent) => {
    const box = band.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    return {
      x: (event.clientX - box.left) * dpr,
      y: (event.clientY - box.top) * dpr,
      t: performance.now(),
      dpr,
      unit: box.width / 1440,
    };
  };

  const onMove = (event: PointerEvent) => {
    const point = locate(event);
    if (last) {
      const distance =
        Math.hypot(point.x - last.x, point.y - last.y) / point.dpr;
      const speed = distance / Math.max(8, point.t - last.t);
      travelled += distance;
      if (travelled >= SPACING * point.unit) {
        travelled = 0;
        const strength = Math.min(20, 8 + speed * 8) * (pressed ? 1.5 : 1);
        drop(point.x, point.y, strength);
      }
    }
    last = point;
  };
  const onDown = (event: PointerEvent) => {
    pressed = true;
    const point = locate(event);
    drop(point.x, point.y, 28);
  };
  const onUp = () => {
    pressed = false;
  };
  const onLeave = () => {
    pressed = false;
    last = null;
    travelled = 0;
  };
  // A lost context stays lost: the band keeps its static letters.
  const onLost = () => {
    lost = true;
    stop();
  };
  // A new size needs a new texture; it is painted on the next drop.
  const resize = new ResizeObserver(stop);

  band.addEventListener("pointermove", onMove);
  band.addEventListener("pointerdown", onDown);
  band.addEventListener("pointerup", onUp);
  band.addEventListener("pointerleave", onLeave);
  band.addEventListener("pointercancel", onLeave);
  canvas.addEventListener("webglcontextlost", onLost);
  resize.observe(band);
  return () => {
    band.removeEventListener("pointermove", onMove);
    band.removeEventListener("pointerdown", onDown);
    band.removeEventListener("pointerup", onUp);
    band.removeEventListener("pointerleave", onLeave);
    band.removeEventListener("pointercancel", onLeave);
    canvas.removeEventListener("webglcontextlost", onLost);
    resize.disconnect();
    stop();
    if (lost) return;
    gl.deleteTexture(scene.texture);
    gl.deleteBuffer(scene.buffer);
    gl.deleteProgram(scene.program);
  };
}
