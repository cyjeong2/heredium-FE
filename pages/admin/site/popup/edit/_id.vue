<template>
  <div>
    <h1 class="mb-17">{{ isNew ? '팝업 등록' : '팝업 수정' }}</h1>
    <div v-if="!isNew" class="info-table">
      <div class="row">
        <label>등록일시</label>
        <div>{{ $dayjs(detailData.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
        <label>등록자</label>
        <div>{{ detailData.createdName }}</div>
      </div>
      <div class="row">
        <label>수정일시</label>
        <div>{{ $dayjs(detailData.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
        <label>수정자</label>
        <div>{{ detailData.lastModifiedName }}</div>
      </div>
    </div>
    <div class="info-table">
      <div class="row">
        <label>제목<b>*</b></label>
        <div class="has-feedback">
          <SInput
            v-model="detailData.title"
            w-size="xxx-large"
            :class="{ 'is-error': !feedback.title.isValid }"
            maxlength="100"
          />
          <p v-if="!feedback.title.isValid">{{ feedback.title.text }}</p>
        </div>
      </div>
      <div class="row">
        <label>노출여부</label>
        <div>
          <SToggle v-model="detailData.isEnabled">{{ detailData.isEnabled ? '노출' : '미노출' }}</SToggle>
        </div>
      </div>
      <div class="row">
        <label>진행기간<b>*</b></label>
        <div class="has-feedback">
          <div>
            <SDatepicker
              v-model="detailData.startDate"
              class="mr-28"
              w-size="x-large"
              is-time-picker
              :class="{ 'is-error': !feedback.date.isValid }"
              :max="detailData.endDate"
            />
            <b class="mr-28">~</b>
            <SDatepicker
              v-model="detailData.endDate"
              w-size="x-large"
              is-time-picker
              :class="{ 'is-error': !feedback.date.isValid }"
              :min="detailData.startDate"
            />
          </div>
          <p v-if="!feedback.date.isValid">{{ feedback.date.text }}</p>
        </div>
      </div>
      <div class="row">
        <label>PC 팝업 이미지<b>*</b></label>
        <div class="col">
          <div>
            <SInput
              :value="detailData.pcImage?.originalFileName || ''"
              class="mr-8"
              w-size="xx-large"
              readonly
              :class="{ 'is-error': !feedback.pcImage.isValid }"
            />
            <template v-if="detailData.pcImage?.originalFileName">
              <a
                :href="`${$axios.defaults.baseURL}/file/download?path=${detailData.pcImage.savedFileName}&fileName=${detailData.pcImage.originalFileName}`"
                download
                class="download primary mr-8"
                >다운로드</a
              >
              <SButton @click="onDeleteFile('pcImage')">삭제</SButton>
            </template>
            <template v-else>
              <SButton @click="fileClick('fileUpload')">파일 첨부</SButton>
              <input
                ref="fileUpload"
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                class="is-blind"
                @change="fileChange($event, 'pcImage')"
              />
            </template>
          </div>
          <p v-if="!feedback.pcImage.isValid" class="validation">{{ feedback.pcImage.text }}</p>
          <p class="bt-2r">가로 720px 세로 720px 10MB 이하의 JPG, GIF, PNG 파일</p>
        </div>
      </div>
      <div class="row">
        <label>PC 팝업 대체 텍스트</label>
        <div>
          <STextarea v-model="detailData.pcImageAlt" maxlength="400" />
        </div>
      </div>
      <div class="row">
        <label>Mobile 팝업 이미지<b>*</b></label>
        <div class="col">
          <div>
            <SInput
              :value="detailData.mobileImage?.originalFileName || ''"
              class="mr-8"
              w-size="xx-large"
              readonly
              :class="{ 'is-error': !feedback.mobileImage.isValid }"
            />
            <template v-if="detailData.mobileImage?.originalFileName">
              <a
                :href="`${$axios.defaults.baseURL}/file/download?path=${detailData.mobileImage.savedFileName}&fileName=${detailData.mobileImage.originalFileName}`"
                download
                class="download primary mr-8"
                >다운로드</a
              >
              <SButton @click="onDeleteFile('mobileImage')">삭제</SButton>
            </template>
            <template v-else>
              <SButton @click="fileClick('fileUpload2')">파일 첨부</SButton>
              <input
                ref="fileUpload2"
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                class="is-blind"
                @change="fileChange($event, 'mobileImage')"
              />
            </template>
          </div>
          <p v-if="!feedback.mobileImage.isValid" class="validation">{{ feedback.mobileImage.text }}</p>
          <p class="bt-2r">가로 420px 세로 420px 10MB 이하의 JPG, GIF, PNG 파일</p>
        </div>
      </div>
      <div class="row">
        <label>Mobile 팝업 대체 텍스트</label>
        <div>
          <STextarea v-model="detailData.mobileImageAlt" maxlength="400" />
        </div>
      </div>
      <div v-if="false" class="row">
        <label>오늘하루 보지 않기 기능 사용</label>
        <div>
          <SToggle v-model="detailData.isHideToday">{{ detailData.isHideToday ? '사용' : '미사용' }}</SToggle>
        </div>
      </div>
      <div class="row">
        <label>팝업 링크</label>
        <div>
          <SInput v-model="detailData.link" class="mr-8" w-size="xx-large" maxlength="250" />
          <SCheckbox v-model="detailData.isNewTab">새창 열기</SCheckbox>
        </div>
      </div>
    </div>
    <div class="bottom-menus">
      <SButton @click="modal.isCancel = true">취소</SButton>
      <div class="right">
        <SButton v-if="!isNew" class="mr-8" @click="modal.isLegacy = true">삭제</SButton>
        <SButton class="mr-8" @click="modal.isPreview = true">미리보기</SButton>
        <SButton button-type="primary" :disabled="isConfirmPending" @click="onRegister">완료</SButton>
      </div>
    </div>
    <SDialogModal :is-show="modal.isSave" @close="$router.go(-1)">
      <template #content>콘텐츠가 저장되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="$router.go(-1)">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isCancel" @close="modal.isCancel = false">
      <template #content>콘텐츠를 저장하지 않고 이전페이지로 이동 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isCancel = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="$router.go(-1)">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isLegacy" @close="modal.isLegacy = false">
      <template #content>콘텐츠를 삭제하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isLegacy = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" :disabled="isConfirmPending" @click="onDeletePost">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isRemoveConfirm" @close="$router.go(-1)">
      <template #content>콘텐츠가 삭제되었습니다.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="$router.go(-1)">확인</SButton>
      </template>
    </SDialogModal>
    <SPopupModal :popup-list="[detailData]" :is-show="modal.isPreview" @close="modal.isPreview = false" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import SInput from '~/components/admin/commons/SInput';
import SToggle from '~/components/admin/commons/SToggle';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SButton from '~/components/admin/commons/SButton';
import { fileValid } from '~/assets/js/commons';
import STextarea from '~/components/admin/commons/STextarea';
import { POPUPS_DETAIL } from '~/assets/js/types';
import SPopupModal from '~/components/admin/modal/SPopupModal.vue';

export default {
  name: 'EditPage',
  components: { SPopupModal, STextarea, SDialogModal, SCheckbox, SInput, SToggle, SDatepicker, SButton },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect, $dayjs }) {
    const { id } = params;
    const isNew = id == null;
    const detailData = isNew
      ? cloneDeep(POPUPS_DETAIL)
      : await $axios.$get(`/admin/popups/${id}`).catch(() => {
          redirect('/admin/site/popup');
        });
    if (isNew) {
      detailData.startDate = $dayjs().format('YYYY-MM-DD HH:mm:ss');
      detailData.endDate = $dayjs().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');
    }

    return { id, isNew, detailData };
  },
  data() {
    return {
      id: null,
      isNew: false,
      detailData: null,
      baseUrl: '/admin/site/popup',
      feedback: {
        title: {
          isValid: true,
          text: '제목을 입력해 주세요.'
        },
        date: {
          isValid: true,
          text: '진행기간을 선택해 주세요.'
        },
        pcImage: {
          isValid: true,
          text: 'PC 이미지를 업로드 해주세요.'
        },
        mobileImage: {
          isValid: true,
          text: 'Mobile 이미지를 업로드 해주세요.'
        }
      },
      modal: {
        isSave: false,
        isCancel: false,
        isLegacy: false,
        isRemoveConfirm: false,
        isPreview: false
      },
      isConfirmPending: false
    };
  },
  methods: {
    async onRegister() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        const detailData = this.detailData;

        if (this.isNew) {
          await this.$axios.$post(`/admin/popups`, detailData);
        } else {
          await this.$axios.$put(`/admin/popups/${this.id}`, detailData);
        }
        this.modal.isSave = true;
      }
      this.isConfirmPending = false;
    },
    async fileChange(e, device) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(file, maxSize, extension) !== null;
        if (isValid) {
          const formData = new FormData();
          formData.append('files', file);
          await this.$axios.$post('/file', formData).then((fileForm) => {
            this.detailData[device] = fileForm;
          });
        } else {
          this.feedback[device].text = '5MB 이하의 JPG, PNG 파일을 업로드 해주세요.';
        }
        e.target.value = null;
        e.target.files = null;
        this.$forceUpdate();
      }
    },
    onDeleteFile(device) {
      this.detailData[device] = null;
      this.$forceUpdate();
    },
    fileClick(target) {
      this.$refs[target].click();
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };

      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const { title, startDate, endDate, pcImage, mobileImage } = this.detailData;
      const isTimeCondition = new Date(startDate) - new Date(endDate) < 0;

      clearValid();

      if (!title) {
        this.feedback.title.isValid = false;
      }
      if (!startDate || startDate === 'Invalid Date' || !endDate || endDate === 'Invalid Date') {
        this.feedback.date.isValid = false;
      } else if (!isTimeCondition) {
        this.feedback.date.text = '종료시간을 시작시간보다 늦은 시간으로 설정해주세요.';
        this.feedback.date.isValid = false;
      }
      if (!pcImage) {
        this.feedback.pcImage.isValid = false;
      }
      if (!mobileImage) {
        this.feedback.mobileImage.isValid = false;
      }
      return isClearForm();
    },
    onDeletePost() {
      this.isConfirmPending = true;
      this.$axios.$delete(`/admin/popups/${this.id}`);
      this.modal.isRemoveConfirm = true;
      this.isConfirmPending = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.info-table .row {
  label {
    width: 20.8rem;
  }
  .textarea {
    width: 100%;
  }

  div.col {
    flex-direction: column;
    flex: auto;
    min-height: auto;
    padding: 0.8rem 0;
    align-items: flex-start;

    p {
      padding: 0.8rem 0 0 1.9rem;
      color: var(--color-grey-3);
      &.validation {
        color: var(--color-red);
        font-weight: 500;
      }
    }

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
    }
  }
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
</style>
