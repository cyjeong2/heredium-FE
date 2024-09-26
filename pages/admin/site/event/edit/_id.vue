<template>
  <div v-if="detailData">
    <h1 class="mb-17">{{ isNew ? '이벤트 등록' : '이벤트 수정' }}</h1>
    <div class="contents-info mb-36">
      <div class="representative-img mr-28">
        <label class="upload-img" @click.stop>
          <img
            v-if="detailData.thumbnail?.resizeImage?.small"
            :src="`${$store.state.BASE_URL}${detailData.thumbnail?.resizeImage?.small}`"
            alt="테스트"
          />
          <span v-if="!detailData.thumbnail?.resizeImage?.small" class="file-info">
            <i class="ic-plus mb-28"></i>
            <span class="h4 mb-17">이미지를 등록해주세요.</span>
            <span class="bt-1r">5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.</span>
            <input type="file" accept=".jpg, .jpeg, .png, .gif" class="is-blind" @change="thumbnail" />
          </span>
        </label>
        <SButton
          v-if="detailData.thumbnail?.resizeImage?.small"
          button-type="primary"
          w-size="small"
          h-size="small"
          @click.self="onDeleteThumbnail"
        >
          삭제
        </SButton>
      </div>
      <div class="info-table">
        <div class="row">
          <label>제목<b>*</b></label>
          <div class="has-feedback">
            <SInput
              v-model="detailData.title"
              w-size="xx-large"
              :class="{ 'is-error': !feedback.title.isValid }"
              maxlength="100"
            />
            <p v-if="!feedback.title.isValid">{{ feedback.title.text }}</p>
          </div>
        </div>
        <div class="row">
          <label>진행기간<b>*</b></label>
          <div class="has-feedback">
            <div>
              <SDatepicker
                v-model="detailData.startDate"
                class="mr-28"
                w-size="large"
                :class="{ 'is-error': !feedback.date.isValid }"
                :min="$dayjs().format('YYYY-MM-DD')"
                :max="detailData.endDate"
              />
              <b class="mr-28">~</b>
              <SDatepicker
                v-model="detailData.endDate"
                w-size="large"
                :class="{ 'is-error': !feedback.date.isValid }"
                :min="detailData.startDate"
              />
            </div>
            <p v-if="!feedback.date.isValid">{{ feedback.date.text }}</p>
          </div>
        </div>
        <div class="row">
          <label>노출여부</label>
          <div>
            <SToggle v-model="detailData.isEnabled">{{ detailData.isEnabled ? '노출' : '미노출' }}</SToggle>
          </div>
        </div>
      </div>
    </div>
    <div class="contents-title mb-16">
      <p class="h4">내용<b>*</b></p>
    </div>
    <div class="contents mb-24" :class="{ 'is-error': !feedback.contents.isValid }">
      <SummernoteEditor v-model="detailData.contents" />
    </div>
    <p v-if="!feedback.contents.isValid" class="contents-error">{{ feedback.contents.text }}</p>
    <div class="info-table">
      <div class="row">
        <label class="col">
          첨부파일
          <span class="bt-2r">10MB이하의 JPG, GIF, PNG, PDF, ZIP 파일</span>
        </label>
        <div class="col">
          <div v-for="(item, index) in 3" :key="item.index">
            <div>
              <SInput
                :value="getFileName(index)"
                class="mr-8"
                readonly
                w-size="xx-large"
                :class="{ 'is-error': !feedback.files[index].isValid }"
              />
              <SButton v-if="!detailData.files[index]" @click="fileClick(index)">파일 첨부</SButton>
              <template v-else>
                <a
                  :href="`${$axios.defaults.baseURL}/file/download?path=${detailData.files[index].savedFileName}&fileName=${detailData.files[index].originalFileName}`"
                  download
                  class="download primary mr-8"
                  >다운로드</a
                >
                <SButton @click="onDeleteFile(index)">삭제</SButton>
              </template>
              <input
                ref="fileUpload"
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .pdf, .zip"
                class="is-blind"
                @change="fileChange($event, index)"
              />
            </div>
            <p v-if="!feedback.files[index].isValid" class="validation">{{ feedback.files[index].text }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-menus">
      <SButton @click="modal.isCancel = true">취소</SButton>
      <div class="right">
        <SButton class="mr-8" @click="showPreview">미리보기</SButton>
        <SButton button-type="primary" :disabled="isConfirmPending" @click="onRegister">완료</SButton>
      </div>
    </div>
    <SDialogModal :is-show="modal.isCancel" @close="modal.isCancel = false">
      <template #content>콘텐츠를 저장하지 않고 이전페이지로 이동 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isCancel = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="onModify">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSave" @close="onModify">
      <template #content>콘텐츠가 저장되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="onModify">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isThumbnail" @close="modal.isThumbnail = false">
      <template #content>5MB 이하의 JPG, GIF, PNG 파일을 업로드해주세요.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isThumbnail = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SInput from '~/components/admin/commons/SInput';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SToggle from '~/components/admin/commons/SToggle';
import SummernoteEditor from '~/components/admin/commons/Summernote';
import SButton from '~/components/admin/commons/SButton';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { EVENT_DETAIL } from '~/assets/js/types';
import { createFormElement, fileValid } from '~/assets/js/commons';
import { eventPreview } from '~/assets/js/previewConverter';

export default {
  name: 'EventEditPage',
  components: { SDialogModal, SButton, SummernoteEditor, SToggle, SDatepicker, SInput },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect, $dayjs }) {
    const { id } = params;
    const isNew = id == null;
    const detailData = id
      ? await $axios
          .$get(`/admin/events/${id}`)
          .then((detailData) => ({
            ...detailData,
            startDate: $dayjs(detailData.startDate).format('YYYY-MM-DD'),
            endDate: $dayjs(detailData.endDate).format('YYYY-MM-DD')
          }))
          .catch(() => {
            redirect('/admin/site/event');
          })
      : cloneDeep(EVENT_DETAIL);

    if (isNew) {
      detailData.startDate = $dayjs().format('YYYY-MM-DD');
      detailData.endDate = $dayjs().add(30, 'days').format('YYYY-MM-DD');
    }

    return { id, isNew, detailData };
  },
  data() {
    return {
      id: '',
      isNew: false,
      uploadImageFile: [],
      baseUrl: '/admin/site/event',
      feedback: {
        title: {
          isValid: true,
          text: '제목을 입력해 주세요.'
        },
        date: {
          isValid: true,
          text: '진행기간을 선택해 주세요.'
        },
        contents: {
          isValid: true,
          text: '내용을 입력해 주세요.'
        },
        files: {
          0: {
            isValid: true,
            text: '10MB 이하의 JPG, GIF, PNG, PDF, ZIP 파일을 업로드 해주세요.'
          },
          1: {
            isValid: true,
            text: '10MB 이하의 JPG, GIF, PNG, PDF, ZIP 파일을 업로드 해주세요.'
          },
          2: {
            isValid: true,
            text: '10MB 이하의 JPG, GIF, PNG, PDF, ZIP 파일을 업로드 해주세요.'
          }
        }
      },
      modal: {
        isSave: false,
        isCancel: false,
        isThumbnail: false
      },
      detailData: null,
      isConfirmPending: false
    };
  },
  methods: {
    async onRegister() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        const detailData = {
          ...this.detailData,
          startDate: `${this.detailData.startDate} 00:00:00`,
          endDate: `${this.detailData.endDate} 23:59:59`
        };
        if (this.isNew) {
          await this.$axios.$post(`/admin/events`, detailData);
        } else {
          await this.$axios.$put(`/admin/events/${this.id}`, detailData);
        }
        this.modal.isSave = true;
      }
      this.isConfirmPending = false;
    },
    async fileChange(e, index) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize = 10 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

        if (isValid) {
          const formData = new FormData();
          formData.append('files', file);
          await this.$axios.$post('/file', formData).then((fileForm) => {
            this.detailData.files[index] = fileForm;
          });
        } else {
          this.feedback.files[index].isValid = false;
        }
        e.target.value = null;
        e.target.files = null;
        this.$forceUpdate();
      }
    },
    async thumbnail(e) {
      if (event.target.files && event.target.files[0]) {
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
                type: 'EVENT_THUMBNAIL'
              }
            })
            .then((fileForm) => {
              this.detailData.thumbnail = fileForm;
            });
        } else {
          this.modal.isThumbnail = true;
        }
        e.target.value = null;
        e.target.files = null;
        this.$forceUpdate();
      }
    },
    fileClick(index) {
      this.$refs.fileUpload[index].click();
    },
    getFileName(index) {
      return this.detailData.files[index]?.originalFileName || '';
    },
    onDeleteFile(index) {
      this.detailData.files[index] = null;
      this.$forceUpdate();
    },
    onDeleteThumbnail() {
      this.detailData.thumbnail = null;
      this.$forceUpdate();
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };

      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const { title, startDate, endDate, contents } = this.detailData;

      clearValid();

      if (!title) {
        this.feedback.title.isValid = false;
      }
      if (!startDate || startDate === 'Invalid Date' || !endDate || endDate === 'Invalid Date') {
        this.feedback.date.isValid = false;
      }
      if (!contents) {
        this.feedback.contents.isValid = false;
      }

      return isClearForm();
    },
    onModify() {
      if (this.isNew) {
        this.$router.push(`${this.baseUrl}`);
      } else {
        this.$router.push(`${this.baseUrl}/${this.id}`);
      }
    },
    showPreview() {
      const convertData = { previewData: JSON.stringify(eventPreview(this.detailData)) };
      const $formEl = createFormElement('/event/preview', convertData, true);

      document.querySelector('body').append($formEl);
      $formEl.submit();
      $formEl.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
.contents-info {
  display: flex;
  align-items: flex-start;

  .representative-img {
    position: relative;
    flex: 1 1 56rem;

    .upload-img {
      position: relative;
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 63.92857142857143%;
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
          font-size: 6.8rem;
        }
      }
    }
    button {
      position: absolute;
      right: 0.8rem;
      top: 0.8rem;
    }
  }

  .info-table {
    flex: 1 1 calc(100% - 58.8rem);
  }
}

.info-table .row > label.col {
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 30rem;
}

.info-table .row > div.col {
  flex-direction: column;
  flex: auto;
  min-height: auto;
  padding: 0.8rem 0;
  align-items: flex-start;

  > div {
    flex-direction: column;

    div {
      display: flex;
      flex: 1 0 0;
      width: 100%;
      min-height: 4.4rem;
      align-items: center;
      padding: 0.8rem 1.9rem;
      font-size: 1.4rem;
      font-weight: 500;
      background-color: var(--color-white);

      & + div {
        margin-top: 2.4rem;
      }
    }
    p {
      padding-left: 1.9rem;
    }
  }
}

.contents-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  b {
    color: var(--color-blue);
    margin-right: 2rem;
  }
}

.contents {
  background-color: var(--color-white);
  border-radius: 0.3rem;
  overflow: hidden;
}

.bottom-menus {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2.4rem;
  padding-top: 2.4rem;
  border-top: 1px solid var(--color-grey-2);

  .right {
    display: flex;
  }
}

.contents-error {
  color: var(--color-red);
}

a.download {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  line-height: 2.1rem;
  min-width: 9.6rem;
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
