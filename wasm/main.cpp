
#include "cstdint"
#include "emscripten/em_macros.h"

extern "C" EMSCRIPTEN_KEEPALIVE void
weightedAverageGrayscale(uint8_t originalArray[], uint8_t destinationArray[],
                         int length) {
  for (int i = 0; i < length; i += 4) {
    uint8_t gray = originalArray[i] * 0.21 + originalArray[i + 1] * 0.72 + originalArray[i + 2] * 0.07;
    destinationArray[i] = gray;
    destinationArray[i+1] = gray;
    destinationArray[i+2] = gray;
    destinationArray[i+3] = originalArray[i+3];
  }
}
