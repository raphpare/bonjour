const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').sassPlugin;
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

const ROOT_OUTFILE = 'lib';

const getFiles = (rootOutfile) => ([
    {
        outfile: `${rootOutfile}/index.js`,
        format: 'cjs'
    },
    {
        outfile: `${rootOutfile}/index.esm.js`,
        format: 'esm'
    }
]);

const configsTypeScript = [
    {
        entryPoint: './src/index.ts',
        files: getFiles(`${ROOT_OUTFILE}`),
        
    },
    {
        entryPoint: './src/week-view/week-view.ts',
        files: getFiles(`${ROOT_OUTFILE}/week-view`),
    }
];

const watchChange = process.argv.slice(2).includes('--watch');

async function build (watchChange) {
    await esbuild.build({
        entryPoints: ['./src/week-view/week-view.scss'],
        minify: true,
        sourcemap: false,
        outfile: './src/week-view/week-view.css',
        watch: watchChange,
        plugins: [sassPlugin({
            async transform(source) {
                const {css} = await postcss([autoprefixer, postcssPresetEnv({stage: 0})]).process(source)
                return css
            }
        })]
    });

    configsTypeScript.forEach(config => {
        config.files.forEach(file => {
            esbuild.build({
                entryPoints: [config.entryPoint],
                bundle: true,
                minify: true,
                platform: 'node',
                sourcemap: true,
                target: 'es6',
                ...file,
                watch: watchChange,
                plugins: [
                    sassPlugin(
                        {
                            type: 'css-text',
                        },
                    )
                ],
            }).then((r) => {
                if (!watchChange) return;
                console.clear();
                console.log('\x1b[32m%s\x1b[0m', 'esbuild watch start');
            }).catch((e) => {
                console.error('esbuild error', e);
                process.exit(1);
            });
        });
    });
}
build(watchChange);

