<template>
    <input class="url-input" @input="changeParentLevel">
</template>

<script>

export default {
  name: 'UrlInput',
  props: {
    videoUrl: String,
    changeParentLevel: Function
  },
}
</script>

<style scoped>
  .url-input {
    height: 20px;
    width: 340px;
  }
</style>
