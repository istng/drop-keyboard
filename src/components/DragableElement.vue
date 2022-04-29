<template id="myComponent">
    <h3  ref="el" class="dragable" :style="style">{{innerText}}</h3>
</template>

<style>
.dragable {
  color: rgb(6, 19, 29);
  background-color: rgb(187, 195, 209);
  border-radius: 16px;
  touch-action: none;
  user-select: none;
  -webkit-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
  transition: transform 0.1s ease-in, box-shadow 0.1s ease-out;
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
    watch,
    onMounted
} from "vue";

const makeDragable = (element, innerText, windowWidth, oldWindowWidth, positionOffset, totalLength, handleUpdate) => {
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
      //console.log('computed init', position);
      return {
        position: "absolute",
        left: position.x + "px",
        //top: position.y + "px",
        //width: position.width + "px",
        //height: position.height + "px",
        "box-shadow": position.isDraging ? "3px 6px 16px rgba(0, 0, 0, 0.15)" : "",
        "transform": position.isDraging ? "translate(-3px, -6px)" : "",
        "cursor": position.isDraging ? "grab" : "pointer",
      };
    }
    //console.log('computed not init')
    return {};
  });

  const onMouseDown = e => {
    //console.log('mousedown')
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
    //console.log('mousemove')
    e.stopPropagation();
    let {
      clientX
    } = e;
    position.x = clientX - position.dragStartX;
    positionOffset = ( position.x / windowWidth.value - 0.05 ) * ( totalLength / 0.9 );
    console.log(positionOffset)
    document.dispatchEvent(new CustomEvent('offset-change', {'detail': {'time':positionOffset,'letter':innerText}}));
    handleUpdate({'time':positionOffset,'letter':innerText});
  };

  const onMouseUp = e => {
    //console.log('mouseup')
    e.stopPropagation();
    position.isDraging = false;
    position.dragStartX = null;
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  };

  const onResize = () => {
    //console.log('resize')
    //console.log(position.x, windowWidth.value)
    position.x = position.x * ( windowWidth.value / oldWindowWidth.value );
  };

  watch(element, element => {
    //console.log('watch')
    if (!(element instanceof HTMLElement)) return;
    //console.log('watch things')
    let rect = element.getBoundingClientRect(element);
    position.init = true;
    if(totalLength > 0) {
      position.x = windowWidth.value * ( (positionOffset / totalLength) * 0.9 + 0.05);
    }
    console.log('hijo de puta', windowWidth.value , positionOffset , totalLength)
    position.width = Math.round(rect.width);
    position.height = Math.round(rect.height);

    element.addEventListener("mousedown", onMouseDown);
    window.addEventListener("resize", onResize);
  });

  watch(windowWidth, (windowWidth, oldWindowWidth) => {
    console.log('watch windoWidth', windowWidth, oldWindowWidth)
  })

  //console.log('last return', position)
  return {
    position,
    style
  };
};

export default defineComponent({
  name: "DragableElement",
  props: {
    innerText: String,
    positionOffset: Number,
    totalLength: Number
  },
  setup(props, context) {
      var windowWidth = ref(window.innerWidth);
      var oldWindowWidth = ref(window.innerWidth);
      const handleUpdate = (value) => {
        context.emit('offset-change', value)
      }
      const el = ref(null);
      const {
      position,
      style
      } = makeDragable(el, props.innerText, windowWidth, oldWindowWidth, props.positionOffset, props.totalLength, handleUpdate);

      onMounted(() => {
        window.addEventListener('resize', () => {
          oldWindowWidth = windowWidth.value;
          windowWidth.value = window.innerWidth;
          //console.log('eventlistener update windowWidth', windowWidth.value)
        });
      })

      return {
      el,
      position,
      style,
      windowWidth,
      oldWindowWidth,
      handleUpdate
      };
  },
});
</script>
