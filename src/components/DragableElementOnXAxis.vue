<template id="myComponent">
    <h3  ref="el" class="dragableX" :style="style" v-bind:id='innerText.split(" ")[1]' >{{innerText[0].toUpperCase()}}</h3>
</template>

<style>
.dragableX {
  border-radius: 16px;
  touch-action: none;
  user-select: none;
  -webkit-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
  transition: transform 0.1s ease-in, box-shadow 0.1s ease-out;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
}

pre {
  overflow: hidden;
  font-size: 10px;
}

#start {
  background-color: #7ddf92;
}
#end {
  background-color: #e4513f;
}
</style>

<script>
import {
  defineComponent,
    reactive,
    computed,
    ref,
    watch
} from "vue";

const makeDragable = (element, innerText, videoWidth, oldvideoWidth, positionOffset, totalLength) => {
  const position = reactive({
    init: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isDraging: false,
    dragStartX: null,
    dragStartY: null
  });

  const style = computed(() => {
    if (position.init) {
      return {
        position: "absolute",
        left: position.x + "px",
        "box-shadow": position.isDraging ? "3px 6px 16px rgba(0, 0, 0, 0.15)" : "",
        "transform": position.isDraging ? "translate(-3px, -6px)" : "",
        "cursor": position.isDraging ? "grab" : "pointer",
      };
    }
    return {};
  });

  const onMouseDown = e => {
    e.stopPropagation();
    let {
      clientX
    } = e;
    position.dragStartX = clientX - position.x;

    position.isDraging = true;

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  };

  const onMouseMove = e => {
    e.stopPropagation();
    let {
      clientX
    } = e;
    position.x = clientX - position.dragStartX;
    positionOffset = ( position.x / videoWidth.value - 0.05 ) * ( totalLength / 0.9 );
    console.log(positionOffset)
    document.dispatchEvent(new CustomEvent('segment-offset-change', {'detail': {'time':positionOffset,'letter':innerText}}));
  };

  const onMouseUp = e => {
    e.stopPropagation();
    position.isDraging = false;
    position.dragStartX = null;
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  };

  const onResize = () => {
    position.x = position.x * ( videoWidth.value / oldvideoWidth.value );
  };

  watch(element, element => {
    if (!(element instanceof HTMLElement)) return;
    let rect = element.getBoundingClientRect(element);
    position.init = true;
    if(totalLength > 0) {
      position.x = videoWidth.value * ( (positionOffset / totalLength) * 0.9 + 0.05);
    }
    position.width = Math.round(rect.width);
    position.height = Math.round(rect.height);

    element.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", onResize);
  });

  watch(videoWidth, (videoWidth, oldvideoWidth) => {
    console.log('watch windoWidth', videoWidth, oldvideoWidth)
  })

  return {
    position,
    style
  };
};

export default defineComponent({
  name: "DragableElementOnXAxis",
  props: {
    innerText: String,
    positionOffset: Number,
    totalLength: Number,
    width: Number
  },
  setup(props) {
      var videoWidth = ref(props.width);
      var oldvideoWidth = ref(props.width);
      const el = ref(null);
      const {
      position,
      style
      } = makeDragable(el, props.innerText, videoWidth, oldvideoWidth, props.positionOffset, props.totalLength);

      return {
      el,
      position,
      style,
      videoWidth,
      oldvideoWidth
      };
  },
});
</script>
