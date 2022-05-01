<template>
  <div>
    <div class="timeline-bar">
    <div class="under-timeline-bar">
      <p id="timeline-length-start">0</p>
      <div class="timeline-buttons-container" id="timeline-buttons-container">
        <DragableElementOnXAxis v-for="buttonLetter in buttonLetters" :key="buttonLetter.letter" :innerText="buttonLetter.letter" :totalLength="timelineLength" :positionOffset="buttonLetter.time" :width="width" :videoIdentificator="videoIdentificator" />
      </div>
      <p id="timeline-length-end">{{timelineLength}}</p>
    </div>
    </div>
  </div>
</template>

<style>
  .timeline-bar {
    border-bottom: 10px #64a2bb solid;
    border-radius: 100px;
    box-sizing: border-box;
    width: 90%;
    margin-left: 5%;
    position: relative;
  }
  .under-timeline-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .timeline-buttons-container {
    position: absolute;
  }
  #timeline-length-start {
    justify-self: start;
    position: absolute;
    color: aliceblue;
  }
  #timeline-length-end {
    justify-self: end;
    position: absolute;
    color: aliceblue;
  }
</style>

<script>
import {
  defineComponent
} from "vue";
import DragableElementOnXAxis from './DragableElementOnXAxis.vue';

export default defineComponent({
  name: "TimelineKeyboard",
  components: {
    DragableElementOnXAxis
  },
  props: {
    buttonLetters: Array,
    timelineLength: Number,
    width: Number,
    videoIdentificator: String
  },
  setup() {
    return {
    };
  },
});
</script>
