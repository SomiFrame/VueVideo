<template>
    <div class="somi-player-container">
        <div class="somi-player-box">
            <div class="somi-player-display" tabindex="1"
                 v-on:mousemove="sliderMove"
                 v-on:mouseleave="sliderLeave"
                 v-on:mouseup="sliderUp"
                 v-on:keydown="videoKeyDown">
                <div class="somi-controller">
                    <div class="somi-slider-bar"
                         v-on:mousedown="sliderDown">
                        <div class="somi-slider-played" :style="playedStyle"></div>
                        <div v-for="bufferedStyle in player.controller.sliderBar.bufferedStyles"
                             class="somi-slider-buffered" :style="bufferedStyle"></div>
                        <span class="somi-slider-currentTime" :style="getSliderHoverLeft">
                            {{ getSliderCurrentTime }}
                        </span>
                    </div>
                    <button class="somi-main-button" v-on:click="playVideo">
                        <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%" :class="{ 'button-play': player.paused,'button-paused': !player.paused }">
                            <path class="ytp-svg-fill" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" id="ytp-svg-477">
                            </path>
                        </svg>
                    </button>
                    <button class="somi-volume" :class="">
                        <svg class="icon-volume" viewBox="-20 -24 100 110"  fill="currentColor" width="100%" height="100%">
                            <path stroke="#41b883" stroke-width="2" fill="#41b883" stroke-dasharray="988.00 988.00" stroke-dashoffset="988.00"
                                  d="M 0 22 L 12 22 L 32 5 L 32 59 L 12 42 L 0 42"></path>
                        </svg>
                    </button>
                    <div class="videoTime">
                        <span class="videoCurrentTime">{{ stringCurrentTime }}</span>
                        <span class="">/</span>
                        <span class="videoTotalTime">{{ stringDuration }}</span>
                    </div>
                    <button class="somi-fullScreen-button" v-on:click="fullScreen">
                        <svg class="svg-fullScreen" :class="{ fullScreen: player.fullScreen }" height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                            <g class="ytp-fullscreen-button-corner-0">
                                <path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"
                                      id="ytp-svg-19">
                                </path>
                            </g>
                            <g class="ytp-fullscreen-button-corner-1">
                                <path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"
                                      id="ytp-svg-20">

                                </path>
                            </g>
                            <g class="ytp-fullscreen-button-corner-2">
                                <path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"
                                      id="ytp-svg-21">
                                </path>
                            </g>
                            <g class="ytp-fullscreen-button-corner-3">
                                <path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"
                                      id="ytp-svg-22">
                                </path>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
            <video :src="player.videoUrl"
                    v-on:loadstart="v_loadstart"
                    v-on:loadedmetadata="v_loadedmetadata"
                    v-on:waiting="v_waiting"
                    v-on:canplay="v_canplay"
                    v-on:play="v_play"
                    v-on:pause="v_pause"
                    v-on:timeupdate="v_timeupdate"
                    v-on:progress="v_progress">
            </video>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        name: 'somiVideoPlayer',
        data() {
            return {
                player: {
                    dom: null,
                    videoUrl: "http://vjs.zencdn.net/v/oceans.mp4",
                    currentTime: "",
                    videoTotalTime: "",
                    paused: true,
                    fullScreen: false,
                    classVolume: "",//Muted-0%,Low-25%,Medium-50%,default-100%,
                    playerKeyDown: false,
                    controller : {
                        sliderBar: {
                            playedPosition: 0,
                            playedPercentage: 0,
                            bufferedStyles: [],
                            hoverPosition: 0,
                            focus: false
                        },
                        videoTime: {
                            currentTime: 0,
                            duration: 0
                        },
                        fullScreenButton: {

                        }
                    }
                }
            }
        },
        computed: {
            playedStyle: function() {
                return {
                    width: this.player.controller.sliderBar.playedPosition + "px"
                }
            },
            stringCurrentTime() {
                return this.toHHMMSS(this.player.controller.videoTime.currentTime.toString())
            },
            stringDuration() {
                return this.toHHMMSS(this.player.controller.videoTime.duration.toString())
            },
            getSliderHoverLeft() {
                return {
                    left: this.player.controller.sliderBar.hoverPosition + "px"
                }
            },
            getSliderCurrentTime() {
                let percentage = 0;
                if(document.querySelector(".somi-slider-bar")) {
                    percentage = this.player.controller.sliderBar.hoverPosition/document.querySelector(".somi-slider-bar").offsetWidth;
                }
                return this.toHHMMSS(percentage*this.player.controller.videoTime.duration);
            }
        },
        methods: {
            v_loadstart(e) {
                let video = e.srcElement || e.target;
            },
            v_loadedmetadata(e) {
                let video = e.srcElement || e.target;
                this.player.controller.videoTime.duration = video.duration;
                console.log(video.paused)
            },
            v_waiting() {
//                console.log("waiting");
            },
            v_canplay(e) {
                let video = e.srcElement || e.target;
//                console.log("canplay");
            },
            v_play(e) {
                let video = e.srcElement || e.target;
                this.player.paused = video.paused;
            },
            v_pause(e) {
                let video = e.srcElement || e.target;
                this.player.paused = video.paused;
            },
            v_timeupdate(e) {
                let video = e.srcElement || e.target;
                this.player.controller.videoTime.currentTime = video.currentTime;
                this.player.controller.sliderBar.percentage = video.currentTime / video.duration;
                this.player.controller.sliderBar.playedPosition = this.player.controller.sliderBar.percentage
                        * document.querySelector(".somi-slider-bar").offsetWidth;
            },
            v_progress(e) {
                let video = e.srcElement || e.target;
                let bufferedarr = [];
                for(let i=0; i<video.buffered.length;i++) {
                    bufferedarr.push({
                        left: 100*video.buffered.start(i)/video.duration + "%",
                        right: 100*(1-video.buffered.end(i)/video.duration) + "%"
                    });
                }
                this.player.controller.sliderBar.bufferedStyles = bufferedarr;
            },
            playVideo() {
                let video = document.querySelector("video");
                if(video.paused) {
                    video.play();
                }
                else {
                    video.pause();
                }
            },
            fullScreen() {
                let el = document.querySelector(".somi-player-box");
                if (
                        document.fullscreenEnabled ||
                        document.webkitFullscreenEnabled ||
                        document.mozFullScreenEnabled ||
                        document.msFullscreenEnabled
                ) {
                    if (el.requestFullscreen) {
                        el.requestFullscreen();
                    } else if (el.webkitRequestFullscreen) {
                        el.webkitRequestFullscreen();
                    } else if (el.mozRequestFullScreen) {
                        el.mozRequestFullScreen();
                    } else if (el.msRequestFullscreen) {
                        el.msRequestFullscreen();
                    }
                }
            },
            sliderEnter(e) {
                let el = e.srcElment || e.target;
            },
            sliderLeave(e) {
                if(this.player.controller.sliderBar.focus) {
                    let video  = document.querySelector("video");
                    this.player.controller.sliderBar.focus = false;
                    let position = e.clientX - document.querySelector(".somi-player-container").offsetLeft-
                            document.querySelector(".somi-controller").offsetLeft;
                    this.player.controller.sliderBar.hoverPosition = position;
                    video.currentTime = this.player.controller.sliderBar.playedPercentage*video.duration;
                    video.play();
                }
            },
            sliderMove(e) {
                let position = e.clientX - document.querySelector(".somi-player-container").offsetLeft -
                        document.querySelector(".somi-controller").offsetLeft;
                let video = document.querySelector("video");
                this.player.controller.sliderBar.hoverPosition = position;
                if (this.player.controller.sliderBar.focus) {
                    this.player.controller.sliderBar.playedPosition = position;
                    this.player.controller.sliderBar.playedPercentage =
                            position / video.offsetWidth;
                    this.player.controller.videoTime.currentTime = this.player.controller.sliderBar.playedPercentage * video.duration;
                }
            },
            sliderDown(e) {
                let video  = document.querySelector("video");
                let position = e.clientX - document.querySelector(".somi-player-container").offsetLeft-
                        document.querySelector(".somi-controller").offsetLeft;
                this.player.controller.sliderBar.hoverPosition = position;
                if(!video.paused) {
                    video.pause();
                }
                this.player.controller.sliderBar.focus = true;
                this.player.controller.sliderBar.playedPercentage =
                        position/document.querySelector("video").offsetWidth;
            },
            sliderUp(e) {
                if(this.player.controller.sliderBar.focus ) {
                    let video = document.querySelector("video");
                    this.player.controller.sliderBar.focus = false;
                    video.currentTime = this.player.controller.sliderBar.playedPercentage * video.duration;
                    console.log(this.player.controller.sliderBar.playedPercentage * video.duration);
                    video.play();
                }
            },
            videoKeyDown(e) {
                if(this.playerKeyDown) {
                    return;
                }
                else {
                    this.playerKeyDown = true;
                }
                let video = document.querySelector("video");
                console.log(e.keyCode);
                switch (e.keyCode) {
                    case 37: //left
                        if (video.currentTime >= 5) {
                            video.currentTime -= 5;
                        }
                        break;
                    case 38: //up
                        if (video.volume <= .9) {
                            video.volume += .1;
                        }
                        break;
                    case 39: //right
                        if (video.currentTime <= video.duration - 5) {
                            document.querySelector("video").currentTime += 5;
                        }
                        break;
                    case 40: //down
                        if (video.volume >= .1) {
                            video.volume -= .1;
                        }
                        break;
                    case 32:
                        if (video.paused) {
                            video.play();
                        }
                        else {
                            video.pause();
                        }
                }
                this.playerKeyDown = false;
            },
            toHHMMSS (_string) {
                var sec_num = parseInt(_string, 10); // don't forget the second param
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours) {
                    if (hours < 10) {
                        hours = "0" + hours + ":";
                    }
                    else {
                        hours = hours + ":";
                    }
                }
                else {
                    hours = "";
                }
                if (minutes < 10) {
                    minutes = "0" + minutes + ":";
                }
                else {
                    minutes = minutes + ":";
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }

                return hours + minutes + seconds;
            }
        }
    }
