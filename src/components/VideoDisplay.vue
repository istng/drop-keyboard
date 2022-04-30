<template>
  <div>
    <video
      ref="videoPlayer"
      id="video"
      controls
      class="video-js vjs-default-skin vjs-16-9"
    >
    </video>
    <div class="url-and-loop-key-container">
      <div></div> <input class="video-url-input" v-model="videoUrl" placeholder="{{defaultVideoUrl}}"> <p class="loop-key"> T </p>
    </div>
    <TimelineKeyboard v-if="timelineLength!=0" :timelineLength="timelineLength" :buttonLetters="buttonLetters"
    />
  </div>
</template>

<style>
.url-and-loop-key-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.video-url-input {
  border-radius: 5px;
  align-self: center;
  margin-right: 10px;
}
.loop-key {
  align-self: center;
  justify-self: start;
  background: blue;
  border-radius: 5px;
  padding: 4px;
  text-align: center;
}
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
    defaultVideoUrl: String,
    buttonLetters: Array
  },
  setup(props) {
    var videoPlayer = ref(null);
    var timelineLength = ref(0);
    var videoUrl = ref(props.defaultVideoUrl);

    onMounted(() => {
      var videoElement = videoPlayer.value;
      var player = videojs(videoElement, {
        "techOrder": ["youtube"],
        "sources": [{
          "type": "video/youtube",
          "src": props.defaultVideoUrl
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
                player.abLoopPlugin.playLoop();
                player.play();
            }
        });
      })
      document.addEventListener('keydown', (e) => {
          console.log(e.key)
          if(e.key == 't') {
              player.abLoopPlugin.togglePauseAfterLooping();   
          }
      });
    });

    return {
      videoPlayer,
      timelineLength,
      videoUrl
    };
  },
});
</script>
