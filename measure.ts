<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover">
  <meta name="description" content="豪士藜麦吐司 - 梦幻烘焙工坊，大广赛参赛作品微信小程序互动游戏">
  <meta name="keywords" content="豪士,藜麦吐司,烘焙,游戏,微信小程序">
  <meta name="author" content="豪士烘焙">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="white">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,address=no,email=no">
  <meta name="theme-color" content="#f7f8fd">
  <title>豪士藜麦吐司 - 梦幻烘焙工坊</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍞</text></svg>">
  <script>!function(n){function f(){var e=n.document.documentElement,r=e.getBoundingClientRect(),width=r.width,height=r.height,arr=[width,height].filter(function(value){return Boolean(value)}),w=Math.min.apply(Math,arr),x=40*w/750;e.style.fontSize=x>=40?"40px":x<=20?"20px":x+"px"}; n.addEventListener("resize",(function(){f()})),f()}(window);</script>
  
  <style>
    *, *::before, *::after {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 0.4rem;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    html, body {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background: #f7f8fd;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    }

    body {
      position: relative;
    }

    #app {
      min-height: 100vh;
      width: 100%;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: center;
          -ms-flex-align: center;
              align-items: center;
      -webkit-justify-content: center;
          -ms-flex-pack: center;
              justify-content: center;
    }

    .__app-loading {
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-direction: column;
          -ms-flex-direction: column;
              flex-direction: column;
      -webkit-align-items: center;
          -ms-flex-align: center;
              align-items: center;
      -webkit-justify-content: center;
          -ms-flex-pack: center;
              justify-content: center;
      gap: 0.4rem;
    }

    .__app-hero {
      width: 3rem;
      height: 3rem;
      -o-object-fit: contain;
         object-fit: contain;
      -webkit-animation: pulse 2s ease-in-out infinite;
              animation: pulse 2s ease-in-out infinite;
    }

    .__app-loading-text {
      color: #666;
      font-size: 0.35rem;
      letter-spacing: 0.05rem;
    }

    @-webkit-keyframes pulse {
      0%, 100% { -webkit-transform: scale(1); transform: scale(1); opacity: 1; }
      50% { -webkit-transform: scale(1.05); transform: scale(1.05); opacity: 0.8; }
    }

    @keyframes pulse {
      0%, 100% { -webkit-transform: scale(1); transform: scale(1); opacity: 1; }
      50% { -webkit-transform: scale(1.05); transform: scale(1.05); opacity: 0.8; }
    }

    /* 隐藏滚动条但保持可滚动 */
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: transparent;
    }
  </style>
  <script type="module" crossorigin src="/js/app.a18920b3.js"></script>
  <link rel="modulepreload" crossorigin href="/js/vendors.aa7c65fe.js">
  <link rel="stylesheet" href="/css/vendors.8886af03.css">
  <link rel="stylesheet" href="/css/index.48d1f3bf.css">
</head>

<body>
  <div id="app">
    <div class="__app-loading">
      <img
        class="__app-hero"
        src="https://img.alicdn.com/imgextra/i4/O1CN018N1JQc1lXjjIBL6wa_!!6000000004829-1-tps-1000-1000.gif"
        alt="豪士藜麦吐司"
      >
      <span class="__app-loading-text">加载中...</span>
    </div>
  </div>
</body>

</html>
