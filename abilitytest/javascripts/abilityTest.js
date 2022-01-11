"use strict";

window.AudioContext = window.AudioContext||window.webkitAudioContext;

var isMobile = {
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    safari: function() {
        return navigator.userAgent.toLowerCase().indexOf('safari/') > -1 &&  navigator.userAgent.toLowerCase().indexOf('chrome/') === -1;
    },
    PC: function() {

    }
};

function Report() {
    this.output_ = [];
    this.nextAsyncId_ = 0;
    this.nativeLog_ = console.log.bind(console);
    console.log = this.logHook_.bind(this);
    window.addEventListener('error', this.onWindowError_.bind(this));
    this.traceEventInstant('system-info', Report.getSystemInfo());
}

Report.prototype = {
    traceEventInstant: function(name, args) {
        this.output_.push({'ts': Date.now(),
            'name': name,
            'args': args});
    },

    traceEventWithId: function(name, id, args) {
        this.output_.push({'ts': Date.now(),
            'name': name,
            'id': id,
            'args': args});
    },

    traceEventAsync: function(name) {
        return this.traceEventWithId.bind(this, name, this.nextAsyncId_++);
    },

    logTestRunResult: function(testName, status) {
        ga('send', {
            'hitType': 'event',
            'eventCategory': 'Test',
            'eventAction': status,
            'eventLabel': testName,
            'nonInteraction': 1
        });
    },

    generate: function(bugDescription) {
        var header = {'title': 'WebRTC Troubleshooter bug report',
            'description': bugDescription || null};
        return this.getContent_(header);
    },

    getContent_: function(contentHead) {
        var stringArray = [];
        this.appendEventsAsString_([contentHead] || [], stringArray);
        this.appendEventsAsString_(this.output_, stringArray);
        return '[' + stringArray.join(',\n') + ']';
    },

    appendEventsAsString_: function(events, output) {
        for (var i = 0; i !== events.length; ++i) {
            output.push(JSON.stringify(events[i]));
        }
    },

    onWindowError_: function(error) {
        this.traceEventInstant('error', {'message': error.message,
            'filename': error.filename + ':' +
            error.lineno});
    },

    logHook_: function() {
        this.traceEventInstant('log', arguments);
        this.nativeLog_.apply(null, arguments);
    }
};

