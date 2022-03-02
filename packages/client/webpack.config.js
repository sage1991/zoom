const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const ForkTSCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    filename: "[id].[contenthash].[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 8080
  },
  resolve: {
    extensions: [ ".js", ".jsx", ".ts", ".tsx" ]
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, ".babelrc")
          }
        }
      },
      {
        test: /.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({ template: path.resolve(__dirname, "public/index.html") }),
    new ForkTSCheckerWebpackPlugin()
  ]
}
