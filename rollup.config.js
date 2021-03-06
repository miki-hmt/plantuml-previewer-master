import path from 'path'
import alias from 'rollup-plugin-alias'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import uglify from 'rollup-plugin-uglify'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

let plugins = [
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  postcss({
    plugins: [
      autoprefixer
    ]
  }),
  alias({
    vue: 'vue/dist/vue.esm.js',
    '@': path.resolve('./src/'),
    resolve: ['.js', '.vue']
  }),
  vue({
    css: './docs/assets/css/app.css'
  }),
  buble({
    objectAssign: 'Object.assign'
  }),
  commonjs(),
  nodeGlobals()
]

let config = {
  input: './src/main.js',
  output: {
    file: './docs/assets/js/app.js',
    format: 'umd',
    sourcemap: true
  },
  plugins: plugins
}

const isProduction = process.env.NODE_ENV === `production`
const isDevelopment = process.env.NODE_ENV === `development`

if (isProduction) {
  config.output.sourcemap = false
  config.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  )
  config.plugins.push(uglify())
}

if (isDevelopment) {
  config.plugins.push(livereload())
  config.plugins.push(
    serve({
      contentBase: './docs/',
      port: 8080,
      open: true
    })
  )
}

export default config