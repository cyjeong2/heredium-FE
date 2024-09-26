<template>
  <span v-html="convertText" />
</template>

<script>
export default {
  name: 'BrConvertText',
  props: {
    text: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    convertText() {
      return this.text.replace(/\n/g, '<br>');
    }
  }
};
</script>
