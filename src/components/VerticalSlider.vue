<template>
    <input class="vertical-slider" orient="vertical" type="range" :value="level" @input="changeParentLevel" :min='minLevel' :max='maxLevel' step="0.01">
</template>

<script>
import {
  ref
} from 'vue';

export default {
  name: 'VerticalSlider',
  props: {
    minLevel: Number,
    maxLevel: Number,
    identificator: String,
    changeParentLevel: Function
  },
  setup() {
    var level = ref(1);
    return {
      level
    };
  }
}
</script>

<style scoped>
  .vertical-slider {
    -webkit-appearance: slider-vertical;
  }
</style>