Report.getSystemInfo = function() {
    var agent = navigator.userAgent;
    var browserName = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var offsetName;
    var offsetVersion;
    var ix;

    if ((offsetVersion = agent.indexOf('Chrome')) !== -1) {
        browserName = 'Chrome';
        version = agent.substring(offsetVersion + 7);
    } else if ((offsetVersion = agent.indexOf('MSIE')) !== -1) {
        browserName = 'Microsoft Internet Explorer'; // Older IE versions.
        version = agent.substring(offsetVersion + 5);
    } else if ((offsetVersion = agent.indexOf('Trident')) !== -1) {
        browserName = 'Microsoft Internet Explorer'; // Newer IE versions.
        version = agent.substring(offsetVersion + 8);
    } else if ((offsetVersion = agent.indexOf('Firefox')) !== -1) {
        browserName = 'Firefox';
    } else if ((offsetVersion = agent.indexOf('Safari')) !== -1) {
        browserName = 'Safari';
        version = agent.substring(offsetVersion + 7);
        if ((offsetVersion = agent.indexOf('Version')) !== -1) {
            version = agent.substring(offsetVersion + 8);
        }
    } else if ((offsetName = agent.lastIndexOf(' ') + 1) <
        (offsetVersion = agent.lastIndexOf('/'))) {
        browserName = agent.substring(offsetName, offsetVersion);
        version = agent.substring(offsetVersion + 1);
        if (browserName.toLowerCase() === browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    if ((ix = version.indexOf(';')) !== -1) {
        version = version.substring(0, ix);
    }
    if ((ix = version.indexOf(' ')) !== -1) {
        version = version.substring(0, ix);
    }
    return {'browserName': browserName,
        'browserVersion': version,
        'platform': navigator.platform};
};

function Ssim() {}

Ssim.prototype = {
    statistics: function(a) {
        var accu = 0;
        var i;
        for (i = 0; i < a.length; ++i) {
            accu += a[i];
        }
        var meanA = accu / (a.length - 1);
        var diff = 0;
        for (i = 1; i < a.length; ++i) {
            diff = a[i - 1] - meanA;
            accu += a[i] + (diff * diff);
        }
        return {mean: meanA, variance: accu / a.length};
    },

    covariance: function(a, b, meanA, meanB) {
        var accu = 0;
        for (var i = 0; i < a.length; i += 1) {
            accu += (a[i] - meanA) * (b[i] - meanB);
        }
        return accu / a.length;
    },

    calculate: function(x, y) {
        if (x.length !== y.length) {
            return 0;
        }

        var K1 = 0.01;
        var K2 = 0.03;
        var L = 255;
        var C1 = (K1 * L) * (K1 * L);
        var C2 = (K2 * L) * (K2 * L);
        var C3 = C2 / 2;

        var statsX = this.statistics(x);
        var muX = statsX.mean;
        var sigmaX2 = statsX.variance;
        var sigmaX = Math.sqrt(sigmaX2);
        var statsY = this.statistics(y);
        var muY = statsY.mean;
        var sigmaY2 = statsY.variance;
        var sigmaY = Math.sqrt(sigmaY2);
        var sigmaXy = this.covariance(x, y, muX, muY);

        var luminance = (2 * muX * muY + C1) /
            ((muX * muX) + (muY * muY) + C1);
        var structure = (sigmaXy + C3) / (sigmaX * sigmaY + C3);
        var contrast = (2 * sigmaX * sigmaY + C2) / (sigmaX2 + sigmaY2 + C2);

        return luminance * contrast * structure;
    }
};

function StatisticsAggregate(rampUpThreshold) {
    this.startTime_ = 0;
    this.sum_ = 0;
    this.count_ = 0;
    this.max_ = 0;
    this.rampUpThreshold_ = rampUpThreshold;
    this.rampUpTime_ = Infinity;
}

StatisticsAggregate.prototype = {
    add: function(time, datapoint) {
        if (this.startTime_ === 0) {
            this.startTime_ = time;
        }
        this.sum_ += datapoint;
        this.max_ = Math.max(this.max_, datapoint);
        if (this.rampUpTime_ === Infinity &&
            datapoint > this.rampUpThreshold_) {
            this.rampUpTime_ = time;
        }
        this.count_++;
    },

    getAverage: function() {
        if (this.count_ === 0) {
            return 0;
        }
        return Math.round(this.sum_ / this.count_);
    },

    getMax: function() {
        return this.max_;
    },

    getRampUpTime: function() {
        return this.rampUpTime_ - this.startTime_;
    }
};

function arrayAverage(array) {
    var cnt = array.length;
    var tot = 0;
    for (var i = 0; i < cnt; i++) {
        tot += array[i];
    }
    return Math.floor(tot / cnt);
}

function arrayMax(array) {
    if (array.length === 0) {
        return NaN;
    }
    return Math.max.apply(Math, array);
}

function arrayMin(array) {
    if (array.length === 0) {
        return NaN;
    }
    return Math.min.apply(Math, array);
}

function MicTest(test) {
    this.test = test;
    this.inputChannelCount = 6;
    this.outputChannelCount = 2;
    this.device = {
        audioid : "",
        videoid : ""
    };
    // Buffer size set to 0 to let Chrome choose based on the platform.
    this.bufferSize = 0;
    // Turning off echoCancellation constraint enables stereo input.
    this.constraints = {
        audio: {
            optional: [
                {echoCancellation: false}
            ]
        }
    };

    this.collectSeconds = 2.0;
    // At least one LSB 16-bit data (compare is on absolute value).
    this.silentThreshold = 1.0 / 32767;
    this.lowVolumeThreshold = -60;
    // Data must be identical within one LSB 16-bit to be identified as mono.
    this.monoDetectThreshold = 1.0 / 65536;
    // Number of consequtive clipThreshold level samples that indicate clipping.
    this.clipCountThreshold = 6;
    this.clipThreshold = 1.0;

    // Populated with audio as a 3-dimensional array:
    //   collectedAudio[channels][buffers][samples]
    this.collectedAudio = [];
    this.collectedSampleCount = 0;
    for (var i = 0; i < this.inputChannelCount; ++i) {
        this.collectedAudio[i] = [];
    }
}


function audioInputTest(){
        $("#meters").show();
        /*
        *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
        *
        *  Use of this source code is governed by a BSD-style license
        *  that can be found in the LICENSE file in the root of the source
        *  tree.
        */

        /* global AudioContext, SoundMeter */

        'use strict';

        var instantMeter = document.querySelector('#instant meter');
        var slowMeter = document.querySelector('#slow meter');
        var clipMeter = document.querySelector('#clip meter');

        var instantValueDisplay = document.querySelector('#instant .value');
        var slowValueDisplay = document.querySelector('#slow .value');
        var clipValueDisplay = document.querySelector('#clip .value');

        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
        } catch (e) {
            alert('Web Audio API not supported.');
        }

        // Put variables in global scope to make them available to the browser console.
        var constraints = window.constraints = {
            audio: true,
            video: false
        };

        function handleSuccess(stream) {
        // Put variables in global scope to make them available to the
        // browser console.
            window.stream = stream;
            var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
            soundMeter.connectToSource(stream, function(e) {
                if (e) {
                alert(e);
                return;
                }
                setInterval(function() {
                instantMeter.value = instantValueDisplay.innerText =
                    soundMeter.instant.toFixed(2);
                slowMeter.value = slowValueDisplay.innerText =
                    soundMeter.slow.toFixed(2);
                clipMeter.value = clipValueDisplay.innerText =
                    soundMeter.clip;
                }, 200);
            });
        }

        function handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
        }

        navigator.mediaDevices.getUserMedia(constraints).
            then(handleSuccess).catch(handleError);
}

