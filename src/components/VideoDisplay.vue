<template>
  <div class="video-display-container">
    <div class="video-and-levels">
      <VideoJS :videoUrl='videoUrl' :loopStart='0' :loopEnd='5' :loopEnabled='true' :identificator='identificator' :speedRate='speedRate' :volumeLevel='volumeLevel'  :loopKey='loopKey' />
      <VerticalSlider class="speed" :changeParentLevel='changeSpeedLevel' :minLevel='0.0' :maxLevel='2.0' />
      <VerticalSlider class="volume" :changeParentLevel='changeVolumeLevel' :minLevel='0.0' :maxLevel='1.0'/>
    </div>
    <div class="url-and-loop-key">
      <UrlInput :changeParentLevel='changeVideoUrl' :videoUrl='videoUrl' />
      <p class="loop-key" >{{loopKey}}</p>
    </div>
    <div v-if="videoLength != 0" class="horizontal-sliders-container">
      <HorizontalMultipleSlider class="horizontal-slider" v-for="k in keys" 
        :key='k.key'
        :identificator='identificator'
        :tooltipKey='k.key'
        :start='k.start'
        :end='k.end'
        :maxLength='videoLength'
        :updateLoopSegment='updateLoopSegment'
      />
    </div>
  </div>
</template>

<script>
import {
  ref
} from 'vue';
import VideoJS from './VideoJS.vue';
import VerticalSlider from './VerticalSlider.vue';
import HorizontalMultipleSlider from './HorizontalMultipleSlider.vue';
import UrlInput from './UrlInput.vue';

export default {
  name: 'VideoDisplay',
  components: {
    VideoJS,
    VerticalSlider,
    HorizontalMultipleSlider,
    UrlInput
  },
  props: {
    identificator: String,
    loopKey: String,
    keys: Array,
    updateLoopSegment: Function,
  },
  setup(props) {
    var videoUrl = ref("https://www.youtube.com/watch?v=U1FxfR3lg6Q");
    var speedRate = ref(1.0);
    var volumeLevel = ref(1.0);
    var videoLength = ref(0);

    const changeVideoUrl = (url) => {
      //watch on VideoJS does not actually change the video without reloading dom
      document.dispatchEvent(new CustomEvent('video-url-change'+props.identificator, {'detail': {'url':url.target.value}}));
    };
    const changeSpeedLevel = (level) => {
      speedRate.value = parseFloat(level.target.value);
    };
    const changeVolumeLevel = (level) => {
      volumeLevel.value = parseFloat(level.target.value);
    };

    document.addEventListener('keydown', (e) => {
        if(e.key.toUpperCase() == props.loopKey) {
          document.dispatchEvent(new CustomEvent('toggle-loop'+props.identificator));
        }
    });

    props.keys.forEach(key => {
      document.addEventListener('keydown', (e) => {
          if(e.key.toUpperCase() == key.key) {
            document.dispatchEvent(new CustomEvent('change-loop-segment'+props.identificator, {'detail': {'start': key.start, 'end': key.end}}));
          }
      });      
    })

    document.addEventListener('change-video-length'+props.identificator, (e) => {
      videoLength.value = e.detail;
    });

    return {
      videoUrl,
      speedRate,
      volumeLevel,
      changeSpeedLevel,
      changeVolumeLevel,
      changeVideoUrl,
      videoLength
    };
  }
}
</script>

<style scoped>
  .video-display-container {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  }
  .video-and-levels {
    display: grid;
    grid-template-columns: 92% 20px 20px;
    grid-template-rows: repeat(1, 1fr);
    column-gap: 10px;
  }
  .url-and-loop-key {
    display: flex;
    justify-content: center;
    column-gap: 30px;
    align-items: center;
  }
  .horizontal-sliders-container {
    margin-top: 30px;
    display: grid;
    grid-template-rows: repeat(1, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
  .horizontal-slider {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }
  .loop-key {
    align-self: center;
    justify-self: start;
    background: #4b6aba;
    font-weight: bold;
    border-radius: 5px;
    padding: 4px;
    text-align: center;
    color: white;
  }
</style>
