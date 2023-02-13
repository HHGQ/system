<template>
  <div>111
    <slot name="tree"></slot>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {

    }
  },
  mounted() {
    enum Color {Red=1, Green=2, Blue=4}
    let c: Color = Color.Green;
  }
}
</script>