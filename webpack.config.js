const path = require("path");
const webpack = require('webpack');
module.exports = {
    mode: "production",
    entry: {
        index: "./public/src/js/script.js",
    },
    output: {
        path: path.resolve(__dirname, "./public/dist"),
        publicPath: "./dist/",
        filename: "[name].js",
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {},
        }),
    ],
    resolve: {
        fallback: {
            assert: require.resolve("assert/"),
            fs: false,
            path: require.resolve("path-browserify"),
        },
    },
};
