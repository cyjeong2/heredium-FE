<template>
  <SModal :is-show="isShow" @close="cancel">
    <template #title>인원정보</template>
    <template #content>
      <div class="artist-modal">
        <div class="representative-img">
          <label class="upload-img" @click.stop>
            <img v-if="thumbnail" :src="`${$store.state.BASE_URL}${thumbnail.resizeImage?.small}`" alt="테스트" />
            <span v-if="!thumbnail?.resizeImage?.small" class="file-info">
              <i class="ic-plus" />
              <span class="bt-2r">이미지를 등록해주세요.</span>
              <span class="nt-4">5MB 이하의 JPG, GIF, PNG파일을 선택해주세요.</span>
              <input type="file" accept=".jpg, .jpeg, .png, .gif" class="is-blind" @change="onThumbnail" />
            </span>
          </label>
          <SButton
            v-if="thumbnail?.resizeImage?.small"
            button-type="primary"
            w-size="small"
            h-size="small"
            @click.self="thumbnail = null"
          >
            삭제
          </SButton>
        </div>
        <div class="forms">
          <div><SInput v-model="name" placeholder="이름" maxlength="30" /></div>
          <div><STextarea v-model="intro" height="11.6rem" placeholder="소개" maxlength="3000" /></div>
        </div>
      </div>
    </template>
    <template #modal-btn1>
      <SButton @click="cancel">취소</SButton>
    </template>
    <template #modal-btn2>
      <SButton button-type="primary" @click="saveArtist">완료</SButton>
    </template>
    <template #etc>
      <SDialogModal no-scroll-lock :is-show="isShowErrorModal" @close="isShowErrorModal = false">
        <template #content>{{ errorModalMsg }}</template>
        <template #modal-btn2>
          <SButton button-type="primary" @click="isShowErrorModal = false">확인</SButton>
        </template>
      </SDialogModal>
    </template>
  </SModal>
</template>

<script>
import SModal from '~/components/admin/modal/SModal';
import SButton from '~/components/admin/commons/SButton';
import SInput from '~/components/admin/commons/SInput';
import STextarea from '~/components/admin/commons/STextarea';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { fileValid } from '~/assets/js/commons';

export default {
  name: 'ArtistModifyModal',
  components: { SDialogModal, STextarea, SInput, SButton, SModal },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedArtist: {
      type: Object,
      required: false,
      default: () => ({
        isNew: true,
        thumbnail: null,
        name: '',
        intro: '',
        groupIndex: null,
        artistIndex: null
      })
    }
  },
  data() {
    return {
      isNew: true,
      thumbnail: null,
      name: '',
      intro: '',
      isShowErrorModal: false,
      errorModalMsg: ''
    };
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        this.isNew = this.selectedArtist.isNew;
        this.thumbnail = this.selectedArtist.thumbnail;
        this.name = this.selectedArtist.name;
        this.intro = this.selectedArtist.intro;
      }
    }
  },
  methods: {
    async onThumbnail(e) {
      const input = event.target;

      if (input.files && input.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

        if (isValid) {
          const formData = new FormData();
          formData.append('files', file);
          await this.$axios
            .$post('/file', formData, {
              params: {
                type: 'SMALL'
              }
            })
            .then((fileForm) => {
              this.thumbnail = fileForm;
            });
        } else {
          this.errorModalMsg = '5MB이하의 JPG, GIF, PNG 파일을 업로드해주세요.';
          this.isShowErrorModal = true;
        }
        e.target.value = null;
        e.target.files = null;
      }
    },
    resetData() {
      this.thumbnail = null;
      this.name = '';
      this.intro = '';
    },
    cancel() {
      this.resetData();
      this.$emit('close');
    },
    isValidate() {
      let isValid = true;

      if (!this.name) {
        this.errorModalMsg = '이름을 입력해 주세요.';
        isValid = false;
      } else if (!this.intro) {
        this.errorModalMsg = '소개를 입력해 주세요.';
        isValid = false;
      }
      if (!isValid) {
        this.isShowErrorModal = true;
      }

      return isValid;
    },
    saveArtist() {
      if (this.isValidate()) {
        this.$emit('save', {
          isNew: this.isNew,
          thumbnail: this.thumbnail,
          name: this.name,
          intro: this.intro,
          groupIndex: this.selectedArtist.groupIndex,
          artistIndex: this.selectedArtist.artistIndex
        });
        this.resetData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.artist-modal {
  display: flex;
}

.representative-img {
  position: relative;
  margin-right: 2rem;

  .upload-img {
    position: relative;
    display: block;
    width: 16.8rem;
    height: 16.8rem;
    padding-bottom: 16.8rem;
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

      i {
        font-size: 4.8rem;
        margin-bottom: 0.8rem;
      }

      .bt-2r {
        margin-bottom: 0.4rem;
      }

      .nt-4 {
        color: rgba(17, 17, 17, 0.5);
        font-size: 1.2rem;
      }
    }
  }
  button {
    position: absolute;
    right: 0.8rem;
    top: 0.8rem;
  }
}

.forms {
  flex: 1 1 auto;

  input {
    width: 100% !important;
    min-width: unset;
    margin-bottom: 0.8rem;
  }
}
</style>
