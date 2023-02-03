const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').sassPlugin;
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const path = require('path');
const fs = require('fs');

function fromDir(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
        console.log('no dir ', startPath);
        return;
    }

    const files = fs.readdirSync(startPath);

    for (var i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter, callback); // recurse
        } else if (filter.test(filename) && !/stories.ts/.test(filename))
            callback(filename.replace(/\\/g, '/'));
    }
}

const sassEntryPoints = [];
fromDir('src', /[a-z\-]+\.scss$/, (filename) => {
    sassEntryPoints.push(filename);
});

const typeScriptEntryPoints = [];
fromDir('src', /[a-z\-]+\.ts$/, (filename) => {
    typeScriptEntryPoints.push(filename);
});

const typeScriptFormats = ['cjs', 'esm'];

const watchChange = process.argv.slice(2).includes('--watch');

async function build(watchChange) {
    for (let index = 0; index < sassEntryPoints.length; index++) {
        const entryPoint = sassEntryPoints[index];
        const path = entryPoint.replace(/[a-z\-]{1,}\.scss$/, '');
        const outfile =
            path + entryPoint.replace(path, '').replace(/\.scss$/, '.css');

        await esbuild.build({
            entryPoints: [entryPoint],
            minify: true,
            sourcemap: false,
            outfile,
            watch: watchChange,
            plugins: [
                sassPlugin({
                    async transform(source) {
                        const { css } = await postcss([
                            autoprefixer,
                            postcssPresetEnv({ stage: 0 }),
                        ]).process(source, { from: undefined });
                        return css;
                    },
                }),
            ],
        });
    }

    typeScriptEntryPoints.forEach((entryPoint) => {
        typeScriptFormats.forEach((format) => {
            if (/\/models\//.test(entryPoint)) return;

            const extension = format == 'cjs' ? '.js' : `.${format}.js`;

            const outfile = entryPoint
                .replace(/src\//, 'lib/')
                .replace(/\.ts$/, extension);

            esbuild
                .build({
                    entryPoints: [entryPoint],
                    bundle: true,
                    minify: true,
                    platform: 'node',
                    sourcemap: true,
                    target: 'es6',
                    format,
                    outfile,
                    watch: watchChange,
                    plugins: [
                        sassPlugin({
                            type: 'css-text',
                        }),
                    ],
                })
                .then((r) => {
                    if (!watchChange) return;
                    console.clear();
                    console.log('\x1b[32m%s\x1b[0m', 'esbuild watch start');
                })
                .catch((e) => {
                    console.error('esbuild error', e);
                    process.exit(1);
                });
        });
    });
}

build(watchChange);
