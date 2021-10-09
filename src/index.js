import {atob as _atob} from 'abab';
import XMLHttpRequest from './XMLHttpRequest'
import window from './window'
var DOMParser=require("./xmldom").DOMParser;
import TouchEvent from "./touchEvent"

export function createCreateJS(canvas,stageWidth,canvas2d) {
	let ratio = stageWidth/canvas.width;
	let evtArr = {};
	canvas.style = {width: canvas.width + 'px', height: canvas.height + 'px'}
	canvas.parentElement=true;
	canvas.getBoundingClientRect=function(){
		return { left: 0, top: 0, right:canvas.width,bottom:canvas.height,width:canvas.width, height:canvas.height };
	};
	canvas.addEventListener = function(eventName,eventFun){
		window.addEventListener(eventName,eventFun);
	}
	canvas.removeEventListener = function(eventName,eventFun) {
		window.removeEventListener(eventName,eventFun);
	}
	if(canvas2d) {
		canvas2d.addEventListener = function () {}
		canvas2d.removeEventListener = function () {}
	}
	const requestAnimationFrame = canvas.requestAnimationFrame;
	const cancelAnimationFrame = canvas.cancelAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
	const HTMLVideoElement = function(){};
	const HTMLCanvasElement = function(){};
	const HTMLImageElement = function(){};
	const MouseEvent = function(){};
	const navigator={
		userAgent:""
	};
	const Image = function(){
		let img= canvas.createImage();
		img.crossOrigin="";
		return img;
	}
	const document = {
        clientLeft:0,
        clientTop:0,
        body:{
            clientLeft:0,
            clientTop:0,
        },
		createElementNS(_, type) {
			let cvs;
			switch(type) {
				case "canvas":
					return canvas2d;
					break;
				case "img":
				case "image":
					let img= canvas.createImage();
					img.crossOrigin="";
					return img;
					break;
			}
		},
		createElement(type) {
			let cvs;
			switch(type) {
				case "canvas":
					return canvas2d;
					break;
				case "img":
				case "image":
					let img= canvas.createImage();
					img.crossOrigin="";
					return img;
					break;
				case "a":
					return {href:""}
					break;
			}
		},
		addEventListener:function(){},
		removeEventListener:function(){},
	};
	window.document = document;
	// eslint-disable-next-line
	const atob = (a) => {
		return _atob(a)
	}
	__INJECT_CREATEJS__
	createjs.dispatchEvent = function(event){
		const touchEvent = new TouchEvent(event.type)
		for(var i=0;i<event.touches.length;i++) {
			event.touches[i].clientX = event.touches[i].x*ratio;
			event.touches[i].clientY = event.touches[i].y*ratio;
			event.touches[i].layerX = event.touches[i].x*ratio;
			event.touches[i].layerY = event.touches[i].y*ratio;
			event.touches[i].pageX = event.touches[i].x*ratio;
			event.touches[i].pageY = event.touches[i].y*ratio;
		}
		for(var i=0;i<event.changedTouches.length;i++) {
			event.changedTouches[i].clientX = event.changedTouches[i].x*ratio;
			event.changedTouches[i].clientY = event.changedTouches[i].y*ratio;
			event.changedTouches[i].layerX = event.changedTouches[i].x*ratio;
			event.changedTouches[i].layerY = event.changedTouches[i].y*ratio;
			event.changedTouches[i].pageX = event.changedTouches[i].x*ratio;
			event.changedTouches[i].pageY = event.changedTouches[i].y*ratio;
		}
		touchEvent.target = canvas
		touchEvent.touches = event.touches
		touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
		touchEvent.changedTouches = event.changedTouches
		touchEvent.timeStamp = event.timeStamp
		window.dispatchEvent(touchEvent)
	}
	return createjs
}