import ModuleFactory, { type MainModule } from '../wasm/main';

const image: HTMLImageElement = document.getElementById(
  'image'
)! as HTMLImageElement;
const canvas: HTMLCanvasElement = document.getElementById(
  'canvas'
)! as HTMLCanvasElement;
const context = canvas.getContext('2d', { willReadFrequently: true })!;
const filepicker = document.querySelector('input')!;
let module: MainModule | undefined;

ModuleFactory().then((loadedModule) => {
  module = loadedModule;
});

filepicker.addEventListener('change', () => {
  const file = filepicker.files?.item(0);

  if (!file) {
    console.error('Somehow loaded a null file?');
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    image.src = reader.result?.toString() ?? '';
  });
  reader.readAsDataURL(file);
});

image.addEventListener('load', () => {
  if (image.src === '') {
    return;
  }

  if (!module) {
    console.error('Tried to load image onto canvas but WASM was not ready.');
    return;
  }

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const newImageData = weightedAverageGrayscale(module, context, imageData);
  context.putImageData(newImageData, 0, 0);
});

function weightedAverageGrayscale(
  Module: MainModule,
  context: CanvasRenderingContext2D,
  imageData: ImageData
): ImageData {
  const newImageData = context.createImageData(imageData);
  const dataLength = imageData.data.length;

  console.time('js conversion');
  // RGBA so stride of 4
  for (let i = 0; i < dataLength; i += 4) {
    // Weighted grayscale conversion
    const gray = Math.ceil(
      imageData.data[i + 0] * 0.21 +
        imageData.data[i + 1] * 0.72 +
        imageData.data[i + 2] * 0.07
    );

    newImageData.data[i] = gray; // R
    newImageData.data[i + 1] = gray; // G
    newImageData.data[i + 2] = gray; // B
    newImageData.data[i + 3] = imageData.data[i + 3]; // Alpha remains unchanged
  }
  console.timeEnd('js conversion');

  console.time('wasm conversion');
  const inputPointer = Module._malloc(dataLength);
  const outputPointer = Module._malloc(dataLength);

  Module.HEAPU8.set(imageData.data, inputPointer);
  Module._weightedAverageGrayscale(inputPointer, outputPointer, dataLength);

  newImageData.data.set(
    Module.HEAPU8.subarray(outputPointer, outputPointer + dataLength)
  );

  console.log(Module.HEAPU8.subarray(outputPointer, outputPointer + dataLength))

  Module._free(inputPointer);
  Module._free(outputPointer);
  console.timeEnd('wasm conversion');

  return newImageData;
}
