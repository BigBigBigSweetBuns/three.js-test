const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin"); // 拷贝插件
const path = require("path");
const webpack = require("webpack");

module.exports = {
  //指定项目的模式 production:生产环境 development:开发环境
  mode: "development",
  devtool: "source-map",
  //  入口文件
  entry: {
    // js 插件分类
    vendors: ["three"],
    // 页面入口
    index: ["./src/pages/index/index.js"],
    daDouShaBao: ["./src/pages/daDouShaBao/daDouShaBao.js"],
  },
  //使用webpackDevServer为我们实现服务端的功能
  devServer: {
    //指定服务端的路径
    contentBase: "./dist",
    //open为true，项目启动时会自动打开浏览器访问项目
    open: true,
    port: 8080,
    proxy: {
      "/api": "http://localhost:8081",
    },
    //让webpackDevServer开启hot module replacement功能
    hot: true,
    //当hot module replacement功能没生效时，也不允许浏览器重新加载
    hotOnly: true,
  },
  //打包后的文件和其输出目录
  output: {
    // 公共开头
    publicPath: "./",
    //  输出的目录 dist
    path: path.resolve(__dirname, "dist"),
    //  输出的 JS 文件名
    filename: "public/js/[name].js",
  },
  plugins: [
    // new CopyWebpackPlugin([{ patterns: { from: "from/file.txt" } }]),
    //  配置 MiniCssExtractPlugin 生成独立的 CSS 文件
    new MiniCssExtractPlugin({
      filename: "public/css/[name].css",
    }),
    // 匹配生成不同的html页面
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/pages/index/index.html",
      chunks: ["index", "vendors"],
    }),
    new HtmlWebpackPlugin({
      filename: "daDouShaBao.html",
      template: "./src/pages/daDouShaBao/daDouShaBao.html",
      chunks: ["daDouShaBao", "vendors"],
    }),
    new CleanWebpackPlugin(["dist"]),
    //引入webpack热模块更新插件
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      // 处理 html文件
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              // attrs:['img:src'],
            },
          },
        ],
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader",
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./dist",
            },
          },
          {
            loader: "css-loader",
          },
        ],
      },
      //  处理 SCSS 文件的 loader
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./dist",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      // 处理图片
      {
        test: /\.(jpg|png|gif|bmp|jpeg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "images/[name].[ext]",
              publicPath: "./",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "underscore-template-loader",
          },
        ],
      },
    ],
  },
  // splitChunksPlugin
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        commons: {
          name: "commons", //提取出来的文件命名
          chunks: "initial", //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0, //表示提取公共部分最小的大小
        },
      },
    },
  },
};