function enumDevice(onOk, onError) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      onError('enumerateDevices() not supported.');
      return;
    }
    navigator.mediaDevices.enumerateDevices()
        .then(function (sourceInfos) {
            onOk(sourceInfos);
        })
        .catch(function(err) {
            console.log('JS Device selection not supported', err);
            onError(err);
        });
}

function getDeviceName(tracks) {
    if (tracks.length === 0) {
        return null;
    }
    return tracks[0].label;
}

function appendSourceId(id, type, constraints) {
    if (constraints[type] === true) {
        constraints[type] = {optional: [{sourceId: id}]};
    } else if (typeof constraints[type] === 'object') {
        if (typeof constraints[type].optional === 'undefined') {
            constraints[type].optional = [];
        }
        constraints[type].optional.push({sourceId: id});
    }
}

function doGetUserMedia(constraints, onSuccess, reportFatal, audioid, videoid) {
    var self = this;
    var traceGumEvent = report.traceEventAsync('getusermedia');
    if (audioid) {
        appendSourceId(audioid, "audio", constraints);
    }
    if (videoid) {
        appendSourceId(videoid, "video", constraints);
    }
    try {
        traceGumEvent({'status': 'pending', 'constraints': constraints});

        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log("enumerateDevices() not supported.");
          reportFatal('enumerateDevices() not supported.');
          return;
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                var cam = getDeviceName(stream.getVideoTracks());
                var mic = getDeviceName(stream.getAudioTracks());
                traceGumEvent({'status': 'success', 'camera': cam,
                    'microphone': mic});
                onSuccess.apply(this, arguments);
            })
            .catch(function(error) {
                traceGumEvent({'status': 'fail', 'error': error});
                reportFatal('Failed to get access to local media due to ' +
                    'error: ' + error.name);
            });
    } catch (e) {
        console.log(e);
        traceGumEvent({'status': 'exception', 'error': e.message});
        return reportFatal('getUserMedia failed with exception: ' +
            e.message);
    }
}

function setTimeoutWithProgressBar(timeoutCallback, timeoutMs) {
    var start = window.performance.now();


    var timeoutTask = function() {
        timeoutCallback();
    };
    var timer = setTimeout(timeoutTask, timeoutMs);
    var finishProgressBar = function() {
        clearTimeout(timer);
        timeoutTask();
    };
    return finishProgressBar;
}

