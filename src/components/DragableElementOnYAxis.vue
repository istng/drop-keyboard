<template id="myComponent">
    <h3  ref="el" class="dragableY" :style="style">{{innerText}}</h3>
</template>

<style>
.dragableY {
  color: black;
  background-color: #666666;
  border-radius: 16px;
  touch-action: none;
  user-select: none;
  -webkit-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
  transition: transform 0.1s ease-in, box-shadow 0.1s ease-out;
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 2px;
}

pre {
  overflow: hidden;
  font-size: 10px;
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

const makeDragable = (element, innerText, videoHeight, positionOffset) => {
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
        top: position.y + "px",
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
      clientY
    } = e;
    position.dragStartY = clientY - position.y;

    position.isDraging = true;

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
  };

  const onMouseMove = e => {
    e.stopPropagation();
    let {
      clientY
    } = e;
    position.y = clientY - position.dragStartY;
    document.dispatchEvent(new CustomEvent('level-offset-change', {'detail': {'level':((videoHeight.value - position.y) / (videoHeight.value - 100)).toFixed(2),'letter':innerText}}));
  };

  const onMouseUp = e => {
    e.stopPropagation();
    position.isDraging = false;
    position.dragStartY = null;
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  };

  watch(element, element => {
    if (!(element instanceof HTMLElement)) return;
    let rect = element.getBoundingClientRect(element);
    position.init = true;
    position.y = videoHeight.value - positionOffset * ( videoHeight.value - 100);
    position.width = Math.round(rect.width);
    position.height = Math.round(rect.height);

    element.addEventListener("mousedown", onMouseDown);
  });

  return {
    position,
    style
  };
};

export default defineComponent({
  name: "DragableElementOnYAxis",
  props: {
    innerText: String,
    positionOffset: Number,
    height: Number
  },
  setup(props) {
      var videoHeight = ref(props.height);

      const el = ref(null);
      const {
      position,
      style
      } = makeDragable(el, props.innerText, videoHeight, props.positionOffset);

      return {
      el,
      position,
      style,
      videoHeight,
      };
  },
});
</script>
