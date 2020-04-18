<script>
import Vue from "vue";
import VueWebSharer from "@/vue-web-sharer.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    VueWebSharer
  },
  data() {
    const shareUrl = document.location.href;
    return {
      open: false,
      config: {
        native: {
          socialShareTitle: "Read this!",
          socialShareText: "This is an awesome website",
          socialShareUrl: shareUrl
        },
        email: {
          brandName: "Email",
          socialShareBody: shareUrl
        },
        facebook: {
          socialShareUrl: shareUrl
        },
        twitter: {
          socialShareUrl: shareUrl
        },
        linkedIn: {
          socialShareUrl: shareUrl
        },
        whatsApp: {
          socialShareUrl: shareUrl
        },
        copy: {
          socialShareUrl: shareUrl
        }
      }
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
    <vue-web-sharer :open="open" :displayNames="true" :config="config" @close="closeSharer" />
  </div>
</template>
