'use strict'

var videoplay = document.querySelector('video#player');
var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');
//!包含视频和音频，直接赋值给html 之中的标签
function gotMediaStream(stream)
{
	videoplay.srcObject = stream; //!指定数据源
	//! 标签拿到数据之后就可以将采集到的视频和音频播放出来了
	//获取浏览器之中的音视频设备
	return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos)
{
	deviceInfos.forEach(function(deviceinfo){
		var option = document.createElement('option');
		option.text = deviceinfo.label;
		option.value = deviceinfo.deviceId;
		if(deviceinfo.kind ==='audioinput')
		{
			audioSource.appendChild(option);
		}	
		else if(deviceinfo.kind==='audiooutput')
		{
			audioOutput.appendChild(option);
		}
		else if(deviceinfo.kind === 'videoinput')
		{		
			videoSource.appendChild(option);
		}
		});
}

function handleError(err)
{
	console.log('getUserMedia err:', err);
}

if(!navigator.mediaDevices ||
	!navigator.mediaDevices.getUserMedia){
	console.log("getUserMedia is not support");
}else{
	var constraints= {
		video : {
			width: 640,
			height: 480,
			framerate: 30,
			facingMode: "environment"
		},
		audio : false
	
	}
//!开始做音视频采集
	navigator.mediaDevices.getUserMedia(constraints)
	.then(gotMediaStream) //!如果音视频采集成功，做获取流的操作
	//！如果获取流成功了，就做加标签的动作，还可以继续做then操作
	.then(gotDevices)
	.catch(handleError);
}
