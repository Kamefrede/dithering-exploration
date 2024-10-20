import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

const recompile = async (directory) => {
  const isDebug = process.env.DEBUG ?? false;
  const command = isDebug ? "make debug" : "make release";

  console.log(`Running ${command} in ${directory}`);

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: directory });

    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  } catch (error) {
    console.error(`Failed to run ${command}: ${error}`);
  }
};

export default function wasmRecompilePlugin(options = {}) {
  const { directory = "./wasm", extensions = [".cpp"] } = options;

  return {
    name: "vite-plugin-wasm-recompile",

    buildStart: async () => {
      await recompile(directory);
    },

    configureServer(server) {
      const absoluteDir = path.resolve(directory);

      server.watcher.add(absoluteDir);

      server.watcher.on("change", async (file) => {
        const shouldRecompile = extensions.some((ext) => file.endsWith(ext));

        if (shouldRecompile) {
          console.log(`${file} changed. Recompiling...`);
          await recompile(directory);
        }
      });
    },
  };
}
