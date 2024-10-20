<script lang="ts">
  import ModuleFactory, { type MainModule } from '../wasm/main'
  import { onMount } from 'svelte';



  onMount(() => {
    const imageToMessWith: HTMLImageElement = document.getElementById("image")! as HTMLImageElement
    const canvas: HTMLCanvasElement = document.getElementById("canvas")! as HTMLCanvasElement
    const context = canvas.getContext("2d")!

    ModuleFactory().then((module) => {
      canvas.width = imageToMessWith.width
      canvas.height = imageToMessWith.height

      context.drawImage(imageToMessWith, 0, 0)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const newImageData = weightedAverageGrayscale(module, context, imageData)
      context.putImageData(newImageData, 0, 0)
  })
})

  function weightedAverageGrayscale(Module: MainModule, context: CanvasRenderingContext2D, imageData: ImageData): ImageData {
    const newImageData = context.createImageData(imageData)
    const dataLength = imageData.data.length

    const startTime = performance.now()
    // RGBA so stride of 4
    /*for(let i = 0; i < dataLength; i += 4) {
        const r = imageData.data[i + 0];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        // Weighted grayscale conversion
        const gray = Math.ceil(r * 0.21 + g * 0.72 + b * 0.07);

        newImageData.data[i] = gray; // R
        newImageData.data[i + 1] = gray; // G
        newImageData.data[i + 2] = gray; // B
        newImageData.data[i + 3] = imageData.data[i + 3]; // Alpha remains unchanged
    }*/

    const inputPointer = Module._malloc(dataLength)
    const outputPointer = Module._malloc(dataLength)

    Module.HEAPU8.set(imageData.data, inputPointer)
    Module._weightedAverageGrayscale(inputPointer, outputPointer, dataLength);

    newImageData.data.set(Module.HEAPU8.subarray(outputPointer, outputPointer + dataLength))

    Module._free(inputPointer)
    Module._free(outputPointer)

    const endTime = performance.now()

    console.log(`Mapping values to grayscale took ${endTime - startTime}ms`)
    console.log(newImageData.data)

    return newImageData
  }
</script>


<main>
  <img alt="rose" id="image" src="/harry.png" style="display: none;">
  <canvas id="canvas"></canvas>
</main>

<style>
</style>
