'use strict'

var videoplay = document.querySelector('video#player');
//var audioplay = document.querySelector("audio#audioplayer");
var audioSource = document.querySelector('select#audioSource');
var audioOutput = document.querySelector('select#audioOutput');
var videoSource = document.querySelector('select#videoSource');
var filter = document.querySelector('select#filter');
var button  = document.querySelector("button#snapshot");
var picture  = document.querySelector("canvas#picture");
var divConstraints = document.querySelector("div#constraints");
picture.width = 320;
picture.height = 240;

//record
var recvideo = document.querySelector('video#recplayer');
var btnRecord = document.querySelector('button#record');
var btnPlay = document.querySelector('button#recplay');
var btnDownload = document.querySelector('button#download');

var buffer;
var mediaRecorder;

//!包含视频和音频，直接赋值给html 之中的标签
function gotMediaStream(stream)
{

	window.stream = stream;
	videoplay.srcObject = stream; //!指定数据源
	//!拿到多媒体流之中的轨，只取第一个就好了，因为这里面只有一个视频的track
	var videoTrack = stream.getVideoTracks()[0];
	//!拿到video 所有的约束
	var videoConstraints = videoTrack.getSettings();

	//!转化成json格式
	divConstraints.textContent = JSON.stringify(videoConstraints, null, 2);

	//!audioplay.srcObject = stream;
	//! 标签拿到数据之后就可以将采集到的视频和音频播放出来了
	//获取浏览器之中的音视频设备
	return navigator.mediaDevices.enumerateDevices();
}

function getMediaStream(stream)
{
	videoplay.srcObject = stream;
	window.stream = stream;
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
	var deviceId = videoSource.value;

		console.log("option2222.value:", deviceId);
	var constraints= {
		video : {
			width: 640,
			heigth: 480,
			framerate: 30,
			facingMode: "environment"
//			deviceId : deviceId ? deviceId : undefined
		},
		audio : {
			noiseSupprrssion: true,
			echoCancellation: true
		},
	
	}
//!开始做音视频采集
	navigator.mediaDevices.getUserMedia(constraints)
	.then(gotMediaStream) //!如果音视频采集成功，做获取流的操作
	//！如果获取流成功了，就做加标签的动作，还可以继续做then操作
	.then(gotDevices)
	.catch(handleError);
}

function switchVideo()
{
        var constraints= {
                video : {
                        width: 640,
                        heigth: 480,
                        framerate: 30,
                        facingMode: "user"
//                      deviceId : deviceId ? deviceId : undefined
                },
                audio : {
                        noiseSupprrssion: true,
                        echoCancellation: true
                },

        }
//!开始做音视频采集
        navigator.mediaDevices.getUserMedia(constraints)
        .then(getMediaStream) //!如果音视频采集成功，做获取流的操作
        //！如果获取流成功了，就做加标签的动作，还可以继续做then操作
        .catch(handleError);

}

videoSource.onchange = switchVideo ;

filter.onchange = function()
{
	//!当我们选择其中的变化的时候，
	//播放视频的名字css name 就是我们选择的这个名字
	//通过className设置元素的样式
	videoplay.className = filter.value;
}

button.onclick = function()
{
	picture.className = filter.value;
	
	var context = picture.getContext('2d');
	switch (filter.value) {
	 	case 'blur':
		 context.filter = 'blur(3px)';
		 break;
		 case 'grayscale':
		context.filter = 'grayscale(1)';
		break;
		case 'invert':
		context.filter = 'invert(1)';
			      break;
			    case 'sepia':
			      context.filter = 'sepia(1)';
			      break;
			    default:
			      break;
	}
	
	//!getContext  是获取canvas 之中的上下文，我们要得到的图片是2维的，所以是2d，
	//拿到上下文之后就开始用drawImage 开始画图了.
	//1.视频
	//2.起始点坐标
	//图片的宽度和高度
	context.drawImage(videoplay, 0, 0, picture.width, picture.height);
}

function handleDataAvailable(e){
	if(e && e.data && e.data.size > 0){
	 	buffer.push(e.data);			
	}
}

//!开始录制俺就函数
function startRecord(){
	
	buffer = [];
	//!限制选项  录制音视频格式
	var options = {
		mimeType: 'video/webm;codecs=vp8'
	}
	//！判断是否支持这个类型的录制
	if(!MediaRecorder.isTypeSupported(options.mimeType)){
		console.error(`${options.mimeType} is not supported!`);
		return;	
	}

	try{
		mediaRecorder = new MediaRecorder(window.stream, options);
	}catch(e){
		console.error('Failed to create MediaRecorder:', e);
		return;	
	}
	//!当数据有效的时候可以存储到缓冲区
	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);

}

function stopRecord(){
	mediaRecorder.stop();
}

btnRecord.onclick = function() {

	if(btnRecord.textContent === 'Start Record'){
		startRecord();	
		btnRecord.textContent = 'Stop Record';
		btnPlay.disabled = true;
		btnDownload.disabled = true;
	}else{
	
		stopRecord();
		btnRecord.textContent = 'Start Record';
		btnPlay.disabled = false;
		btnDownload.disabled = false;

	}
}

btnPlay.onclick = function() {
	var blob = new Blob(buffer, {type: 'video/webm'});
	recvideo.src = window.URL.createObjectURL(blob);
	recvideo.srcObject = null;
	recvideo.controls = true;
	recvideo.play();
}

btnDownload.onclick = function() {
	var blob = new Blob(buffer, {type: 'video/webm'});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');

	a.href = url;
	a.style.display = 'none';
	a.download = 'aaa.webm';
	a.click();
}



