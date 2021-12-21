// ZzSprite - Tiny Sprite Generator - Frank Force 2020 - MIT License

"use strict";

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @language_out ECMASCRIPT_2019
// @js_externs ZzSprite
// ==/ClosureCompiler==

const primary = "#0844a680";
const secondary = "#031d1c";
const accent = "#fefefe";
const stop = "#f76743";

function ZzSprite(
  context,
  x = 0,
  y = 0,
  seed = 1,
  size = 16,
  mode = 0,
  mutateSeed = 0,
  colorSeed = 0
) {
  function Random(max = 1, min = 0) {
    // todo how does this work?
    randomSeed ^= randomSeed << 13;
    randomSeed ^= randomSeed >>> 17;
    return (
      ((Math.abs((randomSeed ^= randomSeed << 5)) % 1e9) / 1e9) * (max - min) +
      min
    );
  }

  // random chance to flip drawing axis
  let randomSeed = seed;
  const flipAxis = Random() < 0.5;
  const w = flipAxis ? size - 3 : (size / 2 - 1) | 0;
  const h = !flipAxis ? size - 3 : (size / 2 - 1) | 0;

  // apply mutations
  randomSeed += mutateSeed + 1e8;
  const spriteSize = size * Random(0.9, 0.6);
  const density = Random(1, 0.9);
  const doubleCenter = Random() < 0.5;
  const yBias = Random(0.1, -0.1);
  const colorRand = mode == 1 ? 0.08 : 0.04;

  // recenter
  x += (size / 2) | 0;
  y += 2 | 0;

  function DrawSpriteInternal(x, y, outline) {
    // draw each pixel
    randomSeed = seed;
    const passCount = mode == 3 ? 3 : 1;
    for (let pass = 0; pass < passCount; ++pass)
      for (let k = 0; k < w * h; ++k) {
        const i = flipAxis ? (k / w) | 0 : k % w;
        const j = !flipAxis ? (k / w) | 0 : k % w;

        // pick new random color using color seed
        const saveSeed = randomSeed;
        randomSeed += colorSeed + 1e9;
        const r = Random(243, 240);
        const g = Random(49, 90);
        const b = 0;
        let newColor = `rgb(${r},${g}%, ${b}%)`;
        if (outline || mode == 3) newColor = primary;
        else if (mode == 1)
          newColor = r % 3 ? (r % 3 == 1 ? stop : secondary) : accent;
        else if (mode == 2) newColor = accent;
        if (!k || Random() < colorRand) context.fillStyle = newColor;
        randomSeed = saveSeed;

        // check if pixel should be drawn
        const isHole = Random() > density;
        if (
          Random(spriteSize / 2) ** 2 >
            i * i + (j - ((1 - 2 * yBias) * h) / 2) ** 2 &&
          !isHole
        ) {
          const o = !!outline;
          context.fillRect(
            x + i - o - doubleCenter,
            y + j - o,
            1 + 2 * o,
            1 + 2 * o
          );
          context.fillRect(x - i - o, y + j - o, 1 + 2 * o, 1 + 2 * o);
        }
      }
  }

  // outline then fill
  if (mode != 3) DrawSpriteInternal(x, y, 1);
  DrawSpriteInternal(x, y);
}

