module.exports = {
  baseUrl: './',
  devServer: {
    
    host: 'localhost',
    port: 8083,
    open: true, //项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
    
    proxy: {
      "/api": {
        //真实转换成的后台请求地址，别忘了加http(https)
        //target: "http://localhost:8999/DormitoryAdmin", 
        target: "http://114.132.237.53:8999", 
        ws: true,
        changeOrigin: true,//是否跨域
        pathRewrite: {//重定向
          "^/api": "/",//和上面一样，将请求地址中前面的替换为后面的内容
        }
      }
    }
  },
  lintOnSave:false //关闭eslint检查
}
