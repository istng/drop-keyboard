<template>
  <div>
    <video
      v-bind:id="'video'+identificator"
      class="video-js vjs-default-skin vjs-16-9"
    >
    </video>
  </div>
</template>

<style scoped>
</style>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  watch
} from "vue";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// eslint-disable-next-line no-unused-vars
import videojsYoutube from "videojs-youtube";
import abLoopPlugin from "videojs-abloop";
abLoopPlugin(window, videojs);

export default defineComponent({
  name: "VideoJS",
  props: {
    videoUrl: String,
    loopStart: Number,
    loopEnd: Number,
    loopEnabled: Boolean,
    identificator: String,
    speedRate: Number,
    volumeLevel: Number
  },
  setup(props) {
    var videoElement = ref(null)
    var player = null;

    onMounted(() => {
      videoElement = document.getElementById("video"+props.identificator);
      player = videojs(videoElement, {
        "techOrder": ["youtube"],
        "sources": [{
          "type": "video/youtube",
          "src": props.videoUrl
        }],
        plugins: {
          abLoopPlugin: {}
        }
      }, () => {
        player.log('onPlayerReady', 'this');
      });
      player.ready(function () {
        this.abLoopPlugin.setStart(props.loopStart).setEnd(props.loopEnd).enable();
        
        //watch on VideoJS does not actually change the video without reloading dom
        document.addEventListener('video-url-change'+props.identificator, (e) => {
          this.src({src: e.detail.url, type: "video/youtube"});
        });

        document.addEventListener('toggle-loop'+props.identificator, () => {
          this.abLoopPlugin.togglePauseAfterLooping();
        });
      });

      player.on('loadedmetadata', function() {
        document.dispatchEvent(new CustomEvent('change-video-length'+props.identificator, {'detail': player.duration()}));
      });

      document.addEventListener('change-loop-segment'+props.identificator, (e) => {
        player.abLoopPlugin.setStart(e.detail.start);
        player.abLoopPlugin.setEnd(e.detail.end);
        player.abLoopPlugin.playLoop();
      });

      player.playbackRate(props.speedRate);
      player.volume(props.volumeLevel);
    });

    watch(() => props.volumeLevel, (oldLevel, newLevel) => {
      player.volume(newLevel);
    });
    watch(() => props.speedRate, (oldLevel, newLevel) => {
      player.playbackRate(newLevel);
    });


    return {
      videoElement,
      player
    };
  },
});
</script>
