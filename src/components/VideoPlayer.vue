<template>
    <div class="somi-player-container">
        <div class="somi-player-box">
            <div class="somi-player-display">
                <div class="somi-controller">
                    <div class="videoTime">
                        <span class="videoCurrentTime">00:00</span>
                        <span class="videoTotalTime">00:00</span>
                    </div>
                </div>
            </div>
            <video :src="player.videoUrl"></video>
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
                    duration: 0,
                    controller : {
                        sliderBar: {

                        },
                        videoTime: {
                            currentTime: "",
                            totalTime: ""
                        },
                        fullScreenButton: {

                        }

                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .somi-player-container {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 60%;
        font-size: 10px;
        .somi-player-box {
            position: absolute;
            width: 100%;
            height: 100%;
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
                .somi-controller {
                    position: absolute;
                    bottom: 0;
                    height: 4em;
                    width: 100%;
                    background-color: #000;
                    opacity: .7;

                }
            }
        }
    }
</style>