MicTest.prototype = {
    run : function () {
        if (typeof audioContext === 'undefined') {
            this.test.reportError('WebAudio/webkitAudioContext is not supported, test cannot run.');
            this.test.done();
        } else {
            var that = this;
            enumDevice(function (source) {
                var audioId = "", videoId = "";
                for (var i = 0; i < source.length; i++) {
                    var item = source[i];
                    if (item.kind == 'audioinput') {
                        if (!audioId) {
                            audioId = item.deviceId;
                        }
                    } else if (item.kind == "videoinput") {
                        if (!videoId) {
                            videoId = item.deviceId;
                        }
                    }
                }
                that.device.audioid = audioId;
                that.device.videoid = videoId;
                doGetUserMedia(that.constraints, that.gotStream.bind(that), function (error) {
                    that.test.reportFatal(error);
                }, audioId, videoId);
            }, function (error) {
                that.test.reportError('WebAudio is not supported, test cannot run.');
                that.test.done();
            });
        }
    },
    gotStream: function(stream) {
        if (!this.checkAudioTracks(stream)) {
            this.test.done();
            return;
        }

        //ios 暂不支持获取
        if( isMobile.iOS() && isMobile.safari() ){
            this.test.done();
            return;
        }
        this.test.done();

        // this.createAudioBuffer(stream);
    },
    checkAudioTracks: function(stream) {
        this.stream = stream;
        var audioTracks = stream.getAudioTracks();
        if (audioTracks.length < 1) {
            this.test.reportError('No audio track in returned stream.');
            return false;
        }
        this.test.reportSuccess('Audio track created using device=' +
            audioTracks[0].label);
        return true;
    },
    createAudioBuffer: function() {
        this.audioSource = audioContext.createMediaStreamSource(this.stream);
        this.scriptNode = audioContext.createScriptProcessor(this.bufferSize,
            this.inputChannelCount, this.outputChannelCount);
        this.audioSource.connect(this.scriptNode);
        this.scriptNode.connect(audioContext.destination);
        this.scriptNode.onaudioprocess = this.collectAudio.bind(this);
        this.stopCollectingAudio = setTimeoutWithProgressBar(
            this.onStopCollectingAudio.bind(this), 5000);
    },
    collectAudio: function(event) {
        var sampleCount = event.inputBuffer.length;
        var allSilent = true;
        for (var c = 0; c < event.inputBuffer.numberOfChannels; c++) {
            var data = event.inputBuffer.getChannelData(c);
            var first = Math.abs(data[0]);
            var last = Math.abs(data[sampleCount - 1]);
            var newBuffer;
            if (first > this.silentThreshold || last > this.silentThreshold) {
                newBuffer = new Float32Array(sampleCount);
                newBuffer.set(data);
                allSilent = false;
            } else {
                newBuffer = new Float32Array();
            }
            this.collectedAudio[c].push(newBuffer);
        }
        if (!allSilent) {
            this.collectedSampleCount += sampleCount;
            if ((this.collectedSampleCount / event.inputBuffer.sampleRate) >= this.collectSeconds) {
                this.stopCollectingAudio();
            }
        }
    },

    onStopCollectingAudio: function() {
        this.stream.getAudioTracks()[0].stop();
        this.audioSource.disconnect(this.scriptNode);
        this.scriptNode.disconnect(audioContext.destination);
        this.analyzeAudio(this.collectedAudio);
        this.test.done();
    },

    analyzeAudio: function(channels) {
        var activeChannels = [];
        for (var c = 0; c < channels.length; c++) {
            if (this.channelStats(c, channels[c])) {
                activeChannels.push(c);
            }
        }
        if (activeChannels.length === 0) {
            this.test.reportError('No active input channels detected. Microphone ' +
                'is most likely muted or broken, please check if muted in the ' +
                'sound settings or physically on the device. Then rerun the test.');
        } else {
            this.test.reportSuccess('Active audio input channels: ' +
                activeChannels.length);
        }
        if (activeChannels.length === 2) {
            this.detectMono(channels[activeChannels[0]], channels[activeChannels[1]]);
        }
    },

    channelStats: function(channelNumber, buffers) {
        var maxPeak = 0.0;
        var maxRms = 0.0;
        var clipCount = 0;
        var maxClipCount = 0;
        for (var j = 0; j < buffers.length; j++) {
            var samples = buffers[j];
            if (samples.length > 0) {
                var s = 0;
                var rms = 0.0;
                for (var i = 0; i < samples.length; i++) {
                    s = Math.abs(samples[i]);
                    maxPeak = Math.max(maxPeak, s);
                    rms += s * s;
                    if (maxPeak >= this.clipThreshold) {
                        clipCount++;
                        maxClipCount = Math.max(maxClipCount, clipCount);
                    } else {
                        clipCount = 0;
                    }
                }

                rms = Math.sqrt(rms / samples.length);
                maxRms = Math.max(maxRms, rms);
            }
        }

        if (maxPeak > this.silentThreshold) {
            var dBPeak = this.dBFS(maxPeak);
            var dBRms = this.dBFS(maxRms);
            this.test.reportInfo('Channel ' + channelNumber + ' levels: ' +
                dBPeak.toFixed(1) + ' dB (peak), ' + dBRms.toFixed(1) + ' dB (RMS)');
            if (dBRms < this.lowVolumeThreshold) {
                this.test.reportError('Microphone input level is low, increase input ' +
                    'volume or move closer to the microphone.');
            }
            if (maxClipCount > this.clipCountThreshold) {
                this.test.reportWarning('Clipping detected! Microphone input level ' +
                    'is high. Decrease input volume or move away from the microphone.');
            }
            return true;
        } else {
            return false;
        }
    },

    detectMono: function(buffersL, buffersR) {
        var diffSamples = 0;
        for (var j = 0; j < buffersL.length; j++) {
            var l = buffersL[j];
            var r = buffersR[j];
            if (l.length === r.length) {
                var d = 0.0;
                for (var i = 0; i < l.length; i++) {
                    d = Math.abs(l[i] - r[i]);
                    if (d > this.monoDetectThreshold) {
                        diffSamples++;
                    }
                }
            } else {
                diffSamples++;
            }
        }
        if (diffSamples > 0) {
            this.test.reportInfo('Stereo microphone detected.');
        } else {
            this.test.reportInfo('Mono microphone detected.');
        }
    },

    dBFS: function(gain) {
        var dB = 20 * Math.log(gain) / Math.log(10);
        return Math.round(dB * 10) / 10;
    }
};

function CameraTest(test, resolutions) {
    this.test = test;
    this.resolutions = resolutions;
    this.currentResolution = 0;
    this.isMuted = false;
    this.isShuttingDown = false;
}

