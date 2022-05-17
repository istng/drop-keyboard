<template>
  <div class="video-display-container">
    <div>
      <video
        ref="videoPlayer"
        v-bind:id="'video'+identificator"
        class="video-js vjs-default-skin vjs-16-9"
      >
      </video>
      <div class="url-and-loop-key-container">
        <div></div> <input class="video-url-input" v-model="videoUrl" placeholder="{{defaultVideoUrl}}"  @input="changeVideoUrlEvent"> <p class="loop-key"> {{loopButton.toUpperCase()}} </p>
      </div>
      <TimelineKeyboard v-if="timelineLength!=0 && videoWidth!=0" :timelineLength="timelineLength" :buttonLetters="buttonLetters" :width="videoWidth" :videoIdentificator="identificator"
      />
    </div>
    <LevelSlider v-if="videoHeight!=0" class="level-slider" :height="videoHeight" :letter="'S'" :positionOffset="0.5" :videoIdentificator="identificator" />
    <LevelSlider v-if="videoHeight!=0" class="level-slider volume-slider" :height="videoHeight" :letter="'V'" :positionOffset="0.97" :videoIdentificator="identificator" />
  </div>
</template>

<style>
.video-display-container {
  display: grid;
  grid-template-columns: 1fr fit-content(20px) fit-content(20px);
  column-gap: 10px;
}
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
  background: #4b6aba;
  font-weight: bold;
  border-radius: 5px;
  padding: 4px;
  text-align: center;
}
.level-slider {
  align-self: center;
}
.volume-slider {
  padding-right: 10px;
}
</style>

<script>
import {
  defineComponent,
  onMounted,
  ref
} from "vue";
import TimelineKeyboard from './TimelineKeyboard.vue';
import LevelSlider from "./LevelSlider"
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
// eslint-disable-next-line no-unused-vars
import videojsYoutube from "videojs-youtube";
import abLoopPlugin from "videojs-abloop";
abLoopPlugin(window, videojs);

export default defineComponent({
  name: "VideoDisplay",
  components: {
    TimelineKeyboard,
    LevelSlider
  },
  props: {
    defaultVideoUrl: String,
    buttonLetters: Array,
    identificator: String,
    loopButton: String
  },
  setup(props) {
    var videoPlayer = ref(null);
    var timelineLength = ref(0);
    var videoUrl = ref(props.defaultVideoUrl);
    var level = ref(0);
    var videoWidth = ref(0);
    var videoHeight = ref(0);
    var lastKeyPressed = ref(props.buttonLetters[0].key);

    const changeVideoUrlEvent = (e) => {
      document.dispatchEvent(new CustomEvent('video-url-change', {'detail': {'url':e.data, 'video':props.identificator}}));
    };

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
        document.dispatchEvent(new CustomEvent('total-length-change', {'detail': {'length':timelineLength.value, 'video':props.identificator}}));
      });

      props.buttonLetters.forEach((buttonLetter, index) => {
        document.addEventListener('keydown', (e) => {
            if(e.key == buttonLetter.key) {
              lastKeyPressed.value = buttonLetter.key;
              player.abLoopPlugin.setStart(buttonLetter.time);
              player.abLoopPlugin.setEnd(props.buttonLetters[index+1].time);
              player.abLoopPlugin.playLoop();
            }
        });
      })

      videoWidth.value = player.currentWidth();
      videoHeight.value = player.currentHeight();
      
      document.addEventListener('keydown', (e) => {
          if(e.key == props.loopButton) {
              player.abLoopPlugin.togglePauseAfterLooping();   
          }
      });

      document.addEventListener('level-offset-change', (e) => {
        if(e.detail.video == props.identificator) {
          if(e.detail.letter == "S") {
            player.playbackRate(e.detail.level * 2);
          }
          if(e.detail.letter == "V") {
            player.volume(e.detail.level);
          }
        }
      });

      document.addEventListener('video-url-change', (e) => {
        if(e.detail.video == props.identificator)
          player.src({src: e.detail.url, type: "video/youtube"});
      });
    });

    return {
      videoPlayer,
      timelineLength,
      videoUrl,
      level,
      videoWidth,
      videoHeight,
      lastKeyPressed,
      changeVideoUrlEvent
    };
  },
});
</script>
