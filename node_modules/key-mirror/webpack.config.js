var webpack = require('webpack');


var plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
];

if (process.env.COMPRESS) {

    plugins.push(

        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    );
}

module.exports = {

    output: {
        library: 'spout',
        libraryTarget: 'umd2'
    },

    plugins: plugins,

    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader?harmony' }
        ]
    }


};