CameraTest.prototype = {
    run : function () {
        this.maybeContinueGetUserMedia();
    },
    startGetUserMedia : function (resolution) {
        var constraints = {
            audio: false,
            video: {width: {exact: resolution[0]},
                height: {exact: resolution[1]}}
        };
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log("enumerateDevices() not supported.");
          this.test.reportError('enumerateDevices() not supported.');
          return;
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                if (this.resolutions.length > 1) {
                    this.test.reportSuccess('Supported: ' + resolution[0] + 'x' + resolution[1]);
                    stream.getTracks().forEach(function(track) {track.stop();});
                    this.maybeContinueGetUserMedia();
                } else {
                    this.collectAndAnalyzeStats_(stream, resolution);
                }
            }.bind(this))
            .catch(function(error) {
                if (this.resolutions.length > 1) {
                    this.test.reportInfo(resolution[0] + 'x' + resolution[1] +
                        ' not supported');
                } else {
                    this.test.reportError('getUserMedia failed with error: ' + error.name);
                }
                this.maybeContinueGetUserMedia();
            }.bind(this));
    },
    maybeContinueGetUserMedia : function () {
        if (this.currentResolution === this.resolutions.length) {
            this.test.done();
            return;
        }

        var index = this.currentResolution++;
        console.debug(index,this.resolutions[index]);
        this.startGetUserMedia(this.resolutions[index]);
    },
    collectAndAnalyzeStats_ : function (stream, resolution) {
        var tracks = stream.getVideoTracks();
        if (tracks.length < 1) {
            this.test.reportError('No video track in returned stream.');
            this.maybeContinueGetUserMedia();
            return;
        }

        //ios 认为可用
        // if( isMobile.iOS() && isMobile.safari() ){
        //     this.test.done();
        //     this.successCount ++;
        //     return;
        // }
        var videoTrack = tracks[0];
        if (typeof videoTrack.addEventListener === 'function') {

            videoTrack.addEventListener('ended', function() {
                if (this.isShuttingDown) {
                    return;
                }
                this.test.reportError('Video track ended, camera stopped working');
            }.bind(this));

            videoTrack.addEventListener('mute', function() {
                if (this.isShuttingDown) {
                    return;
                }
                this.test.reportWarning('Your camera reported itself as muted.');
                this.isMuted = true;
            }.bind(this));

            videoTrack.addEventListener('unmute', function() {
                if (this.isShuttingDown) {
                    return;
                }
                this.test.reportInfo('Your camera reported itself as unmuted.');
                this.isMuted = false;
            }.bind(this));
        }

        var video = document.createElement('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.width = resolution[0];
        video.height = resolution[1];
        video.srcObject = stream;
        var frameChecker = new VideoFrameChecker(video);
        var call = new Call(null, this.test);
        call.pc1.addStream(stream);
        call.establishConnection();
        call.gatherStats(call.pc1, stream,
            this.onCallEnded_.bind(this, resolution, video,
                stream, frameChecker),
            100);

        setTimeoutWithProgressBar(this.endCall_.bind(this, call, stream), 8000);
    },
    onCallEnded_ : function (resolution, videoElement, stream, frameChecker, stats, statsTime) {
        this.analyzeStats_(resolution, videoElement, stream, frameChecker,
            stats, statsTime);

        frameChecker.stop();

        this.test.done();
    },
    analyzeStats_ : function (resolution, videoElement, stream, frameChecker, stats, statsTime) {
        var googAvgEncodeTime = [];
        var googAvgFrameRateInput = [];
        var googAvgFrameRateSent = [];
        var statsReport = {};
        var frameStats = frameChecker.frameStats;

        for (var index in stats) {
            if (stats[index].type === 'ssrc') {
                if (parseInt(stats[index].googFrameRateInput) > 0) {
                    googAvgEncodeTime.push(
                        parseInt(stats[index].googAvgEncodeMs));
                    googAvgFrameRateInput.push(
                        parseInt(stats[index].googFrameRateInput));
                    googAvgFrameRateSent.push(
                        parseInt(stats[index].googFrameRateSent));
                }
            }
        }

        statsReport.cameraName = stream.getVideoTracks()[0].label || NaN;
        statsReport.actualVideoWidth = videoElement.videoWidth;
        statsReport.actualVideoHeight = videoElement.videoHeight;
        statsReport.mandatoryWidth = resolution[0];
        statsReport.mandatoryHeight = resolution[1];
        statsReport.encodeSetupTimeMs = this.extractEncoderSetupTime_(stats, statsTime);
        statsReport.avgEncodeTimeMs = arrayAverage(googAvgEncodeTime);
        statsReport.minEncodeTimeMs = arrayMin(googAvgEncodeTime);
        statsReport.maxEncodeTimeMs = arrayMax(googAvgEncodeTime);
        statsReport.avgInputFps = arrayAverage(googAvgFrameRateInput);
        statsReport.minInputFps = arrayMin(googAvgFrameRateInput);
        statsReport.maxInputFps = arrayMax(googAvgFrameRateInput);
        statsReport.avgSentFps = arrayAverage(googAvgFrameRateSent);
        statsReport.minSentFps = arrayMin(googAvgFrameRateSent);
        statsReport.maxSentFps = arrayMax(googAvgFrameRateSent);
        statsReport.isMuted = this.isMuted;
        statsReport.testedFrames = frameStats.numFrames;
        statsReport.blackFrames = frameStats.numBlackFrames;
        statsReport.frozenFrames = frameStats.numFrozenFrames;

        report.traceEventInstant('video-stats', statsReport);

        this.testExpectations_(statsReport);
    },
    endCall_ : function (callObject, stream) {
        this.isShuttingDown = true;
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        callObject.close();
    },
    extractEncoderSetupTime_ : function (stats, statsTime) {
        for (var index = 0; index !== stats.length; index++) {
            if (stats[index].type === 'ssrc') {
                if (parseInt(stats[index].googFrameRateInput) > 0) {
                    return JSON.stringify(statsTime[index] - statsTime[0]);
                }
            }
        }
        return NaN;
    },
    resolutionMatchesIndependentOfRotationOrCrop_ : function (aWidth, aHeight, bWidth, bHeight) {
        var minRes = Math.min(bWidth, bHeight);
        return (aWidth === bWidth && aHeight === bHeight) ||
            (aWidth === bHeight && aHeight === bWidth) ||
            (aWidth === minRes && bHeight === minRes);
    },
    testExpectations_ : function (info) {
        var notAvailableStats = [];
        for (var key in info) {
            if (info.hasOwnProperty(key)) {
                if (typeof info[key] === 'number' && isNaN(info[key])) {
                    notAvailableStats.push(key);
                } else {
                    this.test.reportInfo(key + ': ' + info[key]);
                }
            }
        }
        if (notAvailableStats.length !== 0) {
            this.test.reportInfo('Not available: ' + notAvailableStats.join(', '));
        }

        if (isNaN(info.avgSentFps)) {
            this.test.reportInfo('Cannot verify sent FPS.');
        } else if (info.avgSentFps < 5) {
            this.test.reportError('Low average sent FPS: ' + info.avgSentFps);
        } else {
            this.test.reportSuccess('Average FPS above threshold');
        }
        if (!this.resolutionMatchesIndependentOfRotationOrCrop_(
                info.actualVideoWidth, info.actualVideoHeight, info.mandatoryWidth,
                info.mandatoryHeight)) {
            this.test.reportError('Incorrect captured resolution.');
        } else {
            this.test.reportSuccess('Captured video using expected resolution.');
        }
        /*if (info.testedFrames === 0) {
            this.test.reportError('Could not analyze any video frame.');
        } else {
            if (info.blackFrames > info.testedFrames / 3) {
                this.test.reportError('Camera delivering lots of black frames.');
            }
            if (info.frozenFrames > info.testedFrames / 3) {
                this.test.reportError('Camera delivering lots of frozen frames.');
            }
        }*/
    }
};

