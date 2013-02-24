/*
 * Redactor webcam image plugin.
 * Copyright (c) 2013 Tommy Brunn (tommy.brunn@gmail.com)
 * https://github.com/Nevon/redactor-webcam
 */

//Safe logging
//http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};

if (typeof RedactorPlugins === 'undefined') {
	var RedactorPlugins = {};
}

RedactorPlugins.webcam = {
	init: function() {
		"use strict";

		//Translation strings
		var STRINGS = {
			webcam_title : 'Insert webcam image',
			webcam_help_msg : 'Please accept our request to access your camera using the buttons at the top of the window.',
			webcam_btn_take : 'Take photo',
			webcam_btn_insert : 'Insert photo',
			webcam_btn_reset : 'Discard photo'
		}
		$.extend(RLANG, STRINGS);


		//Check if there's any support for getUserMedia
		if (!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
			return false;
        }
		
		/*
		 * Create the button. When clicked either show 
		 * modal or replace smilies in selected text.
		 */
		this.addBtn('webcam', RLANG.webcam_title, function(redactor) {
			redactor.createModal(redactor);
		});

		//Add a separator before the button
		this.addBtnSeparatorBefore('webcam');

		//Add icon to button
		$('a.redactor_btn_webcam').css({
			backgroundImage: ' url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGZSURBVEiJ7ZU/axRRFMV/Z54LNttGC6ezMWnEkM5OIZBKrUJAix2wSGWRxm+gRWT7ZbZQUga/gNptoY0xRCwsl0AgvU32vWPhCJPZ2RhYAhZ7ynvfOefdP48n21wlsitVXxj8FwbXZiWKorgv6RPQAbD9qizLly3nuravD4fD0zYdNde0KIqHkp7ZXpe0VEsZeA+cNTTuAl3go+23ZVl++FcFe8CSpAjsV7FHQACeAEg6tn0I5MDtKvcUWAdu1MWmZlC79UGe55t5nm8CB1Xsl+3ng8HgVkppJ4Rwz/Yq8L3BvbCCv1gdj8fn2mH7BfCjKIovWZatxRhPJO2GEDZijEf8adU5XHqLJB2XZTkA3khaq8I3gdcppQC8a+Nd2sD2Ya/XW66J1zW2JH2bywDIO53OT+CkJTeync9rcGcymSwDu0CqxT9nWTYCHreRLhpyE0HSXghhI6W0D2wBoyzLRjHGPrDSRmqroPmQ6liJMR7Z3gFObT+IMX4FtmdxpyqQ1K/WsTPDpAtst3xUZ5L6U3qLH21hMDd+A1LylGbqdIHEAAAAAElFTkSuQmCC)'
		});

	},
	createModal: function(redactor) {
		"use strict";
		var modal = '<div id="webcam_modal" style="padding: 10px;">';
		modal += '<em id="redactor-webcam-helpmsg">'+RLANG.webcam_help_msg+'</em>';
		modal += '<video id="redactor-webcam-video" style="display: none;"></video>';
		modal += '<button class="redactor_modal_btn" id="redactor-webcam-shoot" style="display: none;">'+RLANG.webcam_btn_take+'</button>';		
		modal += '<canvas id="redactor-webcam-canvas" style="display: none;"></canvas>';
		modal += '<img src="" id="redactor-webcam-photo" style="display: none;">';
		modal += '<button class="redactor_modal_btn" id="redactor-webcam-upload" style="display: none;">'+RLANG.webcam_btn_insert+'</button>';
		modal += '<button class="redactor_modal_btn" id="redactor-webcam-reset" style="display: none;">'+RLANG.webcam_btn_reset+'</button>';
		modal += '<input type="file" name="webcam_photo" style="display: none;">';
		modal += '</div>';

		//Set up the UI
		this.modalInit(RLANG.webcam_title, modal, 340, function() {
			var streaming   = false,
			video           = document.querySelector('#redactor-webcam-video'),
			canvas          = document.querySelector('#redactor-webcam-canvas'),
			photo           = document.querySelector('#redactor-webcam-photo'),
			shootbutton     = document.querySelector('#redactor-webcam-shoot'),
			uploadbutton    = document.querySelector('#redactor-webcam-upload'),
			resetbutton     = document.querySelector('#redactor-webcam-reset'),
			width           = 320,
			height          = 0;

			//Get whatever version of getUserMedia is available
			navigator.getMedia = ( navigator.getUserMedia ||
	        					   navigator.webkitGetUserMedia ||
	                               navigator.mozGetUserMedia ||
	                               navigator.msGetUserMedia);

			navigator.getMedia(
				{
					video: true,
					audio: false
				},
				function(stream) {
					//Success! Get rid of the help message
					$('#redactor-webcam-helpmsg').hide();

					//Initialize the video strea,
					if (navigator.mozGetUserMedia) {
						video.mozSrcObject = stream;
					} else {
						var vendorURL = window.URL || window.webkitURL;
						video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
					}
					video.play();

					//Show the video
					$(video).fadeIn();
					$(shootbutton).show();
				},
				function(err) {
					log("Something went wrong! " + err.code);
				}
			);

			//Resize the video
			video.addEventListener('canplay', function(ev){
				if (!streaming) {
					height = video.videoHeight / (video.videoWidth/width);
					video.setAttribute('width', width);
					video.setAttribute('height', height);
					canvas.setAttribute('width', width);
					canvas.setAttribute('height', height);
					streaming = true;
				}
			}, false);

			function takepicture() {
				//Get a frame from the video, save it as a dataURL 
				//and display it as an image.
				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').drawImage(video, 0, 0, width, height);
				var data = canvas.toDataURL('image/png');
				photo.setAttribute('src', data);

				//Update the UI
				$(video).fadeOut(function() {
					$(photo).fadeIn();
				});
				$(shootbutton).fadeOut(function() {
					$(uploadbutton).fadeIn();
					$(resetbutton).fadeIn();
				});
			}

			shootbutton.addEventListener('click', function(ev){
				takepicture();
				ev.preventDefault();
			}, false);

			resetbutton.addEventListener('click', function(ev) {
				$(photo).fadeOut(function() {
					$(video).fadeIn();
				});
				
				$(uploadbutton).fadeOut();
				$(resetbutton).fadeOut(function() {
					$(shootbutton).fadeIn();
				});
			});

			uploadbutton.addEventListener('click', function(ev) {
				redactor.setBuffer();

				//If an image uploading endpoint has been set, upload
				//the image there. Otherwise, just add an image using
				//a datauri.
				if (redactor.opts.imageUpload === false) {
					redactor.insertHtml('<img src="'+photo.getAttribute('src')+'">');
				} else {
					redactor.uploadImage(redactor, photo.getAttribute('src'));
				}

				redactor.modalClose();
			});
		});
	},
	uploadImage: function(redactor, dataURI) {
		var byteString;
		var blob;
		var ui;

		//Convert base64 to raw binary data
		if (dataURI.split(',')[0].indexOf('base64') >= 0) {
			byteString = atob(dataURI.split(',')[1]);
		} else {
			byteString = unescape(dataURI.split(',')[1]);
		}

		//Get the mime type
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		//Write the binary data to an ArrayBuffer
		var arrayBuffer = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(arrayBuffer);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		//Write the ArrayBuffer to a Blob
		try {
			blob = new Blob([ia], {type: mimeString});
		} catch (e) {
			//The BlobBuilder API has been deprecated in favor
			//of Blob. This is for backwards compatibility.
			var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
			var bb = new BlobBuilder();
			bb.append(ia);
			blob = bb.getBlob(mimeString);
		}

		//Send the blob as FormData
		var fd = new FormData();
		fd.append('fname', 'webcam-photo-'+new Date().getTime()+'.png');
		fd.append('file', blob);

		$.ajax({
			type: 'POST',
			url: redactor.opts.imageUpload,
			data: fd,
			cache: false,
			processData: false,
			contentType: false
		}).done(function(data) {
			redactor.imageUploadCallback(JSON.parse(data));
		}).fail(function() {
			log("Upload failed.");
			redactor.insertHtml('<img src="'+dataURI+'">');
		});
	}
};