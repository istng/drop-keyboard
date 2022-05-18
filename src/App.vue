<template>
  <div class="videos-container">
    <VideoDisplay class="video-display" v-for="keyboardData in keyboard" 
      :identificator='keyboardData.videoIdentificator' 
      :key='keyboardData.videoIdentificator'
      :loopKey='keyboardData.loopKey'
      :keys='keyboardData.keys'
      :updateLoopSegment='updateLoopSegment'
       />
  </div>
</template>

<script>
import VideoDisplay from './components/VideoDisplay.vue'

export default {
  name: 'App',
  components: {
    VideoDisplay
  },
  setup() {
    
    var keyboard = [
      {
        videoIdentificator: 0,
        loopKey: "T",
        keys: [
          {
            key: "Q",
            start: 0,
            end: 5
          },
          {
            key: "W",
            start: 7,
            end: 10
          },
          {
            key: "E",
            start: 12,
            end: 16
          },
          {
            key: "R",
            start: 18,
            end: 23
          }
        ]
      },
      {
        videoIdentificator: 1,
        loopKey: "Y",
        keys: [
          {
            key: "U",
            start: 0,
            end: 5
          },
          {
            key: "I",
            start: 7,
            end: 10
          },
          {
            key: "O",
            start: 12,
            end: 16
          },
          {
            key: "P",
            start: 18,
            end: 23
          }
        ]
      },
      {
        videoIdentificator: 2,
        loopKey: "G",
        keys: [
          {
            key: "A",
            start: 0,
            end: 5
          },
          {
            key: "S",
            start: 7,
            end: 10
          },
          {
            key: "D",
            start: 12,
            end: 16
          },
          {
            key: "F",
            start: 18,
            end: 23
          }
        ]
      },
      {
        videoIdentificator: 3,
        loopKey: "H",
        keys: [
          {
            key: "J",
            start: 0,
            end: 5
          },
          {
            key: "K",
            start: 7,
            end: 10
          },
          {
            key: "L",
            start: 12,
            end: 16
          },
          {
            key: ";",
            start: 18,
            end: 23
          }
        ]
      }
    ];

    const updateLoopSegment = (identificator, key, newStart, newEnd) => {
      keyboard[identificator].keys.forEach(k => {
        if(k.key == key) {
          k.start = newStart;
          k.end = newEnd;
        }
      });
    }

    return {
      keyboard,
      updateLoopSegment
    };
  }
}
</script>

<style>
body, html {
  background: #2a2930;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.videos-container {
  display: grid;
  grid-template-columns: repeat(2, 35%);
  grid-template-rows: repeat(2, 35%);
  justify-content: center;
  gap: 20px;
}
.video-display {
  align-self: center;
}
</style>