function VideoFrameChecker(videoElement) {
    this.frameStats = {
        numFrozenFrames: 0,
        numBlackFrames: 0,
        numFrames: 0
    };

    this.running_ = true;

    this.nonBlackPixelLumaThreshold = 20;
    this.previousFrame_ = [];
    this.identicalFrameSsimThreshold = 0.985;
    this.frameComparator = new Ssim();

    this.canvas_ = document.createElement('canvas');
    this.videoElement_ = videoElement;
    this.listener_ = this.checkVideoFrame_.bind(this);
    this.videoElement_.addEventListener('play', this.listener_, false);
}

VideoFrameChecker.prototype = {
    stop: function() {
        this.videoElement_.removeEventListener('play' , this.listener_);
        this.running_ = false;
    },

    getCurrentImageData_: function() {
        this.canvas_.width = this.videoElement_.width;
        this.canvas_.height = this.videoElement_.height;

        var context = this.canvas_.getContext('2d');
        context.drawImage(this.videoElement_, 0, 0, this.canvas_.width,
            this.canvas_.height);
        return context.getImageData(0, 0, this.canvas_.width, this.canvas_.height);
    },

    checkVideoFrame_: function() {
        if (!this.running_) {
            return;
        }
        if (this.videoElement_.ended) {
            return;
        }

        var imageData = this.getCurrentImageData_();

        if (this.isBlackFrame_(imageData.data, imageData.data.length)) {
            this.frameStats.numBlackFrames++;
        }

        if (this.frameComparator.calculate(this.previousFrame_, imageData.data) >
            this.identicalFrameSsimThreshold) {
            this.frameStats.numFrozenFrames++;
        }
        this.previousFrame_ = imageData.data;

        this.frameStats.numFrames++;
        setTimeout(this.checkVideoFrame_.bind(this), 20);
    },

    isBlackFrame_: function(data, length) {
        var thresh = this.nonBlackPixelLumaThreshold;
        var accuLuma = 0;
        for (var i = 4; i < length; i += 4) {
            // Use Luma as in Rec. 709: Y′709 = 0.21R + 0.72G + 0.07B;
            accuLuma += 0.21 * data[i] +  0.72 * data[i + 1] + 0.07 * data[i + 2];
            // Early termination if the average Luma so far is bright enough.
            if (accuLuma > (thresh * i / 4)) {
                return false;
            }
        }
        return true;
    }
};

function Call(config, test) {
    this.test = test;
    this.traceEvent = report.traceEventAsync('call');
    this.traceEvent({config: config});
    this.statsGatheringRunning = false;

    this.pc1 = new RTCPeerConnection(config);
    this.pc2 = new RTCPeerConnection(config);

    this.pc1.addEventListener('icecandidate', this.onIceCandidate_.bind(this,
        this.pc2));
    this.pc2.addEventListener('icecandidate', this.onIceCandidate_.bind(this,
        this.pc1));

    this.iceCandidateFilter_ = Call.noFilter;

}

