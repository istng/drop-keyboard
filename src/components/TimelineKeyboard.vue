<template>
  <div>
    <div class="timeline-bar"></div>
    <div class="under-timeline-bar">
      <p id="timeline-length-start">0</p>
      <div class="timeline-buttons-container" id="timeline-buttons-container">
        <DragableElement v-for="buttonLetter in buttonLetters" :key="buttonLetter.letter" :innerText="buttonLetter.letter" :totalLength="timelineLength" :positionOffset="buttonLetter.time" v-bind:id="'timeline-button-' + buttonLetter.letter" @offset-change="logTimeChange"  />
      </div>
      <p id="timeline-length-end">{{timelineLength}}</p>
    </div>
  </div>
</template>

<style>
  .timeline-bar {
    margin-top: 10px;
    border-bottom: 10px red solid;
    border-radius: 100px;
    box-sizing: border-box;
    width: 90%;
    margin-left: 5%;
  }
  .under-timeline-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .timeline-buttons-container {
    justify-self: center;
    display: flex;
  }
  #timeline-length-start {
    justify-self: start;
    position: absolute;
    left: 5%;
  }
  #timeline-length-end {
    justify-self: end;
    position: absolute;
    left: 94%;
  }
</style>

<script>
import {
  defineComponent,
} from "vue";
import DragableElement from './DragableElement.vue';

export default defineComponent({
  name: "TimelineKeyboard",
  components: {
    DragableElement
  },
  props: {
    buttonLetters: Array,
    timelineLength: Number
  },
  setup() {
    const logTimeChange = e => {
      console.log('func',e);
    }

    return {
      logTimeChange
    };
  },
});
</script>
