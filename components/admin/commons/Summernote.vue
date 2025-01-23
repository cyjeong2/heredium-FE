<template>
  <client-only>
    <span>
      <SummerEditor
        id="summernote"
        ref="summerNote"
        v-model="content"
        :set-content="value"
        :is-hide-video="isHideVideo"
        :disabled="disabled"
        @onImageUpload="onImageUpload"
        @onChange="onChange"
      />
      <SDialogModal :is-show="isFileError" @close="isFileError = false">
        <template #content>5MB이하의 JPG, PNG, GIF, PNG 파일을 업로드해주세요.</template>
        <template #modal-btn1>
          <SButton button-type="primary" @click="isFileError = false">확인</SButton>
        </template>
      </SDialogModal>
    </span>
  </client-only>
</template>

<script>
import '~/assets/js/summernote-0.8.18-dist/summernote-lite.css';
import '~/assets/js/summernote-0.8.18-dist/vendor/summernote-spade-custom.scss';
import { fileValid } from '~/assets/js/commons';
import SDialogModal from '~/components/admin/modal/SDialogModal.vue';
import SButton from '~/components/admin/commons/SButton.vue';

export default {
  name: 'SummernoteEditor',
  components: { SButton, SDialogModal },
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    isHideVideo: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      lang: null,
      langClass: null,
      content: '',
      isFileError: false
    };
  },
  watch: {
    value(newValue) {
      if (newValue !== this.content) {
        this.$refs.summerNote.setNewContent(newValue);
      }
    }
  },
  created() {
    this.content = this.value ? this.value : '';
  },
  methods: {
    async onImageUpload(files, callback) {
      if (files && files[0]) {
        const maxSize = 5 * 1024 * 1024;
        const extension = ['.jpg', '.jpeg', '.png', '.gif'];
        const isValid = fileValid.check(files[0], maxSize, extension) !== null;

        if (isValid) {
          const formData = new FormData();

          [...files].forEach((item) => {
            formData.append('files', item);
          });

          await this.$axios
            .$post(`/file/image`, formData)
            .then((res) => {
              if (res && res[0]) {
                callback(res);
              }
            })
            .catch((err) => {
              alert(err);
            });
        } else {
          this.isFileError = true;
        }
      }
    },
    onChange(contents) {
      if (contents !== this.content) {
        this.content = contents;
        this.$emit('input', contents);
      }
    },
    setContent(contents) {
      this.$refs.summerNote.setNewContent(contents);
    }
  }
};
</script>