Call.prototype = {
    establishConnection: function() {
        this.traceEvent({state: 'start'});
        this.pc1.createOffer().then(
            this.gotOffer_.bind(this),
            this.test.reportFatal.bind(this.test)
        );
    },

    close: function() {
        this.traceEvent({state: 'end'});
        this.pc1.close();
        this.pc2.close();
    },

    setIceCandidateFilter: function(filter) {
        this.iceCandidateFilter_ = filter;
    },

    constrainVideoBitrate: function(maxVideoBitrateKbps) {
        this.constrainVideoBitrateKbps_ = maxVideoBitrateKbps;
    },

    disableVideoFec: function() {
        this.constrainOfferToRemoveVideoFec_ = true;
    },

    gatherStats: function(peerConnection, localStream, statsCb) {
        var stats = [];
        var statsCollectTime = [];
        var self = this;
        var statStepMs = 100;

        var selector = (adapter.browserDetails.browser === 'chrome') ?
            localStream : null;
        var track = peerConnection.getLocalStreams()[0].getVideoTracks()[0];
        this.statsGatheringRunning = true;
        getStats_();

        function getStats_() {
            if (peerConnection.signalingState === 'closed') {
                self.statsGatheringRunning = false;
                statsCb(stats, statsCollectTime);
                return;
            }

            peerConnection.getStats(selector, function (report) {
                gotStats_(report);
            }, function (error) {
                console.error("get stats error : " + error);
                statsCb(stats, statsCollectTime);
            });
        }

        function gotStats_(response) {
            if (adapter.browserDetails.browser === 'chrome') {
                response.forEach(function (value, key, map) {
                    stats.push(value);
                    statsCollectTime.push(Date.now());
                });

            } else if (adapter.browserDetails.browser === 'firefox') {
                for (var j in response) {
                    var stat = response[j];
                    stats.push(stat);
                    statsCollectTime.push(Date.now());
                }
            } else {
                self.test.reportError('Only Firefox and Chrome getStats ' +
                    'implementations are supported.');
            }
            setTimeout(getStats_, statStepMs);
        }
    },

    gotOffer_: function(offer) {
        if (this.constrainOfferToRemoveVideoFec_) {
            offer.sdp = offer.sdp.replace(/(m=video 1 [^\r]+)(116 117)(\r\n)/g,
                '$1\r\n');
            offer.sdp = offer.sdp.replace(/a=rtpmap:116 red\/90000\r\n/g, '');
            offer.sdp = offer.sdp.replace(/a=rtpmap:117 ulpfec\/90000\r\n/g, '');
            offer.sdp = offer.sdp.replace(/a=rtpmap:98 rtx\/90000\r\n/g, '');
            offer.sdp = offer.sdp.replace(/a=fmtp:98 apt=116\r\n/g, '');
        }
        this.pc1.setLocalDescription(offer);
        this.pc2.setRemoteDescription(offer);
        this.pc2.createAnswer().then(
            this.gotAnswer_.bind(this),
            this.test.reportFatal.bind(this.test)
        );
    },

    gotAnswer_: function(answer) {
        if (this.constrainVideoBitrateKbps_) {
            answer.sdp = answer.sdp.replace(
                /a=mid:video\r\n/g,
                'a=mid:video\r\nb=AS:' + this.constrainVideoBitrateKbps_ + '\r\n');
        }
        this.pc2.setLocalDescription(answer);
        this.pc1.setRemoteDescription(answer);
    },

    onIceCandidate_: function(otherPeer, event) {
        if (event.candidate) {
            var parsed = Call.parseCandidate(event.candidate.candidate);
            if (this.iceCandidateFilter_(parsed)) {
                otherPeer.addIceCandidate(event.candidate);
            }
        }
    }
};

Call.noFilter = function() {
    return true;
};

Call.isRelay = function(candidate) {
    return candidate.type === 'relay';
};

Call.isNotHostCandidate = function(candidate) {
    return candidate.type !== 'host';
};

Call.isReflexive = function(candidate) {
    return candidate.type === 'srflx';
};

Call.isHost = function(candidate) {
    return candidate.type === 'host';
};

Call.isIpv6 = function(candidate) {
    return candidate.address.indexOf(':') !== -1;
};

Call.parseCandidate = function(text) {
    var candidateStr = 'candidate:';
    var pos = text.indexOf(candidateStr) + candidateStr.length;
    var fields = text.substr(pos).split(' ');
    return {
        'type': fields[7],
        'protocol': fields[2],
        'address': fields[4]
    };
};

Call.cachedIceServers_ = null;
Call.cachedIceConfigFetchTime_ = null;

Call.asyncCreateTurnConfig = function(onSuccess, onError) {
    var settings = currentTest.settings;
    if (typeof(settings.turnURI) === 'string' && settings.turnURI !== '') {
        var iceServer = {
            'username': settings.turnUsername || '',
            'credential': settings.turnCredential || '',
            'urls': settings.turnURI.split(',')
        };
        var config = {'iceServers': [iceServer]};
        report.traceEventInstant('turn-config', config);
        setTimeout(onSuccess.bind(null, config), 0);
    } else {
        Call.fetchTurnConfig_(function(response) {
            var config = {'iceServers': response.iceServers};
            report.traceEventInstant('turn-config', config);
            onSuccess(config);
        }, onError);
    }
};

