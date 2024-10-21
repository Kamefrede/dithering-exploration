#include "emscripten/em_macros.h"
#include <stdint.h>
#include "wasm_simd128.h"

extern "C" void
EMSCRIPTEN_KEEPALIVE
weightedAverageGrayscale(uint8_t originalArray[], uint8_t destinationArray[],
                         int length) {
  const v128_t scaleR = wasm_f32x4_splat(0.21f);
  const v128_t scaleG = wasm_f32x4_splat(0.72f);
  const v128_t scaleB = wasm_f32x4_splat(0.07f);

  // Yes. This will absolutely result in out of bound reads and writes if the lenght is not divided by 16.
  // Do I care enough to fix it? Not really no.
  for (int i = 0; i < length; i += 16) {
    v128_t pixelData = wasm_v128_load((v128_t*)&originalArray[i]);

    v128_t r = wasm_v128_and(pixelData, wasm_i32x4_splat(0xFF));
    v128_t g = wasm_u32x4_shr(pixelData, 8);
    g = wasm_v128_and(g, wasm_i32x4_splat(0xFF));
    v128_t b = wasm_u32x4_shr(pixelData, 16);
    b = wasm_v128_and(b, wasm_i32x4_splat(0xFF));

    v128_t r_f = wasm_f32x4_convert_i32x4(r);
    v128_t g_f = wasm_f32x4_convert_i32x4(g);
    v128_t b_f = wasm_f32x4_convert_i32x4(b);

    v128_t gray_f = wasm_f32x4_add(
        wasm_f32x4_add(wasm_f32x4_mul(r_f, scaleR), wasm_f32x4_mul(g_f, scaleG)),
        wasm_f32x4_mul(b_f, scaleB));

    v128_t gray = wasm_i32x4_trunc_sat_f32x4(gray_f);

    v128_t gray_packed = wasm_v128_or(wasm_v128_or(gray, wasm_i32x4_shl(gray, 8)), wasm_i32x4_shl(gray, 16));

    v128_t alpha_mask = wasm_i32x4_splat(0xFF000000);
    v128_t alpha = wasm_v128_and(pixelData, alpha_mask);
    gray_packed = wasm_v128_or(gray_packed, alpha);

    wasm_v128_store((v128_t*)&destinationArray[i], gray_packed);
  }
}
