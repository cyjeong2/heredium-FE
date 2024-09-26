<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <div class="modal">
          <div class="head">
            <button type="button" class="close-btn" @click="cancel">
              <i class="ic-close" />
            </button>
          </div>
          <div class="body">
            <div class="contents-info mb-24">
              <div class="representative-img mr-16">
                <label class="upload-img" @click.stop>
                  <img
                    v-if="thumbnail?.resizeImage?.small"
                    :src="`${$store.state.BASE_URL}${thumbnail?.resizeImage?.small}`"
                    :alt="`${thumbnail?.originalFileName}`"
                  />
                  <span v-if="!thumbnail?.resizeImage?.small" class="file-info">
                    <i class="ic-plus mb-16"></i>
                    <span class="bt-2r">이미지를 등록해주세요.</span>
                    <span class="nt-5">5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.</span>
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, .gif"
                      class="is-blind"
                      @change="fileUpload($event, 'thumbnail')"
                    />
                  </span>
                </label>
                <SButton
                  v-if="thumbnail?.resizeImage?.small"
                  button-type="primary"
                  w-size="small"
                  h-size="small"
                  @click.self="onDeleteFile('thumbnail')"
                >
                  삭제
                </SButton>
              </div>
              <div class="works-info">
                <SInput v-model="title" w-size="full" class="mb-14" placeholder="제목" maxlength="100" />
                <SInput v-model="writer" w-size="full" class="mb-14" placeholder="작가명" maxlength="30" />
                <SInput v-model="position" w-size="full" placeholder="작품위치" maxlength="100" />
              </div>
            </div>
            <div class="mb-24">
              <STextarea v-model="intro" placeholder="작품 소개" maxlength="3000" />
            </div>
            <div class="mb-12">
              <div class="file-list">
                <label class="tm-2m">음성파일</label>
                <SInput :value="getFileName('audio')" class="file-input mr-8" readonly />
                <SButton v-if="!audio" @click="onFileClick('audioUpload')">파일 첨부</SButton>
                <template v-else>
                  <a
                    :href="`${$axios.defaults.baseURL}/file/download?path=${audio.savedFileName}&fileName=${audio.originalFileName}`"
                    download
                    class="download primary mr-8"
                    >다운로드</a
                  >
                  <SButton w-size="small" @click="onDeleteFile('audio')">삭제</SButton>
                </template>
                <input
                  ref="audioUpload"
                  type="file"
                  accept=".mp3"
                  class="is-blind"
                  @change="fileUpload($event, 'audio')"
                />
              </div>
              <p class="bt-2r">15MB 이하의 MP3 파일</p>
            </div>
            <div>
              <div class="file-list">
                <label class="tm-2m">지도 이미지</label>
                <SInput :value="getFileName('map')" class="file-input mr-8" readonly />
                <SButton v-if="!map" @click="onFileClick('mapUpload')">파일 첨부</SButton>
                <template v-else>
                  <a
                    :href="`${$axios.defaults.baseURL}/file/download?path=${map.savedFileName}&fileName=${map.originalFileName}`"
                    download
                    class="download primary mr-8"
                    >다운로드</a
                  >
                  <SButton w-size="small" @click="onDeleteFile('map')">삭제</SButton>
                </template>
                <input
                  ref="mapUpload"
                  type="file"
                  accept=".png, .jpg, .jpeg, .gif"
                  class="is-blind"
                  @change="fileUpload($event, 'map')"
                />
              </div>
              <p class="bt-2r">{가로}px {세로}px 5MB 이하의 JPG, GIF, PNG 파일</p>
            </div>
          </div>
          <div class="foot-wrap">
            <div class="foot">
              <SButton class="mr-8" @click="cancel">취소</SButton>
              <SButton button-type="primary" @click="saveDocent">완료</SButton>
            </div>
          </div>
        </div>
      </div>
      <SDialogModal no-scroll-lock :is-show="isShowErrorModal" @close="isShowErrorModal = false">
        <template #content>{{ errorModalMsg }}</template>
        <template #modal-btn2>
          <SButton button-type="primary" @click="isShowErrorModal = false">확인</SButton>
        </template>
      </SDialogModal>
    </div>
  </transition>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import SInput from '~/components/admin/commons/SInput';