Call.asyncCreateStunConfig = function(onSuccess, onError) {
    var settings = currentTest.settings;
    if (typeof(settings.stunURI) === 'string' && settings.stunURI !== '') {
        var iceServer = {
            'urls': settings.stunURI.split(',')
        };
        var config = {'iceServers': [iceServer]};
        report.traceEventInstant('stun-config', config);
        setTimeout(onSuccess.bind(null, config), 0);
    } else {
        Call.fetchTurnConfig_(function(response) {
            var config = {'iceServers': response.iceServers.urls};
            report.traceEventInstant('stun-config', config);
            onSuccess(config);
        }, onError);
    }
};

Call.fetchTurnConfig_ = function(onSuccess, onError) {

    var testRunTime = 240; // Time in seconds to allow a test run to complete.
    if (Call.cachedIceServers_) {
        var isCachedIceConfigExpired =
            ((Date.now() - Call.cachedIceConfigFetchTime_) / 1000 >
                parseInt(Call.cachedIceServers_.lifetimeDuration) - testRunTime);
        if (!isCachedIceConfigExpired) {
            report.traceEventInstant('fetch-ice-config', 'Using cached credentials.');
            onSuccess(Call.getCachedIceCredentials_());
            return;
        }
    }

    var xhr = new XMLHttpRequest();
    function onResult() {
        if (xhr.readyState !== 4) {
            return;
        }

        if (xhr.status !== 200) {
            onError('TURN request failed');
            return;
        }

        var response = JSON.parse(xhr.responseText);
        Call.cachedIceServers_ = response;
        Call.getCachedIceCredentials_ = function() {
            return JSON.parse(JSON.stringify(Call.cachedIceServers_));
        };
        Call.cachedIceConfigFetchTime_  = Date.now();
        report.traceEventInstant('fetch-ice-config', 'Fetching new credentials.');
        onSuccess(Call.getCachedIceCredentials_());
    }

    xhr.onreadystatechange = onResult;
    xhr.open('POST', TURN_URL + API_KEY, true);
    xhr.send();
};

function ConnectionTest(test , stun) {
    this.test = test;
    stun = stun || $("#stunserver").val();
    if (!stun) {
        stun = "stun:webrtc.qq.com:8800";
    }
    this.stun = {
        iceServers: [{
            urls: stun
        }],
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
        tcpCandidatePolicy: "disable",
        IceTransportsType: "nohost"
    };

    this.optional = {
        optional: [{
            DtlsSrtpKeyAgreement: true
        }]
    };

}

ConnectionTest.prototype = {
    run : function () {
        this.createPeerConnection();
    },
    createPeerConnection : function () {
        console.debug('createPeerConnection',this.stun, this.optional)
        var peerConnection = new RTCPeerConnection(this.stun, this.optional);
        peerConnection.onicecandidate = onicecandidate_;
        var offerSdpOption = {
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            voiceActivityDetection : false
        };
        peerConnection.createOffer(offerSdpOption).then(function (offer) {
            console.debug('createOffer',offer)
            peerConnection.setLocalDescription(offer);
        });
        var that = this;
        function onicecandidate_(e) {
            var candidate = e.candidate;
            if (filterIceCandidate_(candidate)) {
                that.test.reportSuccess(candidate.candidate);
                that.test.done();
                peerConnection.close();
            } else {
                that.test.reportInfo(candidate.candidate);
            }
        }
        function getIceCandidateType_(candidate) {
            try {
                var str = candidate.candidate;
                var params = str.split(" ");
                return params[7];
            } catch (e) {
                console.error("Get Ice Candidate Type Error : e = " + e);
                return null;
            }

        }

        function filterIceCandidate_(candidate) {
            var str = candidate.candidate;
            if (str.indexOf("tcp") != -1) {
                return false;
            }
            return true;
        }
    }

};

function WebRTCTest() {
    this.listener = {
        onMessage :null,
        done : null
    };
    this.errorCount = 0;
    this.warnCount = 0;
    this.successCount = 0;
}
WebRTCTest.prototype = {
    reportWarning : function (str) {
        console.error("warning : " + str);
        this.warnCount ++;
        if (this.listener.onMessage) {
            this.listener.onMessage(str);
        }
    },
    reportError : function (str) {
        console.error("error : " + str);
        this.errorCount ++;
        if (this.listener.onMessage) {
            this.listener.onMessage(str);
        }
    },
    reportInfo : function (str) {
        console.error("info : " + str);
        if (this.listener.onMessage) {
            this.listener.onMessage(str);
        }
    },
    reportFatal : function (str) {
        console.error("fatal : " + str);
        this.reportError(str);
        this.done();
    },
    reportSuccess : function (str) {
        console.error("success : " + str);
        this.successCount ++;
        if (this.listener.onMessage) {
            this.listener.onMessage(str);
        }
    },
    done : function () {
        console.error("done !!! ");
        var result = 0;
        if (this.errorCount + this.warnCount > 0 || this.successCount <= 0) {
            console.error("this webrtc test failed!!!");
            result = -1;
        }
        if (this.listener.done) {
            this.listener.done(result);
        }
    },
    setListener : function (listener) {
        this.listener.onMessage = listener.onMessage;
        this.listener.done = listener.done;
    }
};

var report = new Report();