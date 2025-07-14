import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir("./npm");

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    scriptModule: false,
    typeCheck: false,
    shims: {
        deno: true,
    },
    package: {
        name: "europresse-lib",
        version: "1.3",
        description:
            "A library to search and fetch articles from Europresse",
        license: "AGPL-3.0",
        repository: {
            type: "git",
            url: "git+https://github.com/ebanDev/europresse-lib.git",
        },
        bugs: {
            url: "https://github.com/ebanDev/europresse-lib/issues",
        },
    },
    postBuild() {
        Deno.copyFileSync("LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});
