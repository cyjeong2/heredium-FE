<template>
  <SButton :button-type="buttonType" @click="downloadTemplateExcel">양식 다운로드 </SButton>
</template>

<script>
import SButton from './SButton.vue';

export default {
  name: 'SDownloadExcelTemplate',
  components: { SButton },
  props: {
    buttonType: {
      type: String,
      required: false,
      default: 'standard'
    },
    fileName: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  methods: {
    downloadTemplateExcel() {
      this.$axios
        .$get(this.url, {
          method: 'GET',
          responseType: 'blob',
          params: this.params
        })
        .then((res) => {
          const href = URL.createObjectURL(res);
          const link = document.createElement('a');

          link.href = href;
          link.setAttribute('download', `${this.fileName}.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    }
  }
};
</script>

<style scoped lang="scss"></style>
