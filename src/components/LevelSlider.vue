<template>
  <div>
    <div class="level-bar"></div>
    <DragableElementOnYAxis :innerText="letter" :positionOffset="positionOffset" :height="height" :videoIdentificator="videoIdentificator" />
  </div>
</template>

<style>
  .level-bar {
    border-left: 10px #999999 solid;
    border-radius: 10px;
    box-sizing: border-box;
    height: v-bind(levelBarHeight);
  }
</style>

<script>
import {
  defineComponent,
  ref
} from "vue";
import DragableElementOnYAxis from './DragableElementOnYAxis.vue';

export default defineComponent({
  name: "TimelineKeyboard",
  components: {
    DragableElementOnYAxis
  },
  props: {
    letter: String,
    positionOffset: Number,
    height: Number,
    videoIdentificator: String
  },
  setup(props) {
    var levelBarHeight = ref((props.height - 100).toString()+"px")
    return {
      levelBarHeight
    };
  },
});
</script>
