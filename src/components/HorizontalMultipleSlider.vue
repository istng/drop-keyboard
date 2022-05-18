<template>
    <Slider v-model="value" :format="format" :min='0' :max='maxLength' :lazy="false" @update="onUpdateValues" />
</template>

<script>
import Slider from '@vueform/slider';

export default {
  name: 'HorizontalMultipleSlider',
  components: {
    Slider,
  },
  props: {
    identificator: String,
    tooltipKey: String,
    start: Number,
    end: Number,
    maxLength: Number,
    updateLoopSegment: Function
  },
  setup(props) {
    var value = [props.start, props.end];
    var onUpdateValues = (e) => {
      props.updateLoopSegment(props.identificator, props.tooltipKey, e[0], e[1]);
    };
    var format = () => {
      return props.tooltipKey;
    };
    return {
      value,
      onUpdateValues,
      format
    };
  }
}
</script>

<style scoped>
</style>
<style src="@vueform/slider/themes/default.css"></style>