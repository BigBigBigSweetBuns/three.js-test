const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
  devtool: "inline-source-map",
  //打包后的文件和其输出目录
  output: {
    // 公共开头
    publicPath: "./",
    //  输出的目录 dist
    path: path.resolve(__dirname, "../dev"),
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
    ],
  },
};
