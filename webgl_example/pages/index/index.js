import {createCreateJS} from "../../libs/createjs.miniprogram"
var createjs = {};
var app = getApp()
Page({
	onLoad:function () {
		var query = wx.createSelectorQuery();
		var query2d = wx.createSelectorQuery();
		query2d.select('#canvas2d').fields({ node: true, size: true }).exec((res2d) => {
			var canvas2d = res2d[0].node;
			query.select('#myCanvas').fields({ node: true, size: true }).exec((res) => {
				var canvas = res[0].node;
				var stageWidth = 750;//canvas宽度，跟小程序wxss指定的一样大小
				var stageHeight = 1220;//canvas高度，跟小程序wxss指定的一样大小
				canvas.width = stageWidth;
				canvas.height = stageHeight;
				createjs = createCreateJS(canvas,stageWidth,canvas2d);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
				var stage = new createjs.StageGL(canvas);
				createjs.Touch.enable(stage);
				var pic = new createjs.Bitmap("img/bg.jpg");
				stage.addChild(pic);
				var head = new createjs.Bitmap("img/head.png");
				head.y = 300;
				stage.addChild(head);  
                var head2 = new createjs.Bitmap("img/head.png"); 
                head2.y = 20;
                stage.addChild(head2); 
                head2.addEventListener('click', () => { console.log('点击了') });
				createjs.framerate = 30;
				var dir = 1;
				createjs.Ticker.addEventListener("tick", function(){
					head.x+=10*dir;
					if(head.x>650||head.x<0) {
						dir*=-1;
					}
					stage.update();
				});
			});
		});
	},
	touchEvent:function(e){
		//接收小程序的触摸事件传给PIXI
		createjs.dispatchEvent(e);
	}
})