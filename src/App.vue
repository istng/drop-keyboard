<template>
  <div>
    <VideoDisplay class="video-display" :defaultVideoUrl="firstVideoUrl" :buttonLetters="firstVideoButtonLetters" />
  </div>
</template>

<script>
import {
  ref
} from "vue";
import VideoDisplay from './components/VideoDisplay.vue';

export default {
  name: 'App',
  components: {
    VideoDisplay
  },
  setup() {
    var firstVideoButtonLetters = ref([{
          letter: 'q start',
          time: 2,
          key: 'q'
        }, {
          letter: 'q end',
          time: 4
        }, {
          letter: 'w start',
          time: 7,
          key: 'w'
        }, {
          letter: 'w end',
          time: 10
        },       {
          letter: 'e start',
          time: 14,
          key: 'e'
        }, {
          letter: 'e end',
          time: 22
        }, {
          letter: 'r start',
          time: 33,
          key: 'r'
        },       {
          letter: 'r end',
          time: 37
        }
      ]);
      document.addEventListener('segment-offset-change', (e) => {
        firstVideoButtonLetters.value.find(buttonLetter => buttonLetter.letter == e.detail.letter).time = e.detail.time;
        //player.abLoopPlugin.setStart(e.detail.time)
        console.log(e.detail);
      });
      document.addEventListener('level-offset-change', (e) => {
        //player.abLoopPlugin.setStart(e.detail.time)
        console.log(e.detail);
      });
    var firstVideoUrl = 'https://www.youtube.com/watch?v=U1FxfR3lg6Q';
      return {
        firstVideoUrl,
        firstVideoButtonLetters
      };
  }
}
</script>

<style>
body, html {
  padding: 0;
  margin: 0;
  background: #2a2930;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
