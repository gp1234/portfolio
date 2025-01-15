const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i, // Extract CSS into separate files
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css", // Cache-busting with content hash
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all", // Code splitting
        },
    },
});