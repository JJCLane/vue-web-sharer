<script>
import Vue from "vue";
import VueWebSharer from "@/vue-web-sharer.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    VueWebSharer
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    openSharer() {
      this.open = true;
    },
    closeSharer() {
      this.open = false;
    }
  }
});
</script>

<template>
  <div id="app">
    <button @click="openSharer">Click me</button>
    <vue-web-sharer :open="open" @close="closeSharer" />
  </div>
</template>
