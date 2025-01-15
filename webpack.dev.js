const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map", // Enables detailed source maps for debugging
    devServer: {
        static: "./dist", // Serves files from the dist directory
        open: true, // Automatically opens the browser
        hot: true, // Enables Hot Module Replacement (HMR)
    },
});