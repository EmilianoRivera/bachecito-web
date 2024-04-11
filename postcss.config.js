module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Convert files < 8kb to base64 strings
              fallback: 'style-loader', // Use style-loader for larger files
              name: '[name].[ext]', // Output file name
              outputPath: 'css/', // Output path
              publicPath: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/' // Public URL
            }
          }
        ]
      }
    ]
  }
};
