const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const MODE = process.env.WEBPACK_ENV === "development";
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  mode: MODE ? "development" : "production",
  entry: ["@babel/polyfill", ENTRY_FILE],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: "css-loader",
          },
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    autoprefixer,
                    {
                      //options
                      overrideBrowserslist: "cover 99.5%",
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "styles.css",
    }),
  ],
};

module.exports = config;
