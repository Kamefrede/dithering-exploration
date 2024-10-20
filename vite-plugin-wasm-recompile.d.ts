import { Plugin } from "vite";

interface WasmRecompilePluginOptions {
  directory?: string;
  extensions?: string[];
}

export default function wasmRecompilePlugin(
  options?: WasmRecompilePluginOptions
): Plugin;
