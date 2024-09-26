<template>
  <h1><img :src="titleLogoSrc" alt="title logo" :class="{ 'no-margin': noMargin }" /><slot name="default" /></h1>
</template>

<script>
export default {
  name: 'STitle',
  props: {
    // frame | mic | camera | calendar | coffee | page | scissors
    // laptop | loudspeaker | gift | bookmark | people | gear | pencil
    // chart | bar-chart
    emoji: {
      type: String,
      required: false,
      default: ''
    },
    noMargin: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      titleLogoSrc: ''
    };
  },
  created() {
    let titleLogoSrc = '';

    switch (this.emoji) {
      case 'frame':
        titleLogoSrc = require('~/assets/img/emoji/emoji_photo-frame.svg');
        break;
      case 'mic':
        titleLogoSrc = require('~/assets/img/emoji/emoji_microphone.svg');
        break;
      case 'camera':
        titleLogoSrc = require('~/assets/img/emoji/emoji_camera-with-flash.svg');
        break;
      case 'calendar':
        titleLogoSrc = require('~/assets/img/emoji/emoji_calendar.svg');
        break;
      case 'coffee':
        titleLogoSrc = require('~/assets/img/emoji/emoji_coffee.svg');
        break;
      case 'page':
        titleLogoSrc = require('~/assets/img/emoji/emoji_page-facing-up.svg');
        break;
      case 'scissors':
        titleLogoSrc = require('~/assets/img/emoji/emoji_scissors.svg');
        break;
      case 'laptop':
        titleLogoSrc = require('~/assets/img/emoji/emoji_laptop.svg');
        break;
      case 'loudspeaker':
        titleLogoSrc = require('~/assets/img/emoji/emoji_loudspeaker.svg');
        break;
      case 'gift':
        titleLogoSrc = require('~/assets/img/emoji/emoji_wrapped-gift.svg');
        break;
      case 'bookmark':
        titleLogoSrc = require('~/assets/img/emoji/emoji_bookmark-tabs.svg');
        break;
      case 'people':
        titleLogoSrc = require('~/assets/img/emoji/emoji_holding-hands.svg');
        break;
      case 'gear':
        titleLogoSrc = require('~/assets/img/emoji/emoji_gear.svg');
        break;
      case 'pencil':
        titleLogoSrc = require('~/assets/img/emoji/emoji_pencil.svg');
        break;
      case 'chart':
        titleLogoSrc = require('~/assets/img/emoji/emoji_chart-increasing.svg');
        break;
      case 'bar-chart':
        titleLogoSrc = require('~/assets/img/emoji/emoji_bar-chart.svg');
        break;
      default:
        titleLogoSrc = require('~/assets/img/emoji/emoji_photo-frame.svg');
        break;
    }

    this.titleLogoSrc = titleLogoSrc;
  }
};
</script>

<style lang="scss" scoped>
h1 {
  display: flex;
  align-items: center;
  margin-bottom: 1.7rem;

  > img {
    height: 5rem;
    width: 5rem;
    margin-right: 2rem;
  }

  &.no-margin {
    margin-bottom: 0;
  }
}
</style>