import STextarea from '~/components/admin/commons/STextarea';
import SButton from '~/components/admin/commons/SButton';
import { fileValid } from '~/assets/js/commons';
import SDialogModal from '~/components/admin/modal/SDialogModal';
export default {
  name: 'DocentRegisterModal',
  components: { SDialogModal, SButton, STextarea, SInput },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    docentData: {
      type: Object,
      required: false,
      default: () => ({
        isNew: true,
        index: null,
        thumbnail: null,
        title: '',
        writer: '',
        position: '',
        intro: '',
        audio: null,
        map: null
      })
    }
  },
  data() {
    return {
      isNew: true,
      thumbnail: null,
      title: '',
      writer: '',
      position: '',
      intro: '',
      audio: null,
      map: null,
      isShowErrorModal: false,
      errorModalMsg: ''
    };
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        disableBodyScroll(document);
        this.isNew = this.docentData.isNew;
        this.thumbnail = this.docentData.thumbnail;
        this.title = this.docentData.title;
        this.writer = this.docentData.writer;
        this.position = this.docentData.position;
        this.intro = this.docentData.intro;
        this.audio = this.docentData.audio;
        this.map = this.docentData.map;
      } else {
        clearAllBodyScrollLocks();
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    isValidate() {
      let isValid = true;

      if (!this.title) {
        this.errorModalMsg = '제목을 입력해 주세요.';
        isValid = false;
      } else if (!this.intro) {
        this.errorModalMsg = '작품 소개를 입력해 주세요.';
        isValid = false;
      }
      if (!isValid) {
        this.isShowErrorModal = true;
      }

      return isValid;
    },
    getFileName(target) {
      return this[target]?.originalFileName || '';
    },
    resetData() {
      this.thumbnail = null;
      this.title = '';
      this.writer = '';
      this.position = '';
      this.intro = '';
      this.audio = null;
      this.map = null;
    },
    cancel() {
      this.resetData();
      this.$emit('close');
    },
    saveDocent() {
      if (this.isValidate()) {
        const newDocent = {
          thumbnail: this.thumbnail,
          title: this.title,
          writer: this.writer,
          position: this.position,
          intro: this.intro,
          audio: this.audio,
          map: this.map
        };

        this.$emit('save', { newDocent, isNew: this.isNew, index: this.docentData.index });
        this.resetData();
      }
    },
    onDeleteFile(target) {
      this[target] = null;
      this.$forceUpdate();
    },
    onFileClick(target) {
      this.$refs[target].click();
    },
    async fileUpload(e, target) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize =
          target === 'thumbnail' ? 5 * 1024 * 1024 : target === 'audio' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

        if (isValid) {
          const formData = new FormData();
          formData.append('files', file);
          await this.$axios
            .$post(
              '/file',
              formData,
              target === 'thumbnail' || target === 'map'
                ? {
                    params: {
                      type: 'SMALL'
                    }
                  }
                : null
            )
            .then((fileForm) => {
              this[target] = fileForm;
            });
        } else {
          if (target === 'thumbnail') {
            this.errorModalMsg = '5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.';
          } else if (target === 'audio') {
            this.errorModalMsg = '15MB 이하의 MP3 파일을 선택해주세요.';
          } else {
            this.errorModalMsg = '5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.';
          }
          this.isShowErrorModal = true;
        }
        e.target.value = null;
        e.target.files = null;
        this.$forceUpdate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-inner {
  position: absolute;
  width: 53.2rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-white);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal {
  .head {
    position: relative;
    min-height: 5.2rem;
    margin-bottom: 2.2rem;
    padding: 1.4rem 1.6rem;

    .close-btn {
      position: absolute;
      top: 50%;
      right: 1.2rem;
      transform: translateY(-50%);
      font-size: 2.4rem;
    }
  }

  .body {
    padding: 0 3.2rem;
    word-break: keep-all;
    margin-bottom: 2.4rem;

    .contents-info {
      display: flex;
      align-items: flex-start;

      .representative-img {
        position: relative;
        flex: 1 1 16rem;
        .upload-img {
          position: relative;
          display: block;
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          background-color: rgba(221, 221, 221, 0.5);
          border-radius: 0.3rem;
          cursor: pointer;

          img {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.3rem;
            object-fit: cover;
            object-position: center;
            background-color: #d9d9d9;
          }

          .file-info {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;

            i {
              font-size: 3.2rem;
            }

            .nt-5 {
              margin-top: 0.4rem;
              color: rgba(17, 17, 17, 0.5);
            }
          }
        }
        button {
          position: absolute;
          right: 0.8rem;
          top: 0.8rem;
        }
      }

      .works-info {
        flex: 1 1 calc(100% - 17.6rem);
      }
    }
    .file-list {
      display: flex;
      align-items: center;
      label {
        flex: 1 1 10rem;
      }
      .file-input {
        flex: 1 1 calc(100% - 20.4rem);
      }
    }
    p {
      padding-top: 0.8rem;
      color: var(--color-grey-3);
    }
  }
  .foot-wrap {
    padding: 0 3.2rem;
    .foot {
      display: flex;
      justify-content: center;
      margin-bottom: 3.6rem;
      padding-top: 3.2rem;
      border-top: 1px solid var(--color-grey-2);
    }
  }
}

a.download {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  line-height: 2.1rem;
  min-width: 6.4rem;
  height: 4.4rem;
  padding: 0 1rem;
  border-radius: 0.3rem;
  background-color: var(--color-white);

  &.primary {
    color: var(--color-white);
    font-weight: 700;
    background-color: #18a0fb;
  }

  &.primary:hover {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), var(--color-blue);
  }
}
</style>
