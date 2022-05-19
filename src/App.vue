<template>
  <div class="app-container">
    <div class="videos-container">
      <VideoDisplay class="video-display" v-for="keyboardData in keyboard" 
        :identificator='keyboardData.videoIdentificator' 
        :key='keyboardData.videoIdentificator'
        :loopKey='keyboardData.loopKey'
        :keys='keyboardData.keys'
        :updateLoopSegment='updateLoopSegment'
         />
    </div>
    <div class="contact">
      <a href="https://ivangk.web.app" target=”_blank”><font-awesome-icon :icon="['fas', 'user']"/></a> <a href="https://www.youtube.com/channel/UC0paZQh-P3ruttlq26UmNig" target=”_blank”><font-awesome-icon :icon="['fab', 'youtube']"/></a> <a href="https://www.instagram.com/ivangk.gk/" target=”_blank”><font-awesome-icon :icon="['fab', 'instagram']"/></a> <a href="https://github.com/istng" target=”_blank”><font-awesome-icon :icon="['fab', 'github']"/></a>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInstagram, faYoutube, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faInstagram);
library.add(faYoutube);
library.add(faGithub);
library.add(faUser);
import VideoDisplay from './components/VideoDisplay.vue'

export default {
  name: 'App',
  components: {
    FontAwesomeIcon,
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
  border: 0;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  overflow: hidden;
}
.app-container {
  width: 100vw;
  height: 100vh;
}
.videos-container {
  display: grid;
  grid-template-columns: repeat(2, 33%);
  grid-template-rows: repeat(2, 55%);
  justify-content: center;
  grid-column-gap: 25px;
  grid-row-gap: 10px;
}
.video-display {
  text-align: center;
}
.contact {
  margin-top: 6vh;
  margin-bottom: 0.6rem; 
  color: white;
  word-spacing: 0.8rem;
  justify-self: center;
  align-self: center;
  text-align: center;
}
a, a:hover, a:visited, a:active {
  color: inherit;
  text-decoration: none;
 }
</style>
