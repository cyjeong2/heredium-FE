<template>
  <div class="note-editor">
    <div class="note-editable">
      <div v-show="isParsing" ref="output" v-html="contents" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorContentOutput',
  props: {
    contents: {
      type: [String, Number, Object],
      required: false,
      default: ''
    }
  },
  data() {
    return {
      isParsing: false
    };
  },
  mounted() {
    const $output = this.$refs.output;

    this.iFrameResize($output);
    this.isParsing = true;
  },
  methods: {
    iFrameResize($target) {
      const $iFrames = $target.querySelectorAll('iframe');

      $iFrames.forEach(($iFrame) => {
        const iFrameWidth = Number($iFrame.width);
        const ratio = iFrameWidth / Number($iFrame.height);

        $iFrame.width = '100%';
        $iFrame.height = 'auto';
        $iFrame.style.aspectRatio = ratio;
        $iFrame.style.maxWidth = `${iFrameWidth}px`;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.note-editor {
  overflow-y: hidden;
  overflow-x: auto;
}

.note-editable:after {
  content: '';
  display: block;
  clear: both;
}

.note-editor *,
::v-deep .note-editor * {
  color: #000 !important;
}

::v-deep .note-editable p {
  line-height: 1.5 !important;

  span {
    line-height: 1.5 !important;
  }
}
</style>
