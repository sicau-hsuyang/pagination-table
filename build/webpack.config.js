/*
 * @Autor: Zhang Yingying
 * @Date: 2020-03-12 20:13:51
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-24 23:42:27
 */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  mode: "production",
  target: "web",
  entry: {
    main: "./src/index.js"
  },
  output: {
    path: resolve("dist"),
    filename: "table.js",
    libraryTarget: "umd",
    library: "PaginationTable",
    libraryExport: "default"
  },
  externals: {
    vue: "Vue"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src")
    }
  },
  performance: {
    hints: "warning",
    // 入口起点的最大体积
    maxEntrypointSize: 50000000,
    // 生成文件的最大体积
    maxAssetSize: 30000000,
    // 只给出 js 文件的性能提示
    assetFilter: function(assetFilename) {
      return assetFilename.endsWith(".js");
    }
  },
  // optimization: {
  //   splitChunks: {
  //     // 默认将node_modules中依赖打包到venders.js
  //     chunks: "all"
  //   },
  //   // 将webpack运行时生成代码打包到runtime.js
  //   runtimeChunk: true
  // },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.pug$/,
        use: "pug-html-loader"
      },
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.((s(a|c))|c)ss$/,
        use: [
          "vue-style-loader",
          "style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, // 10K
              esModule: false
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: "html-loader"
      }
    ]
  },
  plugins: [new VueLoaderPlugin(), new CleanWebpackPlugin()]
};
