createjs 小程序 的适配版本。
---
  - 2021.10.9 修复子元素事件触发不了的问题
---
## 使用

可参考 example 目录下的示例项目或参照以下流程：

1. 复制dist目录的createjs.miniprogram.js到目录libs下

2. 导入小程序适配版本的 createjs

```javascript
import {createCreateJS} from "../../libs/createjs.miniprogram"
var demo = require("./demo")
var createjs = {};
var app = getApp()
Page({
onLoad:function () {
    var query = wx.createSelectorQuery();
    var query2d = wx.createSelectorQuery();
    query2d.select('#canvas2d').fields({ node: true, size: true }).exec((res2d) => {
        var canvas2d = res2d[0].node;
        query.select('#myCanvas').node().exec((res) => {
            var canvas = res[0].node;
            var stageWidth = 750;//canvas宽度，跟小程序wxss指定的一样大小
            var stageHeight = 1220;//canvas高度，跟小程序wxss指定的一样大小
            createjs = createCreateJS(canvas,stageWidth,canvas2d);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
            var AdobeAn = {};
            demo(createjs,AdobeAn);
            var comp=AdobeAn.getComposition("59A13BE6386939418ABC630EB925A061");
            var lib=comp.getLibrary();
            var ss=comp.getSpriteSheet();
            var exportRoot = new lib.demo();
            var stage = new lib.Stage(canvas);
            stage.addChild(exportRoot);
            createjs.Touch.enable(stage);
                        
            var head = new createjs.Bitmap("img/head.png"); 
            head.y = 20;
            stage.addChild(head); 
            head.addEventListener('click', () => { console.log('点击了') });
            function makeResponsive(isResp, respDim, isScale, scaleType) {		
                var lastW, lastH, lastS=1;
                resizeCanvas();
                function resizeCanvas() {			
                    var w = lib.properties.width, h = lib.properties.height;			
                    var iw = canvas.width, ih=canvas.height;			
                    var pRatio = 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
                    if(isResp) {                
                        if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
                            sRatio = lastS;                
                        }
                        else if(!isScale) {					
                            if(iw<w || ih<h)
                                sRatio = Math.min(xRatio, yRatio);				
                        }
                        else if(scaleType==1) {
                            sRatio = Math.min(xRatio, yRatio);
                        }
                        else if(scaleType==2) {
                            sRatio = Math.max(xRatio, yRatio);
                        }
                    }
                    canvas.width = w*pRatio*sRatio;
                    canvas.height = h*pRatio*sRatio;
                    stage.scaleX = pRatio*sRatio;			
                    stage.scaleY = pRatio*sRatio;			
                    lastW = iw; lastH = ih; lastS = sRatio;            
                    stage.tickOnUpdate = false;            
                    stage.update();            
                    stage.tickOnUpdate = true;		
                }
            }
            makeResponsive(false,'both',false,1);	
            AdobeAn.compositionLoaded(lib.properties.id);
            createjs.Ticker.setFPS(lib.properties.fps);
            createjs.Ticker.addEventListener("tick", stage);
        });
    });
},
touchEvent:function(e){
    //接收小程序的触摸事件传给PIXI
    createjs.dispatchEvent(e);
}
})
```

## 说明

- 本项目当前使用的 createjs 版本号为 1.0.1。
- 该适配版本的 createjs 不在全局环境中，如果使用从flash导出的文件，需要对文件做一下处理，处理方式参考demo.js文件
