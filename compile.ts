import { sass } from "https://deno.land/x/denosass@1.0.6/src/mod.ts";
import { ensureDir } from "https://deno.land/std@0.188.0/fs/ensure_dir.ts";
import { join, basename } from "https://deno.land/std@0.188.0/path/mod.ts";

const sassDirectory = "sass";
const cssDirectory = "css";
Deno.chdir("/home/cinqatte/WD/echelon")

for await (const event of Deno.watchFs(sassDirectory)) {
  if (event.kind === "modify") {
    for (const path of event.paths) {
      if (path.match(/\.s[ac]ss$/)) {
        try {
          const sassFileContent = await Deno.readTextFile(path);

          const result = sass(sassFileContent, {
            style: "expanded",
            load_paths: [sassDirectory],
          })

          const cssFilename = join(
            cssDirectory,
            basename(path).replace(/\.[s]?[ac]ss$/, ".css"),
          );
          await ensureDir(cssDirectory);
          await Deno.writeTextFile(cssFilename, result.to_string() as string);
          const now = new Date();
          const formattedTime = now.toLocaleTimeString();
          console.log(`${formattedTime}: compiled: ${path} to ${cssFilename}`);
        } catch (error) {
          const now = new Date();
          const formattedTime = now.toLocaleTimeString();
          console.error(`${formattedTime}: error compiling: ${path}: ${error}`);
        }
      }
    }
  }
}