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
				var stage = new createjs.Stage(canvas);
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
				createjs.framerate = lib.properties.fps;//修改为新版本的设置方式
				createjs.Ticker.addEventListener("tick", stage);
			});
		});
	},
	touchEvent:function(e){
		//接收小程序的触摸事件传给PIXI
		createjs.dispatchEvent(e);
	}
})