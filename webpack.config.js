const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    background: "./src/background.ts",
    contentScript: "./src/contentScript.ts",
    injected: "./src/injected.ts",
  },
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    // fallback: {
    //   url: false,
    //   https: false,
    //   http: false,
    //   util: false,
    //   net: false,
    //   zlib: false,
    // },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./public", to: "." }],
    }),
  ],
};
