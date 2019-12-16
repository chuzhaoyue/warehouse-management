module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // target host
        // ws: true, // proxy websockets 
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
          '^/api': '' // rewrite path
        }
      },
    }
  }
}