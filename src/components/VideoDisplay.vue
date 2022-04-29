<template>
  <div>
    <video
      ref="videoPlayer"
      id="video"
      controls
      class="video-js vjs-default-skin vjs-16-9"
    >
    </video>
    <TimelineKeyboard v-if="timelineLength!=0" :timelineLength="timelineLength" :buttonLetters="buttonLetters"
    />
        <div>{{ buttonLetters }}</div>
  </div>
</template>

<style>
</style>

<script>
import {
  defineComponent,
  onMounted,
  ref
} from "vue";
import TimelineKeyboard from './TimelineKeyboard.vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// eslint-disable-next-line no-unused-vars
import videojsYoutube from "videojs-youtube";
import abLoopPlugin from "videojs-abloop";
abLoopPlugin(window, videojs);

export default defineComponent({
  name: "VideoDisplay",
  components: {
    TimelineKeyboard
  },
  props: {
    videoUrl: String,
    buttonLetters: Array
  },
  setup(props) {
    var videoPlayer = ref(null);
    var timelineLength = ref(0);

    onMounted(() => {
      var videoElement = videoPlayer.value;
      var player = videojs(videoElement, {
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
        this.abLoopPlugin.setStart(props.buttonLetters[0].time).setEnd(props.buttonLetters[1].time).playLoop();
      });
      player.on('loadedmetadata', function() {
        timelineLength.value = player.duration();
      });
      props.buttonLetters.forEach((buttonLetter, index) => {
        document.addEventListener('keydown', (e) => {
            console.log(e.key)
            if(e.key == buttonLetter.key) {
                player.abLoopPlugin.setStart(buttonLetter.time);
                player.abLoopPlugin.setEnd(props.buttonLetters[index+1].time);
                player.currentTime(buttonLetter.time);
                player.play();
            }
        });
      })
    });
    return {
      videoPlayer,
      timelineLength
    };
  },
});
</script>