</script>
<style lang="scss" scoped>
    $main-color: #41b883;
    $buffered-color: #fff;
    $slider-bar-color: #687f75;
    .somi-player-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 60%;
        font-size: 10px;
        button:focus {
            outline: 0;
        }
        button {
            display: inline-block;
            background-color: transparent;
            border: none;
        }
        .somi-player-box {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #000;
            video {
                width: 100%;
                height: 100%;
            }
            .somi-player-display {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: transparent;
                top: 0;
                left: 0;
                z-index: 1;
                overflow: hidden;
                &:focus {
                    outline: none;
                 }
                .somi-controller {
                    position: absolute;
                    bottom: 0;
                    height: 4em;
                    left: 1em;
                    right: 1em;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==);
                    background-repeat: repeat-x;
                    /*opacity: .7;*/
                    .videoTime {
                        float: left;
                        left: 4em;
                        height: 100%;
                        width: auto;
                        color: $main-color;
                        padding: 0 1em;
                        span {
                             height: 100%;
                            display: inline-block;
                            line-height: 4em;
                        }
                    }
                    .somi-main-button {
                        height: 100%;
                        width: 4em;
                        float: left;
                        .button-play {
                            height:100%;
                            width: 100%;
                            .ytp-svg-fill{
                                transition: .3s;
                                d: path("M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z");
                                fill: $main-color;

                            }
                        }
                        .button-paused {
                            .ytp-svg-fill{
                                transition: .3s;
                                d: path("M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z");
                                fill: $main-color;
                            }
                        }
                    }
                    .somi-volume {
                        height: 100%;
                        width: 4em;
                        float: left;
                        .icon-volume {
                            height: 100%;
                            width: 100%;
                            path {
                                transition: 3s;
                                d: path("M 0 22 L 12 22 L 32 5 L 32 59 L 12 42 L 0 42 M 36,22 A 10,10 0 0 1 36,42 L 36,38 A 5,5 0 0 0 36,26 M 38,14 A 9,10 0 0 1 38,50 L 37,46 A 5,5 0 0 0 37,18 M 41,6  A 11,13 0 0 1 41,58 L 39,54 A 9,10 0 0 0 39,10")
                            }
                            &.muted {
                                path {
                                    d: path("M 0 22 L 12 22 L 32 5 L 32 59 L 12 42 L 0 42");
                                }
                            }
                            &.low {
                            path {
                                d: path("M 0 22 L 12 22 L 32 5 L 32 59 L 12 42 L 0 42 M 36,22 A 10,10 0 0 1 36,42 L 36,38 A 5,5 0 0 0 36,26");
                            }
                            }
                            &.medium {
                            path {
                                d: path("M 0 22 L 12 22 L 32 5 L 32 59 L 12 42 L 0 42 M 36,22 A 10,10 0 0 1 36,42 L 36,38 A 5,5 0 0 0 36,26 M 38,14 A 9,10 0 0 1 38,50 L 37,46 A 5,5 0 0 0 37,18");
                            }
                            }
                        }

                    }
                    .somi-fullScreen-button {
                        height: 100%;
                        width: 4em;
                        float: right;
                        .svg-fullScreen {
                        g {
                            transition: .3s;
                            transform-origin: center;
                            path {
                                fill: $main-color;
                                transition: .3s;
                            }
                        }
                        &.fullScreen {
                            g {
                                transform: rotateZ(180deg);
                            }
                         }
                        }
                    }
                    .somi-slider-bar {
                        width: 100%;
                        height: .4em;
                        background-color: $slider-bar-color;
                        position: absolute;
                        top: -.4em;
                        border-radius: 1em;
                        transition: .1s;
                        cursor: pointer;
                        .somi-slider-played {
                            background-color: $main-color;
                            height: 100%;
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 2;
                            &:after {
                                content: " ";
                                width: 1em;
                                height: 1em;
                                background-color: $main-color;
                                position: absolute;
                                right: -.5em;
                                top: 50%;
                                transform: translateY(-50%);
                                border-radius: 100%;
                             }
                        }
                        .somi-slider-buffered {
                            position: absolute;
                            height: 100%;
                            left: 0;
                            right: 0;
                            background-color: $buffered-color;
                        }
                        .somi-slider-currentTime {
                            height: 2em;
                            line-height: 2em;
                            width: auto;
                            padding: 0 .5em;
                            color: $main-color;
                            top: -3em;
                            background-color: #000;
                            position: absolute;
                            visibility: hidden;
                            border:.1em solid $main-color;
                            border-radius: .3em;
                            transform: translateX(-50%);
                        }
                    }
                    .somi-slider-bar:hover {
                        height: .7em;
                        top: -.7em;
                        .somi-slider-played {
                            &:after {
                                height: 2em;
                                width: 2em;
                                right: -1em;
                             }
                        }
                        .somi-slider-currentTime {
                            visibility: visible;
                        }
                    }
                }
            }
        }
    }
</style>