<script>
import Sharer from "./Sharer";

export default {
  name: "VueWebSharer",
  props: {
    open: {
      type: Boolean,
      default: false
    },
    displayNames: {
      type: Boolean,
      default: true
    },
    config: {
      type: Object,
      default: []
    }
  },
  data() {
    return {
      showFallback: false
    };
  },
  computed: {},
  methods: {
    hide(e) {
      if (e && e.target != this.$refs.container) return;
      this.$emit("close");
    },
    handleShare(e, target, attributes) {
      this.hide();
      if (typeof Sharer[target] === "function") {
        Sharer[target](attributes);
      }
    },
    openShare() {
      if (navigator.share && this.config.native) {
        const { title, text, url } = this.config.native;

        let options = {};
        if (url) {
          options.url = url;
        }
        if (title) {
          options.title = title;
        }
        if (text) {
          options.text = text;
        }
        navigator
          .share(options)
          .then(() => {
            this.$emit("close");
          })
          .catch(err => {
            console.info(`Couldn't share because of`, err.message);
            this.$emit("close");
          });
      } else {
        // Web share not supported
        console.info("Web share not supported");
        this.showFallback = true;
      }
    },
    renderBrandName(attributes, defaultName) {
      if (!this.displayNames) return "";
      if (attributes.brandName) {
        return attributes.brandName;
      }
      return defaultName;
    },
    handleKeyUp(evt) {
      if (evt.keyCode === 27 && this.open) {
        this.hide();
      }
    }
  },
  mounted() {
    document.addEventListener("keyup", this.handleKeyUp);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.handleKeyUp);
  },
  watch: {
    open(val) {
      if (!val) {
        this.showFallback = false;
      }
    }
  }
};
</script>

<template>
  <transition name="fade">
    <div v-if="showFallback" :class="['vue-web-sharer']" tabindex="0" @keypress.esc="hide">
      <div class="vue-web-sharer-backdrop" @click="() => hide()"></div>

      <div class="vue-web-sharer-action-sheet" @click="hide">
        <div class="vue-web-sharer-action-sheet-container" ref="container">
          <div class="vue-web-sharer-action-sheet-group">
            <template v-for="(target, key) in config">
              <div v-if="key !== 'native'" :key="key" class="vue-web-sharer-target">
                <button
                  @click="(e) => handleShare(e, key, target)"
                  class="vue-web-sharer-share-button"
                >
                  <div class="vue-web-sharer-share-button-icon">
                    <slot :name="key"></slot>
                  </div>
                  <p v-if="displayNames">{{renderBrandName(target, key)}}</p>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;

  & .vue-web-sharer-backdrop,
  & .vue-web-sharer-action-sheet {
    opacity: 0;
  }

  & .vue-web-sharer-action-sheet-group {
    transform: translate3d(0, 100%, 0);
  }
}

.vue-web-sharer {
  opacity: 1;
  touch-action: manipulation;
  visibility: visible;
}

.vue-web-sharer-backdrop {
  opacity: var(--vue-web-sharer-backdrop-opacity, 0.15);
  transition: opacity 0.1s linear;

  background-color: var(--vue-web-sharer-backdrop-background, black);

  z-index: var(--vue-web-sharer-zindex, 1000);
  transform: translate3d(0, 0, 2px);

  left: 0;
  top: 0;
  position: fixed;
  height: 100%;
  width: 100%;
}

.vue-web-sharer-target {
  width: var(--vue-web-sharer-target-width, 4rem);
  height: var(--vue-web-sharer-target-height, 3rem);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & button {
    position: relative;

    cursor: pointer;

    border: 0;
    background: transparent;

    width: var(--vue-web-sharer-button-width, 100%);
    height: var(--vue-web-sharer-button-height, 100%);

    font-size: var(--vue-web-sharer-button-font-size);

    text-transform: capitalize;
  }

  & p {
    margin: var(--vue-web-sharer-brand-margin, 2px 0);
    color: var(--vue-web-sharer-brand-color, inherit);
    font-size: var(--vue-web-sharer-brand-font-size, 0.6rem);
  }

  & .vue-web-sharer-button-icon {
    margin: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.vue-web-sharer-action-sheet {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: fixed;
  z-index: calc(var(--vue-web-sharer-zindex, 1000) + 1);
  transform: translate3d(0, 0, 3px);
  transition: opacity 0.2s ease-in;

  opacity: 1;

  width: 100%;
  max-width: 540px;
}

.vue-web-sharer-action-sheet-container {
  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  height: 100%;
  max-height: 100%;
}

.vue-web-sharer-action-sheet-group {
  background: var(--vue-web-sharer-action-sheet-group-background, #fafafa);
  box-shadow: var(
    --vue-web-sharer-action-sheet-group-box-shadow,
    0 0 8px 4px rgba(0, 0, 0, 0.1)
  );

  z-index: calc(var(--vue-web-sharer-zindex, 1000) + 10);
  transform: translate3d(0, 0, 10px);

  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  padding: 0.5rem 0px;
  transform: translate3d(0, 0%, 0);
  transition-timing-function: cubic-bezier(0.36, 0.66, 0.04, 1);
  transition: transform 0.2s;

  @media (max-width: 540px) {
    border-radius: var(
      --vue-web-sharer-action-sheet-group-border-radius,
      8px 8px 0 0
    );
  }
}
</style>
