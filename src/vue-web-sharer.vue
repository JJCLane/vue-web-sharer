<script>
export default {
  name: "VueWebSharer",
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showFallback: false
    };
  },
  computed: {},
  methods: {
    hide() {
      this.$el.classList.add("vue-web-sharer-transition-close");

      setTimeout(() => {
        this.$el.classList.remove("vue-web-sharer-transition-close");

        this.$emit("close");
      }, 200);
    }
  },
  watch: {
    open(val) {
      if (val === true) {
        if (navigator.share) {
          navigator
            .share({
              title: "My awesome post!",
              text:
                "This post may or may not contain the answer to the universe",
              url: window.location.href
            })
            .then(() => {
              console.log("Thanks for sharing!");
            })
            .catch(err => {
              console.log(`Couldn't share because of`, err.message);
            });
        } else {
          console.log("web share not supported");
          this.showFallback = true;
        }
      } else {
        this.showFallback = false;
      }
    }
  }
};
</script>

<template>
  <div :class="['vue-web-sharer', showFallback ? 'vue-web-sharer-open' : 'vue-web-sharer-close']">
    <div class="vue-web-sharer-backdrop" @click="() => this.hide()"></div>

    <div class="vue-web-sharer-action-sheet" @click="() => this.hide()">
      <div class="vue-web-sharer-action-sheet-container">
        <div class="vue-web-sharer-action-sheet-group">
          <p class="vue-web-sharer-target">Test</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.vue-web-sharer {
  visibility: hidden;
  opacity: 0;

  cursor: pointer;
  touch-action: manipulation;

  & .vue-web-sharer-backdrop {
    opacity: 0;
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
}

.vue-web-sharer-target {
  margin: auto;
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

  width: 100%;
  max-width: 540px;

  & .vue-web-sharer-action-sheet-container {
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    height: 100%;
    max-height: 100%;
  }
  & .vue-web-sharer-action-sheet-group {
    box-shadow: var(
      --vue-web-sharer-action-sheet-group-box-shadow,
      0 0 8px 4px rgba(0, 0, 0, 0.1)
    );

    z-index: calc(var(--vue-web-sharer-zindex, 1000) + 10);
    transform: translate3d(0, 0, 10px);

    background: var(--vue-web-sharer-action-sheet-group-background, #fafafa);

    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    height: 0;

    transition-timing-function: cubic-bezier(0.36, 0.66, 0.04, 1);
    transition: height 0.2s ease-in;

    @media (max-width: 540px) {
      border-radius: var(
        --vue-web-sharer-action-sheet-group-border-radius,
        8px 8px 0 0
      );
      justify-content: flex-start;
    }
  }
}

.vue-web-sharer-open {
  visibility: visible;
  opacity: 1;

  & .vue-web-sharer-backdrop {
    opacity: var(--vue-web-sharer-backdrop-opacity, 0.25);
  }

  & .vue-web-sharer-action-sheet {
    opacity: 1;
  }
}

.vue-web-sharer-open.vue-web-sharer-transition-close {
  & .vue-web-sharer-backdrop {
    opacity: 0;
  }
  & .vue-web-sharer-action-sheet-group {
    height: 0;
  }
}

.vue-web-sharer-open .vue-web-sharer-action-sheet-group {
  height: var(--vue-web-sharer-height, 80px);

  @media (max-width: 540px) {
    height: var(--vue-web-sharer-height-small-device, 140px);
  }
}
</style>
