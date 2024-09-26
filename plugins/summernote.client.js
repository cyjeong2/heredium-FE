import '~/assets/js/summernote-0.8.18-dist/summernote-lite.css';
import '~/assets/js/summernote-0.8.18-dist/vendor/summernote-spade-custom.scss';
import '~/assets/js/summernote-0.8.18-dist/summernote-lite.min.js';
import '~/assets/js/summernote-0.8.18-dist/vendor/summernote-ko-KR-spade-custom.js';

import Vue from 'vue';

/* global $ */
Vue.component('SummerEditor', {
  props: {
    minHeight: {
      type: Number,
      required: false,
      default: 500
    },
    focus: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    setContent: {
      type: String,
      required: false,
      default: ''
    },
    icoid: {
      type: Number,
      required: false,
      default: 0
    },
    isHideVideo: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    const menu = ['link', 'picture'];

    if (!this.isHideVideo) {
      menu.push('video');
    }

    if ($('#summernote').length > 0) {
      $('#summernote').summernote('destroy');
    }

    this.summerNote = $(this.$el);
    this.summerNote.summernote({
      height: this.minHeight,
      minHeight: null,
      maxHeight: null,
      focus: this.focus,
      lang: 'ko-KR',
      placeholder: this.placeholder,
      disableDragAndDrop: true,
      disable: this.disabled,
      tabSize: 2,
      toolbar: [
        ['style', ['style']],
        // ['font', ['fontname', 'bold', 'underline', 'strikethrough', 'clear']],
        ['font', ['fontsize', 'bold', 'underline', 'strikethrough', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', menu],
        ['misc', ['undo', 'redo']],
        ['view', ['fullscreen', 'codeview', 'help']]
      ],
      callbacks: {
        onInit: this.onInit,
        onChange: this.onChange,
        onImageUpload: this.onImageUpload,
        onImageUploadError: this.onImageUploadError,
        onFocus: this.onFocus,
        onBlur: this.onBlur,
        onBlurCodeview: this.onBlurCodeview,
        onKeydown: this.onKeydown,
        onKeyup: this.onKeyup,
        onPaste: this.onPaste,
        onEnter: this.onEnter
      }
    });
  },
  methods: {
    onInit() {
      if (this.setContent) {
        this.summerNote.summernote('code', this.setContent);
        this.$attrs.value = this.setContent;
      }
    },
    onChange(contents) {
      this.$attrs.value = contents;
      this.$emit('onChange', contents);
    },
    onImageUpload(files) {
      this.$emit('onImageUpload', files, (url) => {
        if (Array.isArray(url)) {
          url.forEach((value) => {
            this.summerNote.summernote('insertImage', value);
          });
        } else {
          this.summerNote.summernote('insertImage', url);
        }
      });
    },
    onFocus() {
      this.$emit('onFocus', this.summerNote);
    },
    onBlur() {
      this.$emit('onBlur', this.summerNote);
    },
    onBlurCodeview() {
      this.$emit('onBlurCodeView', this.summerNote);
    },
    onKeydown() {
      this.$emit('onKeydown', this.summerNote);
    },
    onKeyup() {
      this.$emit('onKeyup', this.summerNote);
    },
    onPaste() {
      this.$emit('onPaste', this.summerNote);
    },
    onEnter() {
      this.$emit('onEnter', this.summerNote);
    },
    setNewContent(contents) {
      this.summerNote.summernote('code', contents);
      this.$attrs.value = contents;
      this.$emit('onChange', contents);
    }
  },
  render: (createElement) => {
    return createElement('div');
  }
});
